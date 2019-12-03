<template>
	<div class="pick-insurance-box">
		<div class="insurance-list">
			<insurance-input
				category="第三方责任险"
				keyWord="thirdInsuranceFee"
				subName="10"
				:isChecked="thirdInsuranceEnable"
				:fee="thirdInsuranceFee"
				:canSelect="true"
				:insuranceType="thirdInsuranceType"
				@handle-checkbox-change="handleCheckboxChange"
				@handle-picker="handlePicker('third')"
			></insurance-input>
			<insurance-input
				category="车辆损失险"
				keyWord="damageInsuranceFee"
				:isChecked="damageInsuranceEnable"
				:fee="damageInsuranceFee"
				@handle-checkbox-change="handleCheckboxChange"
			></insurance-input>
			<insurance-input
				category="全车盗抢险"
				keyWord="robberyInsuranceFee"
				:isChecked="robberyInsuranceEnable"
				:fee="robberyInsuranceFee"
				@handle-checkbox-change="handleCheckboxChange"
			></insurance-input>
			<insurance-input
				category="玻璃单独破碎险"
				keyWord="glassInsuranceFee"
				:isChecked="glassInsuranceEnable"
				:fee="glassInsuranceFee"
				:canSelect="true"
				:insuranceType="glassInsuranceType"
				@handle-checkbox-change="handleCheckboxChange"
				@handle-picker="handlePicker('glass')"
			></insurance-input>
			<insurance-input
				category="自燃损失险"
				keyWord="burnInsuranceFee"
				:isChecked="burnInsuranceEnable"
				:fee="burnInsuranceFee"
				@handle-checkbox-change="handleCheckboxChange"
			></insurance-input>
			<insurance-input
				category="不计免赔特约险"
				keyWord="specialInsuranceFee"
				:isChecked="specialInsuranceEnable"
				:fee="specialInsuranceFee"
				@handle-checkbox-change="handleCheckboxChange"
			></insurance-input>
			<insurance-input
				category="无过责任险"
				keyWord="innocentInsuranceFee"
				:isChecked="innocentInsuranceEnable"
				:fee="innocentInsuranceFee"
				@handle-checkbox-change="handleCheckboxChange"
			></insurance-input>
			<insurance-input
				category="车上人员责任险"
				keyWord="passengerInsuranceFee"
				:isChecked="passengerInsuranceEnable"
				:fee="passengerInsuranceFee"
				@handle-checkbox-change="handleCheckboxChange"
			></insurance-input>
			<insurance-input
				category="划痕险"
				keyWord="cutInsuranceFee"
				:isChecked="cutInsuranceEnable"
				:canSelect="true"
				:fee="cutInsuranceFee"
				:insuranceType="cutInsuranceType"
				@handle-checkbox-change="handleCheckboxChange"
				@handle-picker="handlePicker('cut')"
			></insurance-input>
			<insurance-input
				category="涉水险"
				keyWord="waterInsuranceFee"
				:isChecked="waterInsuranceEnable"
				:fee="waterInsuranceFee"
				@handle-checkbox-change="handleCheckboxChange"
			></insurance-input>
			<insurance-input
				category="折扣"
				keyWord="discount"
				:fee="insuranceDiscountPercent"
				:showCheck="false"
				:canSelect="true"
				@handle-picker="handlePicker('discount')"
			></insurance-input>
		</div>
		<div class="total-box">
			<span class="text">总计：</span>
			<span class="price"
				><b>{{ $store.getters.totalInsuranceComp | priceFilter }}</b
				>元</span
			>
		</div>
		<div class="btn-box">
			<van-button type="default" class="btn" @click="handleBack"
				>返回</van-button
			>
		</div>
		<!-- 弹出框 -->
		<van-popup v-model="showPicker" position="bottom">
			<van-picker
				show-toolbar
				value-key="name"
				:columns="pickerColumns"
				@cancel="showPicker = false"
				@confirm="onConfirm"
			/>
		</van-popup>
	</div>
</template>

<script>
import insuranceMap from '@/utils/insuranceMap';
import InsuranceInput from '@/components/InsuranceInput';
import { mapState, mapGetters } from 'vuex';
import ReloadMixin from '../utils/reloadMixin';

