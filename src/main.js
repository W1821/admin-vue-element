import Vue from 'vue';
////////////////////////////////////////////////////////////////////////////////////////////////////////
// element-ui组件库
import {
    Alert,
    Aside,
    Avatar,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    Checkbox,
    Col,
    Container,
    Dialog,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Footer,
    Form,
    FormItem,
    Header,
    Icon,
    Input,
    Loading,
    Main,
    Menu,
    MenuItem,
    MenuItemGroup,
    Option,
    Pagination,
    Popconfirm,
    Popover,
    Radio,
    RadioButton,
    RadioGroup,
    Row,
    Select,
    Submenu,
    Table,
    TableColumn,
    TabPane,
    Tabs,
    Tag,
    Tree,
    Upload,
} from 'element-ui';
////////////////////////////////////////////////////////////////////////////////////////////////////////
// http
import axios from 'axios';
import VueAxios from 'vue-axios';
////////////////////////////////////////////////////////////////////////////////////////////////////////
// 主页面
import App from './App.vue';
import './assets/css/style.css';
////////////////////////////////////////////////////////////////////////////////////////////////////////
// 路由
import router from './app.router';

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Row);
Vue.use(Col);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Checkbox);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Tree);

Vue.use(Avatar);
Vue.use(Alert);
Vue.use(Divider);
Vue.use(Tag);
Vue.use(Icon);
Vue.use(Loading);
Vue.use(Upload);
Vue.use(Card);
Vue.use(Tabs);
Vue.use(TabPane);

Vue.use(Dialog);
Vue.use(Popover);
Vue.use(Popconfirm);

Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
    router,
}).$mount('#app');
