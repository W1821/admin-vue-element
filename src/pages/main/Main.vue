<template>
    <div>
        <el-container class="main-box">

            <el-header>

                <!-- logo图片 -->
                <div class="logo"></div>

                <!-- 头部右边用户信息及退出 start -->
                <div class='user-info'>

                    <el-dropdown class="dropdown">
                        <el-button>
                            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu>
                            <a @click="openModifyPwdModal">
                                <el-dropdown-item>修改密码</el-dropdown-item>
                            </a>
                            <a @click="logout()">
                                <el-dropdown-item>退出</el-dropdown-item>
                            </a>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <el-avatar class="avatar" icon="el-icon-user-solid" :src="userInfo.headPictureUrl"></el-avatar>

                    <div class="name">您好！{{userInfo.userName}}</div>

                </div>

                <el-menu class="header-menu"
                         :default-active="headerMenuActiveIndex"
                         mode="horizontal"
                         background-color="#001529"
                         text-color="#9fa7ae"
                         active-background-color="#1890ff"
                         active-text-color="#fff">
                    <el-menu-item v-for="menu of heardMenuTreeData"
                                  :key="menu.id"
                                  :index="'' + menu.id"
                                  @click="clickHeaderMenu(menu)">
                        <i :class="menu.icon"></i>
                        {{menu.menuName}}
                    </el-menu-item>
                </el-menu>


            </el-header>

            <el-container>

                <el-aside width="240px">
                    <el-menu ref="leftMenu"
                             @open="handleOpen"
                             :default-active="openedSubMenu ? openedSubMenu.id + '' : ''"
                             unique-opened
                             background-color="#fff">
                        <el-submenu v-for="leftMenu of leftMenuDataArr"
                                    :key="leftMenu.id"
                                    :index="'' + leftMenu.id">
                            <template slot="title">
                                <i :class="leftMenu.icon"></i>
                                <span slot="title">{{leftMenu.menuName}}</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item v-for="subMenu of leftMenu.children"
                                              :key="subMenu.id"
                                              :index="'' + subMenu.id"
                                              @click="clickSubMenu(subMenu)">
                                    {{subMenu.menuName}}
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                    </el-menu>
                </el-aside>

                <el-container>

                    <el-main>
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item></el-breadcrumb-item>
                            <el-breadcrumb-item v-if="breadcrumb.rootName">{{breadcrumb.rootName}}</el-breadcrumb-item>
                            <el-breadcrumb-item v-if="breadcrumb.leftName">{{breadcrumb.leftName}}</el-breadcrumb-item>
                            <el-breadcrumb-item v-if="breadcrumb.subName">{{breadcrumb.subName}}</el-breadcrumb-item>
                        </el-breadcrumb>

                        <div class="content">
                            <transition name="slide-bottom">
                                <keep-alive>
                                    <router-view class="child-view"></router-view>
                                </keep-alive>
                            </transition>
                        </div>

                    </el-main>
                </el-container>

            </el-container>

            <el-footer>xxx</el-footer>

        </el-container>

        <modify-pwd ref="modifyPwdDialog"></modify-pwd>

    </div>
</template>

