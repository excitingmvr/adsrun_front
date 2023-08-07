<template>
  <div class="ar-wrap inquiry">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <!-- 문의하기 Form -->
    <div class="inquiry__wrap layout">
      <!--
        <div class="input-box align-center">
            <label class="input-label" for="recipient">받는 사람</label>
            <input type="email" size="5" id="recipient" placeholder="Admin@adsrun.co.kr"/>
        </div>
      -->
        <div class="input-box align-center">
            <label class="input-label" for="corp_name">회사명</label>
            <input type="text" size="5" id="corp_name" v-model="corpname" maxlength="128" placeholder=""/>
        </div>
        <div class="input-box align-center">
            <label class="input-label" for="corp_num">사업자번호</label>
            <input type="text"  size="5" id="corp_num" v-model="corpnum" maxlength="20" placeholder="-를 제외하고 입력해주세요." oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"/>
        </div>
        <div class="input-box align-center">
            <label class="input-label" for="sender">이메일</label>
            <input type="email" size="5" id="sender" v-model="from_email" maxlength="128" placeholder="회신받을 이메일을 입력해주세요"/>
        </div>
        <div class="input-box align-center">
            <label class="input-label" for="adTitle">제목</label>
            <input type="text" size="5" id="adTitle" v-model="title" maxlength="256" placeholder=""/>
        </div>
        <div class="textarea-box">
            <label class="textarea-label" for="questions">문의사항</label>
            <textarea id="questions" v-model="contents" placeholder="문의사항 내용을 기재해주세요."></textarea>
        </div>
        <div class="input-box align-center" style="margin-bottom:2rem;">
            <label class="input-label" for="phone">전화번호</label>
            <input type="text"  size="5" id="phone" v-model="from_tel" maxlength="20" placeholder="-를 제외하고 입력해주세요." oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"/>
        </div>
        <div class="btns dbl">
            <button class="btn grey" title="취소" @click.prevent="close()">취소</button>
            <button type="submit" class="btn colored black" title="보내기" @click.prevent="request()">보내기</button>
        </div>
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
      corpname: '',
      corpnum: '',
      from_email: '',
      from_tel: '',
      title: '',
      contents: '',
    }
  },
  methods: {
    close(){
      this.$router.push('/login')
    },
    reset() {
      this.corpname = ''
      this.corpnum = ''
      this.from_email = ''
      this.from_tel = ''
      this.title = ''
      this.contents = ''
    },
     validEmail: function(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      alert('정확한 이메일을 입력해 주세요')
        return
    },
    request() {
      if (this.corpname.trim() == '') {
        alert('회사명을 입력해 주세요')
        return
      }
      if (this.corpnum.trim() == '') {
        alert('사업자번호를 입력해 주세요')
        return
      }
      if (this.from_email.trim() == '') {
        alert('이메일을 입력해 주세요')
        return
      }
      var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      if (!regExp.test(this.from_email)) {
        alert('정확한 이메일을 입력해 주세요')
        return
      }
      if (this.title.trim() == '') {
        alert('제목을 입력해 주세요')
        return
      }
      if (this.contents.trim() == '') {
        alert('문의사항을 입력해 주세요')
        return
      }
      if (this.from_tel.trim() == '') {
        alert('전화번호를 입력해 주세요')
        return
      }
      ApiService.post('/front/boards/question_spon/add', {
        'corpname': this.corpname,
        'corpnum': this.corpnum,
        'title': this.title,
        'contents': this.contents,
        'from_email': this.from_email,
        'from_tel': this.from_tel
      }).then(res => {
        // console.log('api boards/question_spon/add res data :'+JSON.stringify(res.data))
        if (res.data.result == 'ok') {
          alert('전송되었습니다.')
          this.reset()
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
