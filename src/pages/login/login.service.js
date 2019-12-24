import SessionStorageService from '../../common/service/SessionStorageService';
import HttpService from '../../common/service/HttpService';
import {User} from '../system/user/user.model';


/**
 * 清理缓存
 */
const clearLoginInfo = () => {
    SessionStorageService.set(USER, null);
};


/**
 * 登录成功处理逻辑
 */
const loginSuccess = (response) => {
    // 添加登录缓存
    SessionStorageService.set(USER, new User(response.data));
    return response;
};

/**
 * 登录失败处理逻辑
 */
const loginError = (error) => {
    window.console.log('loginError', error);
    return error;
};

const USER = 'user';

class LoginService {

    isLoggedIn = () => {
        return SessionStorageService.get(USER);
    };

    getUserInfo = () => {
        return SessionStorageService.get(USER);
    };

    autoLogin = () => {
        return HttpService.getNotHandleError('system/login').then(loginSuccess, loginError);
    };

    /**
     * 发送登录请求
     */
    login = (userName, password) => {
        const authorization = 'Basic ' + btoa(userName + ':' + password);
        const httpHeaders = {Authorization: authorization};
        const options = {headers: httpHeaders};
        return HttpService.getNotHandleError('system/login', null, options).then(loginSuccess, loginError);
    };

    /**
     * 退出
     */
    logout = () => {
        // 这里可能是服务端退出登录有重定向功能
        return HttpService.getNotHandleError('system/logout').then(this.clearLoginInfo, this.clearLoginInfo);
    };

    clearLoginInfo = () => {
        clearLoginInfo();
    };
}

const loginService = new LoginService();

export default loginService;
