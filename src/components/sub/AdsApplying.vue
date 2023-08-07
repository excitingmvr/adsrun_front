<template id="AdsApplying">
  <div class="ar-wrap ads-applying progress-fixed">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <div v-if="box.visible" class="ads-applying__wrap layout">
        <section class="applying-box">
            <img v-if="v_ico" src="/static/images/ico-apply.png" alt=""/>
            <img v-if="!v_ico" src="/static/images/ico-cancel.png" alt=""/>
            <h3 v-html="box.title"></h3>
            <h3 v-if="lane && lane.deli_num">
               <br><br>배송 조회: <br>
            <a style="text-decoration: underline; color: #0000CC" @click.prevent="pop_url(lane.deli_num)">{{lane.deli_num}}</a>

            </h3>
            
            <p v-html="box.msg"></p>
            <br>
            <!--<p v-if="this.status">참여중인 광고 : <br>{{this.title}}</p>-->
            <ul class="num-box">
                <li v-if="box.v_pct">
                    <p>모집율<strong class="yellow">{{box.pct}} %</strong></p>
                    <div class="bar-wrap">
                        <div class="bar" v-bind:style="{width: box.pct+'%'}"></div>
                    </div>
                </li>
                <li v-if="box.v_dday">
                    <p>D-days<strong v-html="box.dday"></strong></p>
                </li>
            </ul>
        </section>
        <!-- * 광고 참여 진행상황 * -->
        <section class="progress-box">
            <ul style="margin-top:0.75rem;">
                <li :class="{active:activeProgress}">광고<br/>모집중<br/></li>
                <li :class="{active:activeInProgress}">광고<br/>진행중<br/></li>
                <li>광고완료<br/></li>
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
  computed: {
    race: function () {
      return this.data.race ? this.data.race : null
    },
    lane: function () {
      return this.data.lane ? this.data.lane : null
    },
    workflow: function () {
      return this.data.workflow ? this.data.workflow : null
    },
    reserve: function () {
      return this.data.reserve ? this.data.reserve : null
    }
  },
  data() {
    return {
      v_ico: true,
      activeProgress: false,
      activeInProgress: false,
      box: {
        visible: false,
        title: '',
        msg: '',
        pct: '',
        v_pct: false,
        dday: '',
        v_dday: false,
        deli_url: ''
      },
      status: null,
      title: ''
    }
  },
  methods: {
    pop_url(url){
      //alert('pop)url:'+url)
      var del_url = this.lane.deli_type == 'A' ?  'http://epost.go.kr/e/?t1=' :this.lane.deli_type == 'B' ? 'http://nplus.doortodoor.co.kr/web/detail.jsp?slipno=' : this.lane.deli_type == 'C' ?  'https://www.lotteglogis.com/home/reservation/tracking/linkView?InvNo=' : 'http://www.ilogen.com/m/personal/trace.pop/'
      del_url += url    
      //alert('pop)url:'+del_url)
      if(navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone|iPod/i) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)){
            window.webkit.messageHandlers.pop.postMessage(del_url+"");
      }else{
      window.adsrunApp.pop(del_url);
      }

    },
    getApplying() {

      this.race = this.data.race ? this.data.race : null
      this.lane = this.data.lane ? this.data.lane : null
      this.reserve = this.data.reserve ? this.data.reserve : null
      this.workflow = this.data.workflow ? this.data.workflow : null

      if (this.reserve) {
        this.box.visible = true
        if(this.workflow != 'C'){
          if (['N','R'].indexOf(this.race.status) > -1) {
            this.box.title = '신청되었습니다!'
            this.box.msg = '모집이 완료되면 스티커 배송이 시작됩니다.<br/>잠시만 기다려 주십시오.'
            let pct = ((this.reserve.reserve_cnt/this.race.recruit_num)*100).toFixed(1)
            this.box.pct = pct > 100 ? 100 : pct
            if (moment(this.race.recruit_end, 'YYYY-MM-DD HH:mm:ss') > moment()) {
              this.box.dday = moment(this.race.recruit_end, 'YYYY-MM-DD HH:mm:ss').diff(moment(), 'days')+1+'일'
            } else {
              this.box.dday = '종료'
            }
            this.box.v_pct = true
            this.box.v_dday = true
            this.v_ico = true 
            this.activeProgress = true
            this.activeInProgress = false
            this.status = true
            this.title = this.data.reserve.title
          }
          if (['E'].indexOf(this.race.status) > -1) {
            this.box.title = '참여하신 광고 모집이 완료 되었습니다!'
            this.box.msg = '스티커가 우편으로 배송됩니다.<br/>스티커를 수령하시면 차량에 부착 후<br> 사진인증을 진행해 주세요.'
            this.box.v_pct = false
            this.box.v_dday = false 
            this.v_ico = true
            this.activeProgress = true
            this.activeInProgress = false
            this.status = true
            this.title = this.data.reserve.title
          }
          if (['C'].indexOf(this.race.status) > -1) {
            this.box.title = '취소되었습니다!'
            this.box.msg = '참여 부족으로 광고가 취소되었습니다.<br/>다른 광고에 참여해 주세요. 죄송합니다.'
            let pct = ((this.reserve.reserve_cnt/this.race.recruit_num)*100).toFixed(1)
            this.box.pct = pct > 100 ? 100 : pct
            this.box.v_pct = true
            this.box.v_dday = false 
            this.v_ico = false
            this.activeProgress = false
            this.activeInProgress = false
            this.status = false
          }
        }else{
          this.box.visible = true 
          this.box.title = '취소되었습니다!'
          this.box.msg = '광고가 취소되었습니다.<br/>다른 광고에 참여해 주세요. 죄송합니다.'
          this.box.v_pct = false
          this.box.v_dday = false 
          this.v_ico = false
          this.activeProgress = false
          this.activeInProgress = false
          this.status = false
        }
      } else if (this.lane) {
        this.box.visible = true         
        this.box.title = '스티커 배송이 시작되었습니다.'
            
        if (this.lane.deli_num) {
           // this.box.title += '<br><br>배송 조회: <br>' + 
          //   `<a style="text-decoration: underline; color: #0000CC" @click.prevent="pop_url('${del_url}${this.lane.deli_num}')"`
          //    + '>' + `${this.lane.deli_num}` + '</a>'
          this.box.msg = '스티커가 발송되었습니다.<br>스티커를 수령하시면 차량에 부착 후<br/>사진인증을 진행해 주세요.'
        } else {
          this.box.msg = '스티커가 배송됩니다.<br/>스티커를 수령하시면 차량에 부착 후<br/>사진인증을 진행해 주세요.'
        }            
        this.box.v_pct = false
        this.box.v_dday = false 
        this.v_ico = true
        this.activeProgress = false
        this.activeInProgress = true
        this.status = true
        this.title = this.lane.title
      }
      
      
      /*
      console.log('HI');
      ApiService.post('/front/ads/check').then(res => {
        console.log('res : ',res.data.status); 
        if(!res.data.status) {
          alert('로그인하셔야 보실 수 있어요~')
          this.$router.push('/login')
        }
        ApiService.post('/front/ads/applying').then(res => {
          this.race = res.data.race ? res.data.race : null
          this.lane = res.data.lane ? res.data.lane : null
          this.reserve = res.data.reserve ? res.data.reserve : null
          this.workflow = res.data.workflow ? res.data.workflow : null
          
            if (this.lane) {
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
              if (['FA'].indexOf(this.lane.status) > -1) {
                this.$router.push('/ads/success')
              }
              this.box.visible = true         
              this.box.title = '참여하신 광고 모집이 완료 되었습니다!'
                  
              if (res.data.lane.deli_num) {
                var del_url = this.lane.deli_type == 'A' ?  'http://epost.go.kr/e/?t1=' :this.lane.deli_type == 'B' ? 'http://nplus.doortodoor.co.kr/web/detail.jsp?slipno=' : 'https://www.lotteglogis.com/home/reservation/tracking/linkView?InvNo='
                this.box.title += '<br><br>배송 조회: <br>' + 
                `<a style="text-decoration: underline; color: #0000CC" href="${del_url}` + 
                `${res.data.lane.deli_num}` + '">' + `${res.data.lane.deli_num}` + '</a>'
                this.box.msg = '스티커가 우편으로 배송되었습니다.<br>스티커를 수령하시면 차량에 부착 후<br/>사진인증을 진행해 주세요.'
              } else {
                this.box.msg = '스티커가 우편으로 배송됩니다.<br/>스티커를 수령하시면 차량에 부착 후<br/>사진인증을 진행해 주세요.'
              }            
              this.box.v_pct = false
              this.box.v_dday = false 
              this.v_ico = true
              this.activeProgress = false
              this.activeInProgress = true
              this.status = true
              this.title = res.data.lane.title
            }
            if (this.reserve) {
              this.box.visible = true
              if(this.workflow != 'C'){
                if (['N','R'].indexOf(this.race.status) > -1) {
                  this.box.title = '신청되었습니다!'
                  this.box.msg = '모집이 완료되면 스티커 배송이 시작됩니다.<br/>잠시만 기다려 주십시오.'
                  let pct = ((this.reserve.reserve_cnt/this.race.recruit_num)*100).toFixed(1)
                  this.box.pct = pct > 100 ? 100 : pct
                  if (moment(this.race.recruit_end, 'YYYY-MM-DD HH:mm:ss') > moment()) {
                    this.box.dday = moment(this.race.recruit_end, 'YYYY-MM-DD HH:mm:ss').diff(moment(), 'days')+1+'일'
                  } else {
                    this.box.dday = '종료'
                  }
                  this.box.v_pct = true
                  this.box.v_dday = true
                  this.v_ico = true 
                  this.activeProgress = true
                  this.activeInProgress = false
                  this.status = true
                  this.title = res.data.reserve.title
                }
                if (['E'].indexOf(this.race.status) > -1) {
                  this.box.title = '참여하신 광고 모집이 완료 되었습니다!'
                  this.box.msg = '스티커가 우편으로 배송됩니다.<br/>스티커를 수령하시면 차량에 부착 후<br> 사진인증을 진행해 주세요.'
                  this.box.v_pct = false
                  this.box.v_dday = false 
                  this.v_ico = true
                  this.activeProgress = true
                  this.activeInProgress = false
                  this.status = true
                  this.title = res.data.reserve.title
                }
                if (['C'].indexOf(this.race.status) > -1) {
                  this.box.title = '취소되었습니다!'
                  this.box.msg = '참여 부족으로 광고가 취소되었습니다.<br/>다른 광고에 참여해 주세요. 죄송합니다.'
                  let pct = ((this.reserve.reserve_cnt/this.race.recruit_num)*100).toFixed(1)
                  this.box.pct = pct > 100 ? 100 : pct
                  this.box.v_pct = true
                  this.box.v_dday = false 
                  this.v_ico = false
                  this.activeProgress = false
                  this.activeInProgress = false
                  this.status = false
                }
              }else{
                this.box.visible = true 
                this.box.title = '취소되었습니다!'
                this.box.msg = '광고가 취소되었습니다.<br/>다른 광고에 참여해 주세요. 죄송합니다.'
                this.box.v_pct = false
                this.box.v_dday = false 
                this.v_ico = false
                this.activeProgress = false
                this.activeInProgress = false
                this.status = false
              }
            }
            if (this.race == null && this.lane == null && this.reserve == null) {
              this.box.visible = true         
              this.box.title = '참여중인 광고가 없습니다!'
              this.box.msg = '광고에 참여하여 상금을 획득하세요.'
              this.box.v_pct = false
              this.box.v_dday = false 
              this.v_ico = true
              this.activeProgress = false
              this.status = false
            }
            //console.log('race',this.race)
            //console.log('lane',this.lane)
            //console.log('reserve',this.reserve)
            //console.log(this.status)
        }).catch(err => {
          console.log(err)
        })
      })
      */
    }
  },
  mounted() {
    if(this.$store.getters.back && this.$store.getters.location != null) {
      this.$store.commit('backOff')
      this.$router.push('/'+this.$store.getters.location)
    }
    this.getApplying()
  }
  
}
</script>
