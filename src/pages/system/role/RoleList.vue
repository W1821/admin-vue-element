<template>
    <div>
        <!-- 查询表单 -->
        <search-form v-if="authButtons.search" :searchBody="searchBody" @searchFunction="search">
            <el-form-item>
                <el-input v-model="searchBody.roleName" placeholder="输入角色名称查询"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="searchBody.roleStatus" clearable placeholder="选择状态查询" value="">
                    <el-option label="启用" value="0"></el-option>
                    <el-option label="禁用" value="1"></el-option>
                </el-select>
            </el-form-item>
        </search-form>

        <template v-if="authButtons.add">
            <el-button @click="add" type="primary" icon="el-icon-plus" class="w100" plain>添加</el-button>
            <el-divider></el-divider>
        </template>

        <!-- 列表数据 -->
        <list-table :table-data="tableData"
                    :page-body.sync="pageBody"
                    :total-rows="totalRows"
                    @onPageIndexChange="getList">

            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="description" label="角色描述"></el-table-column>
            <el-table-column label="角色状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.roleStatus === '0' ? 'success':'danger'">
                        {{ scope.row.roleStatus === '0' ? '可用' : '不可用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>

            <el-table-column label="操作" v-if="authButtons.edit || authButtons.delete">
                <template slot-scope="scope">

                    <el-button v-if="authButtons.edit" @click="edit(scope.row)" size="small" icon="el-icon-edit">
                        编辑
                    </el-button>

                    <el-divider v-if="authButtons.edit && authButtons.delete" direction="vertical"></el-divider>

                    <table-delete-button v-if="authButtons.delete" @onConfirm="remove(scope.row)"
                                         :title="'确定删除' + scope.row.roleName + '吗？'">
                    </table-delete-button>

                </template>
            </el-table-column>

        </list-table>

        <!-- 编辑弹窗 -->
        <role-edit v-if="authButtons.add || authButtons.edit" ref="roleEdit" @saveComplete="search"></role-edit>

    </div>
</template>

<script>

    import RoleEdit from './RoleEdit';
    import roleService from './role.service';
    import {Role} from './role.model';
    import SearchForm from '../../../components/SearchForm';
    import ListTable from '../../../components/ListTable';
    import TableDeleteButton from '../../../components/TableDeleteButton';
    import ButtonAuthService from '../../main/button-auth.service';

    export default {
        components: {TableDeleteButton, ListTable, SearchForm, RoleEdit},
        data() {
            return {
                showModal: false,
                authButtons: {
                    search: false,
                    add: false,
                    edit: false,
                    delete: false,
                },
                tableData: [],
                searchBody: {
                    roleName: null,
                    roleStatus: null,
                },
                pageBody: {
                    index: 1,
                    size: 9,
                },
                totalRows: 0,
            };
        },
        created() {
            // 初始化权限按钮
            this.initAuthButtons();
            this.search();
        },
        methods: {
            search() {
                // 重置第一页
                this.pageBody.index = 1;
                this.getList();
            },
            clear() {
                this.searchBody.roleName = null;
                this.searchBody.roleStatus = null;
            },
            add() {
                this.$refs.roleEdit.openAddModal();
            },
            edit(item) {
                this.$refs.roleEdit.openEditModal(item.id);
            },
            remove(item) {
                roleService.delete(item.id).then(res => {
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
                const body = {...this.searchBody, ...this.pageBody};
                body.roleStatus = body.roleStatus === '' ? null : body.roleStatus;
                roleService.list(body).then(res => {
                    if (!res) {
                        return;
                    }
                    this.tableData = res.data.content.map(e => new Role(e));
                    this.totalRows = res.data.totalElements;
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
