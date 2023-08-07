<template>
	<!-- ** Footer 메뉴 ** -->
	<footer class="footer">
		<nav class="ft-nav">
			<router-link :class="activeStep1" to="/home"><i class="new-icon" v-if="isNew && isNew.indexOf('ad') > -1">N</i><img src="/static/images/ico-grid.png" alt="광고리스트"/>광고리스트</router-link>
			<router-link :class="activeStep2" to="/ads/list"><i class="new-icon" v-if="isNew && isNew.indexOf('flow') > -1">N</i><img src="/static/images/ico-flag.png" alt="참여중인광고"/>참여중인광고</router-link>
			<router-link :class="activeStep3" to="/withdraw"><i class="new-icon" v-if="isNew && isNew.indexOf('withdraw') > -1">N</i><img src="/static/images/ico-box.png" alt="참여내역"/>참여내역</router-link>
		</nav>
	</footer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['isNew']),

    activeStep1() {
      const activeNames = ['Home', 'Race']
      return {active: activeNames.indexOf(this.$route.name) > -1}
    },
    activeStep2() {
      const activeNames = ['AdsApplying', 'AdsProceeding', 'AdsPhotoWaiting', 'AdsPhoto', 'AdsSuccess', 'AdsFailed', 'Ads', 'AdsList']
      return {active: activeNames.indexOf(this.$route.name) > -1}
    },
    activeStep3() {
      const activeNames = ['Withdraw', 'WithdrawRecords']
      return {active: activeNames.indexOf(this.$route.name) > -1}
    },
    fmcAction(){
      this.$store.commit('getFmcAction')
      console.log('before : ' + this.$store.getters.fmcAction)
      return this.$store.getters.fmcAction
    }
  },
  mounted(){
    if(this.fmcAction != null){
      var r = this.fmcAction
      this.$store.commit('clearFmcAction')
      this.$router.push(fmcAction)
    }
  }
}

</script>