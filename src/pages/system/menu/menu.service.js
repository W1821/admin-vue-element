import HttpService from '../../../common/service/HttpService';
import {Menu} from './menu.model';


/**
 * 排序数组对象
 */
const sortMenus = (menus) => {
    return menus.sort((a, b) => a.rank - b.rank);
};

/**
 * 递归添加孩子节点
 */
const addChildrenMenus = (parentMenu, menus) => {
    menus.forEach(e => {
        if (parentMenu.id === e.pid) {
            parentMenu.children.push(e);
            addChildrenMenus(e, menus);
        }
    });
};

/**
 * 添加孩子节点
 */
const addChildrenTreeItem = (menuItem, children) => {
    menuItem.children = [];
    children.forEach(menu => {
        const childMenuItem = {
            key: menu.id + '',
            label: menu.menuName,
            disabled: true,
            children: undefined,
        };
        if (menu.children && menu.children.length > 0) {
            addChildrenTreeItem(childMenuItem, menu.children);
        } else {
            childMenuItem.disabled = false;
            // 添加按钮
            addMenuButtons(childMenuItem, menu);
        }
        menuItem.children.push(childMenuItem);
    });
};

const addMenuButtons = (childMenuItem, menu) => {
    if (menu.buttons && menu.buttons.length > 0) {
        childMenuItem.children = menu.buttons.map(button => {
            return {
                key: button.id + '-btn',
                label: button.buttonName,
                isLeaf: true,
                selectable: false,
            };
        });
    }
};


class MenuService {

    list = () => {
        return HttpService.post('/menu/list').then(res => res, () => null);
    };

    delete = (id) => {
        return HttpService.get('/menu/delete/' + id).then(res => res, () => null);
    };

    add = (body) => {
        return HttpService.post('/menu/add', body).then(res => res, () => null);
    };

    update = (body) => {
        return HttpService.post('/menu/update', body).then(res => res, () => null);
    };

    query = (id) => {
        return HttpService.get('/menu/query/' + id).then(res => res, () => null);
    };

    getSortedMenuList = (data) => {
        return sortMenus(this.getMenuList(data));
    };

    getMenuList = (data) => {
        return data.map(e => {
            const menu = new Menu();
            menu.setDataValue(e);
            return menu;
        });
    };

    getTreeItem = (menu) => {
        const menuItem = {
            key: menu.id + '',
            label: menu.menuName,
            disabled: true,
        };
        if (menu.children && menu.children.length > 0) {
            addChildrenTreeItem(menuItem, menu.children);
        }
        return menuItem;
    };

    getMenuTree = (menus) => {
        // 最顶层的菜单数组
        const topMenus = menus.filter(e => !e.pid);
        // 递归添加下级
        topMenus.forEach(e => addChildrenMenus(e, menus));
        return topMenus;
    };



}


const menuService = new MenuService();

export default menuService;
