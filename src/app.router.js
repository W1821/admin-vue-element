import Vue from 'vue';
import Router from 'vue-router';

import Login from './pages/login/Login';

import loginRoutes from './pages/login/login.routes';
import mainRoutes from './pages/main/main.routes';

Vue.use(Router);

export default new Router({
    routes: [
        {path: '/', component: Login},
        ...loginRoutes,
        mainRoutes,
        {path: '**', component: Login}
    ]
});
