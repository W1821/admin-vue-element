<template>

    <div>
        <edit-dialog ref="editDialog"
                     :save-callback="save"
                     :form-model="user"
                     :form-rules="rules">

            <el-form-item prop="userName" label="用户名">
                <el-input v-model="user.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>

            <el-form-item prop="phoneNumber" label="手机号码">
                <el-input v-model="user.phoneNumber" placeholder="请输入手机号码"></el-input>
            </el-form-item>

            <el-form-item prop="password" label="密码">
                <el-input v-model="user.password" placeholder="请输入密码"></el-input>
            </el-form-item>

            <el-form-item prop="accountStatus" label="帐号状态">
                <el-radio-group v-model="user.accountStatus">
                    <el-radio :label="'1'">禁用</el-radio>
                    <el-radio :label="'0'">可用</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item prop="" label="头像">
                <upload-cropper @onCropSuccess="onCropSuccess" :image-url="user.headPictureUrl"></upload-cropper>
            </el-form-item>

            <el-form-item prop="roleIds" label="角色">
                <el-select v-model="user.roleIds" multiple placeholder="请选择" value="" style="width: 100%">
                    <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

        </edit-dialog>
    </div>
</template>

<script>

    import EditDialog from '../../../components/EditDialog';
    import UploadCropper from '../../../components/UploadCropper';
    import userService from './user.service';
    import {User} from './user.model';

    export default {
        components: {EditDialog, UploadCropper},
        data() {
            return {
                imageUrl: '',
                showDialog: true,
                user: new User(),
                roleList: [],
                rules: {
                    phoneNumber: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                    ],
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                },
            };
        },

        created() {
            this.initRoleList();
        },

        methods: {
            /**
             * 增加页面
             */
            openAddModal() {
                window.console.log('openAddModal');
                this.user = new User();
                this.openModal();
            },

            /**
             * 修改页面
             */
            openEditModal(id) {
                userService.query(id).then(res => {
                    if (res) {
                        this.user.setDataValue(res.data);
                    }
                });
                this.openModal();
            },
            openModal() {
                this.$refs.editDialog.openDialog();
            },
            save() {
                const body = this.getRequestBody();
                let promise;
                if (body.id !== undefined && body.id !== null) {
                    // update
                    promise = userService.update(body);
                } else {
                    // add
                    promise = userService.add(body);
                }
                return promise.then(res => {
                    if (res) {
                        // 保存成功，刷新list页面
                        this.$emit('saveComplete');
                    }
                    return !!res;
                });

            },
            initRoleList() {
                userService.roleList().then(res => {
                    if (res) {
                        this.roleList = res.data.map(role => {
                            return {
                                key: role.id,
                                value: role.id,
                                label: role.roleName,
                            };
                        });
                    }
                });
            },
            getRequestBody() {
                const body = {...this.user};
                body.roles = body.roleIds.map(id => {
                    return {id};
                });
                delete body.roleIds;
                return body;
            },
            onCropSuccess(data) {
                this.user.headPictureBase64 = data;
            },

        }

    };
</script>

<style scoped>

</style>
