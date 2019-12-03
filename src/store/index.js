import Vue from 'vue';
import Vuex from 'vuex';
import Lodash from 'lodash';
import * as ComputeHelper from '../utils/ComputeHelper';
import Config from '../config';

Vue.use(Vuex);

const initialState = {
	/*
	 * 基础信息
	 * */
	houseArea: 0, //房屋面积
	areaPrice: 0, //每平方米价格
	discountType: 0, //优惠方式(0: 不优惠, 1: 每平米优惠, 2: 总价优惠, 3: 总价百分比)
	butType: 0, //购买方式(0: 按揭, 1: 全款)
	interestRate: Config.interestRate, //贷款利率
	loanYear: Config.loanYear, //贷款年数
	downPercent: Config.downPercent, //首付比例
	interestType: 0, //利息方式(0: 等额本金, 1: 等额本息)

	downPrice: 0, //首付
	publicFunc: 0, //公共维修基金
	contractTax: 0, //契税
};

//车型计算器Store,所有数据全部放在Store中,用于通用计算
const store = new Vuex.Store({
	state: Lodash.cloneDeepWith(initialState),
	getters: {
		//计算月供
		monthInterestComp(state) {
			return 0;
		},
	},
	mutations: {
		onModelSelectMutation(state, action) {
			state.selectedModel = action;
			//获取当前的指导价
			state.indicativePrice = ComputeHelper.computeIndicativePrice(
				action.indicativePrice
			);
			//获取当前首付款
			state.downPayment = ComputeHelper.computeDownPayment(
				action.indicativePrice
			);
			//选择后落地价为车价
			state.sellPrice = state.indicativePrice;
		},
	},
	actions: {
		//车型选择事件
		onModelSelectAction(context, params) {
			console.log('当前选择的车型 ==>', params);
			context.commit('resetStoreMutation');
			context.commit('onModelSelectMutation', params);
			context.commit('computeTheoreticCostMutation');
		},
	}
});

export default store;
