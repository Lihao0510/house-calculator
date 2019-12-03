<template>
	<yi-model-wechat
		@on-back-page="onCloseModelLib"
		@on-select-success="onModelSelect"
	/>
</template>

<script>
import { mapActions } from 'vuex';
import ReloadMixin from '../utils/reloadMixin';

export default {
	name: 'ModelLib',
	mixins: [ReloadMixin],
	methods: {
		...mapActions({
			dispatchModel: 'onModelSelectAction'
		}),
		onModelSelect(model) {
			if (model.indicativePrice > 20) {
				this.$dialog
					.alert({
						title: '温馨提示',
						message: '梦想贷暂不支持此车型,敬请期待'
					})
					.then(() => {
						// on close
					});
				return;
			}

			this.dispatchModel(model);
			this.$router.go(-1);
		},
		onCloseModelLib() {
			this.$router.go(-1);
		}
	}
};
</script>

<style scoped lang="less">
@import '../style/default';
</style>
