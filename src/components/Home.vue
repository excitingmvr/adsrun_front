<template>
	<div class="ar-wrap home alert-setting">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    <div v-if="raceList && raceList.length > 0 " class="alert-setting__wrap layout" style="margin-bottom:0.5rem;">
        <ul class="alert-setting__list">
            <li>
                <p>마감된 광고 안보이기</p>
                <input type="checkbox" id="alert-1" hidden v-model="end_hide"/>
                <label class="check-label" for="alert-1"></label>
            </li>
        </ul>
    </div>
    <ul class="ad-list layout">
        <template v-for="item in raceList" >
          <li v-if="item.show">
             <router-link :to="`/race/${item.race_id}`"><img :src="item.image" alt=""/></router-link>
            <div class="ad-list__info">
                <div class="info-box">
                    <h3>{{item.title}}</h3>
                    <p class="price"> 
                      <span v-if="item.unit_price" class="num">{{item.unit_price | comma}}</span><small v-if="item.unit_price">원</small>
                      <span v-if="item.unit_price && item.products"> / </span>
                      <span v-if="item.products">특별리워드 제공(상세참조)</span>
                    </p>
                    <ul class="car-icons">
                        <li v-if="item.ad_location.indexOf(2) > -1 || item.ad_location.indexOf(6) > -1 || item.ad_location.indexOf(7) > -1"><img src="/static/images/ico-car3.png" alt=""/></li>
                        <li v-if="item.ad_location.indexOf(3) > -1 || item.ad_location.indexOf(4) > -1"><img src="/static/images/ico-car4.png" alt=""/></li>
                        <li v-if="item.ad_location.indexOf(1) > -1"><img src="/static/images/ico-car2.png" alt=""/></li>
                    </ul>
                    <ul v-if="'BC'.indexOf(item.ad_area_set) > -1" >
                        <li class="area-icons" v-for="i in item.area_a">{{i}}</li>
                        <!--<li class="area-icons" v-for="i in item.area_b">{{i}}</li>-->
                    </ul>
                    <ul v-else >
                      <li class="area-icons">전국</li>
                    </ul>
                </div>
                <div class="info-box">
                    <p v-if="isDeadline(item)"><countdown :date="calc_deadline(item.recruit_end)"></countdown> 후에 마감</p>
                    <p v-if="!isDeadline(item)">마감</p>
                    <p v-if="isDeadline(item)"><strong class="num">{{item.recruit_num - item.reserve_cnt}}명</strong> 남음</p>
                    <mark v-if="isDeadline(item)" class="mark period-mark">{{item.ad_duration}}일</mark>
                </div>
                <!--<a v-if="isDeadline(item)" href="#" class="btn full colored" @click.prevent="activeEventCodePopup(item);">참여하기</a>-->
                <a v-if="isDeadline(item)" :href="'/race/'+item.race_id" class="btn full colored">상세정보</a>
                <a v-if="!isDeadline(item)" href="#" class="btn full disabled" @click.prevent="deadline()">종료</a>
            </div>
          </li>
        </template>
    </ul> 
    <infinite-loading @infinite="infiniteHandler" spinner="waveDot"><div slot="no-more"></div></infinite-loading>
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
                <button class="ft-btn ok" @click.prevent="activePopup()">확인</button>
            </footer>
        </div>
    </div>

    <!-- * 광고 참여 팝업 * -->
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

    <!-- * 광고 기간/상금 팝업 * -->
    <div class="ar-popup ads-popup" id="ad_duration_popup">
        <div class="ar-popup__dimmer" @click.prevent="removeDurationPopup()"></div>
        <div class="ar-popup__content">
            <div class="popup-body">
                <div class="popup-txt">
                    <h3>{{race.title}}</h3>
                    <p>광고기간과 상금을 확인하세요.</p>
                </div>
                <ul class="popup-check__list">
                    <li>
                        <span>광고기간 : </span><span>{{race.ad_duration}}일</span>
                    </li>
                    <li>
                        <span>상금 : </span><span>{{race.unit_price}}원</span>
                    </li>
                </ul>
                <div class="popup-txt">
                    <p>광고에 참여하시겠습니까?</p>
                </div>
            </div>
            <footer class="popup-ft">
                <button class="ft-btn no" @click.prevent="removeDurationPopup()">아니오</button>
                <button class="ft-btn ok" @click.prevent="showLocationPopup()">네</button>
            </footer>
        </div>
    </div>

    <!-- * 광고 부착위치/사이즈 팝업 * -->
    <div class="ar-popup ads-popup" id="ad_location_popup">
        <div class="ar-popup__dimmer" @click.prevent="removeLocationPopup()"></div>
        <div class="ar-popup__content">
            <div class="popup-body">
                <div class="popup-txt">
                    <h3>{{race.title}}</h3>
                    <p>스티커 부착위치와 사이즈를 확인하세요.</p>
                </div>
                <div style="margin:10px 10px">
                  <ul class="popup-check__list">
                      <li v-if="race.ad_location.indexOf(2) > -1">
                          <input type="checkbox" size="5" id="c1" class="ar-check" checked disabled/>
                          <label for="c1" class="checkbox-label">운전석 앞쪽도어</label>
                      </li>
                      <li v-if="race.ad_location.indexOf(6) > -1">
                          <input type="checkbox" size="5" id="c5" class="ar-check" checked disabled/>
                          <label for="c5" class="checkbox-label">운전석 뒤쪽도어</label>
                      </li>
                      <li v-if="race.ad_location.indexOf(3) > -1">
                          <input type="checkbox" size="5" id="c2" class="ar-check" checked disabled/>
                          <label for="c2" class="checkbox-label">조수석 앞쪽도어</label>
                      </li>
                      <li v-if="race.ad_location.indexOf(4) > -1">
                          <input type="checkbox" size="5" id="c3" class="ar-check" checked disabled/>
                          <label for="c3" class="checkbox-label">조수석 뒤쪽도어</label>
                      </li>
                      <li v-if="race.ad_location.indexOf(1) > -1">
                          <input type="checkbox" size="5" id="c4" class="ar-check" checked disabled/>
                          <label for="c4" class="checkbox-label">차량후면</label>
                      </li>
                      <li v-if="race.ad_location.indexOf(7) > -1">
                          <input type="checkbox" size="5" id="c6" class="ar-check" checked disabled/>
                          <label for="c6" class="checkbox-label">주유캡</label>
                      </li>
                      <li>
                          {{race.sticker_width}}cm x {{race.sticker_height}}cm
                      </li>
                  </ul>
                </div>
                <div class="popup-txt">
                    <p>광고에 참여하시겠습니까?</p>
                </div>
            </div>
            <footer class="popup-ft">
                <button class="ft-btn no" @click.prevent="removeLocationPopup()">아니오</button>
                <button class="ft-btn ok" @click.prevent="showApplyPopup()">네</button>
            </footer>
        </div>
    </div>
	</div>
