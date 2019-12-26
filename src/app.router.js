import Vue from 'vue';
import Router from 'vue-router';
import Login from './pages/login/Login';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
    easing: 'ease',  // 动画方式
    speed: 500,  // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3 // 初始化时的最小百分比
});

import loginRoutes from './pages/login/login.routes';
import mainRoutes from './pages/main/main.routes';

Vue.use(Router);


const router = new Router({
    routes: [
        {path: '/', component: Login},
        ...loginRoutes,
        mainRoutes,
        {path: '**', component: Login}
    ]
});

router.beforeEach((to, from, next) => {
    // 开启进度条
    NProgress.start();
    // 这个一定要加，没有next()页面不会跳转的。这部分还不清楚的去翻一下官网就明白了
    next();
});
//当路由跳转结束后
router.afterEach(() => {
    // 关闭进度条
    NProgress.done();
});

export default router;
