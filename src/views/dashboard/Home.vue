<template>
	<div class="home" ref = "home">
		<!-- <img alt="Vue logo" src="../../assets/logo.png"> -->
		<!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
		<div class="left-contain">
			<HomeLeftContain @banUserSelect = "banUserSelect" @userSelect="userSelect"></HomeLeftContain>
		</div>
<!--		<div class="right-contain" v-if="this.$store.state.wxArr.length !=0">-->
<!--			<HomeRightContain @banUserSelect = "banUserSelect" @userSelect="userSelect"></HomeRightContain>-->
<!--		</div>-->
	</div>
</template>

<script>
	// @ is an alias to /src
	// import HelloWorld from '@/components/HelloWorld.vue'
	import HomeLeftContain from './home/HomeLeftContain.vue'
	import HomeRightContain from './home/HomeRightContain.vue'
	export default {
		name      : 'home',
		components: {
			HomeLeftContain,
			HomeRightContain,
		},
		methods: {
			banUserSelect() {
				this.$refs.home.style.MozUserSelect = 'none'
				this.$refs.home.style.UserSelect = 'none'
				this.$refs.home.style.webkitUserSelect = 'none'
				this.$refs.home.style.MsUserSelect = 'none'
			},
			userSelect() {
				this.$refs.home.style.MozUserSelect = 'text'
				this.$refs.home.style.UserSelect = 'text'
				this.$refs.home.style.webkitUserSelect = 'text'
				this.$refs.home.style.MsUserSelect = 'text'
			}
		}
	}
</script>

<style scoped>
	.home{
		width: 100%;
		height: 100%;
	}
	.left-contain{
		position: absolute;
		left: 0;
		width: 100%;
		max-height: 100%;
	}
	.right-contain{
		width: 20%;
		position: absolute;
		right: 0;
		width: 310px;
		min-width: 310px;
		max-width: 20%;
		height:100%;
		background-color: #ffffff;
	}
</style>
