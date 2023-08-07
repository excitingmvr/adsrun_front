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
                        광고리워드를 입금받으실 계좌를
                        입력해주세요.
                    </h2>
                </div>
                <div v-if="loading == true" class="ar-popup invite-popup active">
                    <div class="ar-popup__dimmer"></div>
                    <img alt="loading" class="loading" src="/static/images/adsrun-loader.gif"></img>
                </div>
                <section class="register-section">
                    <h4 class="register-sub__title">이름</h4>
                    <div class="input-box full">
                        <input type="text" v-model="formData.name" placeholder="이름 입력"/>
                    </div>
                </section>

                <section class="register-section">
                    <h4 class="register-sub__title">은행</h4>
                    <div class="select-box full">
                        <select v-model="formData.account_bank_input">
                            <option value="0" default hidden selected>은행선택</option>
                            <option v-for="option in bank_options" v-bind:key="option.value" v-bind:value="option.value">
                                {{option.text}}</option>
                        </select>
                    </div>
                </section>

                <section class="register-section">
                    <h4 class="register-sub__title">계좌번호</h4>
                    <div class="input-box full">
                        <input type="number" size="5" placeholder="계좌번호 입력 ('-' 없이)" v-model="formData.account_num_input" />
                    </div>
                </section>
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
                <a href="#" class="btn full colored" @click.prevent="checkBankAccount">계좌조회</a>
                
            </div>
            <footer class="register-ft">
            <button type="button" @click="cancel" class="btn grey">건너뛰기</button>
            <button type="button" @click="saveRunner"  class="btn colored">확인</button>
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
          account_ok: false,
          account_num_sended: false,
          account_num_input: '',
          account_bank_input: 0,
          account_holder: '',
          account_num: '',
          account_bank: '',
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
        interval: null,
        loading: false,
      }
    },
    validators: {
     
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
      saveRunner() {
        this.loading = true
        if (this.formData.sended) {
          alert('저장중입니다.')
          this.loading = false
          return
        }
        else if (!this.formData.account_ok) {
          alert('계좌번호 조회를 해 주세요.')
          this.loading = false
          return
        }
        else {
          this.formData.sended = true
          this.$validate()
            .then(success => {
              if (success) {
                ApiService.post('/front/user/runner/addBank', this.formData
                ).then(res => {
                  // console.log("api user/runner/addBank res data:"+ JSON.stringify(res.data))
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
      checkBankAccount() {
        this.loading = true;
        this.formData.account_ok = false
        console.log("checkBank!")
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
          // console.log("api checkBankAccount res data:"+ JSON.stringify(res.data))
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
                this.formData.account_num_sended = false
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
        if(this.formData.id == ''){
        if(this.$route.query.m){
          if(this.$route.query.m == 'Y') alert('회원 정보를 등록해야만 진행이 가능합니다 :)')
        }else{
          if (!this.$store.getters.agreement) this.$router.push({ path: '/agreement' , query:{action: '/registerBank'}})
        } 
        }
      },
      getMypage() {
      ApiService.post('/front/user/runner/info').then(res => {
        // console.log("api user/runner/info res data:"+ JSON.stringify(res.data))
        if(res.data){
        // this.$store.commit('getAgreement')
        this.$store.commit('backOff')    
        console.log(res.data.account_bank)
        this.formData.name = res.data.name
        this.formData.account_num_input = res.data.account_num == null?'': res.data.account_num
        this.formData.account_num = res.data.account_num == null?'': res.data.account_num
        this.formData.account_holder = res.data.account_holder
        for (let i = 0; i < this.bank_options.length; i++) {
                if (res.data.account_bank == this.bank_options[i].text) {
                this.formData.account_bank = this.bank_options[i].text
                this.formData.account_bank_input = this.bank_options[i].value
                break
                }
            }
        if(this.formData.account_num != ''){    
        this.formData.account_ok = true
        }
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
      this.getMypage()   
    }
  }
</script>      