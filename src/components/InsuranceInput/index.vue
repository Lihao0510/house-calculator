<template>
	<div class="insurance-input">
		<div v-if="showCheck">
			<van-checkbox
				class="checkbox"
				v-model="isCheckedStatus"
				checked-color="#00B9B5"
				@change="handleCheckboxChange"
			></van-checkbox>
		</div>
		<div class="right-content">
			<div class="insurance-name-box">
				<div class="name">{{ category }}</div>
				<span class="tip" v-if="canSelect && keyWord !== 'discount'">{{
					compensateFee
				}}</span>
			</div>
			<div class="price-box" @click="handlePicker">
				<span class="price" v-if="keyWord !== 'discount'">{{
					fee | priceFilter
				}}</span>
				<span v-else class="price common">{{ discountComp }}</span>
				<span class="right-arrow" v-if="canSelect"></span>
			</div>
		</div>
	</div>
</template>
<script>
import insuranceMap from '@/utils/insuranceMap';
import numeral from 'numeral';

export default {
	name: 'InsuranceInput',
	props: {
		// 是否展示checkbox项
		showCheck: {
			type: Boolean,
			default: true
		},
		// checkbox是否被选中
		isChecked: {
			type: Boolean
		},
		// 保险类名
		category: {
			type: String
		},
		// 保险可选项下的费用
		fee: {
			type: [String, Number]
		},
		// 右侧是否为可选项
		canSelect: {
			type: Boolean,
			default: false
		},
		// 保险类型, 与insuranceMap配合使用
		insuranceType: {
			type: Number
		},
		// 保险的key值, 区分保险的类型
		keyWord: {
			type: String
		}
	},
	data() {
		return {
			isCheckedStatus: false
		};
	},
	computed: {
		compensateFee() {
			try {
				let type = this.keyWord.split('Insurance')[0];

				return (
					(type === 'glass' ? '' : '赔偿') +
					insuranceMap[type][this.insuranceType - 1]['name']
				);
			} catch (e) {
				console.log('compensateFee error', e);
			}
		},
		discountComp() {
			const discountMap = {
				1: '无折扣',
				0.9: '九折',
				0.8: '八折',
				0.7: '七折',
				0.6: '六折'
			};

			try {
				let keyVal =
					this.fee === 1 ? this.fee : numeral(this.fee).format('0.0');
				console.log('this is keyVal====>', keyVal);
				return discountMap[keyVal];
			} catch (e) {
				console.log('discountComp error', e);
			}
		}
	},
	methods: {
		// checkbox修改
		handleCheckboxChange(e) {
			this.$emit(
				'handle-checkbox-change',
				e,
				this.keyWord.split('Insurance')[0]
			);
		},
		// 打开picker
		handlePicker() {
			console.log('aaaaa=====>', this.isCheckedStatus, this.showCheck);
			if (!this.isCheckedStatus && this.showCheck) return;
			this.$emit('handle-picker');
		}
	},
	mounted() {
		// 父组件传递过来的isChecked值, 子组件直接修改会有警告,
		// 这里重新定义一个isCheckedStatus用来接收和修改checkbox值
		this.isCheckedStatus = this.isChecked;
	}
};
</script>
<style lang="less" scoped>
.insurance-input {
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
</style>
