<template>
	<div class="home-input-box" :class="classComp">
		<div class="label" v-if="label">
			<span class="label-text" >{{ label }}</span>
			<span v-if="showHintComp" class="label-hint">{{ hint }}</span>
		</div>
		<span v-if="showTypeTextComp" :class="['input-content', label ? '' : 'input-content-no-label', !label && !value ? 'input-content-no-label-color': '']" @click="onSelect">{{
			value || placeholder
		}}</span>
		<yi-money-input
			v-if="showTypeNumberComp"
			class="input-content money-content"
			:init-value="value"
			@change="onNumberChange"
		/>
		<van-field
			v-if="showTypePercentComp"
			class="input-content money-content"
			type="number"
			:value="value"
			@change="onPercentChange"
		/>
		<img v-if="showBasicImgComp" class="right-icon" :src="iconComp" />
		<img
			v-else-if="type === 'percent'"
			class="right-icon-percent"
			:src="iconComp"
		/>
<!--		<span v-else class="right-icon"></span>-->
	</div>
</template>

<script>
import editIcon from '../../assets/icon_edit.png';
import rightIcon from '../../assets/icon_right.png';
import percentIcon from '../../assets/icon_percent.png';
import lodash from 'lodash';

const icons = {
	input: editIcon,
	money: editIcon,
	select: rightIcon,
	textarea: editIcon,
	jump: rightIcon,
	percent: percentIcon,
	text: null
};

export default {
	name: 'HomeInput',
	props: {
		//输入类型: input, select, textarea
		type: {
			type: String,
			default: 'input'
		},
		value: {
			type: String | Number,
			default: ''
		},
		label: {
			type: String,
			default: ''
		},
		hint: {
			type: String,
			default: ''
		},
		placeholder: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		classComp() {
			return {
				low: ['input', 'select', 'text', 'money', 'percent'].includes(
					this.type
				),
				high: ['textarea', 'jump'].includes(this.type)
			};
		},
		iconComp() {
			return icons[this.type];
		},
		showHintComp() {
			return this.hint !== '';
		},
		showTypeTextComp() {
			return ['select', 'text', 'textarea', 'jump'].includes(this.type);
		},
		showTypeNumberComp() {
			return ['money'].includes(this.type);
		},
		showTypePercentComp() {
			return ['percent'].includes(this.type);
		},
		showBasicImgComp() {
			return this.type !== 'text' && this.type !== 'percent';
		}
	},
	methods: {
		onSelect() {
			this.$emit('click');
		},
		onNumberChange(value) {
			console.log('onNumberChange ==>', value);
			lodash.isNumber(value) && this.$emit('change', value);
		},
		onPercentChange(e) {
			this.$emit('change', parseFloat(e.target.value));
		}
	}
};
</script>

<style scoped lang="less">
@import '../../style/default';
.home-input-box {
	width: 100%;
	padding: 0 16px;
	border-bottom: 1px solid #f0f0f0;
	box-sizing: border-box;
	.flexible(row, center, flex-start);
}
.high {
	height: 72px;
}
.low {
	height: 60px;
}
.label {
	height: 100%;
	margin-right: 10px;
	.flexible(column, flex-start, center);
	&-text {
		.font-regular(16px, @text-dark);
	}
	&-hint {
		margin-top: 8px;
		.font-regular(12px, @text-grey);
	}
}
.right-icon {
	width: 12px;
	height: 12px;
	margin-left: 12px;
}
.right-icon-percent {
	width: 16px;
	height: 16px;
	margin-left: 8px;
}
.input-content {
	padding: 0;
	flex: 1;
	height: 100%;
	.flexible(row, center, flex-end);
	.single-line;
	.font-medium(14px, @text-dark);
}
.input-content-no-label {
	justify-content: start;
	white-space: pre-wrap;
}
.input-content-no-label-color {
	font-family: PingFangSC-Regular;
	font-weight: 400;
	font-size: 0.42667rem;
	color: rgba(0, 0, 0, 0.8);
}
</style>
<style lang="less">
.money-content {
	.van-field__control {
		text-align: right;
	}
}
</style>
