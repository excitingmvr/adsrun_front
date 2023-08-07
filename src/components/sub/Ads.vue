<template>
    <AdsApplying v-if="['DR','DW','R','C','WC','N','R','E'].indexOf(this.status) > -1" v-bind="this.res"></AdsApplying>
    <AdsFailed v-else-if="['SF','FF'].indexOf(this.status) > -1" v-bind="this.res"></AdsFailed>
    <AdsPhoto v-else-if="['SW','FW','SR','FR'].indexOf(this.status) > -1" v-bind="this.res" @popupData="popup_data"></AdsPhoto>
    <AdsPhotoWaiting v-else-if="['SU','FU'].indexOf(this.status) > -1" v-bind="this.res"></AdsPhotoWaiting>
    <AdsProceeding v-else-if="['SA'].indexOf(this.status) > -1" v-bind="this.res"></AdsProceeding>
    <AdsSuccess v-else-if="['FA'].indexOf(this.status) > -1" v-bind="this.res"></AdsSuccess>
    <AdsTimeout v-else-if="['T1','T2','T3','T4'].indexOf(this.status) > -1" v-bind="this.res"></AdsTimeout>
</template>
<script>
import ApiService from '@/common/api.service'
import HeaderNav from '@/components/common/HeaderNav'
import AdsApplying from '@/components/sub/AdsApplying'
import AdsFailed from '@/components/sub/AdsFailed'
import AdsPhoto from '@/components/sub/AdsPhoto'
import AdsPhotoWaiting from '@/components/sub/AdsPhotoWaiting'
import AdsProceeding from '@/components/sub/AdsProceeding'
import AdsSuccess from '@/components/sub/AdsSuccess'
import AdsTimeout from '@/components/sub/AdsTimeout'
export default {
  components: {
    HeaderNav,AdsApplying,AdsFailed,AdsPhoto,AdsPhotoWaiting,AdsProceeding,AdsSuccess,AdsTimeout
  },
  data() {
    return {
        status : '',
        res : {}
    }
  },
  methods: {
    getApplying() {
      console.log(this.$route.params.race_id);
        
      ApiService.post('/front/log/searchAds', { 'action' : 'update', 'idx' : this.$route.params.race_id }).then(res => {
        // console.log('api log/searchAds res data : ' + JSON.stringify(res.data))
      })

      ApiService.post('/front/ads/applying',{'race_id' : this.$route.params.race_id}).then(res => {
        // console.log('api ads/applying res data : ' + JSON.stringify(res.data))
        this.status = res.data.lane ? res.data.lane.status : res.data.workflow == 'C' ? 'WC' : res.data.race.status
        console.log(this.status)
        this.res = res
      })
    },
    popup_data(data) {
      this.$emit('popupData', {content : data.content, button : data.button, url : data.url});
      activeCustomPopup();
    }
  },
  mounted() {
    this.getApplying()
  }
}
</script>