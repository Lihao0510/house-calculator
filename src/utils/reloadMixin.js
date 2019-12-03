export default {
	mounted() {
		if (this.$route.name === 'ModelLib') {
			if (!this.$route.query.from) {
				this.$router.push('/');
			}
			return;
		}
		if (this.$route.name !== 'Home') {
			!this.$store.state.indicativePrice && this.$router.push('/');
		}
	}
}
