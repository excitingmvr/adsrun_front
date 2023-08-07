<template>
  <div class="ar-wrap record">
    <header-nav/>
    <aside class="top-banner layout">
      <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <div class="record__wrap layout">
        <section class="result-box">
            <span>잔액</span>
            <h4><span class="num">{{balance | comma}}</span><small>원</small></h4>
        </section>
        <section class="result-box cumulation">
            <span>누적금액</span>
            <h4><span class="num">{{accumulate | comma}}</span><small>원</small></h4>
        </section>
        <!-- * 내역 리스트 * -->
        <section class="record-box">
            <h4>내역</h4>
            <ul class="record-list">
                <li v-for="item in records">
                    <span>{{ [item.dt, 'YYYY-MM-DD HH:mm:ss'] | moment('YYYY.MM.DD')}}</span>
                    <p>
                      <small>{{item.title}}</small>
                      <span class="num" v-if="item.amount">{{item.amount | comma}}원</span>
                      <span class="num" v-else-if="item.products">{{item.products}}</span>
                      <small v-if="item.etc=='완료' && item.amount"><br>실입금액</small><span class="num" v-if="item.etc=='완료' && item.amount">{{item.amount - Math.round(item.amount * 0.05) - 500 | comma}}원</span>
                      <small v-if="item.etc=='완료' && item.amount"><br>수수료</small><span class="num" v-if="item.etc=='완료' && item.amount">{{Math.round(item.amount * 0.05) + 500 | comma}}원</span>
                    </p>
                    <mark :class="{active: item.title=='인출'}">{{item.etc}}</mark>
                </li>
            </ul>
        </section>
    </div>
  </div>
</template>

<script>
import ApiService from '@/common/api.service'
import HeaderNav from '@/components/common/HeaderNav'

export default {
  components: {
    HeaderNav
  },  
  data() {
    return {
      apply_cnt: null,
      complete_cnt: null,
      complete_pct: null,
      balance: null,
      accumulate: null,
      latest: null,
      records: []
    }
  },
  methods: {
    getWithdraw() {
      ApiService.post('/front/withdraw').then(res => {
        // console.log('api withdraw res data :'+JSON.stringify(res.data))
        //console.log(res.data)
        this.apply_cnt = res.data.apply_cnt
        this.complete_cnt = res.data.complete_cnt
        this.balance = res.data.balance
        this.accumulate = res.data.accumulate
        let pct = ((this.complete_cnt/this.apply_cnt)*100).toFixed(1)
        this.complete_pct = pct > 100 ? 100 : pct < 0 ? 0 : pct
        this.latest = res.data.latest
      }).catch(err => {
        console.log(err)
      })
    },
    getWithdrawRecords() {
      ApiService.post('/front/withdraw/records').then(res => {
        // console.log('api withdraw/records res data :'+JSON.stringify(res.data))
        this.records = res.data
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted() {
    this.getWithdraw()
    this.getWithdrawRecords()
  }
}
</script>
