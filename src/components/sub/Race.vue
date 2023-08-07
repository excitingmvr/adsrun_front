<template>
  <div class="ar-wrap home-detail">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <div class="home-detail__wrap layout">
        <!-- * 광고 상세정보 * -->
        <section v-if="race" class="home-detail__box">
            <button class="up-btn active" title="접기/펴기 버튼" @click.prevent="toggleBox()"></button>
            <h3 id="detail-title">{{race.title}}</h3>
            <ul class="home-detail__list" aria-labelledby="detail-title">
                <li><p>광고주</p><p>{{race.corp_name}}</p></li>
                <li><p>광고설명</p><p></p></li>
                <div>{{race.contents}}</div>
                <li><p>모집기간</p><p>{{[race.recruit_beg, 'YYYY-MM-DD HH:mm:ss'] | moment('YYYY-MM-DD') }} - {{[race.recruit_end, 'YYYY-MM-DD HH:mm:ss'] | moment('YYYY-MM-DD') }}</p></li>
                <li><p>참가인원</p><p><strong>{{race.reserve_cnt}}명</strong>/{{race.recruit_num}}명</p></li>
                <li class="alert">*모집률이 ({{race.drop_pct}})% 이하면 해당 광고는 자동 drop됩니다.</li>
                <li><p>광고기간</p><p>{{race.ad_duration}}일</p></li>
                <li v-if="'BC'.indexOf(race.ad_area_set) > -1">
                  <p>신청가능지역</p>
                  <p :align="areas_op ? 'left' : 'right'" style="width: 60%;">
                    <template v-for="(a,index) in areas">
                      <br v-if="index > 0" >
                      <div :align="areas_op ? 'left' : 'right'" v-html="a"></div>
                    </template>
                    
                  </p>
                </li>
                <li v-if="'BC'.indexOf(race.ad_area_set) > -1"><p>지역기준</p><p v-if="race.ad_area_set=='B'">차량등록지</p><p v-else>주요이동경로</p></li>
                <li><p>광고 리워드</p>
                  <p>
                    <span v-if="race.unit_price">{{race.unit_price | comma}}원</span>
                    <span v-if="race.unit_price && race.products"> / </span>
                    <span v-if="race.products">{{race.products}}</span>
                  </p>
                </li>
                <li><p>스티커 부착위치</p>
                <p align="right" style="width: 70%;">
                <template v-for="(a,index) in locations">
                      <br v-if="index > 0">{{a}}
                    </template>
                    </p>
                <!-- <p v-if="locations != ''"  align="right" style="width: 70%;">{{locations}}</p> -->
                <!--
                  <p v-if="race.ad_location==1">뒷유리</p>
                  <p v-if="race.ad_location==6">뒷면</p>
                  <p v-if="race.ad_location==2">도어(운전석)</p>
                  <p v-if="race.ad_location==3">도어(조수석)</p>
                  <p v-if="race.ad_location==4">본넷</p>
                  <p v-if="race.ad_location==7">주유캡</p>
                  <p v-if="race.ad_location==5">자유부착</p>
                  -->
                </li>
                <!--<li><p>스티커 사이즈</p><p>{{race.sticker_width}}cm X {{race.sticker_height}}cm</p></li>-->
                <li v-if="race.homepage" style="justify-content: center;"><p><a style="color: #4b70fd;" @click.prevent="pop_url(race.homepage.trim())" id="click_homepage_link">{{race.homepage.trim()}}</a></p></li>
            </ul>
        </section>
        
        <section v-if="race" class="home-detail__img">
            <swiper class="swiper" :options="swiperOption" style="width: 100%;">
              <swiper-slide v-for="item in images" :key="item.id">
                <div style="display:block;width: 100%;">
                  <li v-if="item.width != undefined"><p>스티커 사이즈</p><p>{{item.width}}cm X {{item.height}}cm</p></li>
                  <li v-if="item.location != undefined"><p>스티커 부착위치</p><p>{{item.location}}</p></li>
                  <img :src="item.src" alt="" style="width:100%"/>
                </div>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </section>
        <!--
        <section v-if="race" class="home-detail__img">
            <img :src="race.image1" alt=""/>
        </section>-->
        <!-- 밀어서 참여하기 슬라이드  v-if="isAuthenticated" -->
        <section  class="home-detail__slide" id="home-detail__slide">
            <button class="slide-bar handle">밀어서 참여하기</button>
        </section>
        <!-- * 이벤트 코드 입력 팝업 * -->
        <div class="ar-popup ads-popup" id="evt_code_popup">
            <div class="ar-popup__dimmer" @click.prevent="removeEventPopup()"></div>
            <div class="ar-popup__content">
                <div class="popup-body">
                    <div class="popup-txt">
                        <h3>{{race.title}}</h3>
                        <p>광고 이벤트 코드를 입력하세요</p>
                    </div>
                    <input type="text" maxlength="6" id="evt_characters" class="ar_popup_evtinput" />                
                </div>
                <footer class="popup-ft">
                    <button class="ft-btn no" @click.prevent="removeEventPopup()">취소</button>
                    <button class="ft-btn ok" @click.prevent="applyEvent()">확인</button>
                </footer>
            </div>
        </div>
        <div class="ar-popup ads-popup" id="ad_apply_popup">
            <div class="ar-popup__dimmer" @click.prevent="removeApplyPopup()"></div>
            <div class="ar-popup__content">
                <div class="popup-body">
                    <div class="popup-txt">
                        <h3>{{race.title}}</h3>
                        <p>서비스 이용에 제약을 받는 경우</p>
                    </div>
                    <div style="margin:10px 10px">
                      <ul class="popup-check__list">
                          <li>
                            1. 스티커 도착 후 단순변심에 의해 광고를 시작하지 않을 경우, 스티커 반송비용이 부과 될 수 있으며 향후 서비스 이용에 제약을 받을 수 있습니다.
                          </li>
                          <li>
                            2. 스티커 부착 시 완전히 밀착하여 부착하지 않거나 스티커가 훼손되는 경우 상금이 지급되지 않고 서비스 이용에 제약을 받게 됩니다.
                          </li>
                          <li>
                            3. 시작 인증 사진이 승인되면 광고 기간이 만료될 때까지 스티커를 옮겨 붙이거나 훼손시키면 안됩니다. 이 경우 상금이 지급되지 않고 서비스 이용에 제약을 받게 됩니다.
                          </li>
                          <li>
                            !! 주의 사항 !!<br>
                            외부 도색한 차량인 경우(출고 이후 개별 도색) 부착 시 도색 면이 떨어질 수 있으니 광고 참여에 주의를 당부 드립니다.
                          </li>
                      </ul>
                    </div>
                    <div class="popup-txt">
                        <p>위 내용을 확인하였고<br>광고에 참여하시겠습니까?</p>
                    </div>
                </div>
                <footer class="popup-ft">
                    <button class="ft-btn no" @click.prevent="removeApplyPopup()">아니오</button>
                    <button class="ft-btn ok" @click.prevent="applyAds(race.race_id)">네</button>
                </footer>
            </div>
        </div>
        
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import ApiService from '@/common/api.service'
import HeaderNav from '@/components/common/HeaderNav'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import { mapGetters } from 'vuex'

