<template>
	<div class="home-page">
		<div class="top-price-wrap">
			<div class="top-price">
				<span id="total_money">{{ 1000000 | priceFilter }}</span>
				<span id="total_money_desc">购房总价格</span>
			</div>
			<div class="top-price-detail" v-if="selectedModel.name">
				<div class="top-price-detail-price">
					<div class="top-price-cell">
						<span>{{ 30 }}</span>
						<span>贷款时间(年)</span>
					</div>
					<div class="top-price-cell">
						<span>{{ 500000 | priceFilter }}</span>
						<span>首付(元)</span>
					</div>
					<div class="top-price-cell">
						<span>{{ 5000 | grossFilter }}</span>
						<span>月供(元)</span>
					</div>
				</div>
			</div>
		</div>
		<home-input type="text" label="购房城市" value="漳州" />
		<home-input
			type="percent"
			label="房屋面积"
			:value="discountPercent"
			@change="onDiscountPercentEdit"
		/>
		<home-input
			key="discountMoney"
			type="money"
			label="单价(元/m2)"
			:value="discountMoney"
			@change="onDiscountMoneyEdit"
		/>
		<home-input
			type="select"
			label="优惠方式"
			placeholder="请选择优惠方式"
			:value="discountTypeComp"
			@click="onOpenSelectDiscount"
		/>
		<home-input
			key="discountMoney"
			v-if="discountType === 1"
			type="money"
			label="每平米优惠(元)"
			:value="discountMoney"
			@change="onDiscountMoneyEdit"
		/>
		<home-input
			v-else-if="discountType === 2"
			type="percent"
			label="优惠百分比(%)"
			:value="discountPercent"
			@change="onDiscountPercentEdit"
		/>
		<home-input
			v-else-if="discountType === 3"
			type="money"
			key="increaseMoney"
			label="总价优惠(元)"
			:value="increaseMoney"
			@change="onIncreaseMoneyEdit"
		/>
		<home-input
			type="select"
			label="购买方式"
			placeholder="请选择购买方式"
			:value="discountTypeComp"
			@click="onOpenSelectDiscount"
		/>
		<home-input
			type="text"
			label="开票价"
			placeholder="请选择车型"
			:value="sellPrice | priceFilter"
		/>
		<home-input
			type="text"
			label="契税"
			placeholder="请选择车型"
			:value="downPayment | priceFilter"
		/>
		<home-input
			type="text"
			label="公共维修基金"
			placeholder="请选择车型"
			:value="refundYear + '年'"
		/>
		<home-input
			type="money"
			label="其他收费合计(元)"
			:value="totalOther"
			@change="onOtherMoneyEdit"
		/>
		<home-input
			type="jump"
			label="其他收费备注"
			hint="收费内容、收费方式/金额等"
			placeholder="请输入备注"
			:value="otherRemark | remarkSlice"
			@click="onRemarkEdit('other')"
		/>
		<span id="bottom_remind">此结果仅供参考，实际费用以当地缴费为准</span>
		<yi-button id="bottom_button" @click="generateQuoteImage"
			>点击生成图片</yi-button
		>
		<!--优惠方式底部菜单-->
		<yi-action-sheet
			v-model="showDiscountTypeSelect"
			:actions="discountTypeOptions"
			cancel-text="取消"
			@cancel="showDiscountTypeSelect = false"
			@select="onDiscountSelected"
		/>
	</div>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex';
import HomeInput from '../components/HomeInput';
import ReloadMixin from '../utils/reloadMixin';

