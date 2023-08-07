<template id="AdsProceeding">
  <div class="ar-wrap ads-ongoing progress-fixed">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <div class="ads-ongoing__wrap layout">
        <section class="ongoing-info__wrap">
            <img v-if="url" :src="url" alt=""/>
            <div class="ongoing-info">
            <div class="ongoing-bar" v-if="homepage" style="text-align: center;"><a style="color: #4b70fd;font-size: 12px" @click.prevent="pop_url(homepage)" id="click_homepage_link">{{homepage}}</a></div>
                <div class="ongoing-bar">
                    <div class="bar-wrap">
                        <img src="/static/images/ico-car-yellow.png" alt="" v-bind:style="{left: pct+'%'}"/>
                        <div class="bar" v-bind:style="{width: pct+'%'}"></div>
                    </div>
                    <div class="date-wrap">
                        <p>{{beg_date}}</p>
                        <p>{{end_date}}</p>
                    </div>
                </div>
                <div class="ongoing-txt" style="border-bottom: 1px solid #ededed;padding-bottom: 1rem;">
                    <p><span class="ongoing-title">D-days</span>{{dday}}</p>
                    <p><span class="ongoing-title">리워드</span>
                      <span>
                        <span v-if="unit_price">{{unit_price | comma}}원 <span v-if="race.products"> / </span></span>
                        <span v-if="race.products">{{race.products}}</span>
                      </span>
                        <!-- <p v-if="unit_price">{{unit_price | comma}} 원</p>
                        <p v-if="race.products">{{race.products}}</p> -->
                    </p>
                    
                </div>
                <!-- * 광고 SNS URL 등록 * -->
                 <!-- <div class="ongoing-txt" style="border-bottom: 1px solid #ededed;padding-bottom: 1rem;">
                  <p style="text-align:center;"><span>SNS에 게시글(사진포함) 올리고 링크 등록하기</span></p>
                  <div v-if="!fullURL">
                    <input type="text" id="SNS" maxlength="256" placeholder="SNS 주소를 입력해주세요" style="width:80%;padding: 0.6875rem 0.9375rem;font-size: 0.75rem;border: 1px solid #ededed;border-radius: 6px;background-color: #f9f9f9;line-height: 1.15;flex: 1;" oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"/>
                    <button @click.prevent="saveSNS" class="btn colored" style="font-weight: bold;flex:1;border-radius: 15%; padding: 0.15 0.25rem; line-height: 1.5;font-size: 0.95rem;padding: 0.45rem 1rem;">+</button>
                  </div>
                  <p v-if="sns1" style="padding-top: 0.6rem;"><span style="word-break: break-word;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"><button style="margin-right: 5px;height: auto;width: 3rem;text-align:center;font-size:0.5rem;display: inline-block;border-radius: 5px;" :class="sns1_status == 'Y' ? 'btn-success' : sns1_status == 'N' ? 'btn-danger' : 'btn-dark'">{{sns1_status == 'Y' ? '인정' : sns1_status == 'N' ? '불인정' : '심사중'}}</button><a @click.prevent="pop_url(sns1)" style="color: #4b70fd;text-align:center;">{{sns1}}</a></span></p>
                  <p v-if="sns2" style="padding-top: 0.6rem;"><span style="word-break: break-word;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"><button style="margin-right: 5px;height: auto;width: 3rem;text-align:center;font-size:0.5rem;display: inline-block;border-radius: 5px;" :class="sns2_status == 'Y' ? 'btn-success' : sns2_status == 'N' ? 'btn-danger' : 'btn-dark'">{{sns2_status == 'Y' ? '인정' : sns2_status == 'N' ? '불인정' : '심사중'}}</button><a @click.prevent="pop_url(sns2)" style="color: #4b70fd;text-align:center;">{{sns2}}</a></span></p>
                  <p v-if="sns3" style="padding-top: 0.6rem;"><span style="word-break: break-word;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"><button style="margin-right: 5px;height: auto;width: 3rem;text-align:center;font-size:0.5rem;display: inline-block;border-radius: 5px;" :class="sns3_status == 'Y' ? 'btn-success' : sns3_status == 'N' ? 'btn-danger' : 'btn-dark'">{{sns3_status == 'Y' ? '인정' : sns3_status == 'N' ? '불인정' : '심사중'}}</button><a @click.prevent="pop_url(sns3)" style="color: #4b70fd;text-align:center;">{{sns3}}</a></span></p>
                  <p v-if="sns4" style="padding-top: 0.6rem;"><span style="word-break: break-word;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"><button style="margin-right: 5px;height: auto;width: 3rem;text-align:center;font-size:0.5rem;display: inline-block;border-radius: 5px;" :class="sns4_status == 'Y' ? 'btn-success' : sns4_status == 'N' ? 'btn-danger' : 'btn-dark'">{{sns4_status == 'Y' ? '인정' : sns4_status == 'N' ? '불인정' : '심사중'}}</button><a @click.prevent="pop_url(sns4)" style="color: #4b70fd;text-align:center;">{{sns4}}</a></span></p>
                  <p v-if="sns5" style="padding-top: 0.6rem;"><span style="word-break: break-word;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"><button style="margin-right: 5px;height: auto;width: 3rem;text-align:center;font-size:0.5rem;display: inline-block;border-radius: 5px;" :class="sns5_status == 'Y' ? 'btn-success' : sns5_status == 'N' ? 'btn-danger' : 'btn-dark'">{{sns5_status == 'Y' ? '인정' : sns5_status == 'N' ? '불인정' : '심사중'}}</button><a @click.prevent="pop_url(sns5)" style="color: #4b70fd;text-align:center;">{{sns5}}</a></span></p>
                </div>  -->
                <!-- <div class="ongoing-txt" style="margin-bottom:3.5rem;padding: 1rem 0;">
                  <h5 class="drive-header">내 주행기록</h5>
                  <div class="drive-box" >
                      <template v-if="drives.size > 0">
                        <div class="drive-li" v-for="item in drives">
                          <p><span :data-idx="item" @click.stop="getDetails($event)">{{item}}</span><i :data-idx="item" @click.stop="getDetails($event)"></i></p>
                        </div>
                      </template>
                      <template v-else>
                        <div class="drive-none"> 해당 기간 주행기록이 없습니다.</div>
                      </template>
                  </div>
                </div> -->
            </div>
        </section>
        
        <!-- * 광고 참여 진행상황 * -->
        <section class="progress-box">
            <ul>
                <li>광고<br/>모집중</li>
                <li class="active">광고<br/>진행중</li>
                <li>광고완료</li>
            </ul>
        </section>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
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
      url: null,
      pct: null,
      beg_date: null,
      end_date: null,
      dday: null,
      unit_price: null,
      homepage: null,
      sns1: null,
      sns1_status : null,
      sns2: null,
      sns2_status : null,
      sns3: null,
      sns3_status : null,
      sns4: null,
      sns4_status : null,
      sns5: null,
      sns5_status : null,
      drives : []
    }
  },
  computed: {
    fullURL : function(){
      var result = this.sns1 && this.sns2 && this.sns3 && this.sns4 && this.sns5 ? true : false
      return result
    }
  },
  methods: {
    pop_url(url){
      console.log('pop)url:'+url);

      if(navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone|iPod/i) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)){
        window.webkit.messageHandlers.pop.postMessage(url+"");
      }else{
        window.adsrunApp.pop(url);
      }

    },
    saveSNS(){
      console.log('In')
      var val = document.getElementById('SNS').value,
          num = 0
      for(var i=1;i<=5;i++){
        console.log(this['sns'+i])
        if(!this['sns'+i]) {
          num = i
          break
        }
      }
      console.log(num)
      /**/
      if(val){
        ApiService.post('/front/ads/setSNS',{ id : this.$route.params.race_id, sns : val, field : ('sns'+num) }).then(res => {
          // console.log('api ads/setSNS res data : ' + JSON.stringify(res.data))
          if(res.data.result == 'ok') alert('SNS 주소가 등록되었습니다\n해당 SNS 광고를 심사 중입니다')
          this['sns'+num] = val
          this['sns'+num+'_status'] = 'R'
          document.getElementById('SNS').value = ''
        })
      }else{
        alert('SNS 주소를 입력해주세요')
      }
      
    },
    getHistory() {
      console.log('date : ',this.lane.beg)
      let end_dt = moment(this.lane.beg, 'YYYY-MM-DD HH:mm:ss').add(this.race.ad_duration, 'days')
      ApiService.post('/front/gps/selectDynamoGPS', { 'date' : this.lane.beg, 'date_end' : end_dt}).then(res => {
        // console.log('api gps/selectDynamoGPS res data : ' + JSON.stringify(res.data))
        var history_set = new Set()
        var history_time = new Set()
        for(var item of res.data){
          history_set.add(item.dates)
          history_time.add(item.dates+ ' ' +item.times)
        }
        console.log('h',res.data)
        if(res.data.length > 0) this.drives = history_set
      })
    },
    getDetails(event){
      console.log('event:'+event.currentTarget.dataset.idx)
      
      window.location.href=`/racehistory/${this.$route.params.race_id}/${event.currentTarget.dataset.idx}`
    },
    getApplying() {
      this.race = this.data.race ? this.data.race : null
      this.lane = this.data.lane ? this.data.lane : null
      //console.log('ads proceeding race : ', JSON.stringify(this.race))
      //console.log('ads proceeding lane : ', JSON.stringify(this.lane))
      if (this.race.ad_file1 != 0) {
        ApiService.post('/front/races/image', {id: this.race.ad_file1}).then(res => {
          this.url = res.data.filepath
        }).catch(err => { console.log(err) })
      }
      this.homepage = this.race.homepage
      for(var i=1; i<=5; i++){
        this[`sns${i}`] = this.lane[`sns${i}`]
        this[`sns${i}_status`] = this.lane[`sns${i}_show_yn`]
      }
      
      let beg_dt = moment(this.lane.beg, 'YYYY-MM-DD HH:mm:ss')
      let end_dt = moment(this.lane.beg, 'YYYY-MM-DD HH:mm:ss').add(this.race.ad_duration, 'days')
      //광고기간이 1일이면 바로 100프로 되는 현상 수정
      /*
      //let ja = this.race.ad_duration > 1 ? beg_dt.diff(moment(), 'days')+1 : beg_dt.diff(moment(), 'days')
      let ja =  moment().diff(beg_dt, 'days')
      //let dday = end_dt.diff(moment(), 'days')+1
      let dday = end_dt.diff(moment(), 'days')
      console.log(ja,dday)
      let pct = ((ja/this.race.ad_duration)*100).toFixed(1)
      */
      let ja =  moment().diff(beg_dt, 'hour')
      let dday = moment.duration(end_dt.diff(moment()))
      dday = dday.asDays() <= 0 ? 0 : Math.ceil(dday.asDays())
      console.log(ja,dday)
      let pct = ((ja/(this.race.ad_duration * 24))*100).toFixed(1)

      this.pct = pct > 100 ? 100 : pct < 0 ? 0 : pct
      this.beg_date = beg_dt.format('YYYY.MM.DD')
      this.end_date = end_dt.format('YYYY.MM.DD')
      this.dday = dday
      this.unit_price = this.race.unit_price
      /*
      ApiService.post('/front/ads/applying').then(res => {
        this.race = res.data.race ? res.data.race : null
        this.lane = res.data.lane ? res.data.lane : null
        console.log('race',this.race)
        console.log('lane',this.lane)
        if (this.race.ad_file1 != 0) {
          ApiService.post('/front/races/image', {id: this.race.ad_file1}).then(res => {
            this.url = res.data.filepath
          }).catch(err => { console.log(err) })
        }
        if (['SW','FW','SR','FR'].indexOf(this.lane.status) > -1) {
          this.$router.push('/ads/photo')
        }
        if (['SU','FU'].indexOf(this.lane.status) > -1) {
          this.$router.push('/ads/photo/waiting')
        }
        if (['SF','FF'].indexOf(this.lane.status) > -1) {
          this.$router.push('/ads/failed')
        }
        if (['T1','T2','T3','T4'].indexOf(this.lane.status) > -1) {
          this.$router.push('/ads/timeout')
        }
        if (['FA'].indexOf(this.lane.status) > -1) {
          this.$router.push('/ads/success')
        }
        let beg_dt = moment(this.lane.beg, 'YYYY-MM-DD HH:mm:ss')
        let end_dt = moment(this.lane.beg, 'YYYY-MM-DD HH:mm:ss').add(this.race.ad_duration, 'days')
        //광고기간이 1일이면 바로 100프로 되는 현상 수정
        
        //let ja = this.race.ad_duration > 1 ? beg_dt.diff(moment(), 'days')+1 : beg_dt.diff(moment(), 'days')
        //let ja =  moment().diff(beg_dt, 'days')
        //let dday = end_dt.diff(moment(), 'days')+1
        //let dday = end_dt.diff(moment(), 'days')
        //console.log(ja,dday)
        //let pct = ((ja/this.race.ad_duration)*100).toFixed(1)
        
        let ja =  moment().diff(beg_dt, 'hour')
        let dday = moment.duration(end_dt.diff(moment()))
        dday = dday.asDays() <= 0 ? 0 : Math.ceil(dday.asDays())
        console.log(ja,dday)
        let pct = ((ja/(this.race.ad_duration * 24))*100).toFixed(1)

        this.pct = pct > 100 ? 100 : pct < 0 ? 0 : pct
        this.beg_date = beg_dt.format('YYYY.MM.DD')
        this.end_date = end_dt.format('YYYY.MM.DD')
        this.dday = dday
        this.unit_price = this.race.unit_price
      }).catch(err => {
        console.log(err)
      })
      */
    }
  },
  mounted() {
    this.getApplying()
    this.getHistory()
    this.$store.commit('isBack')
  }
}
</script>
