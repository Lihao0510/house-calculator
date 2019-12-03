import Vue from 'vue';
import Vuex from 'vuex';
import Lodash from 'lodash';
import * as ComputeHelper from '../utils/ComputeHelper';

Vue.use(Vuex);

const initialState = {
	/*
	 * 基础信息
	 * */

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
