<template>

    <el-container class="login-bg">
        <el-main>
            <!--  -->
            <el-row class="login-title">
                <el-col :xs="{span: 16, offset: 4}" :sm="{span: 6, offset: 9}" :xl="{span: 4, offset: 10}">
                    <i class="el-icon-setting"></i>xxx管理系统
                </el-col>
            </el-row>

            <!-- 登录错误提示 start -->
            <el-row>
                <el-col :xs="{span: 16, offset: 4}" :sm="{span: 6, offset: 9}" :xl="{span: 4, offset: 10}">
                    <el-alert v-if="errorMsg"
                              :title="errorMsg"
                              show-icon
                              center
                              type="error"
                              class="error-alert"
                              :closable="false">
                    </el-alert>
                </el-col>
            </el-row>
            <!-- 登录错误提示 end -->

            <!-- 登录表单 start -->
            <el-row v-loading="loading">
                <el-col :xs="{span: 16, offset: 4}" :sm="{span: 6, offset: 9}" :xl="{span: 4, offset: 10}">
                    <el-form :model="formModel" :rules="rules" ref="loginForm">
                        <el-form-item prop="userName">
                            <el-input v-model="formModel.userName" prefix-icon="el-icon-user" placeholder="用户名或手机号"/>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="formModel.password" type="password" prefix-icon="el-icon-lock"
                                      placeholder="密码"/>
                        </el-form-item>
                        <el-form-item>
                            <el-checkbox label="Remember me" name="type"></el-checkbox>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="login-form-button" type="primary" @click="onSubmit('loginForm')">
                                登录
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <!-- 登录表单 end -->
        </el-main>
    </el-container>

</template>

<script>

    import NotificationService from '../../common/service/NotificationService';
    import loginService from './login.service';

    export default {
        data() {
            return {
                errorMsg: null,
                loading: false,
                formModel: {
                    userName: '15256639988',
                    password: '2',
                },
                rules: {
                    userName: [
                        {required: true, message: '请输入用户名或手机号', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                }
            };
        },
        created: function () {
            window.console.log('LoginComponent created');
            const params = this.$route.params;
            // 存在type表示不需要自动登录
            if (params.type) {
                loginService.logout();
            }
        },

        methods: {
            onSubmit(loginForm) {
                this.$refs[loginForm].validate(valid => !valid ? false : this.login());
            },
            login() {
                this.loading = true;
                loginService.login(this.formModel.userName, this.formModel.password)
                    .then(response => {
                        window.console.log('login', response);
                        // 取消设置转圈
                        this.loading = false;
                        if (!response) {
                            this.errorMsg = '网络异常，请稍候再试';
                            return;
                        }
                        if (response.success) {
                            this.errorMsg = null;
                            NotificationService.success('登录成功');
                            this.loginSuccess();
                        } else {
                            this.loginError(response);
                        }
                    });
            },
            loginSuccess() {
                // 登陆成功，跳转到main页面，main页面默认打开第一个菜单
                window.console.log('登陆成功，跳转到', '/main');
                this.$router.push({path: '/main'});
            },
            loginError(error) {
                window.console.log('LoginService loginError', error);
                switch (error.status) {
                    case 401:
                        this.errorMsg = '用户名或密码错误';
                        break;
                    case 500:
                        this.errorMsg = '系统错误，请稍候再试';
                        break;
                    default:
                        this.errorMsg = '网络异常，请稍候再试';
                        break;
                }
            }
        }
    };

</script>

<style scoped>

    .login-bg {
        height: 100vh;
        background: url("../../assets/images/bg.svg") no-repeat;
        background-size: 100%;
    }

    .login-title {
        margin-top: 100px;
        margin-bottom: 50px;
        text-align: center;
        font-size: 33px;
        color: rgba(0, 0, 0, .85);
        font-family: Myriad Pro, Helvetica Neue, Arial, Helvetica, sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
    }

    .login-form-button {
        width: 100%;
    }

    .error-alert {
        margin-bottom: 6px;
    }

</style>