export default {
	name: 'PickInsurance',
	mixins: [ReloadMixin],
	components: {
		InsuranceInput
	},
	data() {
		return {
			showPicker: false,
			pickerColumns: [],
			openCategory: '' // 记录当前打开的保险picker数据
		};
	},
	computed: {
		...mapState([
			//第三者责任险
			'thirdInsuranceFee',
			//第三者责任险类型(1: 5/2: 10/3: 20/4: 50/5: 100)
			'thirdInsuranceType',
			//车辆损失险
			'damageInsuranceFee',
			//盗抢险
			'robberyInsuranceFee',
			//玻璃单独破碎险
			'glassInsuranceFee',
			//玻璃单独破碎险类型(1: 国产/2: 进口)
			'glassInsuranceType',
			//自燃损失险
			'burnInsuranceFee',
			//不计免赔特约险
			'specialInsuranceFee',
			//无过责任险
			'innocentInsuranceFee',
			//车上人员责任险
			'passengerInsuranceFee',
			//划痕险
			'cutInsuranceFee',
			//划痕险(1: 2千/2: 5千/3: 1万/4: 2万/)
			'cutInsuranceType',
			//涉水险
			'waterInsuranceFee',

			/*
			 * 保险费用页面开关状态
			 * */
			//第三者责任险是否选中
			'thirdInsuranceEnable',
			//车辆损失险是否选中
			'damageInsuranceEnable',
			//盗抢险是否选中
			'robberyInsuranceEnable',
			//玻璃单独破碎险是否选中
			'glassInsuranceEnable',
			//自燃损失险是否选中
			'burnInsuranceEnable',
			//不计免赔特约险是否选中
			'specialInsuranceEnable',
			//无过责任险是否选中
			'innocentInsuranceEnable',
			//车上人员责任险是否选中
			'passengerInsuranceEnable',
			//划痕险是否选中
			'cutInsuranceEnable',
			//涉水险是否选中
			'waterInsuranceEnable',

			//保险折扣
			'insuranceDiscountPercent'
		]),
		...mapGetters({
			totalInsuranceComp: 'totalInsuranceComp'
		})
	},
	methods: {
		// checkbox修改事件
		handleCheckboxChange(value, type) {
			this.$store.dispatch('updateInsurancePriceAction', {
				category: type,
				enable: value
			});
		},
		// 监听picker
		handlePicker(val) {
			console.log('this is value====>', val);
			this.showPicker = true;
			this.pickerColumns = insuranceMap[val];
			this.openCategory = val;
		},
		onConfirm(value) {
			console.log('this is confirm value====>', value);
			this.showPicker = false;
			this.$store.dispatch('updateInsurancePriceAction', {
				category: this.openCategory,
				enable: true,
				type: value.code
			});
		},
		handleBack() {
			this.$router.go(-1);
		}
	},
	mounted() {}
};
</script>
<style lang="less">
@import '../style/default';

.pick-insurance-box {
	.van-picker__cancel,
	.van-picker__confirm {
		color: @theme-color;
	}
}
</style>

<style scoped lang="less">
@import '../style/default';

.pick-insurance-box {
	width: 100%;
	height: auto;
	.insurance-list {
		width: 100%;
		.insurance-item {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding: 18px 20px;
			&::after {
				content: '';
				position: absolute;
				left: 20px;
				right: 0;
				bottom: -2.5px;
				height: 1px;
				background: #ddd;
				transform: scaleY(0.5);
			}
			.checkbox {
				width: 22px;
				height: 22px;
				margin-right: 8px;
			}
			.right-content {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.insurance-name-box {
					display: flex;
					flex-direction: column;
					.name {
						height: 16px;
						line-height: 16px;
						font-size: 16px;
						font-weight: 400;
						color: rgba(0, 0, 0, 1);
					}
					.tip {
						margin-top: 8px;
						height: 12px;
						line-height: 12px;
						font-size: 12px;
						font-weight: 300;
						color: rgba(0, 0, 0, 1);
					}
				}
				.price-box {
					display: flex;
					align-items: center;
					.price {
						height: 16px;
						font-size: 16px;
						font-weight: bold;
						color: rgba(0, 0, 0, 1);
						line-height: 16px;
					}
					.right-arrow {
						display: inline-block;
						margin-left: 8px;
						width: 8px;
						height: 8px;
						border-top: 2px solid #c5c5c5;
						border-right: 2px solid #c5c5c5;
						transform: rotate(45deg);
					}
				}
			}
		}
	}
	.total-box {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin: 22px 20px 0 0;
		height: 16px;
		line-height: 16px;
		font-size: 16px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 1);
		line-height: 16px;
		.text {
		}
		.price {
			margin-left: 10px;
			b {
				font-weight: bold;
			}
		}
	}
	.btn-box {
		margin: 62px 0 30px 0;
		padding: 10px 20px;
		.btn {
			width: 100%;
			height: 50px;
			color: #fff;
			font-size: 15px;
			border-radius: 25px;
			background: @theme-color;
		}
	}
}
</style>
