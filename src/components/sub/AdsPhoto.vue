<template id="AdsPhoto">
  <div class="ar-wrap ads-photo">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <div class="ads-photo__wrap layout">
        <div v-if="loading == true" class="ar-popup invite-popup active">
          <div class="ar-popup__dimmer"></div>
          <img alt="loading" class="loading" src="/static/images/adsrun-loader.gif">
        </div>
        <section v-if="status=='SW'" class="box complete-box">
            <img src="/static/images/ico-check-circle.png" alt=""/>
            <h3>스티커 배송이 완료되었습니다!</h3>
            <p>스티커를 차량
              <span> {{ad_locations}}</span>            
              부착 후<br/>{{date_at}}까지 시작 인증 사진을 업로드해 주세요.</p>
        </section>
        <section v-if="status=='SR' || status=='FR'" class="box fail-box">            
            <h3>사진 재촬영이 필요합니다.</h3><br/>
            <p>{{lane.last_push_message}}</p>
        </section>
        <section v-if="status=='FW'" class="box final-box">
            <h3>캠페인 기간 완료</h3>
            <p>{{lane.last_push_message}}</p>
        </section>
        <section class="tip-box" v-if="lane && lane.ad_location">
            <h4>스티커 부착상태</h4>
            <div class="tip-img" v-if="lane.ad_location.indexOf('2') > -1">
              <div class="tip-top" v-if="!url1">
                <p><i></i>터치하여 촬영하세요</p>
              </div>
              <p style="margin-bottom: 1rem;">운전석 앞쪽도어</p>
              <template v-if="url1_2 && file1_2">
                <img  :src="url1_2" class="preview" />
                <input type="file" id="file1_2-input" ref="file1_2" v-on:change="handleFileUpload1(2)" accept="image/*"  capture="camera" hidden />
                <label for="file1_2-input" class="photo-label"></label>
              </template>
              <template v-else>
                <img src="/static/images/adlocation2.png" class="sticker" alt=""/>
                <input type="file" id="file1_2-input" ref="file1_2" v-on:change="handleFileUpload1(2)" accept="image/*"  capture="camera" hidden />
                <label for="file1_2-input" class="photo-label"></label>
              </template>
              <p><i></i>스티커와 번호판이 함께 보이도록 촬영해 주세요.</p>
            </div> 
            <div class="tip-img" v-if="lane.ad_location.indexOf('6') > -1">
              <div class="tip-top" v-if="!url1">
                <p><i></i>터치하여 촬영하세요</p>
              </div>
              <p style="margin-bottom: 1rem;">운전석 뒤쪽도어</p>
              <template  v-if="url1_6 && file1_6">
                <img :src="url1_6" class="preview" />
                <input type="file" id="file1_6-input" ref="file1_6" v-on:change="handleFileUpload1(6)" accept="image/*"  capture="camera" hidden />
                <label for="file1_6-input" class="photo-label"></label>
              </template>
              <template v-else>
                <img src="/static/images/adlocation6.png" class="sticker" alt=""/>
                <input type="file" id="file1_6-input" ref="file1_6" v-on:change="handleFileUpload1(6)" accept="image/*"  capture="camera" hidden />
                <label for="file1_6-input" class="photo-label"></label>
              </template>
              <p><i></i>스티커와 번호판이 함께 보이도록 촬영해 주세요.</p>
            </div> 
            <div class="tip-img" v-if="lane.ad_location.indexOf('3') > -1">
              <div class="tip-top" v-if="!url1">
                <p><i></i>터치하여 촬영하세요</p>
              </div>
              <p style="margin-bottom: 1rem;">조수석 앞쪽도어</p>
              <template v-if="url1_3 && file1_3">
                <img  :src="url1_3" class="preview" />
                <input type="file" id="file1_3-input" ref="file1_3" v-on:change="handleFileUpload1(3)" accept="image/*"  capture="camera" hidden />
                <label for="file1_3-input" class="photo-label"></label>
              </template>
              <template v-else>
                <img src="/static/images/adlocation3.png" class="sticker" alt=""/>
                <input type="file" id="file1_3-input" ref="file1_3" v-on:change="handleFileUpload1(3)" accept="image/*"  capture="camera" hidden />
                <label for="file1_3-input" class="photo-label"></label>
              </template>
              <p><i></i>스티커와 번호판이 함께 보이도록 촬영해 주세요.</p>
            </div>          
            <div class="tip-img" v-if="lane.ad_location.indexOf('4') > -1">
              <div class="tip-top" v-if="!url1">
                <p><i></i>터치하여 촬영하세요</p>
              </div>
              <p style="margin-bottom: 1rem;">조수석 뒤쪽도어</p>
              <template v-if="url1_4 && file1_4">
                <img  :src="url1_4" class="preview" />
                <input type="file" id="file1_4-input" ref="file1_4" v-on:change="handleFileUpload1(4)" accept="image/*"  capture="camera" hidden />
                <label for="file1_4-input" class="photo-label"></label>
              </template>
              <template v-else>
                <img src="/static/images/adlocation4.png" class="sticker" alt=""/>
                <input type="file" id="file1_4-input" ref="file1_4" v-on:change="handleFileUpload1(4)" accept="image/*"  capture="camera" hidden />
                <label for="file1_4-input" class="photo-label"></label>
              </template>
              <p><i></i>스티커와 번호판이 함께 보이도록 촬영해 주세요.</p>
            </div> 
            <div class="tip-img" v-if="lane.ad_location.indexOf('1') > -1">
              <div class="tip-top" v-if="!url1">
                <p><i></i>터치하여 촬영하세요</p>
              </div>
              <p style="margin-bottom: 1rem;">차량후면</p>
              <template v-if="url1 && file1">
                <img  :src="url1" class="preview" />
                <input type="file" id="file1-input" ref="file1" v-on:change="handleFileUpload1(1)" accept="image/*"  capture="camera" hidden />
                <label for="file1-input" class="photo-label"></label>
              </template>
              <template v-else>
                <img src="/static/images/adlocation1.png" class="sticker" alt=""/>
                <input type="file" id="file1-input" ref="file1" v-on:change="handleFileUpload1(1)" accept="image/*"  capture="camera" hidden />
                <label for="file1-input" class="photo-label"></label>
              </template>
              <p><i></i>스티커와 번호판이 함께 보이도록 촬영해 주세요.</p>
            </div> 
            <div class="tip-img" v-if="lane.ad_location.indexOf('7') > -1">
              <div class="tip-top" v-if="!url1">
                <p><i></i>터치하여 촬영하세요</p>
              </div>
              <p style="margin-bottom: 1rem;">주유캡</p>
              <template v-if="url1_7 && file1_7">
                <img  :src="url1_7" class="preview" />
                <input type="file" id="file1_7-input" ref="file1_7" v-on:change="handleFileUpload1(7)" accept="image/*"  capture="camera" hidden />
                <label for="file1_7-input" class="photo-label"></label>
              </template>
              <template v-else>
                <img src="/static/images/adlocation7.png" class="sticker" alt=""/>
                <input type="file" id="file1_7-input" ref="file1_7" v-on:change="handleFileUpload1(7)" accept="image/*"  capture="camera" hidden />
                <label for="file1_7-input" class="photo-label"></label>
              </template>
              <p><i></i>스티커와 번호판이 함께 보이도록 촬영해 주세요.</p>
            </div>
            
        </section>
        <section class="tip-box">
            <h4>계기판</h4>
            <div class="tip-img" style="margin-bottom: 0.4rem;">
                <div class="tip-top" v-if="!url2">
                  <p><i></i>터치하여 촬영하세요</p>
                </div>
                <img v-if="!url2 || !file2" src="/static/images/img-panel.png" class="cluster" alt=""/>
                <img v-if="url2 && file2" :src="url2" class="preview" />
                <p><i></i>총 주행거리가 잘 보이도록 촬영해 주세요.</p>
                <input type="file" id="file2-input" ref="file2" v-on:change="handleFileUpload2()" accept="image/*" capture="camera" hidden />
                <label for="file2-input" class="photo-label"></label>
            </div>
        </section>
        <section class="tip-box" style="margin-bottom:3rem;">
            <h4>주행거리(현재 계기판의 주행거리를 입력해주세요)</h4>
            <div class="input-box">
                <input type="text" size="5" v-model="formData.dist" placeholder="주행거리를 입력하세요"  maxlength="20" oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"/>
            </div>
            <div class="input-upload">
                <button class="btn colored" @click.prevent="saveStartPhoto()" title="업로드">업로드</button>
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
import moment from 'moment'
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
      formData: {
        lane_id: '',
        file1: 0,
        file1_2: 0,
        file1_3: 0,
        file1_4: 0,
        file1_5: 0,
        file1_6: 0,
        file1_7: 0,
        file2: 0,
        dist: ''
      },
      status: null,
      file1: null,
      file1_2: null,
      file1_3: null,
      file1_4: null,
      file1_5: null,
      file1_6: null,
      file1_7: null,
      file2: null,
      url1: null,
      url1_2: null,
      url1_3: null,
      url1_4: null,
      url1_5: null,
      url1_6: null,
      url1_7: null,
      url2: null,
      race: null,
      lane: {
        last_push_message: ''
      },
      date_at: null,
      loading: false,
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      },
      src: null
    }
  },
  methods: {
    handleFileUpload1(num) {
      try {
        switch(num){
          case 1 :
            // this.file1 = this.$refs.file1.files[0]
            // if(this.file1) this.url1 = URL.createObjectURL(this.file1)
            this.createImage(this.$refs.file1.files[0]).then(file => {
              this.file1 = file
              if(this.file1) this.url1 = URL.createObjectURL(this.file1)
            }).catch(err => console.log(err))
            break
          case 2 :
            // this.file1_2 = this.$refs.file1_2.files[0]
            // if(this.file1_2) this.url1_2 = URL.createObjectURL(this.file1_2)
            this.createImage(this.$refs.file1_2.files[0]).then(file => {
              this.file1_2 = file
              if(this.file1_2) this.url1_2 = URL.createObjectURL(this.file1_2)
            }).catch(err => console.log(err))
            break
          case 3 :
            // this.file1_3 = this.$refs.file1_3.files[0]
            // if(this.file1_3) this.url1_3 = URL.createObjectURL(this.file1_3)
            this.createImage(this.$refs.file1_3.files[0]).then(file => {
              this.file1_3 = file
              if(this.file1_3) this.url1_3 = URL.createObjectURL(this.file1_3)
            }).catch(err => console.log(err))
            break
          case 4 :
            // this.file1_4 = this.$refs.file1_4.files[0]
            // if(this.file1_4) this.url1_4 = URL.createObjectURL(this.file1_4)
            this.createImage(this.$refs.file1_4.files[0]).then(file => {
              this.file1_4 = file
              if(this.file1_4) this.url1_4 = URL.createObjectURL(this.file1_4)
            }).catch(err => console.log(err))
            break
          case 5 :
            // this.file1_5 = this.$refs.file1_5.files[0]
            // if(this.file1_5) this.url1_5 = URL.createObjectURL(this.file1_5)
            this.createImage(this.$refs.file1_5.files[0]).then(file => {
              this.file1_5 = file
              if(this.file1_5) this.url1_5 = URL.createObjectURL(this.file1_5)
            }).catch(err => console.log(err))
            break
          case 6 :
            // this.file1_6 = this.$refs.file1_6.files[0]
            // if(this.file1_6) this.url1_6 = URL.createObjectURL(this.file1_6)
            this.createImage(this.$refs.file1_6.files[0]).then(file => {
              this.file1_6 = file
              if(this.file1_6) this.url1_6 = URL.createObjectURL(this.file1_6)
            }).catch(err => console.log(err))
            break
          case 7 :
            // this.file1_7 = this.$refs.file1_7.files[0]
            // if(this.file1_7) this.url1_7 = URL.createObjectURL(this.file1_7)
            this.createImage(this.$refs.file1_7.files[0]).then(file => {
              this.file1_7 = file
              if(this.file1_7) this.url1_7 = URL.createObjectURL(this.file1_7)
            }).catch(err => console.log(err))
            break
        }
      } catch(err) {
          alert("사진 촬영 오류가 발생하였습니다. 관리자에게 이 화면을 공유해주세요. "+err)
      } 
    },
    handleFileUpload2() {
      try {
        // this.file2 = this.$refs.file2.files[0]
        // if(this.file2) this.url2 = URL.createObjectURL(this.file2)
        this.createImage(this.$refs.file2.files[0]).then(file => {
          this.file2 = file
          if(this.file2) this.url2 = URL.createObjectURL(this.file2)
        }).catch(err => console.log(err))
      } catch(err) {
          alert("주행거리 사진 촬영 오류가 발생하였습니다. 관리자에게 이 화면을 공유해주세요. "+err)
      } 
    },
    async createImage(fileData) { 
        const reader = new FileReader();

        // Wait for the data url to be loaded from the file
        const dataURL = await new Promise(resolve => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(fileData);
        });

        // Wait for the image to be loaded
        const img = new Image();
        await new Promise(resolve => {
            img.onload = resolve;
            img.src = dataURL;
        });

        // Resize the image with a canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        // This is an addition to keep the aspect ratio of the image so it won't get distorted
        const [maxWidth, maxHeight] = [1080, 1080];
        const [imgWidth, imgHeight] = [
            img.naturalWidth,
            img.naturalHeight
        ];
        const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);

        canvas.width = imgWidth * ratio;
        canvas.height = imgHeight * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        this.image = canvas.toDataURL('image/jpeg', 1.0);

        let binary = window.atob(this.image.split(',')[1])
        let array = []
        for (var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i))
        }
        let blobData = new Blob([new Uint8Array(array)], {type: 'image/jpeg'})
        let file = new File([blobData], fileData.name)

        return file;
    },
    async setFile() {
      try {
        for(var i=1;i<=7;i++){
          const fd1 = new FormData()
          let file_key = ''
          fd1.append('category', 'adsrun')
          switch(i){
            case 1 :
              fd1.append('file', this.file1)
              file_key = 'file1'
              break
            case 2 :
              fd1.append('file', this.file1_2)
              file_key = 'file1_2'
              break
            case 3 :
              fd1.append('file', this.file1_3)
              file_key = 'file1_3'
              break
            case 4 :
              fd1.append('file', this.file1_4)
              file_key = 'file1_4'
              break
            case 5 :
              fd1.append('file', this.file1_5)
              file_key = 'file1_5'
              break
            case 6 :
              fd1.append('file', this.file1_6)
              file_key = 'file1_6'
              break
            case 7 :
              fd1.append('file', this.file1_7)
              file_key = 'file1_7'
              break
          }
          
          if (fd1.get('file') != 'null') {
            const res_fd1 = await ApiService.post('/front/file/upload', fd1, { headers: { 'Content-Type': 'multipart/form-data' } })
            // console.log('api file/upload res data : ' + JSON.stringify(res_fd1.data))
            if (res_fd1.data.result == 'ok') {
              this.formData[file_key] = res_fd1.data.file_id
            }
          }  
        }
        if (this.file2) {
          const fd2 = new FormData();
          fd2.append('category', 'adsrun')
          fd2.append('file', this.file2);
          const res_fd2 = await ApiService.post('/front/file/upload', fd2, { headers: { 'Content-Type': 'multipart/form-data' } })
          if (res_fd2.data.result == 'ok') {
            this.formData.file2 = res_fd2.data.file_id
          }
        }
      } catch(err) {
        alert("파일 업로드 에러가 발생하였습니다. "+err)
      }
    },
    async saveStartPhoto() {
      this.loading = true
      const file = await this.setFile()
      let file_chk = false
      for(var i=1;i<=7;i++){
        let file_key = i == 1 ? 'file1' : 'file1_'+i
        console.log(file_key, this.formData[file_key])
        if(this.formData[file_key] == 0 && this.lane.ad_location.indexOf(String(i)) > -1) file_chk = true
      }

      if (file_chk) {
        alert('스티커부착 사진을 올려주세요')
        this.loading = false
        return
      }
      if (this.formData.file2 == 0) {
        alert('계기판 사진을 올려주세요')
        this.loading = false
        return
      }
      if (this.formData.dist.trim() == '') {
        alert('주행거리를 입력해주세요')
        this.loading = false
        return
      }
      let post_url = 'front/races/begin'
      if (['FW','FR'].indexOf(this.lane.status) > -1) {
        post_url = 'front/races/end'
        if(Number(this.formData.dist.trim()) < this.lane.beg_dist){
            alert('종료주행거리가 시작주행거리보다 작습니다. (시작주행거리 : '+this.lane.beg_dist+')')
            this.loading = false
            return
        }
      }

      ApiService.post(post_url, this.formData
      ).then(res => {
        // console.log('api ' + post_url+ ' res data : ' + JSON.stringify(res.data))
        if (res.data.result == 'ok') {
          if(['FW'].indexOf(this.lane.status) > -1 && this.race.survey_url) {
            this.$emit('popupData', {content : '종료 인증 사진이 등록되었습니다.\n더 나은 서비스를 위해 설문(1~2분 내외) 진행 중이오니, 참여 부탁드리겠습니다.', button : '확인', url : this.race.survey_url});
			      activeCustomPopup();
          } else {
            alert('등록 되었습니다.')
            window.location.reload(true)
          }
        }
      }).catch(err => {
        console.log(err)
        alert("등록 에러가 발생하였습니다. "+err)
      })
    },
    getApplying() {
      const start_upload_grace_period = 5
      const end_upload_grace_period = 10
      this.race = this.data.race ? this.data.race : null
      this.lane = this.data.lane ? this.data.lane : null
      //console.log('ads photo race : ',JSON.stringify(this.race))
      //console.log('ads photo lane : ',JSON.stringify(this.lane))
      this.formData.lane_id = this.lane.id
      switch(this.lane.ad_location){
        case 1:
          this.src = '/static/images/img-car-back.png'
          break;
        case 2:
          this.src = '/static/images/img-car-door1.png'
          break;
        case 3:
          this.src = '/static/images/img-car-door2.png'
          break;
        case 4:
          this.src = '/static/images/img-car-bonnet.png'
          break;
        case 6:
          this.src = '/static/images/img-car-back2.png'
          break;
        default:
          this.src = '/static/images/img-car-back.png'
          break;
      }
      this.status = this.lane.status
      if (['SW','FW','SR','FR'].indexOf(this.lane.status) > -1) {
        var date_at,
            duration = this.lane.ad_duration == null ? end_upload_grace_period : this.lane.ad_duration + end_upload_grace_period
        if(this.lane.status == 'SW'|| this.lane.status == 'SR') 
          date_at = moment(this.lane.deli_at, 'YYYY-MM-DD HH:mm:ss').add(start_upload_grace_period, 'days')
        if(this.lane.status == 'FW'|| this.lane.status == 'FR') 
          date_at = moment(this.lane.beg, 'YYYY-MM-DD HH:mm:ss').add(duration, 'days')
        this.date_at = date_at.format('YYYY') +'년 '+date_at.format('M')+'월 '+date_at.format('D')+'일'	
      }
      /*
      ApiService.post('/front/ads/applying').then(res => {
        const start_upload_grace_period = 5
        const end_upload_grace_period = 10
        this.race = res.data.race ? res.data.race : null
        this.lane = res.data.lane ? res.data.lane : null
        console.log('race',this.race)
        console.log('lane',this.lane)
        this.formData.lane_id = this.lane.id
        switch(this.lane.ad_location){
          case 1:
            this.src = '/static/images/img-car-back.png'
            break;
          case 2:
            this.src = '/static/images/img-car-door1.png'
            break;
          case 3:
            this.src = '/static/images/img-car-door2.png'
            break;
          case 4:
            this.src = '/static/images/img-car-bonnet.png'
            break;
          case 6:
            this.src = '/static/images/img-car-back2.png'
            break;
          default:
            this.src = '/static/images/img-car-back.png'
            break;
        }
        this.status = this.lane.status
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
        if (['SW','FW','SR','FR'].indexOf(this.lane.status) > -1) {
          var date_at,
              duration = this.lane.ad_duration == null ? end_upload_grace_period : this.lane.ad_duration + end_upload_grace_period
          if(this.lane.status == 'SW'|| this.lane.status == 'SR') 
            date_at = moment(this.lane.deli_at, 'YYYY-MM-DD HH:mm:ss').add(start_upload_grace_period, 'days')
          if(this.lane.status == 'FW'|| this.lane.status == 'FR') 
            date_at = moment(this.lane.beg, 'YYYY-MM-DD HH:mm:ss').add(duration, 'days')
          this.date_at = date_at.format('YYYY') +'년 '+date_at.format('M')+'월 '+date_at.format('D')+'일'	
        }
      }).catch(err => {
        console.log(err)
      })
      */
    },
    pop_url(url){
      console.log('pop)url:'+url);

      if(navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone|iPod/i) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)){
        window.webkit.messageHandlers.pop.postMessage(url+"");
      }else{
        window.adsrunApp.pop(url);
      }
    },
  },
  computed: {
    ad_locations: function () {
      var results = ''
      for(var str of this.lane.ad_location.split(',')){
        var ads = ''
        switch(str){
          case '1':
            ads = '차량후면'
            break
          case '2':
            ads = '운전석 앞쪽도어'
            break
          case '3':
            ads = '조수석 앞쪽도어'
            break
          case '4':
            ads = '조수석 뒤쪽도어'
            break
          case '6':
            ads = '운전석 뒤쪽도어'
            break
          case '7':
            ads = '주유캡'
            break
        }
        results += (results == '' ? '' : ',') + ads
      }
      return results+'에'
    },
    retry_cnt: function () {
      let result
      if(this.status=='SR'){
        result = this.lane.beg_fail_cnt == null || this.lane.beg_fail_cnt == '' ? 3 : 3 - this.lane.beg_fail_cnt
      }else if(this.status=='FR'){
        result = this.lane.end_fail_cnt == null || this.lane.end_fail_cnt == '' ? 3 : 3 - this.lane.end_fail_cnt
      }else{
        result = 0
      }
      return result
    }
  },
  watch: {
    number(val){
      const reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z]/;

      // 한글, 영문 체크
      if(reg.exec(val)!==null) this.number = val.replace(/[^0-9]/g,'');

      // .... 만 입력하게 될 경우 체크
      if(isNaN(parseFloat(val))) this.number = '';
    }
  },
  mounted() {
    this.getApplying()
    this.$store.commit('isBack') 
  }
}
</script>
