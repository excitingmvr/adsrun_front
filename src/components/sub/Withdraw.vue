<template>
  <div class="ar-wrap withdrawal">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
      <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <div class="withdrawal__wrap layout">
        <section class="summary-box">
            <div class="summary-wrap">
                <span>참여광고</span>
                <p>{{apply_cnt}}<small>건</small></p>
            </div>
            <hr class="center-bar"/>
            <div class="summary-wrap">
                <span>미션완료</span>
                <p><span class="num">{{complete_cnt}}</span><small>건</small><b> (<span class="num">{{complete_pct}}%</span>)</b></p>
            </div>
        </section>
        <section class="result-box" >
            <span>잔액</span>
            <h4><span class="num">{{balance | comma}}</span><small>원</small></h4><div class="click_box"><i @click.prevent="goWithdrawRecords()"></i></div>
        </section>
        <section class="result-box cumulation">
            <span>누적금액</span>
            <h4><span class="num">{{accumulate | comma}}</span><small>원</small></h4>
        </section>
        <section class="result-box cumulation">
            <span>실입금누적액</span>
            <h4><span class="num">{{total_tax_deduc | comma}}</span><small>원</small></h4>
        </section>
        <!--
        <section class="result-box cumulation">
            <span>세금공제누적액</span>
            <h4><span class="num">{{withdraw_tax_deduc | comma}}</span><small>원</small></h4>
        </section>
        -->
        <div class="input-box full"><input type="number" v-if="v_withdraw" v-model="withdraw_amount" size="5" placeholder="1000원 이상, 100원 단위로 출금 가능합니다"/></div>
        <button v-if="v_withdraw" class="btn colored full" @click.prevent="activeWithdrawPopup()">출금하기</button>
        <section v-if="!v_withdraw" class="result-box request cumulation">
            <span>출금 요청액</span>
            <h4><span class="num">{{prev_withdraw_amount | comma}}</span><small>원</small></h4>
        </section>
        <button v-if="!v_withdraw" class="btn full disabled" disabled>출금 신청중</button>
    </div>

    <!-- * 출금 팝업 * -->
    <div class="ar-popup withdraw-popup">
        <div class="ar-popup__dimmer" @click.prevent="removeWithdrawPopup()"></div>
        <div class="ar-popup__content">
            <div class="popup-body">
                <div class="popup-txt">
                    <h3 class="price">{{confirm_withdraw_amount | comma}}<small>원</small></h3>
                    <p>출금 신청하셨습니다.<br/>출금하시겠습니까?</p><br />
                    <p>수수료 : {{act_tax_deduc | comma}}<small>원</small></p>
                    <p>계좌입금액 : {{act_withdraw_amount | comma}}<small>원</small></p>
                </div>
            </div>
            <footer class="popup-ft">
                <button class="ft-btn no" @click.prevent="removeWithdrawPopup()">아니오</button>
                <button class="ft-btn ok" @click.prevent="requestWithdraw()">네</button>
            </footer>
        </div>
    </div>
  </div>
</template>

<script>
import ApiService from '@/common/api.service'
import HeaderNav from '@/components/common/HeaderNav'
import { mapGetters } from 'vuex'

