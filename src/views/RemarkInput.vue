<template>
	<div class="page-container">
		<van-field
			class="remark-input"
			rows="5"
			type="textarea"
			placeholder="请输入备注(100字以内)"
			:maxlength="100"
			v-model="inputText"
		/>
		<yi-button id="bottom_button" @click="confirmEdit">确认</yi-button>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import ReloadMixin from '../utils/reloadMixin';

export default {
	name: 'RemarkInput',
	mixins: [ReloadMixin],
	data() {
		return {
			type: 'boutique',
			inputText: ''
		};
	},
	computed: {
		...mapState(['boutiqueRemark', 'otherRemark', 'attachedRemark'])
	},
	methods: {
		...mapMutations({
			updateRemark: 'updateRemarkMutation'
		}),
		confirmEdit() {
			this.updateRemark({
				type: this.type,
				text: this.inputText
			});
			this.$router.go(-1);
		}
	},
	mounted() {
		this.type = this.$route.query.type;
		switch (this.type) {
			case 'other':
				this.inputText = this.otherRemark;
				break;
			case 'attached':
				this.inputText = this.attachedRemark;
				break;
			case 'boutique':
				this.inputText = this.boutiqueRemark;
				break;
		}
	}
};
</script>

<style scoped lang="less">
@import '../style/default';

.page-container {
	width: 100%;
	height: 100vh;
	padding: 20px;
	box-sizing: border-box;
}
.remark-input {
	background-color: #f0f0f0;
}

#bottom_button {
	width: 100%;
	height: 50px;
	border-radius: 25px;
	background-color: @theme-color;
	margin-top: 24px;
	.font-medium(16px, white);
}
</style>