</template>

<script>
import moment from 'moment'
import ApiService from '@/common/api.service'
import HeaderNav from '@/components/common/HeaderNav'
import Countdown from '@/components/common/Countdown'
import { mapGetters } from 'vuex'
import InfiniteLoading from 'vue-infinite-loading'
import VueCookies from 'vue-cookies'
export default {
  components: {
    HeaderNav, Countdown, InfiniteLoading
  },
  data() {
    return {
      raceList: [],
      end_hide: false,
      race: {
        race_id: 0,
        title:'',
        ad_location: '',
        ad_duration: 0,
        unit_price: 0,
        sticker_width: 0,
        sticker_height: 0
      },
      userInfo: {
        phone:''
      },
      event: {},
      hasEventCode: false,
      selectedRace: {},
      limit: null
    }
  },
  watch: {
      end_hide(newVal,oldVal){
            window.localStorage.setItem('showRaceList',newVal)
            this.raceList.forEach( x => {
                if(newVal){
                    if(!this.isDeadline(x)) x.show = false
                }else{
                    x.show = true
                }
            })
      },
      userId(value){
        console.log('home watch getUser : ' + value);  
        if (this.isAuthenticated && value && !this.$store.getters.agreement) {
          console.log('home watch agreement router push');
          this.$router.push('/agreement') 
        }
      }

  },
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser', 'isPreview']),
    userId: function() {
      return this.$store.getters.userId;
    }
  },
	methods: {
    infiniteHandler($state) {
        ApiService.post('/front/races/list',{
          'limit' : this.limit == null ? 0 : this.limit
        }).then(res => {
          this.end_hide = window.localStorage.getItem('showRaceList') == 'true' ? true : false
          //this.raceList = res.data
          //this.madeShowList()
          // console.log('api races/list res : ' + JSON.stringify(res.data));
          setTimeout(() => { //스크롤 페이징을 띄우기 위한 시간 지연(1초)
            if (res.data.length) {
              this.raceList = this.raceList.concat(res.data);
              this.raceList.forEach( x => { 
                if(this.end_hide){
                  if(!this.isDeadline(x)) x.show = false; else x.show = true
                  console.log('x.show:'+x.show)
                }else{
                  x.show = true
                } 
              })
              
              $state.loaded(); //데이터 로딩
              this.limit += 10 
              if (this.raceList.length / 10 == 0) {
                $state.complete(); //데이터가 없으면 로딩 끝
              }
            } else {
              $state.complete();
            }
          }, 1000)
        }).catch(err => {
          console.log(err)
        })
    },
    getLoglist(){
      ApiService.post('/front/log/search').then(res => {
        // console.log('api log/search res : ' + JSON.stringify(res.data));
        var li = []
        res.data.forEach( x => {
          if(!li.includes(x.push_type)) li.push(x.push_type)
        })
        // console.log('li',li)
        if(li.length > 0) this.$store.commit('setIsnew',li.join(','))
        // console.log(this.$store.state.isNew)
      })
    },
    getMyInfo() {
      ApiService.post('/front/user/runner/info').then(res => {
        // console.log('api user/runner/info res data : ' + JSON.stringify(res.data));
        if (res.data && res.data['phone']) {
          this.userInfo.phone = res.data.phone
        }
      }).catch(err => {
        console.log(err)
      })
    },
    calc_deadline(date) {
      var date_= moment(date,'YYYY-MM-DD HH:mm:ss')
      if(date_.format('H') == 0 && date_.format('m') == 0 && date_.format('s') == 0) date_ = date_.add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
      else date_ = date_.format('YYYY-MM-DD HH:mm:ss')
      return date_
    },
    isDeadline(race) {
      return moment(race.recruit_end, 'YYYY-MM-DD HH:mm:ss').add(1,'days') > moment() && race.recruit_num > race.reserve_cnt && ['E','F','C','P'].indexOf(race.status) == -1
    },
    deadline() {
      alert('모집이 종료되었습니다.')
    },
    activeEventCodePopup(item) {
      if (!this.isAuthenticated) {
        alert('로그인 후 참여가능합니다.')
        this.$router.push('/login')
        return
      }

      ApiService.post('/front/user/runner/exists').then(res => {
        // console.log('api user/runner/exists res data : ' + JSON.stringify(res.data));
        if (res.data.cnt < 1) {
          this.$router.push('/register')
        } else {

          this.selectedRace = item;
          ApiService.post('/front/races/event', {
            'race_id': item.race_id
          }).then(res => {
            // console.log("api races/event res data:"+ JSON.stringify(res.data))
            if (res.data.cnt > 0) {
              document.querySelector('#evt_code_popup').classList.add("active");
              this.hasEventCode = true;
            } else {
              this.removeEventPopup()
              this.hasEventCode = false;
              this.activePopup();
            }
          }).catch(err => {
            console.log(err)
          })

        }
      });
    },
    activePopup() {
      if (!this.isAuthenticated) {
        alert('로그인 후 참여가능합니다.')
        this.$router.push('/login')
        return
      }      
      if (this.hasEventCode) {
        ApiService.post('/front/races/event/info', {
          'phone' : this.userInfo.phone
        }).then(res => {
          // console.log("api races/event/info res data:"+ JSON.stringify(res.data))
         this.event = res.data
          let ecode_chars = document.getElementById('evt_characters').value
          if (ecode_chars !== this.event.e_code) {
            alert('이벤트 코드가 맞지 않습니다!')
            return
          }
          this.removeEventPopup()
          this.race.race_id = this.selectedRace.race_id
          this.race.title = this.selectedRace.title
          this.race.ad_location = this.selectedRace.ad_location
          document.querySelector('#ad_apply_popup').classList.add("active");
        }).catch(err => {
          console.log(err)
          this.removeEventPopup()
          return
        })
      }else{
        this.race.race_id = this.selectedRace.race_id
        this.race.title = this.selectedRace.title
        this.race.ad_location = this.selectedRace.ad_location
        this.race.unit_price = this.selectedRace.unit_price
        this.race.ad_duration = this.selectedRace.ad_duration
        this.race.sticker_width = this.selectedRace.sticker_width
        this.race.sticker_height = this.selectedRace.sticker_height
        //document.querySelector('#ad_apply_popup').classList.add("active");
        document.querySelector('#ad_duration_popup').classList.add("active")
      }
    },
    removeApplyPopup() {
      document.querySelector('#ad_apply_popup').classList.remove("active");
    },
    removeEventPopup() {
      document.querySelector('#evt_code_popup').classList.remove("active");
    },
    removeDurationPopup() {
      document.querySelector('#ad_duration_popup').classList.remove("active");
    },
    removeLocationPopup() {
      document.querySelector('#ad_location_popup').classList.remove("active");
    },
    showLocationPopup() {
      this.removeDurationPopup()
      document.querySelector('#ad_location_popup').classList.add("active")
    },
    showApplyPopup() {
      this.removeLocationPopup()
      document.querySelector('#ad_apply_popup').classList.add("active")
    },
    applyAds(race_id) {
      console.log('race_id',race_id)
      document.querySelector('.ads-popup').classList.remove("active");
      //러너 등록된 상태인지 확인
      ApiService.post('/front/user/runner/exists').then(res => {
        // console.log("api user/runner/exists res data:"+ JSON.stringify(res.data))
        if (res.data.cnt < 1) {
          this.$router.push('/register')
        } else {
          ApiService.post('/front/races/reserve', {
            'race_id': race_id
          }).then(res => {
            // console.log("api races/reserve res data:"+ JSON.stringify(res.data))
            if (res.data.result == 'ok') {
              alert('신청되었습니다.')
              this.$router.push('/ads/applying')
            }
            if (res.data.result == 'dup' || res.data.result == 'ing') {
              alert('이미 신청되었거나 참여중인 광고가 있습니다.')
              this.removeApplyPopup()
            }
            if (res.data.result == 'over') {
              alert('모집정원을 초과하여 마감되었습니다.')
              this.removeApplyPopup()
            }
          }).catch(err => {
            console.log(err)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    chkAuth(){
      console.log('isPreview cookie:'+VueCookies.isKey('isPreviewC'))
      console.log('isAuthenticated', this.isAuthenticated)
      console.log('currentUser', JSON.stringify(this.currentUser))
      if(!this.isAuthenticated && !VueCookies.isKey('isPreviewC')) this.$router.push({ path: '/login' })
      else if (this.isAuthenticated && this.currentUser != null && this.currentUser.id && !this.$store.getters.agreement) {
        console.log('chkAuth home agreement router push');
        this.$router.push('/agreement') 
        // if(this.isPreview) this.$store.commit('setPreview')
      }
    }
	},
	mounted() {
    if(this.$route.query.type && this.$route.query.type == '10'){
      if(this.$route.query.id){
        console.log('route.query.id : '+this.$route.query.id);
        this.$store.commit('setInviteId', this.$route.query.id);
      }
    }

    console.log('home mounted');
    this.$store.commit('setLocation','home')
    this.chkAuth()
    if (this.isAuthenticated) this.getLoglist()
    this.getMyInfo()
	}
}
</script>
