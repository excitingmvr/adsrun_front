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
          <h4>SNS 간편 로그인</h4>
          <nav>
              <ul class="easy-login__list">
                  
                  <li>
                      <a href="https://api.adsrun.kr/auth/kakao">
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
                  <li>
                    <a v-if="apple" href="https://api.adsrun.kr/auth/apple">
                      <img src="/static/images/ico-apple.png" alt="Apple"/>
                      <!-- 애플 -->
                    </a>
                  </li>
                  <li>
                      <a href="https://api.adsrun.kr/auth/naver">
                          <img src="/static/images/ico-naver.png" alt="Naver"/>
                          <!-- 네이버 -->
                      </a>
                  </li>
                  <!--
                  <li>
                      <a href="#">
                          <img src="/static/images/ico-googleplus.png" alt="Google+"/>
                          구글플러스
                      </a>
                  </li>
                  -->
              </ul>
          </nav>
          <div class="login-btns">
              <a href="#" class="btn full ask-btn">광고 의뢰 문의</a>
              <!-- <a @click.prevent="$router.push('/home')" class="btn no-back">둘러보기</a> -->
          </div> 
      </section>
  </div>
</template>

<script>
import 'swiper/css/swiper.css'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { LOGIN } from '@/store/actions.type'
import { mapGetters } from 'vuex'
import JwtService from '@/common/jwt.service'
export default {
  components: {
    Swiper, SwiperSlide
  },
  data() {
    return {
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
  mounted() {
    // 현재 swiper 인스턴스를 확인
    //this.swiper.$swiper.slideTo(3, 1000, false)
    if(navigator.userAgent.match(/ADSRUN_APP_IOS/i)){
        this.apple = true
    }
    this.login()
    
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser'])
  },
	methods: {
    login() {
      console.log("loginSuccess:!"+this.$route.query.token);
      JwtService.saveToken(this.$route.query.token);
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
              console.log('go home');
            }else if(navigator.userAgent.match(/ADSRUN_APP_ANDROID/i)){
              console.log("android call login!"+this.currentUser.id);
              window.adsrunApp.login(this.currentUser.id);
              console.log('go home');
              this.$router.push({ path: '/home' })
              console.log('go home');
            }else{
              this.$router.push({ path: '/home' })
            }
            
            //this.$router.push({ path: '/home' })
            /*
            ApiService.post('/front/login/checkReserve').then(res => {
              if (res.data.result) {
                this.$router.push({ path: '/ads/applying' })
              }else{
                this.$router.push({ path: 'http://localhost:3030/home' })
              }
            })
            */
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
    },
    fcmInfoSuccess(token, userId){

      console.log("token:"+token);

    }
  }
}


</script>
