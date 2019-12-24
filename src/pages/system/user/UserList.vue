<template>
    <div>
        <template v-if="authButtons.search">
            <!-- 查询表单 -->
            <search-form :searchBody="searchBody" @searchFunction="search">
                <el-form-item>
                    <el-input v-model="searchBody.userName" placeholder="输入用户名称查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchBody.phoneNumber" placeholder="输入手机号码查询"></el-input>
                </el-form-item>
            </search-form>
        </template>

        <template v-if="authButtons.add">
            <el-button @click="add" type="primary" icon="el-icon-plus" class="w100" plain>添加</el-button>
            <el-divider></el-divider>
        </template>

        <!-- 列表数据 -->
        <list-table :table-data="tableData"
                    :page-body.sync="pageBody"
                    :total-rows="totalRows"
                    @onPageIndexChange="getList">

            <el-table-column label="头像">
                <template slot-scope="scope">
                    <el-avatar icon="el-icon-user-solid" :src="scope.row.headPictureUrl"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column prop="phoneNumber" label="手机号码"></el-table-column>
            <el-table-column prop="userName" label="用户名"></el-table-column>
            <el-table-column label="帐号状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.accountStatus === '0' ? 'success':'danger'">
                        {{ scope.row.accountStatus === '0' ? '可用' : '不可用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column label="角色">
                <template slot-scope="scope">
                    <el-tag v-for="role of scope.row.roles" :key="role.id">{{ role.roleName }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="操作" v-if="authButtons.edit || authButtons.delete">
                <template slot-scope="scope">

                    <el-button v-if="authButtons.edit" @click="edit(scope.row)" size="small" icon="el-icon-edit">
                        编辑
                    </el-button>

                    <el-divider v-if="authButtons.edit && authButtons.delete" direction="vertical"></el-divider>

                    <table-delete-button v-if="authButtons.delete"
                                         @onConfirm="remove(scope.row)"
                                         :title="'确定删除' + scope.row.userName + '吗？'">
                    </table-delete-button>

                </template>
            </el-table-column>

        </list-table>

        <!-- 编辑弹窗 -->
        <user-edit v-if="authButtons.add || authButtons.edit" ref="userEdit" @saveComplete="search"></user-edit>

    </div>
</template>

<script>

    import UserEdit from './UserEdit';
    import userService from './user.service';
    import {User} from './user.model';
    import SearchForm from '../../../components/SearchForm';
    import ListTable from '../../../components/ListTable';
    import TableDeleteButton from '../../../components/TableDeleteButton';
    import ButtonAuthService from '../../main/button-auth.service';

    export default {
        components: {TableDeleteButton, ListTable, SearchForm, UserEdit},
        data() {
            return {
                authButtons: {
                    search: false,
                    add: false,
                    edit: false,
                    delete: false,
                },
                showModal: false,
                tableData: [],
                searchBody: {
                    userName: null,
                    phoneNumber: null,
                },
                pageBody: {
                    index: 1,
                    size: 7,
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
                this.searchBody.userName = null;
                this.searchBody.phoneNumber = null;
            },
            add() {
                this.$refs.userEdit.openAddModal();
            },
            edit(item) {
                this.$refs.userEdit.openEditModal(item.id);
            },
            remove(item) {
                userService.delete(item.id).then(res => {
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
                userService.list(body).then(res => {
                    if (!res) {
                        return;
                    }
                    this.tableData = res.data.content.map(e => new User(e));
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
    .el-tag {
        margin-left: 10px;
    }
</style>
