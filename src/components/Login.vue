<template>
  <div class="ar-wrap login grey">

      <!-- * 로그인 페이지 상단 슬라이더 * -->
      <swiper :options="swiperOption" ref="mySwiper" class="login-swiper">
        <swiper-slide>
          <div class="slide-img">
              <img src="/static/images/img-login-1.png" alt=""/>
          </div>
          <mark class="mark step-mark">STEP 1</mark>
          <h3>희망하는 광고 선택</h3>
        </swiper-slide>
        <swiper-slide> 
          <div class="slide-img">
              <img src="/static/images/img-login-2.png" alt=""/>
          </div>
          <mark class="mark step-mark">STEP 2</mark>
          <h3>광고스티커 부착하고 사진인증</h3>
        </swiper-slide>
        <swiper-slide>
          <div class="slide-img">
              <img src="/static/images/img-login-3.png" alt=""/>
          </div>
          <mark class="mark step-mark">STEP 3</mark>
          <h3>상금 적립!</h3>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>

      <!-- * SNS 간편로그인 리스트 * -->
      <section class="layout easy-login">
          <h4>SNS 간편 로그인 후<br>진행중인 다양한 광고를 확인해보세요!</h4>
          <nav>
              <ul class="easy-login__list">
                  <li>
                      <a href="#" @click="goLogin('kakao')">
                           <img src="/static/images/ico-kakao.png" alt="Kakao Talk"/>
                          <!-- 카카오톡 -->
                      </a> 
                  </li>
                  <!-- <li>
                      <a href="https://api.adsrun.kr/auth/facebook">
                          <img src="/static/images/ico-fb.png" alt="FaceBook"/>
                          페이스북
                      </a>
                  </li> -->
                  <li >
                    <a v-if="apple" href="#" @click="goLogin('apple')">
                      <img src="/static/images/ico-apple.png" alt="Apple"/>
                      <!-- 애플 -->
                    </a>
                  </li>
                  <li>
                    <a href="#" @click="goLogin('naver')">
                      <img src="/static/images/ico-naver.png" alt="Naver"/>
                      <!-- 네이버 -->
                    </a>
                  </li>
                  <!-- <li>
                      <a href="https://api.adsrun.kr/auth/google">
                          <img src="/static/images/ico-googleplus.png" alt="Google+"/>
                          구글플러스
                      </a>
                  </li> -->
                </ul>
          </nav>
          <div class="login-btns">
              <a @click.prevent="$router.push('/question_spon')" class="btn full ask-btn">광고 의뢰 문의</a>
              <!-- <a @click.prevent="getPreview()" class="btn no-back">둘러보기</a> -->
          </div>
          
      </section>
  </div>
</template>

<script>
import 'swiper/css/swiper.css'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import VueCookies from 'vue-cookies'
import API_URL from '@/common/url'
import ApiService from '@/common/api.service'
import JwtService from '@/common/jwt.service'
import { LOGIN } from '@/store/actions.type'
import { mapGetters } from 'vuex'

