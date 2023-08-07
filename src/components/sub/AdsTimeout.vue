<template id="AdsTimeout">
  <div class="ar-wrap ads-fail progress-fixed">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <div class="ads-fail__wrap layout">
        <section class="fail-box">
            <img src="/static/images/ico-cancel.png" alt=""/>
            <h3>미션 실패하셨습니다.</h3>
            <p>기한내에 스티커를 부착하지 않으셔서 이번 미션에<br/>
                실패하셨습니다. 상금은 지급되지 않습니다.<br/>
                다른 광고에 참여해 주세요</p>
            <br>
            <p v-if="this.status">참여했던 광고 : <br>{{this.title}}</p>
        </section>
        <!-- * 광고 참여 진행상황 * -->
        <section class="progress-box">
          <ul>
            <li>광고<br/>모집중</li>
            <li>광고<br/>진행중</li>
            <li>광고완료</li>
          </ul>
        </section>
    </div>
  </div>
</template>

<script>
import ApiService from '@/common/api.service'
import HeaderNav from '@/components/common/HeaderNav'

export default {
  components: {
    HeaderNav
  },
  props: {
    data : Object
  },
  data() {
    return {
      race: null,
      lane: null,
      status: null,
      title: null
    }
  },
  methods: {
    getApplying() {
      console.log('t1 mount')
      this.race = this.data.race ? this.data.race : null
      this.lane = this.data.lane ? this.data.lane : null
      console.log('race',this.race)
      console.log('lane',this.lane)
      this.status = this.lane.status
      this.title = this.lane.title
      /*
      ApiService.post('/front/ads/applying').then(res => {
        this.race = res.data.race ? res.data.race : null
        this.lane = res.data.lane ? res.data.lane : null
        console.log('race',this.race)
        console.log('lane',this.lane)
        this.status = this.lane.status
        this.title = this.lane.title
        if (['SW','FW','SR','FR'].indexOf(this.lane.status) > -1) {
          this.$router.push('/ads/photo')
        }
        if (['SU','FU'].indexOf(this.lane.status) > -1) {
          this.$router.push('/ads/photo/waiting')
        }
        if (['SA'].indexOf(this.lane.status) > -1) {
          this.$router.push('/ads/proceeding')
        }
        if (['FA'].indexOf(this.lane.status) > -1) {
          this.$router.push('/ads/success')
        }
      }).catch(err => {
        console.log(err)
      })
      */
    }
  },
  mounted() {
    this.getApplying()
    this.$store.commit('isBack')
  }  
}
</script>