<script>

    import mainService from './main.service';
    import loginService from '../login/login.service';
    import SessionStorageService from '../../common/service/SessionStorageService';
    import NotificationService from '../../common/service/NotificationService';
    import ModifyPwd from './ModifyPwd';

    export default {
        components: {ModifyPwd},
        data() {
            return {
                initOk: false,                  // 判断是否是update过一次
                userInfo: null,                 // 当前登录人信息

                heardMenuTreeData: [],         // 头部菜单数据
                headerMenuActiveIndex: null,  // 头部菜单默认选中项

                leftMenuDataArr: [],           // 左边二级菜单数据

                openedHeaderMenu: null,        // 展开的左边二级菜单
                openedLeftMenu: null,          // 展开的左边二级菜单
                openedSubMenu: null,           // 打开的左边三级菜单

                breadcrumb: {
                    rootName: null,
                    leftName: null,
                    subName: null,
                }
            };
        },

        created() {
            this.userInfo = loginService.getUserInfo();
            mainService.init().then(() => this.setDefaultMenuDataArr());
        },
        updated() {
            if (!this.initOk) {
                window.console.log('Main->updated', this.leftMenuDataArr);
                this.$refs.leftMenu.open('' + this.openedLeftMenu.id);
                this.initOk = true;
            }
        },
        methods: {
            handleOpen(key, keyPath) {
                window.console.log(key, keyPath);
                const leftMenu = this.leftMenuDataArr.find(m => m.id + '' === key);
                this.clickLeftMenu(leftMenu);
            },
            /**
             * 头部菜单点击事件
             * @param menu 头部菜单
             */
            clickHeaderMenu(menu) {
                if (!menu) {
                    return;
                }
                // 设置选中状态
                this.headerMenuActiveIndex = menu.id + '';
                // 设置当前选中的头部菜单
                this.openedHeaderMenu = menu;
                // 切换二级菜单
                this.leftMenuDataArr = menu.children;
            },

            /**
             * 左边二级菜单点击事件
             * @param leftMenu 二级菜单
             */
            clickLeftMenu(leftMenu) {
                if (!leftMenu) {
                    return;
                }
                // 设置当前的二级菜单
                this.openedLeftMenu = leftMenu;
            },

            /**
             * 左边三级菜单点击事件
             * @param subMenu 三级菜单
             */
            clickSubMenu(subMenu) {
                if (!subMenu) {
                    return;
                }
                // 设置面包屑
                this.breadcrumb.rootName = this.openedHeaderMenu.menuName;
                this.breadcrumb.leftName = this.openedLeftMenu.menuName;
                this.breadcrumb.subName = subMenu.menuName;

                // 设置当前选中的三级菜单
                this.openedSubMenu = subMenu;

                // 路由配置错误，跳转到404页面
                if (!subMenu.routePath) {
                    NotificationService.error('配置错误，请联系开发人员');
                    return;
                }

                // 跳转路由
                if (this.$route.path === subMenu.routePath) {
                    window.console.log('不跳转路由');
                    return;
                }

                this.$router
                    .push({path: subMenu.routePath})
                    .then(success => {
                        // 跳转成功保存当前地址
                        if (success) {
                            mainService.setRedirectUrl(subMenu.routePath);
                        }
                    });
            },

            /**
             * 设置默认数据
             */
            setDefaultMenuDataArr() {
                window.console.log('setDefaultMenuDataArr');
                this.heardMenuTreeData = mainService.getMenuTreeData();

                if (this.f5Refresh()) {
                    return;
                }

                // 点击默认的头部菜单
                const headerMenu = this.heardMenuTreeData[0];
                this.clickHeaderMenu(headerMenu);

                // 点击默认左边二级菜单
                const leftMenu = headerMenu.children[0];
                this.clickLeftMenu(leftMenu);

                // 点击默认左边三级菜单
                const subMenu = leftMenu.children[0];
                this.clickSubMenu(subMenu);
            },

            /**
             * F5刷新逻辑
             */
            f5Refresh() {
                const redirectUrl = SessionStorageService.get('redirectUrl');
                if (!redirectUrl) {
                    return false;
                }
                const subMenu = mainService.getMenuListData().find(menu => menu.routePath === redirectUrl);
                if (!subMenu) {
                    return false;
                }
                const leftMenu = mainService.getMenuListData().find(menu => menu.id === subMenu.pid);
                if (!leftMenu) {
                    return false;
                }
                const headerMenu = mainService.getMenuListData().find(menu => menu.id === leftMenu.pid);
                if (!headerMenu) {
                    return false;
                }

                window.console.log('MainComponent->F5刷新逻辑');
                this.clickHeaderMenu(headerMenu);
                this.clickLeftMenu(leftMenu);
                this.clickSubMenu(subMenu);
                return true;
            },


            logout() {
                window.console.log('logout');
                loginService.logout().then(() => this.$router.push({path: '/login/1'}));
            },
            /**
             * 修改密码弹窗
             */
            openModifyPwdModal() {
                this.$refs.modifyPwdDialog.openModifyPwdDialog();
            },

        }
    };
</script>

<style scoped lang="less">
    .el-container {
        padding: 0;
        margin: 0;
    }

    .main-box {
        height: 100vh;
    }

    .el-header {
        background-color: #001529;
        line-height: 60px;

    }

    .el-aside {
        background-color: #fff;
        position: relative;
        box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
    }

    .el-main {
        background-color: #f0f2f5;
        padding-bottom: 0;
    }

    .el-footer {
        background-color: #f0f2f5;
        line-height: 60px;
        text-align: center;
    }

    .el-menu {
        border-right: 0;
    }

    .el-breadcrumb {
        margin: 0 0 16px 0;
    }

    .el-dropdown {
        width: 120px;
    }

    .el-dropdown-menu {
        width: 120px;
    }

    .content {
        background: #fff;
        padding: 20px;
        min-height: calc(100vh - 210px);
    }

    a {
        text-decoration: none;
    }

    .logo {
        width: 190px;
        height: 40px;
        line-height: 40px;
        background: url("../../assets/images/logo.png") no-repeat;
        background-size: 100% 100%;
        margin: 10px 15px;
        float: left;
    }

    .header-menu {
        float: left;
    }

    .user-info {
        float: right;
        margin-right: 10px;
        height: 40px;
        line-height: 40px;
        margin-top: 10px;
        overflow: auto;
        zoom: 1;
    }

    .user-info > .dropdown {
        float: right;
        right: 0;
    }

    .user-info > .avatar {
        margin-right: 8px;
        float: right;
        right: 0;
    }

    .user-info > .name {
        margin-right: 8px;
        float: right;
        right: 0;
        color: white;
    }

    .child-view {
        transition: all .6s;
    }

    .slide-bottom-enter,
    .slide-top-leave-active {
        opacity: 0;
        -webkit-transform: translate(0, 100%);
        transform: translate(0, 100%);
    }

    .slide-bottom-leave-active,
    .slide-top-enter {
        opacity: 0;
        -webkit-transform: translate(0, -100%);
        transform: translate(0, -100%);
    }


</style>