export default {
	name: 'Home',
	components: { HomeInput },
	mixins: [ReloadMixin],
	data() {
		return {
			showDiscountTypeSelect: false,
			discountTypeOptions: [
				{ name: '优惠金额', type: 1 },
				// { name: '优惠点数', type: 2 },
				{ name: '加价金额', type: 3 }
			]
		};
	},
	computed: {
		...mapState([
			'selectedModel',
			'discountType',
			'discountPercent',
			'discountMoney',
			'increaseMoney',
			'sellPrice',
			'totalTax',
			'totalInsurance',
			'totalBoutique',
			'totalOther',
			'indicativePrice',
			'downPayment',
			'refundYear',
			'boutiqueRemark',
			'otherRemark',
			'attachedRemark'
		]),
		...mapGetters({
			sellPriceComp: 'sellPriceComp',
			monthInterestComp: 'monthInterestComp',
			returnProfitComp: 'returnProfitComp',
			grossProfitComp: 'grossProfitComp',
			totalTaxComp: 'totalTaxComp',
			carGeneralPriceComp: 'carGeneralPriceComp',
			totalInsuranceComp: 'totalInsuranceComp'
		}),
		//裸车价计算公式显示
		discountTypeComp() {
			switch (this.discountType) {
				case 1:
					return '优惠金额';
				case 2:
					return '优惠点数';
				case 3:
					return '加价金额';
				default:
					return '';
			}
		}
	},
	methods: {
		...mapMutations({
			updateBoutiquePriceMutation: 'updateBoutiquePriceMutation',
			updateOtherPriceMutation: 'updateOtherPriceMutation',
			updateDiscountMutation: 'updateDiscountMutation'
		}),
		...mapActions({
			updateDiscountAction: 'updateDiscountAction'
		}),
		onSelectModel() {
			this.$router.push('/model-lib?from=home');
		},
		onRemarkEdit(type) {
			if (!this.indicativePrice) {
				this.$toast.fail({
					message: '请先选择车型!',
					duration: 1000
				});
				return;
			}
			this.$router.push(`/remark-input?type=${type}`);
		},
		onBoutiqueMoneyEdit(amount) {
			this.updateBoutiquePriceMutation(amount);
		},
		onOtherMoneyEdit(amount) {
			this.updateOtherPriceMutation(amount);
		},
		onOpenSelectDiscount() {
			if (!this.indicativePrice) {
				this.$toast.fail({
					message: '请先选择车型!',
					duration: 1000
				});
				return;
			}
			this.showDiscountTypeSelect = true;
		},
		onDiscountSelected(option) {
			this.showDiscountTypeSelect = false;
			this.updateDiscountAction({
				type: 'type',
				value: option.type
			});
		},
		goTaxDetail() {
			if (!this.indicativePrice) {
				this.$toast.fail({
					message: '请先选择车型!',
					duration: 1000
				});
				return;
			}
			this.$router.push('/pick-tax');
		},
		goInsuranceDetail() {
			if (!this.indicativePrice) {
				this.$toast.fail({
					message: '请先选择车型!',
					duration: 1000
				});
				return;
			}
			this.$router.push('/pick-insurance');
		},
		onDiscountMoneyEdit(value) {
			this.updateDiscountAction({
				type: 'discount',
				value: value
			});
		},
		onDiscountPercentEdit(value) {
			this.updateDiscountAction({
				type: 'percent',
				value: value
			});
		},
		onIncreaseMoneyEdit(value) {
			this.updateDiscountAction({
				type: 'increase',
				value: value
			});
		},
		generateQuoteImage() {
			if (!this.indicativePrice) {
				this.$toast.fail({
					message: '请先选择车型!',
					duration: 1000
				});
				return;
			}
			this.$router.push('/share');
		}
	},
	mounted() {}
};
</script>

<style scoped lang="less">
@import '../style/default';
.home-page {
	.flexible(column, center, flex-start);
	width: 100%;
	padding: 20px 0;
	box-sizing: border-box;
}
.top-price-wrap {
	width: 100%;
	padding: 0 20px;
	box-sizing: border-box;
}
.top-price {
	width: 100%;
	height: 128px;
	background-color: @theme-color;
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
	.flexible(column, center, center);
	#total_money {
		.font-semi(32px, white);
		margin-bottom: 12px;
	}
	#total_money_desc {
		.font-regular(12px, rgba(255, 255, 255, 0.7));
	}
}
.top-price-detail {
	width: 100%;
	height: 56px;
	background-color: @theme-color;
	&-price {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.1);
		.flexible(row, center, flex-start);
	}
	.top-price-cell {
		height: 100%;
		flex: 1;
		.flexible(column, center, center);
		span:nth-child(1) {
			.font-semi(16px, white);
		}
		span:nth-child(2) {
			.font-regular(12px, white);
			opacity: 0.7;
			margin-top: 4px;
		}
	}
}
#bottom_remind {
	.font-regular(12px, @text-hint);
	margin-top: 24px;
	margin-bottom: 16px;
}
#bottom_button {
	width: 335px;
	height: 50px;
	border-radius: 25px;
	background-color: @theme-color;
	margin: 0 auto 24px;
	.font-medium(16px, white);
}
</style>