export default {
  components: {
    Swiper,
    SwiperSlide
},
  data() {
    return {
      kakao_url: API_URL+'/auth/kakao',
      naver_url: API_URL+'/auth/naver',
      apple_url: API_URL+'/auth/apple',
      apple: false,
      swiperOption: {
        // swiper 옵션, 콜백함수 모두 동일하게 사용
        //loop: false,
        pagination: {
            el: '.swiper-pagination',
        },
      }
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper
    },
    ...mapGetters(['isAuthenticated', 'currentUser'])
  },
  beforeDestroy() {
    window.removeEventListener('message', this.onLoginComplete, false)
  },
  mounted() {
    console.log("mounted")
    // 현재 swiper 인스턴스를 확인
    //this.swiper.$swiper.slideTo(3, 1000, false)
    if(this.$route.query.m){
      if(this.$route.query.m == 'y') alert('로그인 하셔야 보실 수 있어요 ~ :)')
    }
    window.addEventListener('message', this.onLoginComplete, false)
    if(navigator.userAgent.match(/ADSRUN_APP_IOS/i)){
        this.apple = true
    }
  },
	methods: {
    getPreview(){
      VueCookies.set('isPreviewC', 'Y')
      console.log('isPreview:'+VueCookies.isKey('isPreviewC'))
      this.$router.push('/home')

    }, 
    goLogin(type){
        //alert("navigator.userAgent:"+navigator.userAgent);
        if(type == "kakao"){
             try {
                if(navigator.userAgent.match(/ADSRUN_APP_IOS/i)){
                        console.log("ios call login!"+type)
                        window.webkit.messageHandlers.snsLoginCall.postMessage("KAKAO","userID")
                        //window.webkit.messageHandlers.snsLoginCall.postMessage("KAKAO:::<%=member_type%>");
                    }else if(navigator.userAgent.match(/ADSRUN_APP_ANDROID/i)){
                        //alert("android call login!"+type);
                        window.adsrunApp.snsLoginCall("KAKAO","userID");
                        //window.realhome.snsLoginCall("KAKAO","<%= member_type %>");
                    }else{
                        location.href = API_URL+'auth/kakao'
                    }
             } catch (error) {
                if(navigator.userAgent.match(/ADSRUN_APP_IOS/i)){
                    alert("앱 업데이트를 해주세요.");
                    window.webkit.messageHandlers.pop.postMessage("https://apps.apple.com/kr/app/%EC%95%A0%EC%A6%88%EB%9F%B0/id1522656816");
                }else if(navigator.userAgent.match(/ADSRUN_APP_ANDROID/i)){
                    alert("앱 업데이트를 해주세요.");
                    window.adsrunApp.pop("https://play.google.com/store/apps/details?id=com.steven.adsrun");
                }
             }       
                    
        }else if(type == "naver"){
             try {
                    if(navigator.userAgent.match(/ADSRUN_APP_IOS/i)){
                        console.log("ios call login!"+type)
                        window.webkit.messageHandlers.snsLoginCall.postMessage("NAVER","userID")
                        //window.webkit.messageHandlers.snsLoginCall.postMessage("NAVER:::<%=member_type%>");
                    }else if(navigator.userAgent.match(/ADSRUN_APP_ANDROID/i)){
                        console.log("android call login!"+type)
                        window.adsrunApp.snsLoginCall("NAVER","userID")
                        //window.realhome.snsLoginCall("NAVER","<%= member_type %>");
                    }else {
                        location.href = API_URL+'auth/naver'
                    }
              } catch (error) {
                if(navigator.userAgent.match(/ADSRUN_APP_IOS/i)){
                    alert("앱 업데이트를 해주세요.");
                    window.webkit.messageHandlers.pop.postMessage("https://apps.apple.com/kr/app/%EC%95%A0%EC%A6%88%EB%9F%B0/id1522656816");
                }else if(navigator.userAgent.match(/ADSRUN_APP_ANDROID/i)){
                    alert("앱 업데이트를 해주세요.");
                    window.adsrunApp.pop("https://play.google.com/store/apps/details?id=com.steven.adsrun");
                }
              }   
        // }else if(type == "facebook"){
        //     if(navigator.userAgent.match(/ADSRUN_APP_IOS/i)){
        //         console.log("ios call login!"+type)
        //         window.webkit.messageHandlers.snsLoginCall.postMessage("FACEBOOK","userID")
        //         //window.webkit.messageHandlers.snsLoginCall.postMessage("FACEBOOK:::<%=member_type%>");
        //     }else if(navigator.userAgent.match(/ADSRUN_APP_ANDROID/i)){
        //         console.log("android call login!"+type)
        //         window.adsrunApp.snsLoginCall("FACEBOOK","userID")
        //     }else {
        //         location.href = API_URL+'/auth/facebook'
        //     }
        }else if(type == "apple"){
            try {
                if(navigator.userAgent.match(/ADSRUN_APP_IOS/i)){
                    console.log("ios call login!"+type);
                    //window.webkit.messageHandlers.snsLoginCall.postMessage("APPLE","userID");
                    location.href = API_URL+'auth/apple'
                }
            } catch (error) {
                //alert("앱 업데이트를 해주세요. 웹으로 로그인진행! ");
                location.href = API_URL+'auth/apple'
            }   
        }
    },
    onLoginComplete(event){

        
        if(this.$route.name != 'Login'){
            return
        }
       if(typeof event.data == 'object'){
            var datas = event.data
            if(datas.snsType){
              var params = {
                userid: datas.id,
                email: datas.email,
                fcmtoken: datas.fcmtoken,
                snsType: datas.snsType.toLowerCase(),
                osInfo: datas.osInfo=='AOS'?'android':'ios',
                profile: datas.profile
              };

              //alert(JSON.stringify(params))


              ApiService.post('/auth/sns', params).then(res => {
                //alert(res.data.result)
                // console.log("api /auth/sns res data:"+ JSON.stringify(res.data))
                if (res.data.result == 'ok') {
                        
                  JwtService.saveToken(res.data.token);
                  Promise.all([this.$store.dispatch(LOGIN)]).then(() => {
                  //app 호출 모듈 추가

                    console.log("loginSuccess:!! :"+ this.isAuthenticated);
                    console.log("this.currentUser.id:"+this.currentUser.id);
                    try{
                      if (this.isAuthenticated) {
                        console.log("navigator.userAgent:"+navigator.userAgent);
                        if(navigator.userAgent.match(/ADSRUN_APP_IOS/i)){
                          console.log("ios call login!"+this.currentUser.id);
                          window.webkit.messageHandlers.login.postMessage(this.currentUser.id+"");
                          console.log('go home');
                          this.$router.push({ path: '/home' })
                        }else if(navigator.userAgent.match(/ADSRUN_APP_ANDROID/i)){
                          console.log("android call login!"+this.currentUser.id);
                          window.adsrunApp.login(this.currentUser.id);
                          console.log('go home');
                          this.$router.push({ path: '/home' })    
                        }else{
                          this.$router.push({ path: '/home' })    
                        }  
                      } 
                    }catch(e){
                      console.log('error:'+JSON.stringify(e));
                      ApiService.post('/front/login/checkReserve').then(res => {
                        // console.log("api login/checkReserve res data:"+ JSON.stringify(res.data))
                        if (res.data.result) {
                          this.$router.push({ path: '/ads/applying' })
                        }else{
                          this.$router.push({ path: '/home' })
                        }
                      })
                    }
                  }).catch((err) => {
                    console.log('err:'+JSON.stringify(err))
                    // if(err.errors == 'secession member') this.$router.push({ path: '/Login/secession'+err.Id })
                  })
                    
                } else {
                    alert('SNS 로그인에 실패하였습니다. 관리자에게 문의하세요.')
                }
              }).catch(err => {
                alert('SNS 로그인에 실패하였습니다. 관리자에게 문의하세요.')
              })

            }
       }
    },
  }
}
</script>
