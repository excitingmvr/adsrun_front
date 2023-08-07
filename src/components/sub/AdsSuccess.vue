<template id="AdsSuccess">
  <div class="ar-wrap ads-success progress-fixed">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <div class="ads-success__wrap layout">
        <section class="msg-box">
            <h3>캠페인 미션 완료!</h3>
            <p>축하합니다. 리워드가 지급됩니다.</p>
        </section>
        <section class="result-box">
          <div v-if="unit_price" class="result-success-box">
            <span>현금리워드</span>
            <h4><strong>{{unit_price | comma}}</strong>원</h4>
          </div>
          <div v-if="race.products" class="result-success-box">
            <span>특별리워드</span>
            <h4><strong>{{race.products}}</strong></h4>
          </div>
        </section>

        <!-- * 광고 참여 진행상황 * -->
        <section class="progress-box">
            <ul>
                <li>광고<br/>모집중</li>
                <li>광고<br/>진행중</li>
                <li class="active">광고완료</li>
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
      unit_price: null,
      race: null,
      lane: {
        last_push_message: ''
      },
    }
  },
  methods: {
    getApplying() {
      console.log(this.data)
      this.race = this.data.race ? this.data.race : null
      this.lane = this.data.lane ? this.data.lane : null
      console.log('race',this.race)
      console.log('lane',this.lane)
      this.unit_price = this.race.unit_price
        /*
      ApiService.post('/front/ads/applying').then(res => {
        this.race = res.data.race ? res.data.race : null
        this.lane = res.data.lane ? res.data.lane : null
        console.log('race',this.race)
        console.log('lane',this.lane)
        this.unit_price = this.race.unit_price
        if (['SW','FW','SR','FR'].indexOf(this.lane.status) > -1) {
          this.$router.push('/ads/photo')
        }
        if (['SU','FU'].indexOf(this.lane.status) > -1) {
          this.$router.push('/ads/photo/waiting')
        }
        if (['SA'].indexOf(this.lane.status) > -1) {
          this.$router.push('/ads/proceeding')
        }
        if (['SF','FF'].indexOf(this.lane.status) > -1) {
          this.$router.push('/ads/failed')
        }
        if (['T1','T2','T3','T4'].indexOf(this.lane.status) > -1) {
          this.$router.push('/ads/timeout')
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
