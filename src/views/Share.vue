<template>
	<div>
		<div class="share-container">
			<div class="share-content" ref="imageDom" id="imageDom">
				<div class="share-title">
					<p class="main-title">{{getBrandComp.brand}}</p>
					<p class="subtitle">{{getBrandComp.series}}</p>
				</div>
				<div class="share-text">
					<div class="bg-top"></div>
					<ul class="text-wrap">
						<li
							class="text-item"
							v-for="type in textDataList"
							:key="type.title"
						>
							<p class="item-title">{{ type.title }}</p>
							<div
								class="item-detail"
								v-for="item in type.itemList"
								:key="item.name"
								v-show="!item.hide"
							>
								<span class="label">{{ item.name }}</span>
								<span class="price" v-if="!item.type">
									{{item.price | priceFilter}}元</span>
								<span class="price" v-else>{{item.price || ''}}</span>
							</div>
							<p class="border"></p>
						</li>
					</ul>
					<div class="total">
						提车总费用：{{ $store.getters.carGeneralPriceComp | priceFilter }}(元)
					</div>
					<div class="bg-bottom"></div>
					<div class="bg-dream"></div>
					<img class="footer-tip" src="../assets/share/icon-tip.png" />
				</div>
			</div>
			<img :src="imgUrl" alt="" class="img" v-show="imgUrl" />
		</div>
		<div class="btn" @click="btn">{{ tip }}</div>
	</div>
</template>

<script>
import html2canvas from 'html2canvas';
import ReloadMixin from '../utils/reloadMixin';

export default {
	name: 'Share',
	mixins: [ReloadMixin],
	computed: {
		textDataList() {
			const discountDataMap = [
				{
					code: 0,
					key: 'none',
					name: '不优惠'
				},
				{
					code: 1,
					key: 'discountMoney',
					name: '优惠'
				},
				{
					code: 2,
					key: 'discountPercent',
					name: '优惠点数'
				},
				{
					code: 3,
					key: 'increaseMoney',
					name: '加价'
				}
			];
			const discountData = discountDataMap[this.$store.state.discountType];
			return [
				{
					title: '裸车',
					itemList: [
						{
							name: '车身价',
							price: this.$store.state['sellPrice']
						},
						{
							name: discountData.name,
							price: this.$store.state[discountData.key],
							hide: !this.$store.state[discountData.key]
						}
					]
				},
				{
					title: '金融费用',
					itemList: [
						{
							name: '首付金额',
							price: this.$store.state['downPayment']
						},
						{
							name: '还款周期',
							price: `${this.$store.state['refundYear'] * 12}个月`,
							type: 'time'
						},
						{
							name: '每月还款',
							price: this.$store.getters['monthInterestComp']
						}
					]
				},
				{
					title: '商业险',
					itemList: [
						{
							name: '保费',
							price: this.$store.getters['totalInsuranceComp']
						}
					]
				},
				{
					title: '必要费用',
					itemList: [
						{
							name: '购置税',
							price: this.$store.state['purchaseTax']
						},
						{
							name: '车船税',
							price: this.$store.state['vehicleTax']
						},
						{
							name: '交强险',
							price: this.$store.state['forceTax']
						},
						{
							name: '上牌费',
							price: this.$store.state['licenceTax']
						}
					]
				},
				{
					title: '精品费用',
					itemList: [
						{
							name: '精品套餐',
							price: this.$store.state['totalBoutique']
						}
					]
				},
				{
					title: '精品备注',
					itemList: [
						{
							name: this.$store.state['boutiqueRemark'] || '无',
							type: 'mark'
						}
					]
				},
				{
					title: '赠品备注',
					itemList: [
						{
							name: this.$store.state['attachedRemark'] || '无',
							type: 'mark'
						}
					]
				},
				{
					title: '其他收费',
					itemList: [
						{
							name: '其他收费合计',
							price: this.$store.state['totalOther']
						}
					]
				},
				{
					title: '其他收费备注',
					itemList: [
						{
							name: this.$store.state['otherRemark'] || '无',
							type: 'mark'
						}
					]
				}
			];
		},
		getBrandComp() {
			let selectedModel = this.$store.state.selectedModel;
			let splitStr = selectedModel.productiveYear;
			try {
				return  {
					brand: selectedModel.name.split(splitStr)[0].trim(),
					series: splitStr + selectedModel.name.split(splitStr)[1]
				}
			} catch (e) {
				return {
					brand: selectedModel.name && selectedModel.name.split(' ')[0] || '',
					series: selectedModel.name && selectedModel.name.split(' ').slice(1).join(' ') || ''
				}
			}
		},
	},
	data() {
		return {
			imgUrl: '',
			tip: '图片生成中...'
		};
	},
	methods: {
		btn() {}
	},
	mounted() {
		if (!this.$store.state.indicativePrice) {
			return false;
		}
		const toast = this.$toast.loading({
			message: '图片生成中...',
			forbidClick: true
		});
		setTimeout(() => {
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
			html2canvas(this.$refs.imageDom, {
				logging: true, // 启用日志记录以进行调试 (发现加上对去白边有帮助)
				allowTaint: true, // 否允许跨源图像污染画布
				backgroundColor: null, // 解决生成的图片有白边
				useCORS: true // 如果截图的内容里有图片,解决文件跨域问题
			}).then(canvas => {
				// 转成图片，生成图片地址
				this.imgUrl = canvas.toDataURL('image/png');
				toast.clear();
			});
			this.tip = '长按图片保存报价单！';
		}, 500);
	}
};
</script>

