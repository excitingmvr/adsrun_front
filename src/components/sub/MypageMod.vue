<template>
  <div class="ar-wrap mypage">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <div class="mypage__wrap layout">
        <div v-if="loading == true" class="ar-popup invite-popup active">
          <div class="ar-popup__dimmer"></div>
          <img alt="loading" class="loading" src="/static/images/adsrun-loader.gif">
        </div>
        <!-- 개인정보 -->
        <section v-if="me" class="mypage-box edit-box">
            <h3>개인정보</h3>
            <ul class="mypage-list">
                <li>
                    <p>이름</p>
                    <input type="text" size="5" :value="me.name" readonly="readonly" style="color:#e4e4e4e4"/>
                </li>
                <li>
                    <p>생년월일/성별</p>
                    <input type="text" size="5" :value="me.serial_no.substr(0,6)+' / '+gender(me.serial_no.substr(6,1))" readonly="readonly" style="color:#e4e4e4e4"/>
                </li>
                <li class="has-btn">
                    <p>전화번호</p>
                    <input type="tel" size="5" :value="mobile(me.phone)" readonly="readonly" />
                    <button type="button" class="btn colored" @click.prevent="open_sms=true">본인인증</button>
                </li>
                <li v-if="open_sms" class="has-btn">
                    <input type="number" style="text-align:left" size="5" placeholder="휴대폰번호 입력 ('-' 없이)" v-model="formData.phone" :readonly="formData.sms_ok" />
                    <button type="button" class="btn colored" @click.prevent="checkPhone">{{formData.sms_btn_msg}}</button>
                </li>
                <li v-if="open_sms && formData.sms_sended" class="has-btn">
                    <input type="number" style="texft-align:left" size="5" :placeholder="formData.sms_remain" v-model="formData.sms_code"/>
                    <button type="button" class="btn colored" @click.prevent="checkSmsCode">인증번호 확인</button>
                </li>
                <li>
                    <p>이메일</p>
                    <input type="email" size="5" :value="me.u_mail" readonly="readonly" style="color:#e4e4e4e4" />
                </li>
                <li>
                    <p>연락처 이메일</p>
                    <input type="email" size="5" :value="me.email" @input="me.email=$event.target.value"/>
                </li>
                <li>
                    <p>주소</p>
                    <input type="text" size="5" :value="me.addr1+' '+me.addr2" readonly="readonly" style="color:#e4e4e4e4" />
                </li>
            </ul>
        </section>

        <!-- 차량정보 -->
        <section v-if="me" class="mypage-box edit-box">
            <h3>차량정보</h3>
            <ul class="mypage-list">
                <li class="has-btn">
                    <p>차량번호</p>
                    <input type="text" size="5" :value="me.car_num" readonly="readonly" />
                    <button type="button" class="btn colored" @click.prevent="open_car=true">차량변경</button>
                </li>
                <li v-if="open_car" class="has-btn">
                    <input type="text" style="text-align:left" size="5" placeholder="차량번호" v-model="formData.car_num_input" />
                    <button type="button" class="btn colored" @click.prevent="checkCarInfo">차량조회</button>
                </li>
                <li>
                    <p>차명</p>
                    <input type="text" size="5" :value="me.car_name" readonly="readonly" />
                </li>
                <li>
                    <p>차종</p>
                    <input type="text" size="5" :value="me.car_type" readonly="readonly" />
                </li>
                <li>
                    <p>년식</p>
                    <input type="text" size="5" :value="me.car_year" readonly="readonly" />
                </li>
                <li>
                    <p>색상</p>
                    <input type="text" size="5" :value="me.car_color" readonly="readonly" />
                </li>
                <li>
                    <p>차량등록지</p>
                    <input type="text" size="5" :value="me.car_addr" readonly="readonly" />
                </li>
            </ul>
        </section>

        <!-- 계좌정보 -->
        <section v-if="me" class="mypage-box edit-box">
            <h3>계좌정보</h3>
            <ul class="mypage-list">
                <li>
                    <p>은행</p>
                    <input type="text" size="5" :value="me.account_bank" readonly="readonly" />
                </li>
                <li>
                    <p>예금주</p>
                    <input type="text" size="5" :value="me.account_holder" readonly="readonly" />
                </li>
                <li class="has-btn">
                    <p>계좌번호</p>
                    <input type="text" size="5" :value="me.account_num" readonly="readonly" />
                    <button type="button" class="btn colored" @click.prevent="open_account=true">계좌인증</button>
                </li>
                <li v-if="open_account">
                    <p></p>
                    <select v-model="formData.account_bank_input" style="text-align:right">
                        <option value="0" default hidden selected>은행선택</option>
                        <option v-for="option in bank_options" v-bind:key="option.value" v-bind:value="option.value">{{option.text}}</option>
                    </select>
                </li>
                <li v-if="open_account" class="has-btn">
                    <!-- <input type="number" style="text-align:left" size="5" placeholder="계좌번호 입력 ('-' 없이)" v-model="formData.account_num_input" :readonly="formData.account_ok" /> -->
                    <input type="number" style="text-align:left" size="5" placeholder="계좌번호 입력 ('-' 없이)" v-model="formData.account_num_input" />
                    <button type="button" class="btn colored" @click.prevent="checkBankAccount">계좌 조회</button>
                </li>
            </ul>
        </section>

        <!-- 주소 -->
        <section v-if="me" class="mypage-box edit-box">
            <h3>주요 이동 경로</h3>
            <ul class="mypage-list">
                <li>
                    <p>주거지</p>
                    <input type="text" size="5" :value="me.addr1+' '+me.addr2" readonly="readonly" />
                </li>
                <li class="has-btn">
                    <p></p>
                    <button type="button" class="btn colored" @click.prevent="open_addr1=true">주거지 주소변경</button>
                </li>
                <li v-if="open_addr1" class="has-btn">
                    <input type="text" style="text-align:left" size="5" placeholder="우편번호" readonly="readonly" v-model="formData.zipcode"/>
                    <button class="btn colored" @click.prevent="searchDaumPost('H')">주소검색</button>
                </li>
                <li v-if="open_addr1">
                    <input type="text" style="text-align:left" size="5" placeholder="주소" readonly="readonly" v-model="formData.addr1"/>
                </li>
                <li v-if="open_addr1">
                    <input type="text" style="text-align:left" size="5" placeholder="상세주소 입력" v-model="formData.addr2"/>
                </li>
                <li>
                    <p>직장</p>
                    <input type="text" size="5" :value="me.c_addr" readonly="readonly" />
                </li>
                <li class="has-btn">
                    <p></p>
                    <button type="button" class="btn colored" @click.prevent="open_addr2=true">직장 주소변경</button>
                </li>
                <li v-if="open_addr2" class="has-btn">
                    <input type="text" style="text-align:left" size="5" placeholder="우편번호" readonly="readonly" v-model="formData.c_zipcode"/>
                    <button class="btn colored" @click.prevent="searchDaumPost('C')">주소검색</button>
                </li>
                <li v-if="open_addr2">
                    <input type="text" style="text-align:left" size="5" placeholder="주소" readonly="readonly" v-model="formData.c_addr"/>
                </li>
            </ul>
        </section>
        <div class="btns dbl">
          <router-link to="/mypage" class="btn grey" title="취소">취소</router-link>
          <button type="button" class="btn colored black" title="확인" @click.prevent="saveRunner">확인</button>
        </div>
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
  data() {
    return {
      me: null,
      open_sms: false,
      open_car: false,
      open_account: false,
      open_addr1: false,
      open_addr2: false,
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
        account_ok: false,
        account_num_sended: false,
        account_num_input: '',
        account_bank_input: 0,
        account_holder: '',
        account_num: '',
        account_bank: '',
        c_zipcode: '',
        c_addr: '',
        car_addr:''
      },
      bank_options: [
        { text:'산업은행', value:'002'},
        { text:'기업은행', value:'003'},
        { text:'국민은행', value:'004'},
        { text:'수협중앙회', value:'007'},
        { text:'농협', value:'011'},
        { text:'우리은행', value:'020'},
        { text:'SC은행', value:'023'},
        { text:'한국씨티은행', value:'027'},
        { text:'대구은행', value:'031'},
        { text:'부산은행', value:'032'},
        { text:'광주은행', value:'034'},
        { text:'제주은행', value:'035'},
        { text:'전북은행', value:'037'},
        { text:'경남은행', value:'039'},
        { text:'새마을금고중앙회', value:'045'},
        { text:'신협중앙회', value:'048'},
        { text:'BOA은행', value:'060'},
        { text:'우체국', value:'071'},
        { text:'하나은행', value:'081'},
        { text:'신한은행', value:'088'},
        { text:'케이뱅크', value:'089'},
        { text:'카카오은행', value:'090'},
        { text:'유안타증권', value:'209'},
        { text:'미래대우증권', value:'238'},
        { text:'삼성증권', value:'240'},
        { text:'NH투자증권', value:'247'},
        { text:'키움증권', value:'264'},
        { text:'대신증권', value:'267'},
        { text:'한화투자증권', value:'269'},
        { text:'신한금융투자', value:'278'},
        { text:'유진투자증권', value:'280'},
        { text:'메리츠증권', value:'287'}
      ],
      postcode: '',
      address: '',
      interval: null,
      car_serial_no: null,
      loading: false
    }
  },
  computed: {
    isEmail : function(){
      var regExp =  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
      var result = false
      this.me.email = this.me.email.trim()
      if(regExp.test(this.me.email)) result = true
      return result
    }
  },
  methods: {
    gender(num) {
      return (num % 2) == 1 ? '남' : '여'
    },
    mobile(num) {
      let ret = ''
      if (num.length == 11) {
        ret = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
      } else if (num.length == 8) {
        ret = num.replace(/(\d{4})(\d{4})/, '$1-$2')
      } else {
        ret = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
      }
      return ret
    },
    getMypage() {
      ApiService.post('/front/user/runner/info').then(res => {
        // console.log('api user/runner/info res data :'+JSON.stringify(res.data))
        if (res.data && res.data['phone']) {
          this.me = res.data
        } else {
          this.$router.push('/register')
        }
      }).catch(err => {
        console.log(err)
      })
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
              if (rt == 'C') {
                this.formData.c_zipcode = this.postcode
                this.formData.c_addr = this.address
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
      console.log('isEmail',this.isEmail);
      if (this.formData.sended) {
        alert('저장중입니다.')
        return
      }
      /**/
      // else if ((this.formData.car_owner != '' && this.formData.car_owner != null) || (this.formData.account_holder != '' && this.formData.account_holder != null)) {
      //   var car_owner = this.formData.car_owner != '' && this.formData.car_owner != null ? this.formData.car_owner : this.me.name,
      //       account_holder = this.formData.account_holder != '' && this.formData.account_holder != null ? this.formData.account_holder : this.me.account_holder
        
      //   if(car_owner.indexOf(account_holder) == -1){
      //     alert('예금주와 차량 소유주가 일치하지 않습니다.')
      //     this.loading = false
      //     return
      //   } 
      // }
      else if (this.formData.car_owner != '' && this.formData.car_owner != null && this.formData.car_owner.indexOf(this.me.name) == -1 ) {
        alert('회원 이름과 자동차 소유주가 일치하지 않습니다.')
        this.loading = false
        return
      }
      else if (this.formData.phone != '' && this.formData.phone != null && !this.isMobile(this.formData.phone)) {
        alert('정확한 휴대폰번호를 입력해 주세요.')
        this.loading = false
        return
      }
      /**/
      // else if (this.car_serial_no != null && this.car_serial_no != this.me.serial_no.substr(0,6)) {
      //   alert('자동차 등록증의 주민번호와 입력한 주민번호가 일치하지 않습니다.')
      //   this.loading = false
      //   return
      // }
      else if (this.me.email != null && this.me.email != '' && !this.isEmail){
        alert('이메일 형식이 아닙니다.')
        this.loading = false
        return
      }
      
      this.formData.sended = true
      this.formData.email = this.me.email
      ApiService.post('/front/user/runner/mod', this.formData
      ).then(res => {
        // console.log('api user/runner/mod res data :'+JSON.stringify(res.data))
        if (res.data.result == 'ok') {
          alert('저장되었습니다.')
          this.loading = false
          this.$router.push('/mypage')
        }
        if (res.data.result == 'error') {
          alert('저장에 실패하였습니다.')
          this.loading = false
        }
        this.formData.sended = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    isMobile(phoneNum) { 
      var regExp =/(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/; 
      var myArray; 
      if(regExp.test(phoneNum)){ 
        myArray = regExp.exec(phoneNum); 
        return true;
      } else {
        return false;
      }
    },
    checkPhone() {
      this.loading = true
      if (this.formData.sms_ok) {
        alert('인증번호 확인되었습니다.')
        this.loading = false
        return
      }
      if (this.formData.sms_sended) {
        alert('인증번호가 전송되었습니다.')
        this.loading = false
        return
      }
      this.formData.phone = this.formData.phone.replace(/['-','e']/,'')
      console.log('input:',this.formData.phone)
      if (this.formData.phone.trim() == '') {
        alert('휴대폰번호를 입력해 주세요.')
        this.loading = false
        return
      }
      if (this.formData.phone.length == 0 || this.formData.phone.length < 10 || this.formData.phone.length > 11) {
        alert('정확한 휴대폰번호를 입력해 주세요.')
        this.loading = false
        return
      }
      if (!this.isMobile(this.formData.phone)) {
        alert('정확한 휴대폰번호를 입력해 주세요.')
        this.loading = false
        return
      }
      this.formData.sms_sended = true
      ApiService.post('/front/getVerifyNumber', {
        'phone': this.formData.phone
      }).then(res => {
        // console.log('api getVerifyNumber res data :'+JSON.stringify(res.data))
        if (res.data.result == 'ok') {
          this.formData.sms_deadline = moment().add(3, 'minute').format('YYYY-MM-DD HH:mm:ss')
          this.countdownSms()
          this.formData.sms_confirm = res.data.message
          this.loading = false
        // }else if(res.data.result == 'failed'){
        //   this.formData.sms_sended = false
        //   alert('이미 등록된 휴대폰번호입니다.')
        //   this.loading = false
        }else{
          this.formData.sms_sended = true
          alert('휴대폰인증에 실패하였습니다. 관리자에게 문의하세요.')
          this.loading = false
        }
      }).catch(err => {
        console.log(err)
        this.loading = false
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
      },1000);
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
      if(regExp.test(carNum)){ 
        myArray = regExp.exec(carNum); 
        return true;
      } else {
        return false;
      }
    },
    checkCarInfo() {
      this.loading = true
      /*
      if (this.formData.car_num_ok) {
        alert('차량번호가 확인되었습니다.')
        this.loading = false
        return
      }
      */
      /*
      if (this.formData.car_num_sended) {
        alert('차량번호 조회중입니다.')
        this.loading = false
        return
      }
      */
      if (this.formData.car_num_input.trim() == '') {
        alert('차량번호를 입력해 주세요.')
        this.loading = false
        return
      }
      if (!this.isCarnum(this.formData.car_num_input)) {
        alert('정확한 차량번호를 입력해 주세요.')
        this.loading = false
        return
      }
      this.formData.car_num_sended = true
      ApiService.post('/front/checkCarInfo', {
        'owner': this.me.name,
        'cnum': this.formData.car_num_input.replace(/\s/g,'')
      }).then(res => {
        // console.log('api checkCarInfo res data :'+JSON.stringify(res.data))
        const data = res.data
        if (data.resCd == '0000') {
          console.log("the same!1")
          if (data.out.outB7001 && data.out.outB7001.list && data.out.outB7001.list.length > 0) {
            console.log("the same!2")
            let carInfo = null
            for (let i = 0; i < data.out.outB7001.list.length; i++) {
              if (this.formData.car_num_input.replace(/\s/g,'') == data.out.outB7001.list[i].resCarNo) {
                console.log("the same!3")
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
              this.car_serial_no = carInfo.resUserIdentiyNo.substr(0,6)

              this.me.car_name = this.formData.car_name
              this.me.car_num = this.formData.car_num
              this.me.car_type = this.formData.car_type
              this.me.car_year = this.formData.car_year
              this.me.car_color = this.formData.car_color
              this.loading = false
            }else{
              this.loading = false
            }
          } else if(data.out.outB7001 && data.out.outB7001.errYn == 'Y'){
            alert(data.out.outB7001.errMsg + ' ' + data.out.errMsg)
            this.loading = false
            this.formData.car_num_sended = false
          }
        } else {
          this.formData.car_num_sended = false
          if(data.result == 'infotech_error'){
            alert('서비스 점검 중입니다. 곧 조치하겠습니다.')
          }else if(data.result == 'duplicated'){
            alert('이미 등록된 차량번호입니다.')
          }
          this.loading = false
        }
      }).catch(err => {
        this.formData.car_num_sended = false
        console.log(err)
        this.loading = false
      })
    },
    checkBankAccount() {
      this.loading = true
      /*
      if (this.formData.account_ok) {
        alert('계좌번호가 확인되었습니다.')
        this.loading = false
        return
      }
      */
      if (this.formData.account_num_sended) {
        alert('계좌번호 조회중입니다.')
        this.loading = false
        return
      }
      if (this.formData.account_bank_input == '0') {
        alert('은행을 선택해 주세요.')
        this.loading = false
        return
      }
      if (this.formData.account_num_input.trim() == '') {
        alert('계좌번호를 입력해 주세요.')
        this.loading = false
        return
      }
      this.formData.account_num_sended = true
      ApiService.post('/front/checkBankAccount', {
        'bank': this.formData.account_bank_input,
        'anum': this.formData.account_num_input
      }).then(res => {
        // console.log('api checkBankAccount res data :'+JSON.stringify(res.data))
        const data = res.data
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
            this.loading = false
          } else if(data.out.outB6400 && data.out.outB6400.errYn == 'Y'){
            alert('계좌조회를 실패하였습니다.' + data.out.outB6400.errMsg + ' ' + data.out.errMsg)
            this.formData.account_num_sended = false
            this.loading = false
          }
        } else {
          this.formData.account_num_sended = false
          if(data.result == 'error'){
            alert('계좌조회를 실패하였습니다. 관리자에게 문의하세요.')
          }else if(data.result == 'duplicated'){
            alert('이미 등록된 계좌번호입니다.')
          }
          this.loading = false
        }
      }).catch(err => {
        this.formData.account_num_sended = false
        console.log(err)
        this.loading = false
      })
    }
  },
  mounted() {
    this.getMypage()
  }
}
</script>
