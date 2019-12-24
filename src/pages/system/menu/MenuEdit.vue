<template>

    <div>
        <edit-dialog ref="editDialog" :save-callback="save" :form-model="menu" :form-rules="rules">

            <el-form-item prop="pid" label="上级菜单">
                <el-select v-model="menu.pid" placeholder="请选择上级菜单" value="" style="width: 100%" @change="changePid">
                    <el-option v-for="item in menuList" :key="item.id" :label="item.showName" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item prop="menuName" label="菜单名称">
                <el-input v-model="menu.menuName" placeholder="请输入菜单名称"></el-input>
            </el-form-item>

            <el-form-item prop="routePath" label="菜单路由">
                <el-input v-model="menu.routePath" placeholder="请输入菜单路由"></el-input>
            </el-form-item>

            <el-form-item prop="icon" label="菜单图标">
                <el-input v-model="menu.icon" placeholder="请选择菜单图标" :readonly="true" :prefix-icon="menu.icon">
                    <el-button slot="append" icon="el-icon-search" @click="openMenuIconDialog"></el-button>
                </el-input>
            </el-form-item>

            <el-form-item prop="rank" label="排序值">
                <el-input v-model="menu.rank" placeholder="请输入排序值"></el-input>
            </el-form-item>

            <el-form-item prop="actions" label="注册请求">
                <el-input v-model="menu.actions" placeholder="请输入注册请求"></el-input>
            </el-form-item>

            <template v-if="canShowAddButton">
                <el-divider></el-divider>
                <el-form-item>
                    <el-button @click="openButtonDialog">增加按钮</el-button>
                </el-form-item>
                <el-form-item prop="" label="注册按钮">
                    <el-tag v-for="(item,index) in menu.buttons"
                            @click="openButtonDialog(index, item)"
                            @close="onButtonClose(item)"
                            :key="index"
                            closable>
                        {{item.buttonName}}
                    </el-tag>
                </el-form-item>
            </template>
        </edit-dialog>

        <menu-button-dialog ref="menuButtonDialog" @clickOk="onButtonDialogOk"></menu-button-dialog>

        <menu-icon-dialog ref="menuIconDialog" @selectIconBack="selectIconBack"></menu-icon-dialog>
    </div>
</template>

<script>

    import EditDialog from '../../../components/EditDialog';
    import menuService from './menu.service';
    import {Menu} from './menu.model';
    import MenuButtonDialog from './MenuButtonDialog';
    import MenuIconDialog from './MenuIconDialog';

    export default {
        components: {MenuButtonDialog, EditDialog, MenuIconDialog},
        props: {
            parentMenuList: {
                type: Array,
                default: () => {
                    return [];
                }
            }
        },
        data() {
            return {
                opened: false,
                menuList: [],
                showDialog: true,
                canShowAddButton: false,
                menu: new Menu(),
                rules: {
                    menuName: [{required: true, message: '请输入菜单名称', trigger: 'blur'}],
                }
            };
        },

        watch: {
            parentMenuList(value) {
                this.menuList = value.filter(menu => menu.pids.split(',').length < 2);
            }
        },

        methods: {
            openModal() {
                this.$refs.editDialog.openDialog();

                // 打开过一次就不增加 --无-- 选项了
                if (this.opened) {
                    return;
                }
                this.opened = true;
                this.menuList = [{id: '-1', showName: '--无--'}, ...this.menuList];
            },
            /**
             * 增加页面
             */
            openAddModal(id) {
                this.menu = new Menu();
                if (id !== null) {
                    // 增加菜单
                    this.menu.pid = id;
                    this.changePid(this.menu.pid);
                }
                this.openModal();
            },
            /**
             * 修改页面
             */
            openEditModal(id) {
                menuService.query(id).then(res => {
                    if (res) {
                        this.menu = new Menu(res.data);
                        this.menu.pid = this.menu.pid ? this.menu.pid : '-1';
                        this.changePid(this.menu.pid);
                    }
                });
                this.openModal();
            },
            /**
             * 选中图标
             */
            openMenuIconDialog() {
                this.$refs.menuIconDialog.openDialog();
            },
            changePid(value) {
                const pMenu = this.menuList.find(m => m.id === value);
                this.canShowAddButton = !!(pMenu && pMenu.pids && pMenu.pids.split(',').length === 1);
            },
            save() {
                const body = this.menu;
                body.pid = body.pid === '-1' ? '' : body.pid;
                body.pids = this.getPids();
                window.console.log(body);

                let promise;
                if (this.menu.id !== undefined && this.menu.id !== null) {
                    // update
                    promise = menuService.update({id: this.menu.id, ...body});
                } else {
                    // add
                    promise = menuService.add(body);
                }
                return promise.then(res => {
                    if (res) {
                        // 保存成功，刷新list页面
                        this.$emit('saveComplete');
                    }
                    return !!res;
                });

            },
            openButtonDialog(index, button) {
                this.$refs.menuButtonDialog.openDialog(index, button);
            },
            onButtonClose(button) {
                this.menu.buttons = this.menu.buttons.filter(b => b !== button);
            },
            onButtonDialogOk(button, index) {
                if (index === null) {
                    // 增加
                    this.menu.buttons.push(button);
                } else {
                    // 修改
                    this.menu.buttons.splice(index, 1, button);
                }
            },
            getPids() {
                let pids = '';
                const pMenu = this.menuList.find(menu => this.menu.pid === menu.id);
                if (pMenu) {
                    pids = pMenu.pids ? pMenu.pids + ',' + pMenu.id : pMenu.id;
                }
                return pids;
            },
            selectIconBack(icon) {
                this.menu.icon = icon;
            }
        },

    };
</script>

<style scoped>
    .el-tag {
        margin-left: 10px;
    }
</style>