export default {
  components: {
    HeaderNav,Swiper,SwiperSlide
  },
  data() {
    return {
      race: {},
      submit_cnt: 0,
      hasEventCode: false,
      event: {},
      userInfo: {
        phone:''
      },
      images: [],
      location_map : {
        '1':'차량후면',
        '2':'운전석 앞쪽도어',
        '3':'조수석 앞쪽도어',
        '4':'조수석 뒤쪽도어',
        '6':'운전석 뒤쪽도어',
        '7':'주유캡'
      },
      location_order : { '2' : 1, '6' : 2, '3' : 3, '4' : 4, '1' : 5, '7' : 6 },
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      }
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser','isNew','isPreview']),
    locations: function(){
      let lo = [],
          r = this.race
      if(this.race && this.race.ad_location){
        var li = this.race.ad_location.split(',')
        console.log("li:"+li)
        li.sort( (a,b) => { 
          a = this.location_order[a]
          b = this.location_order[b]
          if(a > b) return 1
          if(a < b) return -1
          return 0
        })
        console.log("li:"+li)
        for(var words of li){
          if(this.location_map[words]) lo.push((lo.length > 0 ? '\n' : '')+this.location_map[words])
        }    
      }
      return lo
    },
    areas : function(){
      let str = [],
          r = this.race
      
      if(r && r.area_map){
        for(var key of Object.keys(r.area_map)){
               str.push(`<div style="display: inline-block;vertical-align: top;">${key}-</div><div style=" display: inline-block;width:60%;text-align:left"> ${r.area_map[key] == 'all' ? '전역' : r.area_map[key].join(',')}</div>`)
         
       }
      }
      
      return str
    },
    areas_op : function(){
      let res = false
      let str = [],
          r = this.race
       if(r && r.area_map){
        for(var item of Object.keys(r.area_map)){
        if(item.length > 20) res = true}
      }
     
      console.log('res:'+res)
      return res
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
    checkLogs(){
      console.log('checkLogs');
      if (this.isAuthenticated) {
        ApiService.post('/front/log/check',{'type' : 'ad'}).then(res => {
          // console.log('api log/check type ad res data :'+JSON.stringify(res.data))
            if(res.data.result) this.$store.commit('setIsnew',this.isNew.replaceAll('ad,','').replaceAll('ad',''))
        })
      }
    },
    // Publishing Script
    setBoxHeight() {
        const boxHeight = document.querySelector('.home-detail__box').scrollHeight;
        document.querySelector('.home-detail__box').style.height = boxHeight + "px";
        document.querySelector('.home-detail__box').style.transition = "all 0.35s";
    },
    toggleBox() {
        const isActive = document.querySelector('.up-btn').classList.contains('active');
        if(isActive) {
            const titleHeight = document.querySelector('#detail-title').offsetHeight;
            const titleMarginTop = Number(window.getComputedStyle(document.querySelector('#detail-title')).getPropertyValue('margin-bottom').split("px")[0]);
            const boxPadding = Number(window.getComputedStyle(document.querySelector('.home-detail__box')).getPropertyValue('padding-top').split("px")[0]) + Number(window.getComputedStyle(document.querySelector('.home-detail__box')).getPropertyValue('padding-bottom').split("px")[0]);
            document.querySelector('.home-detail__box').style.height = titleHeight + boxPadding + 2 + "px";
            document.querySelector('.up-btn').classList.remove('active');
        }
        else {
            const boxScrollHeight = document.querySelector('.home-detail__box').scrollHeight;
            document.querySelector('.home-detail__box').style.height = boxScrollHeight + "px"; 
            document.querySelector('.up-btn').classList.add('active');
        }
    },
    getRace(race_id) {
      ApiService.post('/front/races/detail', {
        'race_id': race_id
      }).then(res => {
        // console.log('api races/detail res data :'+JSON.stringify(res.data))
        this.checkLogs()
        // console.log('race detail : ' + JSON.stringify(res.data))
        this.race = res.data
        for(var i=1;i<=10;i++){
          console.log(i+' : '+res.data['image'+i]);
          if(res.data['image'+i]) this.images.push({'src' : res.data['image'+i]})
        }
        var location_list = res.data.ad_location.split(',')
        location_list.sort( (a,b) => { 
          a = this.location_order[a]
          b = this.location_order[b]
          if(a > b) return 1
          if(a < b) return -1
          return 0
        })
        for(var idx of location_list.keys()){
          var num = Number(idx) + 1 == 1 ? '' : Number(idx) + 1
          if(this.images[idx]){
            this.images[idx]['location'] = this.location_map[location_list[idx]]
            this.images[idx]['width'] = res.data['sticker_width'+num]
            this.images[idx]['height'] = res.data['sticker_height'+num]
            console.log(idx,num,res.data['sticker_width'+'num'],'sticker_width'+num)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    initPub() {
      // Publishing Script
      this.setBoxHeight()
      let vueObj = this;
      
        new Dragdealer('home-detail__slide', {
          steps: 2,
          callback: function(x, y) {
            if (x) { /* 슬라이드 버튼이 오른쪽에 있을경우 */
              document.querySelector('.handle').style.marginLeft = "0rem";
              if (vueObj.submit_cnt == 0) {
                //vueObj.applyAds(vueObj.race.race_id)
                vueObj.activeEventCodePopup(vueObj.race)
              }
            }
            else { /* 슬라이드 버튼이 왼쪽에 있을경우 */
              document.querySelector('.handle').style.marginLeft = "0";
            }
          }
        })
      
    },
    activeEventCodePopup(item) {
      if (!this.isAuthenticated) {
        alert('로그인 후 참여가능합니다.')
        this.$router.push('/login')
        return
      }

      console.log("activeEventCodePopup");

      ApiService.post('/front/user/runner/exists').then(res => {
        // console.log('api user/runner/exists res data :'+JSON.stringify(res.data))
        if (res.data.cnt < 1) {
          if(confirm('회원 정보를 등록해야만 광고 캠페인 신청이 가능합니다.\n진행하시겠습니까?')){
            this.$router.push('/register')
          }else{
            return
          }
        }else if(res.data.car_num == null || res.data.car_num == ''){
          if(confirm('차량 정보를 등록해야만 광고 캠페인 신청이 가능합니다.\n진행하시겠습니까?')){
            this.$router.push('/registerCar')
          }else{
            return
          }
        } else {
          let area_chk = false
          if(this.race.ad_area_set != 'A'){
            console.log('res111 : ',res)
            var race_area_a = this.race.ad_area_set == 'C' ? res.data.ad_area_a : res.data.car_area_a,
                race_area_b = this.race.ad_area_set == 'C' ? res.data.ad_area_b : res.data.car_area_b
                
            if(race_area_a && race_area_b){
              var runner_area_a = race_area_a.split(',')
              console.log('a : ',runner_area_a,', b: ',race_area_b.split(','),' adrea_a:', this.race.ad_area_a,' adrea_b:', this.race.ad_area_b)
               for(var i=0; i<runner_area_a.length; i++){
                if(this.race.ad_area_a.split(',').includes(runner_area_a[i])) {
                  if(this.race.ad_area_b.split(',').includes(race_area_b.split(',')[i])) area_chk = true
                  
                  if(runner_area_a[i] == 8) area_chk = true
                }
                /*
                if(this.race.ad_area_a.indexOf(runner_area_a[i]) > -1) {
                  if(this.race.ad_area_b.indexOf(race_area_b.split(',')[i]) > -1) area_chk = true
                }
                */
              }
              
            }
            console.log('area_chk:'+area_chk)
          }
          if(this.race.ad_area_set == 'A' || area_chk){
            ApiService.post('/front/races/event', {
              'race_id': item.race_id
            }).then(res => {
              // console.log('api races/event res data :'+JSON.stringify(res.data))
              this.submit_cnt += 1
              if (res.data.cnt > 0) {
                this.hasEventCode = true
                document.querySelector('#evt_code_popup').classList.add("active");
              } else {
                this.removeEventPopup()
                this.hasEventCode = false
                //this.applyAds(item.race_id)
                document.querySelector('#ad_apply_popup').classList.add("active");
              }
            }).catch(err => {
              console.log(err)
            })
          }else{
            alert('참여할 수 없는 지역입니다.')
              this.initPub()
              this.submit_cnt = 0
            return
          }
        }
      });
    },
    removeEventPopup() {
      document.querySelector('#evt_code_popup').classList.remove("active");
    },
    removeApplyPopup() {
      this.initPub()
      this.submit_cnt = 0
      document.querySelector('#ad_apply_popup').classList.remove("active");
    },
    applyEvent() {
      ApiService.post('/front/races/event/info', {
        'phone' : this.userInfo.phone
      }).then(res => {
        // console.log('api races/event/info res data :'+JSON.stringify(res.data))
        this.event = res.data
        let ecode_chars = document.getElementById('evt_characters').value
        if (ecode_chars !== this.event.e_code) {
          alert('이벤트 코드가 맞지 않습니다!')
          return
        }
        this.removeEventPopup()
        this.applyAds(this.race.race_id)
      }).catch(err => {
        console.log(err)
        this.removeEventPopup()
        return
      })
    },
    getMyInfo() {
      ApiService.post('/front/user/runner/info').then(res => {
        //console.log(res.data)
        // console.log('api user/runner/info res data :'+JSON.stringify(res.data))
        if (res.data && res.data['phone']) {
          this.userInfo.phone = res.data.phone
        }
      }).catch(err => {
        console.log(err)
      })
    },
    applyAds(race_id) {
      this.removeApplyPopup()
      if (!this.isAuthenticated) {
        alert('로그인 후 참여가능합니다.')
        this.$router.push('/login')
        return
      }
      if (!(moment(this.race.recruit_end, 'YYYY-MM-DD HH:mm:ss').add(1,'days') > moment() && this.race.recruit_num > this.race.reserve_cnt && ['E','F','C','P'].indexOf(this.race.status) == -1)) {
        alert('모집이 종료되었습니다.')
        return
      }
      console.log('race_id',race_id)
      //러너 등록된 상태인지 확인
      ApiService.post('/front/user/runner/exists').then(res => {  
        // console.log('api user/runner/exists res data :'+JSON.stringify(res.data))
        if (res.data.cnt < 1) {
          if(confirm('회원 정보를 등록해야만 광고 캠페인 신청이 가능합니다.\n진행하시겠습니까?')){
            this.$router.push('/register')
          }else{
            return
          }
        }else if(res.data.car_num == null || res.data.car_num == ''){
          if(confirm('차량 정보를 등록해야만 광고 캠페인 신청이 가능합니다.\n진행하시겠습니까?')){
            this.$router.push('/registerCar')
          }else{
            return
          }
        
        } else {
          let area_chk = false
          if(this.race.ad_area_set != 'A'){
            var race_area_a = this.race.ad_area_set == 'C' ? res.data.ad_area_a : res.data.car_area_a,
                race_area_b = this.race.ad_area_set == 'C' ? res.data.ad_area_b : res.data.car_area_b
            if(race_area_a && race_area_b){
              var runner_area_a = race_area_a.split(',')
              console.log('a : ',runner_area_a,', b: ',race_area_b.split(','),' adrea_a:', this.race.ad_area_a,' adrea_b:', this.race.ad_area_b)
              for(var i=0; i<runner_area_a.length; i++){
                if(this.race.ad_area_a.split(',').includes(runner_area_a[i]) ) {
                  if(this.race.ad_area_b.split(',').includes(race_area_b.split(',')[i])) {area_chk = true}

                  if(runner_area_a[i] == 8) area_chk = true
                }
                /*
                if(this.race.ad_area_a.indexOf(runner_area_a[i]) > -1) {
                  if(this.race.ad_area_b.indexOf(race_area_b.split(',')[i]) > -1) area_chk = true
                }
                */
              }
            }
          }
          if(this.race.ad_area_set == 'A' || area_chk){
            ApiService.post('/front/races/reserve', {
              'race_id': race_id
            }).then(res => {
              // console.log('api races/reserve res data :'+JSON.stringify(res.data))
              if (res.data.result == 'ok') {
                alert('신청되었습니다.')
                //window.location.reload(true)
                this.$router.push('/ads/'+res.data.id)
              }
              if (res.data.result == 'dup' || res.data.result == 'ing') {
                alert('이미 신청되었거나 참여중인 광고가 있습니다.')
              }
              if (res.data.result == 'over') {
                alert('모집정원을 초과하여 마감되었습니다.')
              }
            }).catch(err => {
              console.log(err)
            })
          }else{
            alert('참여할 수 없는 지역입니다..')
            return
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted() {
    
    this.getRace(this.$route.params.race_id)
    this.getMyInfo()
    this.$store.commit('setLocation','race/'+this.$route.params.race_id)
  },
  updated() {
    this.initPub()
  }
}
</script>
