<template>
    <div>

        <template v-if="authButtons.add">
            <el-button @click="add" type="primary" icon="el-icon-plus" class="w100" plain>添加</el-button>
            <el-divider></el-divider>
        </template>

        <!-- 列表数据 -->
        <list-table :pagination="false"
                    max-height="650px"
                    :table-data="tableTree"
                    row-key="id"
                    :expand-all="true">

            <el-table-column prop="menuName" label="菜单名称"></el-table-column>
            <el-table-column prop="rank" label="排序"></el-table-column>
            <el-table-column prop="icon" label="图标">
                <template slot-scope="scope">
                    <i :class="scope.row.icon"></i>
                </template>
            </el-table-column>
            <el-table-column prop="routePath" label="菜单路由"></el-table-column>

            <el-table-column label="操作" v-if="authButtons.addSub || authButtons.edit || authButtons.delete">
                <template slot-scope="scope">
                    <el-button v-if="authButtons.edit" @click="edit(scope.row)" size="small" icon="el-icon-edit">
                        编辑
                    </el-button>
                    <el-divider v-if="authButtons.edit && authButtons.delete" direction="vertical"></el-divider>

                    <table-delete-button v-if="authButtons.delete"
                                         @onConfirm="remove(scope.row)"
                                         :title="'确定删除' + scope.row.showName + '吗？'">
                    </table-delete-button>

                    <template v-if="scope.row.pids.split(',').length < 2">
                        <el-divider v-if="authButtons.edit || authButtons.delete" direction="vertical"></el-divider>
                        <el-button v-if="authButtons.addSub"
                                   @click="add(scope.row)"
                                   size="small"
                                   type="primary"
                                   icon="el-icon-plus"
                                   plain>
                            添加下级
                        </el-button>
                    </template>
                </template>
            </el-table-column>

        </list-table>

        <!-- 编辑弹窗 -->
        <menu-edit
                v-if="authButtons.add || authButtons.addSub || authButtons.edit"
                ref="menuEdit"
                @saveComplete="search"
                :parent-menu-list="dataList">
        </menu-edit>

    </div>
</template>

<script>
    import MenuEdit from './MenuEdit';
    import menuService from './menu.service';
    import TableDeleteButton from '../../../components/TableDeleteButton';
    import ListTable from '../../../components/ListTable';
    import ButtonAuthService from '../../main/button-auth.service';

    export default {
        components: {TableDeleteButton, ListTable, MenuEdit},
        data() {
            return {
                showModal: false,
                authButtons: {
                    search: false,
                    add: false,
                    addSub: false,
                    edit: false,
                    delete: false,
                },
                tableTree: [],
                dataList: [],
            };
        },
        created() {
            // 初始化权限按钮
            this.initAuthButtons();
            this.search();
        },
        methods: {
            search() {
                this.getList();
            },
            add(item) {
                this.$refs.menuEdit.openAddModal(item.id);
            },
            edit(item) {
                this.$refs.menuEdit.openEditModal(item.id);
            },
            remove(item) {
                menuService.delete(item.id).then(res => {
                    if (res) {
                        this.search();
                    }
                });
            },
            getList() {
                // 判断是否有查询权限
                if (!this.authButtons.search) {
                    return;
                }
                menuService.list().then(res => {
                    if (!res) {
                        return;
                    }
                    const menus = menuService.getSortedMenuList(res.data);
                    this.tableTree = menuService.getMenuTree(menus);
                    this.dataList = menuService.getMenuList(res.data);
                });
            },
            initAuthButtons() {
                this.authButtons = ButtonAuthService.getButtonAuth(this.authButtons, this.$route);
            }
        }
    };

</script>

<style scoped>

</style>
