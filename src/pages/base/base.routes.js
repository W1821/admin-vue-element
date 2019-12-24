import Welcome from './welcome/Welcome';
import Error from './error/Error';


/**
 * 子路由配置，不能以 / 开头
 */
export default [
    {path: 'welcome', component: Welcome,},
    {path: 'error', component: Error,},
];
