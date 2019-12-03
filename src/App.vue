<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
export default {
	name: 'App',
	watch: {
		$route: function() {
			console.log('监听到路由变化 ==>', this.$route);
		}
	}
};
</script>

<style>
#app {
	font-family: 'PingFang SC', 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	width: 100%;
	overflow: hidden;
}
</style>
