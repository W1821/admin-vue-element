import UserList from './user/UserList';
import RoleList from './role/RoleList';
import MenuList from './menu/MenuList';

/**
 * 子路由配置，不能以 / 开头
 */
export default [
    {path: 'system/user/list', component: UserList,},
    {path: 'system/role/list', component: RoleList,},
    {path: 'system/menu/list', component: MenuList},
];
