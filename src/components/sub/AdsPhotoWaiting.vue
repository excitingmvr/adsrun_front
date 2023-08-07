<template id="AdsPhotoWaiting">
  <div class="ar-wrap ads-photo">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <div class="ads-photo__wrap layout">
        <section class="box final-box">
            <h3>사진이 등록되었습니다.</h3>
            <p>사진 심사 중입니다.</p>
        </section>
        <section class="tip-box" v-if="lane && lane.ad_location">
            <h4>스티커 부착상태</h4>
            <swiper class="swiper" :options="swiperOption" style="width: 100%;">
                <swiper-slide style="display:block;" v-if="lane.ad_location.indexOf('2') > -1">
                  <p style="margin-bottom: 1rem;">운전석 앞쪽도어</p>
                  <div class="tip-img">
                      <img v-if="!url1_2" src="/static/images/adlocation2.png" class="sticker" alt=""/>
                      <img v-if="url1_2" :src="url1_2" class="preview" />
                  </div>
                </swiper-slide>
                <swiper-slide style="display:block;" v-if="lane.ad_location.indexOf('6') > -1">
                  <p style="margin-bottom: 1rem;">운전석 뒤쪽도어</p>
                  <div class="tip-img">
                      <img v-if="!url1_6" src="/static/adlocation6.png" class="sticker" alt=""/>
                      <img v-if="url1_6" :src="url1_6" class="preview" />
                  </div>
                </swiper-slide>
                <swiper-slide style="display:block;" v-if="lane.ad_location.indexOf('3') > -1">
                  <p style="margin-bottom: 1rem;">조수석 앞쪽도어</p>
                  <div class="tip-img">
                      <img v-if="!url1_3" src="/static/images/adlocation3.png" class="sticker" alt=""/>
                      <img v-if="url1_3" :src="url1_3" class="preview" />
                  </div>
                </swiper-slide>
                <swiper-slide style="display:block;" v-if="lane.ad_location.indexOf('4') > -1">
                  <p style="margin-bottom: 1rem;">조수석 뒤쪽도어</p>
                  <div class="tip-img">
                      <img v-if="!url1_4" src="/static/images/adlocation4.png" class="sticker" alt=""/>
                      <img v-if="url1_4" :src="url1_4" class="preview" />
                  </div>
                </swiper-slide>
                <swiper-slide style="display:block;" v-if="lane.ad_location.indexOf('1') > -1">
                  <p style="margin-bottom: 1rem;">차량후면</p>
                  <div class="tip-img">
                      <img v-if="!url1" src="/static/images/adlocation1.png" class="sticker" alt=""/>
                      <img v-if="url1" :src="url1" class="preview" />
                  </div>
                </swiper-slide> 
                <swiper-slide style="display:block;" v-if="lane.ad_location.indexOf('7') > -1">
                  <p style="margin-bottom: 1rem;">주유캡</p>
                  <div class="tip-img">
                      <img v-if="!url1_7" src="/static/images/adlocation7.png" class="sticker" alt=""/>
                      <img v-if="url1_7" :src="url1_7" class="preview" />
                  </div>
                </swiper-slide> 
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </section>
        <section class="tip-box" style="margin-bottom:3rem;">
            <h4>계기판</h4>
            <div class="tip-img" style="margin-bottom: 0.4rem;">
                <img v-if="!url2" src="/static/images/img-panel.png" class="cluster" alt=""/>
                <img v-if="url2" :src="url2" class="preview" />
            </div>
        </section>
        <section class="tip-box" style="margin-bottom:1rem;">
            <h4>주행거리(현재 계기판의 주행거리를 입력해주세요)</h4>
            <div class="input-box">
                <input type="number" size="5" v-model="dist" placeholder="주행거리를 입력하세요" min="0" max="99999999" readonly/>
            </div>
        </section>
        <section class="tip-box" style="margin-bottom:3rem;">
            <h4>등록일</h4>
            <div class="input-box">
                <input type="text" size="5" v-model="reg" readonly/>
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
import ApiService from '@/common/api.service'
import HeaderNav from '@/components/common/HeaderNav'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  components: {
    HeaderNav,Swiper,SwiperSlide
  },
  props: {
    data : Object
  },
  data() {
    return {
      race: null,
      lane: null,
      url1: null,
      url1_2: null,
      url1_3: null,
      url1_4: null,
      url1_5: null,
      url1_6: null,
      url1_7: null,
      url2: null,
      dist: null,
      reg: null,
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
  methods: {
    async getApplying() {
      this.race = this.data.race ? this.data.race : null
      this.lane = this.data.lane ? this.data.lane : null
      //console.log('ads photo waiting race : ',JSON.stringify(this.race))
      //console.log('ads photo waiting lane : ',JSON.stringify(this.lane))
      if (this.lane.status == 'SU') {
        this.reg = this.lane.beg
        this.dist = this.lane.beg_dist
        for(var i=1;i<=7;i++){
          let file_key = i == 1 ? 'beg_file1' : 'beg_file1_'+i
          let url_key = i == 1 ? 'url1' : 'url1_'+i
          console.log(file_key, this.lane[file_key])
          if(this.lane.ad_location.indexOf(String(i)) > -1 && this.lane[file_key] != 0 && this.lane[file_key] != null){
            let imgIdx = await ApiService.post('/front/races/image', {id: this.lane[file_key]}).then(res => {
              // console.log('api races/image res data : ' + JSON.stringify(res.data))
              this[url_key] = res.data.filepath
            }).catch(err => { console.log(err) })
          }
        }
        if (this.lane.beg_file2 != 0) {
          let imgIdx = await ApiService.post('/front/races/image', {id: this.lane.beg_file2}).then(res => {
            this.url2 = res.data.filepath
          }).catch(err => { console.log(err) })
        }
      }
      if (this.lane.status == 'FU') {
        this.reg = this.lane.end
        this.dist = this.lane.end_dist
        for(var i=1;i<=7;i++) {
          let file_key = i == 1 ? 'end_file1' : 'end_file1_'+i
          let url_key = i == 1 ? 'url1' : 'url1_'+i
          console.log(file_key, this.lane[file_key])
          if(this.lane.ad_location.indexOf(String(i)) > -1 && this.lane[file_key] != 0 && this.lane[file_key] != null){
            let imgIdx = await ApiService.post('/front/races/image', {id: this.lane[file_key]}).then(res => {
              this[url_key] = res.data.filepath
            }).catch(err => { console.log(err) })
          }
        }
        if (this.lane.end_file2 != 0) {
          ApiService.post('/front/races/image', {id: this.lane.end_file2}).then(res => {
            this.url2 = res.data.filepath
          }).catch(err => { console.log(err) })
        }
      }
      /*
      ApiService.post('/front/ads/applying').then(res => {
        this.race = res.data.race ? res.data.race : null
        this.lane = res.data.lane ? res.data.lane : null
        console.log('race',this.race)
        console.log('lane',this.lane)
        if (['SW','FW','SR','FR'].indexOf(this.lane.status) > -1) {
          this.$router.push('/ads/photo')
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
        if (this.lane.status == 'SU') {
          this.reg = this.lane.beg
          this.dist = this.lane.beg_dist
          if (this.lane.beg_file1 != 0) {
            ApiService.post('/front/races/image', {id: this.lane.beg_file1}).then(res => {
              this.url1 = res.data.filepath
            }).catch(err => { console.log(err) })
          }
          if (this.lane.beg_file2 != 0) {
            ApiService.post('/front/races/image', {id: this.lane.beg_file2}).then(res => {
              this.url2 = res.data.filepath
            }).catch(err => { console.log(err) })
          }
        }
        if (this.lane.status == 'FU') {
          this.reg = this.lane.end
          this.dist = this.lane.end_dist
          if (this.lane.end_file1 != 0) {
            ApiService.post('/front/races/image', {id: this.lane.end_file1}).then(res => {
              this.url1 = res.data.filepath
            }).catch(err => { console.log(err) })
          }
          if (this.lane.end_file2 != 0) {
            ApiService.post('/front/races/image', {id: this.lane.end_file2}).then(res => {
              this.url2 = res.data.filepath
            }).catch(err => { console.log(err) })
          }
        }
        if(['SR','FR'].indexOf(this.lane.status) > -1) this.$router.push('/ads/photo')
      }).catch(err => { console.log(err) })
      */
    }
  },
  mounted() {
    this.getApplying()
    this.$store.commit('isBack')
  }
}
</script>
