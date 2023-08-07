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
        <h3>{{dates}}</h3>
        <div class="history-body">
          <div class="history-flex"><img src="/static/images/distance.jpg" alt=""/><span>{{totals}}KM</span></div>
          <div class="history-flex"><img src="/static/images/times.png" alt=""/><span>{{times}}</span></div>
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
    ...mapGetters(['isAuthenticated', 'currentUser']),
    times(){
      var d = this.seconds == '주행기록이 없습니다.' ? 0 : (Math.floor(this.seconds / 1000 / 60 /60) == 0 ? '' : Math.floor(this.seconds / 1000 / 60 /60) +'시간 ')+Math.floor(this.seconds / 1000 / 60 % 60) + '분' 
      return d
    },
    dates(){
      var li = this.$route.params.date.split('-')
      console.log('li:'+this.$route.params.date)
      return li[0] + '년 ' + li[1] + '월 ' + li[2].split(' ')[0] + '일'
    },
    dates_format(){
      console.log('dates_format:'+this.$route.params.date)
      var li = this.$route.params.date.split('-')
      return li[0] + '-' + li[1] + '-' + li[2]
    },
    dates_end(){
      var li = this.$route.params.date.split('-'),
          date_now = new Date(li[0] + '-' + li[1] + '-' + li[2].split(' ')[0]),
          date_res = new Date(date_now.setDate(date_now.getDate() + 1))
          console.log('date_res:'+date_res)
          console.log('date_now:'+date_res.getFullYear() +'-'+ (date_res.getMonth() +1 < 10 ? '0'+(date_res.getMonth()+1) : ''+(date_res.getMonth()+1)) +'-'+ (date_res.getDate() < 10 ? '0'+date_res.getDate() : ''+ date_res.getDate()) + ' 00:00:00')
          
      return date_res.getFullYear() +'-'+ (date_res.getMonth() +1 < 10 ? '0'+(date_res.getMonth()+1) : ''+(date_res.getMonth()+1)) +'-'+ (date_res.getDate() < 10 ? '0'+date_res.getDate() : ''+ date_res.getDate()) + ' 00:00:00'
    }
  },
  methods: {
    getHistory() {
      console.log('this.$route.params.date:'+this.$route.params.date)
      console.log('this.dates_end:'+this.dates_end)
      
        ApiService.post('/front/gps/selectDynamoGPS',{ 'date' : this.$route.params.date+ ' 00:00:00', 'date_end' : this.dates_end } ).then(res => {
          if(res.data.length > 0) this.drives = res.data
          // console.log('api gps/selectDynamoGPS res data :'+JSON.stringify(res.data))
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
