<template>
  <div class="ar-wrap home-detail">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <div class="home-detail__wrap layout">
      <naverMap :lists="drives" :totals="totals" @total-distance="getTotals"></naverMap>
      <div class="history-box">
        <div class="history-body">
          <div class="history-flex"><img src="/static/images/distance.jpg" alt=""/><span>{{totals}}KM</span></div>
          <div class="history-flex"><img src="/static/images/times.png" alt=""/><span></span></div>
        </div>
        <div class="history-details">
          <ul>
            <li><p style="flex:1;">출발지&nbsp&nbsp:</p><p style="flex:1.5;">{{start_addr}}</p></li>
            <li><p style="flex:1;">목적지&nbsp&nbsp:</p><p style="flex:1.5;">{{end_addr}}</p></li>
          </ul>
        </div>
      </div>
      
      
    </div>
 </div>
</template>

<script>
import moment from 'moment'
import ApiService from '@/common/api.service'
import HeaderNav from '@/components/common/HeaderNav'
import naverMap from '@/components/common/NaverMap'
import { mapGetters } from 'vuex'

export default {
  components: {
    HeaderNav,naverMap
  },
  data() {
    return {
      drives : [],
      totals : 0,
      seconds : 0,
      start_addr : '',
      end_addr : ''
    }
  },
  computed: {
   
  },
  methods: {
    getHistory() {
     
        ApiService.post('/front/gps/selectDynamoGPS',{ 'date' : '2022-01-11 00:00:00', 'date_end' : '2022-01-11 24:00:00' } ).then(res => {
          // console.log('api gps/selectDynamoGPS res data : ' + JSON.stringify(res.data))
          if(res.data.length > 0) this.drives = res.data
         // console.log('getHistory():'+JSON.stringify(res.data))
        })
    },
    getTotals(message){
      console.log('getTotals:'+JSON.stringify(message))
      this.totals = message.totals.toFixed(1)
      this.seconds = message.seconds
      this.start_addr = message.start
      this.end_addr = message.end
    }
  },
  mounted() {
    this.getHistory()
  }
}
</script>
