<template>
  <div class="ar-wrap member-withdrawal">
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <div class="member-withdrawal__wrap layout">
        <section class="txt-box">
            <h3>탈퇴한 회원정보입니다.</h3>
            
            <p>회원탈퇴 후 재 가입 방지를 위해 <br/>
            성명, 전화번호, 이메일을 3개월간 보유합니다.</p>
            <p>{{sign_date}} 이후 다시 회원가입이 가능합니다. </p><br/>
        </section>
        <div class="btns">
          <button type="button" class="btn colored black" title="확인" @click.prevent="home()" style="flex: 0 0 100%;">확인</button>
        </div>
    </div>
  </div>
</template>

<script>
import ApiService from '@/common/api.service'
import HeaderNav from '@/components/common/HeaderNav'
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      sign_date : null
    }
  },
  components: {
    HeaderNav
  },
  computed: {
    ...mapGetters(['invalidUser'])
  },
  methods: {
    getDates() {
      console.log('this.$route.params.user_id:'+this.$route.params.user_id)
      ApiService.post('/front/user/secessionDate', {
            'user_id': this.$route.params.user_id
          }).then(res => {
            // console.log("api user/secessionDate res data:"+ JSON.stringify(res.data))
        if (res.data) {
          var date_times = moment(res.data.re_date, 'YYYY-MM-DD HH:mm:ss')
          console.log(res.data.re_date)
          this.sign_date =  date_times.format('YYYY') +'년 '+date_times.format('M')+'월 '+date_times.format('D')+'일'	
        }
      })
    },
    home() {
      this.$router.push({ path: '/login' })
    }
  },
  mounted() {
    this.getDates()
  } 
}
</script>
