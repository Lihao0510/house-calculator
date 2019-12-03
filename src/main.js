import 'babel-polyfill';
import 'normalize.css/normalize.css';
import './style/init.less';
import 'amfe-flexible';
import Vue from 'vue';
import App from './App.vue';
import router from './route/router';
import YiWapLib from 'yiwaplib';
import 'yiwaplib/lib/yiwaplib.css';
import store from './store';
import './utils/filters';

Vue.use(YiWapLib, {
	env: 'prod',
	baseUrl: 'https://api.erp.yiautos.com/zuul/',
	oauthUrl: 'https://oauth.erp.yiautos.com/',
	client: 'demo',
	email: 'lih@itsmycar.com'
});

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
