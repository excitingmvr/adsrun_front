<template>
        <div class="ar-wrap register register-renew grey">
            <header class="header">
                <h1 class="hd-logo">
                    <img src="/static/images/adsrun-bl.png" alt="Ads-Run" class="adsrun-logo"/>
                </h1>
            </header>
            <div class="register-form__wrap layout">
                <div class="access-hd">
                    <h2 class="access-title">
                        회원님의 정보를 입력해주세요.
                    </h2>
                </div>
                <div v-if="loading == true" class="ar-popup invite-popup active">
                    <div class="ar-popup__dimmer"></div>
                    <img alt="loading" class="loading" src="/static/images/adsrun-loader.gif"/>
                </div>
                <section class="register-section">
                    <h4 class="register-sub__title">이름</h4>
                    <div class="input-box full">
                        <input type="text" v-model.trim="formData.name" maxlength="20" placeholder="이름 입력"/>
                    </div>
                </section>
                <section class="register-section">
                    <h4 class="register-sub__title">이메일주소</h4>
                    <div class="input-box full">
                        <input type="text" size="6" placeholder="이메일주소" v-model.trim="formData.email" />
                    </div>
                </section>
               
                <section class="register-section">
                    <h4 class="register-sub__title">주민번호</h4>
                    <div class="input-box r-number">
                        <input type="number" size="6" maxlength="6" placeholder="주민번호 앞 6자리" ref="serial_1" v-model.trim="serial_1"
              @keyup.prevent="checkSerial_1" />
                        <div class="r-number__back">
                            <input type="number" placeholder="*" ref="serial_2" size="5" maxlength="1" v-model="serial_2"
                @keyup.prevent="checkSerial_2"  />
                            <p>••••••</p>
                        </div>
                    </div>
                </section>

                <section class="register-section">
                    <h4 class="register-sub__title">전화번호</h4>
                    <div class="input-box">
                        <input type="number" size="5" placeholder="휴대폰번호 입력 ('-' 없이)" v-model="formData.phone"/> 
                        <!-- :readonly="formData.sms_ok" -->
                        <button class="btn colored" @click.prevent="checkPhone">{{formData.sms_btn_msg}}</button>
                    </div>

                    <div v-if="formData.sms_sended" class="input-box">
                        <input type="number" size="5" :placeholder="formData.sms_remain" v-model="formData.sms_code" />
                        <button type="button" class="btn colored" @click.prevent="checkSmsCode">인증번호 확인</button>
                    </div>
                </section>

               

                <!-- * 주요 이동 경로 * -->
                <section class="register-section">
                    <!-- 주거지(배송지) -->
                    <form>
                           <input type="hidden"  v-model="formData.zipcode" />
                             <div class="addr-title">
                            <h4 class="register-sub__title">주소1 (배송지)</h4>
                            <button class="btn colored" @click.prevent="searchDaumPost('H')">주소검색</button>
                        </div>
                           
                            <div class="input-box full">
                                <input type="text" size="5" placeholder="주소" readonly="readonly" v-model="formData.addr1" />
                            </div>
                            <div class="input-box full">
                                <input type="text" size="5" placeholder="상세주소 입력" v-model="formData.addr2" />
                            </div>
                            <!-- <div class="select-box">
                                <select>
                                    <option value="" default selected hidden>시/도</option>
                                    <option value="test">test</option>
                                </select>
                                <select>
                                    <option value="" default selected hidden>구/군</option>
                                    <option value="test">test</option>
                                </select>
                            </div>
                            <div class="select-box full">
                                <select>
                                    <option value="" default selected hidden>동/리</option>
                                    <option value="test">test</option>
                                </select>
                            </div>
                            <div class="input-box full">
                                <input type="text" size="5" placeholder="상세주소 입력"/>
                            </div> -->
                    </form>
                    <!-- 직장 -->
                    <form style="margin-bottom: 2rem; margin-top:2rem;">
                        <div class="addr-title">
                            <h4 class="register-sub__title">주소2 (주운행지역)</h4>
                        </div>
                        <div class="select-box full">
                                <select v-model="formData.c_addr1" @change="getArea2">
                                    <option value="" default selected hidden>도/시</option>
                                    <option v-for="option in area1_options" v-bind:key="option.id" v-bind:value="option.id">
                                    {{option.area_name}}</option>
                                </select>
                            </div>
                        <div class="select-box full">
                            <select v-model="formData.c_addr2">
                                <option value="" default selected hidden>시/구</option>
                                 <option v-for="option in area2_options" v-bind:key="option.id" v-bind:value="option.id">
                                    {{option.area_name}}</option>
                                </select>
                        </div>
                    </form>
                </section>
            </div>
            <footer class="register-ft">
            <button type="button" @click="cancel" class="btn grey">취소</button>
            <button type="button" @click="saveRunner" class="btn colored">다음</button>
            </footer>
        </div>
    </template>
   <script>
    import axios from 'axios'
    import moment from 'moment'
    import ApiService from '@/common/api.service'
    import SimpleVueValidation from 'simple-vue-validator';
    const Validator = SimpleVueValidation.Validator;
    import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        formData: {
          sended: false,
          runner_id: '',
          phone: '',
          sms_ok: false,
          sms_sended: false,
          sms_code: '',
          sms_confirm: null,
          sms_remain: '',
          sms_deadline: '',
          sms_btn_msg: '인증번호 발송',
          name: '',
          zipcode: '',
          addr1: '',
          addr2: '',
          c_zipcode: '',
          c_addr1: '',
          c_addr2: '',
          email: '',
          car_addr:''
        },
        area1_options: [{ id: '', area_name: '도/시' },],
        area2_options: [{ id: '', area_name: '시/구' },],
        postcode: '',
        address: '',
        interval: null,
        serial_1: '',
        serial_2: '',
        loading: false
      }
    },
    validators: {
      'formData.phone': function (value) {
        return Validator.value(value).required()
      },
     
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'currentUser']),
      isEmail: function () {
        var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
        var result = false
        this.formData.email = this.formData.email.trim()
        if (regExp.test(this.formData.email)) result = true
        return result
      }
    },
    methods: {
      cancel(){
          this.$router.push('/home')
      },
      checkSerial_1() {
        if (this.serial_1.length == 6) {
          this.$refs.serial_2.focus()
          if (this.serial_2.length == 1) this.checkSerial()
        }
        if (this.serial_1.length > 6) {
          this.serial_1 = this.serial_1.slice(0, 6)
        }
      },
      checkSerial_2() {
        if (this.serial_2.length == 1) {
          if (this.serial_1.length == 6) this.checkSerial()
        }
        if (this.serial_2.length > 1) {
          this.serial_2 = this.serial_2.slice(0, 1)
        }
      },
      checkSerial() {
        var reg = /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))$/
        if (!reg.test(this.serial_1)) {
          alert('주민번호 형식이 아닙니다')
          return
        }
        var reg2 = /^[1-4]{1}$/
        if (!reg2.test(this.serial_2)) {
          alert('주민번호 형식이 아닙니다')
          return
        } else {
          if (this.serial_1.length == 6) this.formData.serial_no = this.serial_1 + this.serial_2
        }
        
      },
      checkSeries() {
        if (this.formData.serial_no == '') {
          alert("주민번호를 입력해주세요.")
        } else {
          this.loading = true
          ApiService.post('/front/checkSerialNumber', { 'serial_no': this.formData.serial_no }
          ).then(res => {
            // console.log("api checkSerialNumber res data:"+ JSON.stringify(res.data))
            if (res.data.result == 'ok') {
              this.formData.serial_no_ok = true
              alert('사용 가능한 주민번호입니다.')
            } else if (res.data.result == 'failed') {
              this.formData.serial_no_ok = false
              alert('이미 등록된 주민번호입니다.')
            } else {
              this.formData.serial_no_ok = false
              alert('주민번호 조회에 실패했습니다. 관리자에게 문의하세요.')
            }
            this.loading = false
          })


        }
      },
      searchDaumPost(rt) {
        try {
          new daum.Postcode({
            onComplete: (data) => {
              if (data.userSelectedType === 'R') {
                this.address = data.roadAddress
              } else {
                this.address = data.jibunAddress
              }
              this.postcode = data.zonecode
              if (rt == 'H') {
                this.formData.zipcode = this.postcode
                this.formData.addr1 = this.address
              }
            
            },
          }).open();
        } catch (error) {
            alert("에러가 발생하였습니다. "+error)
            //location.href = API_URL+'/auth/kakao'
        }   
      },
      saveRunner() {
        this.loading = true
        if (this.formData.sended) {
          alert('저장중입니다.')
          this.loading = false
          return
        }
        else if (this.formData.name == '') {
          alert('이름을 입력해주세요.')
          this.loading = false
          return
        }
        else if (this.formData.email != null && !this.isEmail) {
          alert('이메일 형식이 아닙니다.')
          this.loading = false
          return
        }
        else if (this.formData.serial_no == '') {
          alert('주민등록번호를 입력해주세요.')
          this.loading = false
          return
        }
         else if (!this.formData.sms_ok  ) { 
          alert('휴대폰 인증이 필요합니다.')
          this.loading = false
          return
        } 
        else if (this.formData.zipcode == '' || this.formData.c_addr2 == '') {
          alert('주요이동경로를 입력해 주세요.')
          this.loading = false
          return
        }
        else {
          this.formData.sended = true
          this.checkSerial()
          this.$validate()
            .then(success => {
              if (success) {
                // console.log('addBasic Data : ' + JSON.stringify(this.formData))
                 ApiService.post('/front/user/runner/addBasic', this.formData
                ).then(res => {
                  // console.log("api user/runner/addBasic res data:"+ JSON.stringify(res.data))
                  // console.log('addBasic response : ' + JSON.stringify(res.data))
                  if (res.data.result == 'ok') {
                    this.$router.push('/registerCar')
                  }
                  if (res.data.result == 'exists') {
                    alert('이미 등록 되어있습니다.\n수정은 마이페이지에서 가능합니다.')
                    this.formData.sended = false
                  }
                  this.loading = false
                }).catch(err => {
                  console.log(err)
                  this.formData.sended = false
                  this.loading = false
                }) 
              } else {
                alert('Validation failed!')
                this.formData.sended = false
                this.loading = false
              }
            })
            .catch(err => {
              console.log(err)
              this.formData.sended = false
              this.loading = false
            })
        }
      },
      isMobile(phoneNum) {
        var regExp = /(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/;
        var myArray;
        if (regExp.test(phoneNum)) {
          myArray = regExp.exec(phoneNum);
          return true;
        } else {
          return false;
        }
      },
       nextRegister() {
        this.$router.push('/registerCar')
      },
      checkPhone() {
        this.loading = true;
        /* if (this.formData.sms_ok) {
          alert('인증번호 확인되었습니다.')
          this.loading = false;
          return
        } */
        if (this.formData.sms_sended) {
          alert('인증번호가 전송되었습니다.')
          this.loading = false;
          return
        }
        this.formData.phone = this.formData.phone.replace(/['-','e']/, '')
        console.log('input:', this.formData.phone)
        if (this.formData.phone.trim() == '') {
          alert('휴대폰번호를 입력해 주세요.')
          this.loading = false;
          return
        }
        if (this.formData.phone.length == 0 || this.formData.phone.length < 10 || this.formData.phone.length > 11) {
          alert('정확한 휴대폰번호를 입력해 주세요.')
          this.loading = false;
          return
        }
        if (!this.isMobile(this.formData.phone)) {
          alert('정확한 휴대폰번호를 입력해 주세요.')
          this.loading = false;
          return
        }
        this.formData.sms_sended = true
        ApiService.post('/front/getVerifyNumber', {
          'phone': this.formData.phone
        }).then(res => {
          // console.log("api getVerifyNumber res data:"+ JSON.stringify(res.data))
          if (res.data.result == 'ok') {
            this.formData.sms_deadline = moment().add(3, 'minute').format('YYYY-MM-DD HH:mm:ss')
            this.countdownSms()
            this.formData.sms_confirm = res.data.message
            this.loading = false;
           
          // } else if (res.data.result == 'failed') {
          //   this.formData.sms_sended = false
          //   this.loading = false;
          //   alert('이미 등록된 휴대폰번호입니다.')
          } else {
            this.formData.sms_sended = false
            this.loading = false;
            alert('휴대폰인증에 실패하였습니다. 관리자에게 문의하세요.')
          }
        }).catch(err => {
          this.loading = false;
          console.log(err)
        })
      },
      countdownSms() {
        this.interval = window.setInterval(() => {
          const now = Math.trunc((new Date()).getTime() / 1000);
          var deadline_cnt = isNaN(Date.parse(this.formData.sms_deadline)) ? Date.parse(this.formData.sms_deadline.replace(/\s/, 'T')) : Date.parse(this.formData.sms_deadline)
          const deadline = Math.trunc(deadline_cnt / 1000)
          let minutes = Math.trunc((deadline - now) / 60) % 60
          let seconds = (deadline - now) % 60
          if (minutes < 0) {
            minutes = '0'
          }
          if (seconds < 0) {
            seconds = '00'
          } else {
            if (seconds.toString().length <= 1) {
              seconds = `0${seconds}`
            }
          }
          this.formData.sms_remain = `인증번호 입력 (남은 시간 ${minutes}:${seconds})`
          this.countdownStop(minutes, seconds)
        }, 1000);
      },
      countdownStop(m, s) {
        if (this.formData.sms_remain != null && m == '0' && s == '00') {
          clearInterval(this.interval)
          this.formData.sms_sended = false
        }
      },
      checkSmsCode() {
        if (!this.isMobile(this.formData.phone)) {
          alert('정확한 휴대폰번호를 입력해 주세요.')
          this.loading = false
          return
        }
        else if (this.formData.sms_confirm != null) {
          if (this.formData.sms_confirm == this.formData.sms_code) {
            alert('휴대폰인증이 확인되었습니다.')
            this.formData.sms_ok = true
            this.formData.sms_sended = false
            this.formData.sms_btn_msg = '인증완료'
          } else {
            alert('휴대폰인증번호를 다시 확인해주세요.')
          }
        }
      },
      isCarnum(carNum) {
        var regExp = /[0-9]{2,3}[가-힣]{1}[\s]*[0-9]{4}/
        var myArray;
        if (regExp.test(carNum)) {
          myArray = regExp.exec(carNum);
          return true;
        } else {
          return false;
        }
      },
      showCarNameInputInfo() {
        document.querySelector('#car_owner_input_popup').classList.add("active");
      },
      hideCarNameInputInfo() {
        document.querySelector('#car_owner_input_popup').classList.remove("active");
      },
      checkAgreement() {
        console.log('agreement : ' + this.$store.getters.agreement)
        console.log("runner_id in checkAgreement:"+this.formData.runner_id)
        if(this.formData.runner_id == ''){
          if(this.$route.query.m){
            if(this.$route.query.m == 'Y') alert('회원 정보를 등록해야만 진행이 가능합니다 :)')
          }else{
            if (!this.$store.getters.agreement) this.$router.push({ path: '/agreement' , query:{action: '/registerBasic'}})
          } 
        }
      },
      getArea1() {
        ApiService.post('/front/getArea1', {}).then(res => {

          // console.log("api getArea1 res data:"+ JSON.stringify(res.data))
          for (let i = 0; i < res.data.length; i++) {
            this.area1_options.push({ id: res.data[i].id, area_name: res.data[i].area_name });
          }
              
        }).catch(err => {
          this.loading = false;
          console.log(err)
        })

      },
      getArea2() {
        console.log(this.formData.c_addr1)
        this.formData.c_addr2 = ''  
        this.area2_options = [{ id: '', area_name: '시/구' },]
        ApiService.post('/front/getArea2', {'id': this.formData.c_addr1}).then(res => {
          // console.log("api getArea2 res data:"+ JSON.stringify(res.data))
          for (let i = 0; i < res.data.length; i++) {
            this.area2_options.push({ id: res.data[i].id, area_name: res.data[i].area_name });
          }
        }).catch(err => {
          this.loading = false;
          console.log(err)
        })

      },
      getMypage() {
        ApiService.post('/front/user/runner/info').then(res => {
          // console.log("api user/runner/info res data:"+ JSON.stringify(res.data))
          if(res.data){
          // this.$store.commit('getAgreement')
          this.$store.commit('backOff')    
          console.log("runner id:"+res.data.id)
          this.formData.runner_id = res.data.id
          this.formData.name = res.data.name
          this.formData.email = res.data.email
          this.formData.phone = res.data.phone
          this.formData.addr1 = res.data.addr1
          this.formData.addr2 = res.data.addr2
          this.formData.zipcode = res.data.zipcode
          this.serial_1 = res.data.serial_no.substring(0,6)
          this.serial_2 = res.data.serial_no.substring(6,7)
          this.formData.c_addr1 = res.data.ad_area_a.split(',')[1]
          this.getArea2()
          this.formData.c_addr2 = res.data.ad_area_b.split(',')[1]
          this.formData.sms_ok = true
          }
          this.checkAgreement()   
        }).catch(err => {
          console.log(err)
        })
      }
    },
    mounted() {
      if (this.$store.getters.back && this.$store.getters.location != null) {
        this.$store.commit('backOff')
        this.$router.push('/' + this.$store.getters.location)
      }
      this.getArea1()
      this.getMypage()  
    }
  }
</script>