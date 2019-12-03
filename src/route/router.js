import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home';
import ModelLib from '../views/ModelLib';
import PickInsurance from '../views/PickInsurance';
import PickTax from '../views/PickTax';
import RemarkInput from '../views/RemarkInput';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			redirect: '/calculator'
		},
		{
			path: '/calculator',
			name: 'Home',
			component: Home
		},
		{
			path: '/pick-insurance',
			name: 'PickInsurance',
			component: PickInsurance
		},
		{
			path: '/pick-tax',
			name: 'PickTax',
			component: PickTax
		},
		{
			path: '/model-lib',
			name: 'ModelLib',
			component: ModelLib
		},
		{
			path: '/remark-input',
			name: 'RemarkInput',
			component: RemarkInput
		},
		{
			path: '/share',
			name: 'Share',
			component: () => import(/* webpackChunkName: 'share' */ '../views/Share')
		}
	],
	scrollBehavior: () => ({
		y: 0
	})
});
