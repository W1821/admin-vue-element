<template>

    <div>
        <edit-dialog ref="editDialog" :save-callback="save" :form-model="role" :form-rules="rules">

            <el-form-item prop="roleName" label="角色名称">
                <el-input v-model="role.roleName" placeholder="请输入角色名称"></el-input>
            </el-form-item>

            <el-form-item prop="description" label="角色描述">
                <el-input v-model="role.description" placeholder="请输入角色描述"></el-input>
            </el-form-item>

            <el-form-item prop="roleStatus" label="角色状态">
                <el-radio-group v-model="role.roleStatus">
                    <el-radio :label="'1'">禁用</el-radio>
                    <el-radio :label="'0'">可用</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="菜单权限">
                <el-tree ref="menuTree"
                         :data="menuTreeList"
                         node-key="key"
                         show-checkbox
                         check-strictly
                         :expand-on-click-node="false"
                         check-on-click-node
                         default-expand-all
                         style="min-height: 30vh;">
                </el-tree>
            </el-form-item>

        </edit-dialog>
    </div>
</template>

<script>

    import EditDialog from '../../../components/EditDialog';
    import {Role} from './role.model';
    import roleService from './role.service';
    import menuService from '../menu/menu.service';
    import mainService from '../../main/main.service';

    export default {
        components: {EditDialog},
        data() {
            return {
                showDialog: true,
                initMenuTreeSuccess: false,
                menuTreeList: [],
                menuButtonIds: [],
                role: new Role(),
                rules: {
                    roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
                }
            };
        },
        methods: {
            /**
             * 增加页面
             */
            openAddModal() {
                this.role = new Role();
                this.openModal();
            },

            /**
             * 修改页面
             */
            openEditModal(id) {
                this.openModal();
                roleService.query(id).then(res => {
                    if (res) {
                        this.setFormValue(res.data);
                    }
                });
            },
            openModal() {
                this.$refs.editDialog.openDialog();
                if (this.$refs.menuTree) {
                    this.$refs.menuTree.setCheckedKeys([]);
                }
                // mainService.getMenuTreeData()获取数据需要时间，不能放到生命周期方法中执行
                if (!this.initMenuTreeSuccess) {
                    this.menuTreeList = mainService.getMenuTreeData().map(menu => menuService.getTreeItem(menu));
                    this.initMenuTreeSuccess = true;
                }
            },
            save() {
                const body = this.getRequestBody();
                let promise;
                if (body.id !== undefined && body.id !== null) {
                    // update
                    promise = roleService.update(body);
                } else {
                    // add
                    promise = roleService.add(body);
                }
                return promise.then(res => {
                    if (res) {
                        // 保存成功，刷新list页面
                        this.$emit('saveComplete');
                    }
                    return !!res;
                });

            },
            setFormValue(data) {
                this.role.setDataValue(data);
                // 勾选菜单
                const menuIds = this.role.menuIds ? this.role.menuIds.map(id => id + '') : [];
                const buttonIds = this.role.buttonIds ? this.role.buttonIds.map(id => id + '-btn') : [];
                this.$refs.menuTree.setCheckedKeys(menuIds.concat(...buttonIds));
            },
            getRequestBody() {
                const body = this.role;
                const checkedKeys = this.$refs.menuTree.getCheckedKeys();
                checkedKeys.forEach(id => {
                    if (id.endsWith('btn')) {
                        body.buttonIds.push(id.split('-')[0]);
                    } else {
                        body.menuIds.push(id);
                    }

                });
                return body;
            }
        },

    };
</script>

<style scoped>

</style>
