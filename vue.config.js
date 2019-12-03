const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const IS_PROD = process.env.VUE_APP_MODE === 'production';

const APP_PUBLIC_PATH = process.argv[process.argv.length - 1].startsWith('--')
	? 'https://websitedn.yiautos.com/' +
	  process.argv[process.argv.length - 1].substring(2)
	: './';

console.log('APP_PUBLIC_PATH==>', APP_PUBLIC_PATH);

module.exports = {
	publicPath: APP_PUBLIC_PATH,
	css: {
		sourceMap: false,
		loaderOptions: {
			postcss: {
				plugins: [
					autoprefixer(),
					pxtorem({
						rootValue: 37.5,
						propList: ['*']
					})
				]
			}
		}
	},
	configureWebpack: config => {
		if (IS_PROD) {
			config.plugins.push(
				new UglifyJsPlugin({
					uglifyOptions: {
						compress: {
							drop_debugger: true,
							drop_console: true
						},
						sourceMap: false,
						parallel: true
					}
				})
			);
			return {};
		} else {
			return {};
		}
	}
};
