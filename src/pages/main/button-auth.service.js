import mainService from './main.service';

class ButtonAuthService {
    static getButtonAuth = (authButtons, router) => {
        const menu = mainService.getMenuListData().find(m => m.routePath === router.path);
        if (!menu) {
            return authButtons;
        }

        const pageButtons = menu.buttons.map(b => b.code);

        if (pageButtons) {
            Object.keys(authButtons).forEach(ab => authButtons[ab] = !!pageButtons.find(pb => pb === ab));
        }
        window.console.log('ButtonAuthService-> 当前页面的按钮', authButtons);
        return authButtons;
    };
}

export default ButtonAuthService;
