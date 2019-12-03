<template>
	<div class="tax-container">
		<div class="show-data-item" v-for="item in itemList" :key="item.key">
			<div class="label-wrap">
				<div class="label">
					<span class="name">{{ item.name }}</span>
					<i
						class="icon-show-detail"
						v-if="item.detail"
						@click="onGetDetail(item.key)"
					></i>
				</div>
				<div class="describe" v-if="item.describe">{{onFindDescribe(item.key)}}</div>
			</div>
			<div class="price-wrap">
				<div class="edit-price" v-if="item.edit">
					<yi-money-input
						:initValue="$store.state.licenceTax"
						input-align="right"
						@change="onChange(...arguments, item.key)"
					/>
					<i class="icon-edit"></i>
				</div>
				<span class="no-edit-price" v-else="item.edit">{{
					$store.state[item.key] || 0 | priceFilter
				}}</span>
			</div>
		</div>
		<div class="ensure-btn" @click="back">返回</div>
		<van-dialog v-model="show" :title="title" confirmButtonText="我知道了">
			<p v-show="dialogType === 'purchaseTax'" class="describe-1">
				购置税=开票价/（1+13%）x税率（10%）
			</p>
			<ul v-show="dialogType === 'vehicleTax'" class="traffic-wrap">
				<li class="traffic-item" v-for="item in trafficData" :key="item.name">
					<span class="name">{{ item.name }}</span>
					<span class="price">{{ item.price }}元</span>
				</li>
			</ul>
			<ul v-show="dialogType === 'forceTax'" class="traffic-wrap">
				<li class="traffic-item" v-for="item in forceData" :key="item.name">
					<span class="name">{{ item.name }}</span>
					<span class="price">{{ item.price }}元</span>
				</li>
			</ul>
			<p v-show="dialogType === 'licenceTax'" class="describe-1">
				默认500，请手动修改
			</p>
		</van-dialog>
	</div>
</template>

<script>
import ReloadMixin from '../utils/reloadMixin';

export default {
	name: 'PickTax',
	mixins: [ReloadMixin],
	data() {
		return {
			show: false,
			dialogType: '',
			title: '',
			value: '',
			itemList: [
				{
					key: 'purchaseTax',
					name: '购置税',
					detail: true,
					edit: false,
					describe: false
				},
				{
					key: 'vehicleTax',
					name: '车船使用税',
					detail: true,
					edit: false,
					describe: true
				},
				{
					key: 'forceTax',
					name: '交强险',
					detail: true,
					edit: false,
					describe: true
				},
				{
					key: 'licenceTax',
					name: '上牌费',
					detail: true,
					edit: true,
					describe: false
				}
				// {
				// 	key: 'g4',
				// 	name: '金融服务费',
				// 	detail: false,
				// 	edit: true,
				// 	describe: false
				// }
			],
			dataList: {},
			titleList: {
				purchaseTax: '购置税说明',
				vehicleTax: '车船使用税说明',
				forceTax: '交强险说明',
				licenceTax: '上牌费说明'
			},
			trafficData: [
				{
					name: '1.0L(含)以下',
					price: '300'
				},
				{
					name: '1.0L-1.6L(含)',
					price: '420'
				},
				{
					name: '1.6L-2.0L(含)',
					price: '480'
				},
				{
					name: '2.0L-2.5L(含)',
					price: '900'
				},
				{
					name: '2.5L-3.0L(含)',
					price: '1920'
				},
				{
					name: '3.0L-4.0L(含)',
					price: '3480'
				},
				{
					name: '4.0L-4.5L(含)',
					price: '5280'
				}
			],
			forceData: [
				{
					name: '家用六座以下',
					price: '950'
				},
				{
					name: '家用六座以上',
					price: '1100'
				}
			]
		};
	},
	methods: {
		onFindDescribe(key) {
			console.log(key)
			let dataList = [];
			switch (key) {
				case 'vehicleTax' :
					dataList = this.trafficData;
					break;
				case 'forceTax' :
					dataList = this.forceData;
					break;
			}
			for (let item of dataList) {
				if (item.price === this.$store.state[key].toString()) {
					return item.name
				}
			}
		},
		onGetDetail(key) {
			this.title = this.titleList[key];
			this.dialogType = key;
			this.show = true;
		},
		onChange(value, key) {
			if (this.isNumber(value)) {
				this.$store.commit('updateTaxPriceMutation', {
					category: key,
					value
				});
			}
		},
		back() {
			this.$router.back(-1)
		},
		isNumber(value) {
			return Object.prototype.toString.call(value).slice(8, -1) === 'Number';
		}
	},
	mounted() {}
};
</script>
<style>
.show-data-item .van-cell {
	padding: 0;
}
.show-data-item .van-cell .van-field__control {
	font-size: 16px;
	color: rgba(0, 0, 0, 0.84);
	font-weight: bold;
}
.show-data-item .van-cell:not(:last-child):after {
	border: none;
}
</style>
<style scoped lang="less">
@import '../style/default';
.traffic-wrap {
	width: 100%;
	padding: 6px 18px 10px;
	box-sizing: border-box;
	.traffic-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 48px;
		border-bottom: 1px solid #f0f0f0;
		font-size: 16px;
		color: rgba(51, 51, 51, 0.84);
		&:last-child {
			border: none;
		}
	}
}
.tax-container {
	width: 100%;
	padding-left: 20px;
	box-sizing: border-box;
}
.show-data-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 60px;
	border-bottom: 1px solid #f0f0f0;
	line-height: 1;
	box-sizing: border-box;
	.label-wrap {
		.label {
			display: flex;
			align-items: center;
			.name {
				font-size: 16px;
				color: rgba(0, 0, 0, 0.84);
				margin-right: 4px;
			}
			.icon-show-detail {
				display: block;
				width: 12px;
				height: 12px;
				background: url('../assets/tax/icon-describe.png') no-repeat;
				background-size: 100% 100%;
			}
		}
		.describe {
			font-size: 12px;
			margin-top: 8px;
			color: rgba(0, 0, 0, 0.32);
		}
	}
	.price-wrap {
		font-size: 16px;
		color: rgba(0, 0, 0, 0.84);
		.no-edit-price {
			margin-right: 20px;
			font-weight: bold;
		}
		.edit-price {
			display: flex;
			align-items: center;
			margin-right: 15px;
			.edit-input {
				max-width: 100px;
				text-align: right;
				font-size: 16px;
				font-weight: bold;
			}
			.icon-edit {
				display: block;
				width: 12px;
				height: 12px;
				margin-left: 8px;
				background: url('../assets/tax/icon-edit.png') no-repeat;
				background-size: 100% 100%;
			}
		}
	}
}
.ensure-btn {
	width: 335px;
	height: 50px;
	line-height: 50px;
	background: #00B9B5;
	border-radius: 25px;
	text-align: center;
	color: #fff;
	font-size: 16px;
	margin-top: 48px;
}
.describe-1 {
	width: 100%;
	font-size: 14px;
	color: rgba(0, 0, 0, 0.84);
	text-align: center;
	margin: 16px 0 24px;
}
</style>