<style scoped lang="less">
@import '../style/default';
.footer-bg {
	width: 100%;
	height: 6px;
	background-image: repeating-linear-gradient(
		135deg,
		#000 0,
		#000 6px,
		#fff 0,
		#fff 12px,
		#00b9b5 0,
		#00b9b5 18px
	);
}
.img {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
}
.share-container {
	position: relative;
	font-variant: normal;
	font-family: '\9ED1\4F53';
}
.share-content {
	position: relative;
	width: 100%;
	background: rgba(0, 185, 181, 1);
	line-height: 1;
	.share-title {
		width: 351px;
		background: url('../assets/share/bg-title.png') no-repeat;
		background-size: 100% 100%;
		margin: 0 auto;
		color: #fff;
		text-align: center;
		overflow: hidden;
		padding-bottom: 36px;
		.main-title {
			font-weight: bold;
			font-size: 30px;
			margin: 40px 0 10px;
			line-height: 1;
		}
		.subtitle {
			font-weight: normal;
			font-size: 20px;
			padding: 0 20px;
			line-height: 28px;
			/*overflow: hidden;*/
			/*text-overflow: ellipsis;*/
			/*-ms-text-overflow: ellipsis;*/
			/*display: box;*/
			/*display: -webkit-box;*/
			/*line-clamp: 1;*/
			/*-webkit-line-clamp: 1;*/
			/*-webkit-box-orient: vertical;*/
		}
	}
	.share-text {
		position: relative;
		width: 335px;
		margin: -8px auto 0;
		overflow: hidden;
		.bg-top {
			width: 100%;
			height: 24px;
			background: url('../assets/share/bg-text-top.png') no-repeat;
			background-size: 100% 100%;
		}
		.bg-bottom {
			width: 100%;
			height: 6px;
			background: url('../assets/share/bg-text-bottom.png') no-repeat;
			background-size: 100% 100%;
		}
		.bg-dream {
			position: absolute;
			left: 50%;
			top: -22px;
			transform: translateX(-50%);
			width: 116px;
			height: 101px;
			background: url('../assets/share/icon-dream.png') no-repeat;
			background-size: 100% 100%;
		}
		.text-wrap {
			background: #fff;
			.text-item {
				position: relative;
				width: 100%;
				padding: 11px 30px 8px;
				box-sizing: border-box;
				/*border-bottom: 1px dashed rgba(0, 0, 0, 0.08);*/
				&:first-child {
					padding-top: 0;
				}
				.item-title {
					font-size: 16px;
					line-height: 22px;
					color: rgba(0, 0, 0, 0.84);
					margin-bottom: 8px;
					font-weight: bold;
				}
				.item-detail {
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 14px;
					line-height: 20px;
					margin-bottom: 4px;
					.label {
						display: block;
						max-width: 100%;
						word-wrap:break-word;
						color: rgba(0, 0, 0, 0.56);
					}
					.price {
						color: rgba(0, 0, 0, 0.84);
						font-weight: bold;
					}
				}
				.border {
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 1px;
					background: url("../assets/share/icon-border.png") no-repeat;
					background-size: 100% 100%;
				}
			}
		}
		.total {
			text-align: right;
			padding: 19px 30px 19px 0;
			font-size: 18px;
			line-height: 25px;
			color: rgba(0, 0, 0, 0.84);
			font-weight: bold;
			background: #fff;
		}
	}
	.footer-tip {
		display: block;
		width: 196px;
		padding: 36px 0 24px;
		margin: 0 auto;
	}
}
.btn {
	width: 343px;
	height: 48px;
	line-height: 48px;
	text-align: center;
	background: #00b9b5;
	color: #fff;
	font-size: 18px;
	font-weight: bold;
	border-radius: 24px;
	margin: 8px auto;
}
</style>
