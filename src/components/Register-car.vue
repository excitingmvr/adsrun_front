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
                        차량 정보를 등록해 주세요.<br/>
                        합법적으로 광고를 부착하시기 위해 필요한 절차입니다.
                    </h2>
                </div>
                <div v-if="loading == true" class="ar-popup invite-popup active">
                    <div class="ar-popup__dimmer"></div>
                    <img alt="loading" class="loading" src="/static/images/adsrun-loader.gif"/>
                </div>
                <section class="register-section">
                  
                    <h4 class="register-sub__title">차량소유주</h4>
                    <div class="input-box full">
                        <input type="text" v-model="formData.name" maxlength="20" placeholder="차량소유주 입력"/>
                    </div>
                    <div class="popup-txt">
                  <h3 style="text-align:center; line-height: 30px;">공동명의시 성명 입력 예시</h3>
                  <table style="width:100%;border: 1px solid lightslategray; border-collapse: collapse;">
                    <tbody>
                      <tr>
                        <th style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px;"></th>
                        <th style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px;">등록증 소유자 성명란</th>
                        <th style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">입력값</th>
                      </tr>
                      <tr>
                        <td style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">단독 명의시</td>
                        <td style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">홍길동</td>
                        <td style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">홍길동</td>
                      </tr>
                      <tr>
                        <td rowspan="2" style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">공동 명의시</td>
                        <td style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">이수일(60%),˹심순애(40%)˼</td>
                        <td style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">이수일</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">이수일외1인(심순애)</td>
                        <td style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">이수일외1인(심순애)</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">리스차량</td>
                        <td style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">롯데렌탈(주)</td>
                        <td style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">롯데렌탈(주)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                </section>

                <section class="register-section">
                    <h4 class="register-sub__title">차량번호</h4>
                    <div class="input-box">
                        <input type="text" size="5" v-model="formData.car_num_input" placeholder="차량번호 입력"/>
                        <button class="btn colored search" @click.prevent="checkCarInfo">차량조회</button>
                    </div>
                </section>

                <!-- 차량조회 리스트 -->
                <ul class="search-list">
                    <li>
                    <p>차량번호</p>
                    <p>{{formData.car_num}}</p>
                    </li>
                    <li>
                    <p>차종/모델명</p>
                    <p>{{formData.car_type}}/{{formData.car_name}}</p>
                    </li>
                    <li>
                    <p>년식</p>
                    <p>{{formData.car_year}}</p>
                    </li>
                    <li>
                    <p>색상</p>
                    <p>{{formData.car_color}}</p>
                    </li>
                    <li>
                    <p>차량등록지</p>
                    <p>{{formData.car_addr}}</p>
                    </li>
                </ul>
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
          name: '',
          car_num_ok: false,
          car_num_sended: false,
          car_num_input: '',
          car_owner: '',
          car_name: '',
          car_num: '',
          car_type: '',
          car_year: '',
          car_color: '',
          car_addr:'',
          inviterId:''
        },
        interval: null,
        loading: false,
        car_serial_no: null
      }
    },
    validators: {
      'formData.car_num': function (value) {
        return Validator.value(value).required()
      },
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'currentUser']),
    },
    methods: {
      cancel(){
          this.$router.push('/home')
      },
      nextRegister() {
        this.$router.push('/registerBank')
      },
      saveRunner() {
        this.loading = true
        if (this.formData.sended) {
          alert('저장중입니다.')
          this.loading = false
          return
        }
        else if (!this.formData.car_num_ok ) { //|| !this.formData.account_ok
          alert('차량번호 인증이 필요합니다.')
          this.loading = false
          return
        }
        //else if (this.formData.car_owner != this.formData.account_holder) {
        // else if (this.formData.car_owner.indexOf(this.formData.account_holder) == -1) {
        //   alert('예금주와 차량 소유주가 일치하지 않습니다.')
        //   this.loading = false
        //   return
        // }
        /*else if (this.formData.car_owner.indexOf(this.formData.name) == -1) {
          alert('회원 이름과 자동차 소유주가 일치하지 않습니다.')
          this.loading = false
          return
        }*/
        else {
          this.formData.sended = true
          this.$validate()
            .then(success => {
              if (success) {
                ApiService.post('/front/user/runner/addCar', this.formData
                ).then(res => {
                  // console.log("api user/runner/addCar res data:"+ JSON.stringify(res.data))
                  if (res.data.result == 'ok') {
                    this.$router.push('/registerBank')
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
      checkCarInfo() {
        this.loading = true;
        this.formData.car_num_ok = false
        if (this.formData.car_num_sended) {
          this.loading = false;
          alert('차량번호 조회중입니다.')
          return
        }
        if (this.formData.name == null || this.formData.name.trim() == '') {
          this.loading = false;
          alert('이름을 입력해 주세요.')
          return
        }
        if (this.formData.car_num_input == null || this.formData.car_num_input.trim() == '') {
          this.loading = false;
          alert('차량번호를 입력해 주세요.')
          return
        }
        if (!this.isCarnum(this.formData.car_num_input)) {
          this.loading = false;
          alert('정확한 차량번호를 입력해 주세요.')
          return
        }
        this.formData.car_num_sended = true
        ApiService.post('/front/checkCarInfo', {
          'owner': this.formData.name,
          'cnum': this.formData.car_num_input.replace(/\s/g,'')
        }).then(res => {
          // console.log("api checkCarInfo res data:"+ JSON.stringify(res.data))
          const data = res.data
          if (res.data.result != 'duplicated') {
            if (data.resCd == '0000') {
              if (data.out.outB7001 && data.out.outB7001.list && data.out.outB7001.list.length > 0) {
                let carInfo = null
                for (let i = 0; i < data.out.outB7001.list.length; i++) {
                  if (this.formData.car_num_input.replace(/\s/g,'') == data.out.outB7001.list[i].resCarNo) {
                    carInfo = data.out.outB7001.list[i]
                    break
                  }
                }
                if (carInfo) {
                    console.log(carInfo)
                  var carAddr = carInfo.resGarage.indexOf('세종') > -1 ? carInfo.resGarage.split(' ')[0] : carInfo.resGarage.split(' ')[0]+' '+carInfo.resGarage.split(' ')[1]
                  this.formData.car_num_ok = true
                  this.formData.car_owner = carInfo.resFinalOwner
                  this.formData.car_num = carInfo.resCarNo
                  this.formData.car_name = carInfo.commCarName
                  this.formData.car_type = carInfo.resCarModelType
                  this.formData.car_year = carInfo.resCarYearModel
                  this.formData.car_color = carInfo.resColor
                  this.formData.car_addr = carAddr
                  //this.formData.serial_no = carInfo.resUserIdentiyNo.substr(0,8)
                  this.car_serial_no = carInfo.resUserIdentiyNo.substr(0, 6)
                }
                this.loading = false;
                this.formData.car_num_sended = false
              } else {
                this.formData.car_num_sended = false
                this.loading = false
                alert(data.out.outB7001.errMsg + ' ' + data.out.errMsg)
              }
            } else {
              this.formData.car_num_sended = false
              this.loading = false;
              alert('서비스 점검 중입니다. 곧 조치하겠습니다.')
            }
          } else {
            this.formData.car_num_sended = false
            this.loading = false;
            alert('이미 등록된 차량번호 입니다.')
          }
        }).catch(err => {
          this.formData.car_num_sended = false
          this.loading = false;
          console.log(err)
        })
      },
      checkAgreement() {
        console.log('agreement : ' + this.$store.getters.agreement)
        console.log("runner_id in checkAgreement:"+this.formData.runner_id)
        if(this.formData.runner_id == ''){
        if(this.$route.query.m){
          if(this.$route.query.m == 'Y') alert('회원 정보를 등록해야만 진행이 가능합니다 :)')
        }else{
          if (!this.$store.getters.agreement) this.$router.push({ path: '/agreement' , query:{action: '/registerCar'}})
        } 
        }
      },
      getMypage() {
        ApiService.post('/front/user/runner/info').then(res => {

          if(res.data){
          // this.$store.commit('getAgreement')
          this.$store.commit('backOff')    
          // console.log("api runner id:"+res.data.id)
          this.formData.runner_id = res.data.id
          this.formData.name = res.data.name
          this.formData.car_num_input = res.data.car_num
          this.formData.car_type = res.data.car_type
          this.formData.car_name = res.data.car_name
          this.formData.car_num = res.data.car_num
          this.formData.car_year = res.data.car_year
          this.formData.car_color = res.data.car_color
          this.formData.car_addr = res.data.car_addr
          this.formData.car_num_ok = true
          }
              this.checkAgreement()   
          }).catch(err => {
              console.log(err)
          })
      },
      inviteId(){
        this.$store.commit('getInviteId')
        console.log('inviteId : ' + this.$store.getters.inviteId)
        this.formData.inviterId = this.$store.getters.inviteId
      },
    },
    mounted() {
      if (this.$store.getters.back && this.$store.getters.location != null) {
        this.$store.commit('backOff')
        this.$router.push('/' + this.$store.getters.location)
      }   
      this.getMypage()   
      this.inviteId()
    }
  }
</script>    