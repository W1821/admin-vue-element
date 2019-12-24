<template>

    <edit-dialog ref="modifyPwdDialog"
                 :save-callback="modifyPwd"
                 dialog-title="修改密码"
                 dialog-width="40%"
                 min-height="30vh"
                 success-notice-msg="修改密码成功"
                 :form-model="pwd"
                 :form-rules="rules">
        <el-form-item prop="oldPwd" label="旧密码">
            <el-input v-model="pwd.oldPwd" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item prop="newPwd" label="新密码">
            <el-input v-model="pwd.newPwd" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item prop="verifiedPwd" label="确认新密码">
            <el-input v-model="pwd.verifiedPwd" placeholder="请确认新密码"></el-input>
        </el-form-item>
    </edit-dialog>

</template>

<script>
    import EditDialog from '../../components/EditDialog';
    import mainService from './main.service';

    export default {
        components: {EditDialog},
        data() {
            return {
                pwd: {
                    oldPwd: '',
                    newPwd: '',
                    verifiedPwd: '',
                },
                rules: {
                    oldPwd: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'},
                    ],
                    newPwd: [
                        {required: true, message: '请输入新密码', trigger: 'blur'}
                    ],
                    verifiedPwd: [
                        {required: true, message: '请确认新密码', trigger: 'blur'}
                    ],
                },
            };
        },
        methods: {
            openModifyPwdDialog() {
                this.$refs.modifyPwdDialog.openDialog();
            },
            modifyPwd() {
                return mainService.modifyPwd(this.pwd);
            },
        }

    };
</script>

<style scoped>

</style>
