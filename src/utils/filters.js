import Vue from 'vue';
import numeral from 'numeral';

Vue.filter('priceFilter', function(value) {
	if (typeof value === 'number') {
		return '¥' + numeral(value).format('0,0.00');
	}
	return '¥0.00';
});

Vue.filter('grossFilter', function(value) {
	if (typeof value === 'number') {
		return '¥' + numeral(value).format('0,0');
	}
	return '¥0';
});

Vue.filter('remarkSlice', function(value) {
	if (value.length > 10) {
		return value.substring(0, 10) + '...';
	}
	return value;
});