export default {
  components: {
    HeaderNav
  },
  data() {
    return {
      account_num: '',
      apply_cnt: null,
      complete_cnt: null,
      complete_pct: null,
      balance: null,
      accumulate: null,
      withdraw: null,
      withdraw_tax_deduc: null,
      latest: null,
      v_withdraw: true,
      withdraw_amount: null,
      withdraw_options: [
        { value:'1000', text:'1,000원' },
        { value:'3000', text:'3,000원' },
        { value:'5000', text:'5,000원' },
        { value:'10000', text:'10,000원' },
        { value:'15000', text:'15,000원' },
        { value:'20000', text:'20,000원' },
        { value:'30000', text:'30,000원' }
      ],
      confirm_withdraw_amount: 0,
      prev_withdraw_amount: 0,
      tax_deduc : 0.05
    }
  },
  methods: {
    goWithdrawRecords() {
      this.$router.push('/withdraw/records')
    },
    checkLogs(){
        ApiService.post('/front/log/check',{'type' : 'withdraw'}).then(res => {
            // console.log('api log/check type withdraw res data :'+JSON.stringify(res.data))
            if(res.data.result) this.$store.commit('setIsnew',this.isNew.replaceAll('withdraw,','').replaceAll('withdraw',''))
        })
    },
    /* 출금 팝업 활성화/비활성화 */
    activeWithdrawPopup() {

      if(this.account_num == ''){
        alert('계좌정보를 입력해 주세요')
        this.$router.push('/registerBank')
        return
      }

      if (this.withdraw_amount == null) {
        alert('출금액을 입력해 주세요')
        return
      }
      if(this.withdraw_amount > this.balance) {
        alert('신청금액이 잔액을 초과하였습니다. 신청금액내에서만 출금 가능합니다')
        return
      }
      if (this.latest && this.latest.type == 'R') {
        alert('출금 신청중이므로 요청 할 수 없습니다.')
        return
      }
      this.confirm_withdraw_amount = Number(this.withdraw_amount)
      document.querySelector('.withdraw-popup').classList.add("active")
    },
    removeWithdrawPopup() {
      document.querySelector('.withdraw-popup').classList.remove("active")
    },
    requestWithdraw() {
      ApiService.post('/front/withdraw/add', {
        'amount': this.withdraw_amount
      }).then(res => {
        // console.log('api withdraw/add res data :'+JSON.stringify(res.data))
        if (res.data.result == 'ok') {
          this.getWithdraw()
          alert('출금신청 되었습니다.')
        } else {
          alert(res.data.msg)
        }
        this.removeWithdrawPopup() 
      }).catch(err => {
        console.log(err)
      })
    },
    getWithdraw() {
      ApiService.post('/front/withdraw').then(res => {
        //console.log(res.data)
        // console.log('api withdraw res data :'+JSON.stringify(res.data))
        this.checkLogs()
        this.apply_cnt = res.data.apply_cnt
        this.complete_cnt = res.data.complete_cnt
        this.balance = res.data.balance
        this.withdraw = Number(res.data.withdraw)
        this.withdraw_tax_deduc = Math.round(res.data.withdraw * this.tax_deduc) + 500
        this.accumulate = res.data.accumulate
        //console.log((this.complete_cnt/this.apply_cnt)*100)
        let pct = (this.apply_cnt == 0 || this.complete_cnt == 0 ? 0 : ((this.complete_cnt/this.apply_cnt)*100).toFixed(1))
        this.complete_pct = pct > 100 ? 100 : pct < 0 ? 0 : pct
        this.latest = res.data.latest
        if (this.latest && this.latest.type == 'R') {
          this.prev_withdraw_amount = this.latest.amount
          this.v_withdraw = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getMypage() {
      ApiService.post('/front/user/runner/info').then(res => {
        // console.log('api user/runner/info res data :'+JSON.stringify(res.data))
        if(res.data){
          this.account_num = res.data.account_num == null?'': res.data.account_num
          console.log("this.account_num:"+this.account_num)
        }
            this.checkAgreement()   
        }).catch(err => {
            console.log(err)
        })
        }
  },
  computed: {
    ...mapGetters(['isNew']),
    act_tax_deduc: function(){
      return Math.round(this.confirm_withdraw_amount * this.tax_deduc) + 500
    },
    act_withdraw_amount: function(){
      return this.confirm_withdraw_amount - this.act_tax_deduc
    },
    total_tax_deduc: function(){
      return this.withdraw != null && this.withdraw != 0 ? this.withdraw - this.withdraw_tax_deduc : 0
    }
  },
  mounted() {
    this.getWithdraw()
    this.getMypage()
    this.$store.commit('setLocation','withdraw')
  }  
}
</script>
