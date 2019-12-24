import mainService from './main.service';
// import loginService from '../login/login.service';
import SessionStorageService from '../../common/service/SessionStorageService';
import router from '../../app.router';

const ignoreUrls = [
    '/',
    '/main',
    '/main/welcome',
    '/main/error',
];

const checkLogin = () => {
    // return !!loginService.isLoggedIn();
    return SessionStorageService.get('user')
};

const hasAuth = (url) => {
    if (isIgnoreUrl(url)) {
        return true;
    }
    return contains(mainService.getMenuListData(), url);
};

const contains = (menus, url) => {
    window.console.log('路由守卫 已登录--->contains--->', menus);
    for (const menu of menus) {
        if (url === menu.routePath) {
            return true;
        }
        const buttons = menu.buttons;
        if (!buttons) {
            continue;
        }
        for (const button of buttons) {
            if (!button.routePath) {
                continue;
            }
            const prefix = button.routePath.slice(0, button.routePath.lastIndexOf(':'));
            if (url.startsWith(prefix)) {
                return true;
            }
        }
    }
    return false;
};

/**
 * 判断是否是忽略的URL
 * @param url 路径
 */
const isIgnoreUrl = (url) => {
    for (const key in ignoreUrls) {
        if (ignoreUrls[key] === url) {
            return true;
        }
    }
    return false;
};

// 路由守卫
const canActivate = (to) => {
    window.console.log('路由守卫权限判定开始--->跳转页面路由地址--->', to.path);
    // 判断是否登录
    const isLoggedIn = checkLogin();
    window.console.log('路由守卫权限判定开始--->跳转页面路由地址--->checkLogin', isLoggedIn);

    // 未登陆，跳转登陆页面
    if (!isLoggedIn) {
        window.console.log('路由守卫 未登陆--->跳转登陆页面');
        router.push({path: '/login'});
        return false;
    }

    // 登陆后, F5刷新，直接通过
    const redirectUrl = SessionStorageService.get('redirectUrl');
    if (redirectUrl === to.path) {
        window.console.log('路由守卫 F5刷新--->直接通过--->', redirectUrl);
        return true;
    }

    const canToAuth = hasAuth(to.path);
    // 没有权限，但是登陆了
    if (!canToAuth) {
        window.console.log('路由守卫 已登录--->未授权页面--->跳转404页面');
        router.push({path: '/main/error'});
        return false;
    }

    window.console.log('路由守卫权限判定成功--->跳转成功');
    return true;
};

// 路由守卫
export default canActivate;
