import SessionStorageService from '../../common/service/SessionStorageService';
import HttpService from '../../common/service/HttpService';
import menuService from '../system/menu/menu.service';

// 菜单集合，扁平结构，易于查找
let menuListData = [];
// 缓存用户的菜单数据, 树状结构
let menuTreeData = [];

const getMenuListByHttp = () => {
    return HttpService.get('/menu/main/list').then(setMenuData, error => error);
};

const setMenuData = (response) => {
    if (response) {
        // 菜单数据
        const menus = menuService.getSortedMenuList(response.data);
        menuListData = menus;
        menuTreeData = menuService.getMenuTree(menus);
    }
};

const REDIRECT_URL = 'redirectUrl';

class MainService {

    getMenuListData = () => {
        return menuListData;
    };

    getMenuTreeData = () => {
        return menuTreeData;
    };

    getRedirectUrl = () => {
        SessionStorageService.get(REDIRECT_URL);
    };
    setRedirectUrl = (redirectUrl) => {
        SessionStorageService.set(REDIRECT_URL, redirectUrl);
    };

    /**
     * 处理用户的菜单数据
     */
    init = () => {
        // 这里从后台数据库读取
        return getMenuListByHttp();
    };

    /**
     * 修改密码
     * @param data 请求体
     */
    modifyPwd = (data) => {
        return HttpService.post('/user/modify/ownPwd', data);
    };

}


const mainService = new MainService();

export default mainService;
