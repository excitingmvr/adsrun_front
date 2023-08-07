<template>
  <div class="ar-wrap member-withdrawal">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <div class="member-withdrawal__wrap layout">
        <section class="txt-box">
            <h3>회원<br/>탈퇴하시겠습니까?</h3>
            <p>회원 탈퇴를 신청하시면 시간 이내에 모든<br/>
                정보가 삭제됩니다. 회원 탈퇴가 되면 기존 활동<br/>
                내역과 적립금 등 모든 서비스 이용 정보는 복구가<br/>
                불가능합니다. </p><br/>
            <p>회원탈퇴 후 재 가입 방지를 위해 <br/>
            성명, 전화번호, 이메일을 3개월간 보유합니다.</p>
        </section>
        <div class="btns dbl">
          <button type="button" class="btn grey" @click.prevent="home()">취소</button>
          <button type="button" class="btn colored black" title="확인" @click.prevent="secession()">확인</button>
        </div>
    </div>
  </div>
</template>

<script>
import ApiService from '@/common/api.service'
import HeaderNav from '@/components/common/HeaderNav'
import { LOGOUT } from '@/store/actions.type'

export default {
  components: {
    HeaderNav
  },
  methods: {
    home() {
      this.$router.push('/home')
    },
    secession() {
      console.log('탈퇴')
      if (confirm('탈퇴하시겠습니까?')) {
        ApiService.post('/front/secession').then(res => {
          // console.log('api secession res data :'+JSON.stringify(res.data))
          if (res.data.result == 'ok') {
            alert('정상적으로 탈퇴처리 되었습니다')
            Promise.all([this.$store.dispatch(LOGOUT)]).then(() => {
              //window.location.href = '/home'
              this.$router.push('/home')
            }).catch(e => {
              alert(e)
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }  
}
</script>
