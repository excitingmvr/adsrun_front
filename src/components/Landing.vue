<template>
	<div class="ar-wrap main" @click.prevent="home()">
		<h2 class="main-title">
			<strong>정체된<br/>시간</strong>을<br/>삽니다
		</h2>
		<h1 class="ft-logo">
			<img src="/static/images/adsrun-wh.png" alt="Ads-Run" class="adsrun-logo"/>
		</h1>
	</div>
</template>

<script>
export default {
	methods: {
		home() {
			this.$router.push({name:'Home'})
		}
	}
}
</script>