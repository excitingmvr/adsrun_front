<template>
  <div class="ar-wrap register grey">
    <header class="header">
      <h1 class="hd-logo">
        <img src="/static/images/adsrun-bl.png" alt="Ads-Run" class="adsrun-logo" />
      </h1>
    </header>

    <div class="register-form__wrap layout">
      <div v-if="loading == true" class="ar-popup invite-popup active">
        <div class="ar-popup__dimmer"></div>
        <img alt="loading" class="loading" src="/static/images/adsrun-loader.gif"></img>
      </div>
      <!-- * 가입정보 * -->
      <section class="register-section">
        <h3>가입정보</h3>
        <form>
          <div class="input-box full">
            <input type="text" size="5" placeholder="자동차등록증의 소유자 성명 입력" v-model="formData.name" maxlength="20" />
          </div>
          <div class="ar-popup ads-popup" id="car_owner_input_popup">
            <div class="ar-popup__dimmer" @click.prevent="hideCarNameInputInfo"></div>
            <div class="ar-popup__content">
              <div class="popup-body">
                <div class="popup-txt">
                  <h3>공동명의시 성명 입력 예시</h3>
                  <table style="width:100%;border: 1px solid lightslategray; border-collapse: collapse;">
                    <tbody>
                      <tr>
                        <th style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px;">등록증 소유자 성명란</th>
                        <th style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">입력해야할 값</th>
                      </tr>
                      <tr>
                        <td style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">이수일(60%),˹심순애(40%)˼</td>
                        <td style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">이수일</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">이수일외1인(심순애)</td>
                        <td style="border: 1px solid lightslategray; border-collapse: collapse; font-size:11px">이수일외1인(심순애)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
              <footer class="popup-ft">
                <!--<button class="ft-btn no" @click.prevent="hideCarNameInputInfo">취소</button>-->
                <button class="ft-btn ok" @click.prevent="hideCarNameInputInfo">확인</button>
              </footer>
            </div>
          </div>
          <div class="input-box">
            <input type="button" value="자동차 공동명의시 소유자 성명 입력 안내"
              style="background-color: lightgray; font-size: 11px; color: lightslategray;"
              @click.prevent="showCarNameInputInfo">
          </div>
          <div class="input-box">
            <input type="number" size="6" maxlength="6" placeholder="주민번호 앞 6자리" ref="serial_1" v-model="serial_1"
              @keyup.prevent="checkSerial_1" />
            <span style="flex: 1;display:flex;">
              <input type="number" placeholder="*" ref="serial_2" size="5" maxlength="1" v-model="serial_2"
                @keyup.prevent="checkSerial_2" style="width:10%;" />
              <input type="text" value=" * * * * * * " disabled
                style="width:70%;background-color:#f2f2f2;text-align:center;flex-grow:3;" />
            </span>
            <!-- <button type="button" class="btn colored" @click.prevent="checkSeries">조회</button> -->
          </div>
          <div class="input-box">
            <input type="text" size="6" placeholder="연락처 이메일주소" v-model="formData.email" />
          </div>
          <div class="input-box">
            <input type="number" size="5" placeholder="휴대폰번호 입력 ('-' 없이)" v-model="formData.phone"
              :readonly="formData.sms_ok" />
            <button type="button" class="btn colored" @click.prevent="checkPhone">{{formData.sms_btn_msg}}</button>
          </div>
          <div v-if="formData.sms_sended" class="input-box">
            <input type="number" size="5" :placeholder="formData.sms_remain" v-model="formData.sms_code" />
            <button type="button" class="btn colored" @click.prevent="checkSmsCode">인증번호 확인</button>
          </div>
          <div class="input-box">
            <input type="text" size="5" placeholder="차량번호" v-model="formData.car_num_input" />
            <button type="button" class="btn colored" @click.prevent="checkCarInfo">차량조회</button>
          </div>

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
          <div class="select-box full">
            <select v-model="formData.account_bank_input">
              <option value="0" default hidden selected>은행선택</option>
              <option v-for="option in bank_options" v-bind:key="option.value" v-bind:value="option.value">
                {{option.text}}</option>
            </select>
          </div>
          <div class="input-box">
            <!-- <input type="number" size="5" placeholder="계좌번호 입력 ('-' 없이)" v-model="formData.account_num_input" :readonly="formData.account_ok" /> -->
            <input type="number" size="5" placeholder="계좌번호 입력 ('-' 없이)" v-model="formData.account_num_input" />
            <button type="button" class="btn colored" @click.prevent="checkBankAccount">계좌 조회</button>
          </div>

          <!-- 은행 조회 리스트 -->
          <ul class="search-list">
            <li>
              <p>은행명</p>
              <p>{{formData.account_bank}}</p>
            </li>
            <li>
              <p>계좌번호</p>
              <p>{{formData.account_num}}</p>
            </li>
            <li>
              <p>계좌주</p>
              <p>{{formData.account_holder}}</p>
            </li>
          </ul>
        </form>
      </section>

      <!-- * 주요 이동 경로 * -->
      <section class="register-section">
        <h3>주요 이동 경로</h3>
        <!-- 주거지(배송지) -->
        <form>
          <div class="addr-title">
            <h4>1. 주거지(배송지)</h4>
            <button class="btn colored" @click.prevent="searchDaumPost('H')">주소검색</button>
          </div>
          <div class="input-box full">
            <input type="text" size="5" placeholder="우편번호" readonly="readonly" v-model="formData.zipcode" />
          </div>
          <div class="input-box full">
            <input type="text" size="5" placeholder="주소" readonly="readonly" v-model="formData.addr1" />
          </div>
          <div class="input-box full">
            <input type="text" size="5" placeholder="상세주소 입력" v-model="formData.addr2" />
          </div>
        </form>
        <!-- 직장 -->
        <form style="margin-bottom: 2rem;">
          <div class="addr-title">
            <h4>2. 직장</h4>
            <button class="btn colored" @click.prevent="searchDaumPost('C')">주소검색</button>
          </div>
          <div class="input-box full">
            <input type="text" size="5" placeholder="우편번호" readonly="readonly" v-model="formData.c_zipcode" />
          </div>
          <div class="input-box full">
            <input type="text" size="5" placeholder="주소" readonly="readonly" v-model="formData.c_addr" />
          </div>
        </form>
        <button type="button" class="btn half" @click.prevent="cancel">취소</button>
        <button type="button" class="btn half colored" @click.prevent="saveRunner">확인</button>
      </section>
    </div>
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
          car_num_ok: false,
          car_num_sended: false,
          car_num_input: '',
          car_owner: '',
          car_name: '',
          car_num: '',
          car_type: '',
          car_year: '',
          car_color: '',
          serial_no: '',
          serial_no_ok: false,
          account_ok: false,
          account_num_sended: false,
          account_num_input: '',
          account_bank_input: 0,
          account_holder: '',
          account_num: '',
          account_bank: '',
          c_zipcode: '',
          c_addr: '',
          email: '',
          car_addr:'',
          inviterId:''
        },
        bank_options: [
          { text: '산업은행', value: '002' },
          { text: '기업은행', value: '003' },
          { text: '국민은행', value: '004' },
          { text: '수협중앙회', value: '007' },
          { text: '농협', value: '011' },
          { text: '우리은행', value: '020' },
          { text: 'SC은행', value: '023' },
          { text: '한국씨티은행', value: '027' },
          { text: '대구은행', value: '031' },
          { text: '부산은행', value: '032' },
          { text: '광주은행', value: '034' },
          { text: '제주은행', value: '035' },
          { text: '전북은행', value: '037' },
          { text: '경남은행', value: '039' },
          { text: '새마을금고중앙회', value: '045' },
          { text: '신협중앙회', value: '048' },
          { text: 'BOA은행', value: '060' },
          { text: '우체국', value: '071' },
          { text: '하나은행', value: '081' },
          { text: '신한은행', value: '088' },
          { text: '케이뱅크', value: '089' },
          { text: '카카오은행', value: '090' },
          { text: '유안타증권', value: '209' },
          { text: '미래대우증권', value: '238' },
          { text: '삼성증권', value: '240' },
          { text: 'NH투자증권', value: '247' },
          { text: '키움증권', value: '264' },
          { text: '대신증권', value: '267' },
          { text: '한화투자증권', value: '269' },
          { text: '신한금융투자', value: '278' },
          { text: '유진투자증권', value: '280' },
          { text: '메리츠증권', value: '287' }
        ],
        postcode: '',
        address: '',
        interval: null,
        loading: false,
        serial_1: '',
        serial_2: '',
        car_serial_no: null
      }
    },
    validators: {
      'formData.phone': function (value) {
        return Validator.value(value).required()
      },
      'formData.car_num': function (value) {
        return Validator.value(value).required()
      },
      // 'formData.account_num': function (value) {
      //   return Validator.value(value).required()
      // },
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
        /*
        var arrNum1 = new Array();
        var arrNum2 = new Array();
        for (var i=0; i<this.serial_1.length; i++) {
          arrNum1[i] = this.serial_1.charAt(i);
        }
        for (var i=0; i<this.serial_2.length; i++) {
          arrNum2[i] = this.serial_2.charAt(i);
        }
        var tempSum=0;
        for (var i=0; i<this.serial_1.length; i++) {
          tempSum += arrNum1[i] * (2+i);
        }
        for (var i=0; i<this.serial_2.length-1; i++) {
          if(i>=2) {
              tempSum += arrNum2[i] * i;
          }
          else {
              tempSum += arrNum2[i] * (8+i);
          }
        }
        if((11-(tempSum%11))%10!=arrNum2[6]) {
          alert("올바른 주민번호가 아닙니다.");
          this.serial_1 = "";
          this.serial_2 = "";
          this.$refs.serial_1.focus()
          return false;
        }else{
          this.formData.serial_no = this.serial_1 + this.serial_2
        }
        */
      },
      checkSeries() {
        if (this.formData.serial_no == '') {
          alert("주민번호를 입력해주세요.")
        } else {
          this.loading = true
          ApiService.post('/front/checkSerialNumber', { 'serial_no': this.formData.serial_no }
          ).then(res => {
            console.log(res)
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
            if (rt == 'C') {
              this.formData.c_zipcode = this.postcode
              this.formData.c_addr = this.address
            }
          },
        }).open();
      },
      saveRunner() {
        this.loading = true
        if (this.formData.sended) {
          alert('저장중입니다.')
          this.loading = false
          return
        }
        else if (this.formData.serial_no == '') {
          alert('주민등록번호를 입력해주세요.')
          this.loading = false
          return
        }
        /*
        else if(!this.formData.serial_no_ok){
          alert('주민등록번호 인증이 필요합니다.')
          this.loading = false
          return
        }*/
        else if (this.formData.email != null && !this.isEmail) {
          alert('이메일 형식이 아닙니다.')
          this.loading = false
          return
        }
        else if (!this.formData.sms_ok || !this.formData.car_num_ok ) { //|| !this.formData.account_ok
          alert('휴대폰,차량번호 인증이 필요합니다.')
          this.loading = false
          return
        }
        //else if (this.formData.car_owner != this.formData.account_holder) {
        // else if (this.formData.car_owner.indexOf(this.formData.account_holder) == -1) {
        //   alert('예금주와 차량 소유주가 일치하지 않습니다.')
        //   this.loading = false
        //   return
        // }
        else if (this.formData.car_owner.indexOf(this.formData.name) == -1) {
          alert('회원 이름과 자동차 소유주가 일치하지 않습니다.')
          this.loading = false
          return
        }
        // else if (this.formData.account_holder != this.formData.name) {
        //   alert('회원 이름과 예금주가 일치하지 않습니다.')
        //   this.loading = false
        //   return
        // }
        // else if (Number(this.car_serial_no) != this.serial_1) {
        //   alert('자동차 등록증의 주민번호와 입력한 주민번호가 일치하지 않습니다.')
        //   this.loading = false
        //   return
        // }
        else if (this.formData.zipcode == '' || this.formData.c_zipcode == '') {
          alert('주요이동경로를 입력해 주세요.')
          this.loading = false
          return
        }
        else {
          this.formData.sended = true
          this.$validate()
            .then(success => {
              if (success) {
                ApiService.post('/front/user/runner/add', this.formData
                ).then(res => {
                  // console.log("api user/runner/add res data:"+ JSON.stringify(res.data))
                  if (res.data.result == 'ok') {
                    this.$router.push('/home')
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
      checkPhone() {
        this.loading = true;
        if (this.formData.sms_ok) {
          alert('인증번호 확인되었습니다.')
          this.loading = false;
          return
        }
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
      checkCarInfo() {
        this.loading = true;
        /*
        if (this.formData.car_num_ok) {
          alert('차량번호가 확인되었습니다.')
          this.loading = false;
          return
        }
        */
        /*
        if (this.formData.car_num_sended) {
          this.loading = false;
          alert('차량번호 조회중입니다.')
          return
        }
        */
        if (this.formData.name.trim() == '') {
          this.loading = false;
          alert('이름을 입력해 주세요.')
          return
        }
        if (this.formData.car_num_input.trim() == '') {
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
          console.log(res.data)
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
      checkBankAccount() {
        this.loading = true;
        /*
        if (this.formData.account_ok) {
          this.loading = false;
          alert('계좌번호가 확인되었습니다.')
          return
        }
        */
        if (this.formData.account_num_sended) {
          this.loading = false;
          alert('계좌번호 조회중입니다.')
          return
        }
        if (this.formData.account_bank_input == '0') {
          this.loading = false;
          alert('은행을 선택해 주세요.')
          return
        }
        if (this.formData.account_num_input.trim() == '') {
          this.loading = false;
          alert('계좌번호를 입력해 주세요.')
          return
        }
        this.formData.account_num_sended = true
        ApiService.post('/front/checkBankAccount', {
          'bank': this.formData.account_bank_input,
          'anum': this.formData.account_num_input
        }).then(res => {
          console.log(res.data)
          const data = res.data
          if (res.data.result != 'duplicated') {
            if (data.resCd == '0000') {
              if (data.out.outB6400 && data.out.outB6400.errYn == 'N') {
                this.formData.account_holder = data.out.outB6400.name
                this.formData.account_num = this.formData.account_num_input
                for (let i = 0; i < this.bank_options.length; i++) {
                  if (this.formData.account_bank_input == this.bank_options[i].value) {
                    this.formData.account_bank = this.bank_options[i].text
                    break
                  }
                }
                this.formData.account_ok = true
                this.loading = false;
              } else if (data.out.outB6400.errYn == 'Y') {
                this.formData.account_num_sended = false
                this.loading = false;
                alert('계좌조회를 실패하였습니다.' + data.out.outB6400.errMsg + ' ' + data.out.errMsg)
              } else {
                this.formData.account_num_sended = false
                this.loading = false;
                alert('계좌조회를 실패하였습니다. 관리자에게 문의하세요.')
              }
            } else {
              this.formData.account_num_sended = false
              this.loading = false;
              alert('계좌조회를 실패하였습니다. 관리자에게 문의하세요.')
            }
          } else {
            this.formData.account_num_sended = false
            this.loading = false;
            alert('이미 등록된 계좌번호 입니다.')
          }
        }).catch(err => {
          this.formData.account_num_sended = false
          this.loading = false;
          console.log(err)
        })
      },
      checkAgreement() {
        console.log('agreement : ' + this.$store.getters.agreement)
        if(this.$route.query.m) {
          if(this.$route.query.m == 'Y') alert('회원 정보를 등록해야만 진행이 가능합니다 :)')
        } else {
          if (!this.$store.getters.agreement) this.$router.push({ path: '/agreement' , query:{action: '/register'}})
        } 
      },
      inviteId(){
        this.$store.commit('getInviteId')
        console.log('inviteId : ' + this.$store.getters.inviteId)
        this.formData.inviterId = this.$store.getters.inviteId
      }
    },
    mounted() {
      this.inviteId() 
      this.checkAgreement()
      if (this.$store.getters.back && this.$store.getters.location != null) {
        this.$store.commit('backOff')
        this.$router.push('/' + this.$store.getters.location)
      }     
    }
  }
</script>
