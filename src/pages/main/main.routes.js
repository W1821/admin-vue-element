import Main from './Main';
import Error from '../base/error/Error';

import canActivate from './main.auth.service';

import baseRoutes from '../base/base.routes';
import systemRoutes from '../system/system.routes';
import demoRoutes from '../demo/demo.routes';

const beforeEnter = (to, from, next) => canActivate(to) ? next() : next(false);

const mainRoutes = {
    path: '/main',
    component: Main,
    beforeEnter: beforeEnter,
    children: [
        ...baseRoutes,
        ...systemRoutes,
        ...demoRoutes,
        {path: '**', component: Error}
    ]
};

// 添加路由守卫
mainRoutes.children.forEach(route => route.beforeEnter = beforeEnter);

export default mainRoutes;
