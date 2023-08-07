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
            <input type="email" size="5" id="recipient" placeholder="Admin@adsrun.co.kr" readonly="readonly"/>
        </div>
      -->
        <!-- <div class="input-box align-center">
            <label class="input-label" for="sender">보내는 사람</label>
            <input type="email" size="5" id="sender" v-model="from_email" maxlength="128" placeholder="회신받을 이메일을 입력해주세요" readonly="readonly"/>
        </div>
        <div class="input-box align-center" style="margin-bottom:2rem;">
            <label class="input-label" for="phone">전화번호</label>
            <input type="tel" size="5" id="phone" v-model="from_tel" maxlength="20" placeholder="연락받을 전화번호를 입력해주세요." readonly="readonly"/>
        </div> -->
        <div class="input-box align-center">
            <label class="input-label" for="adTitle">제목</label>
            <input type="text" size="5" id="adTitle" v-model="title" maxlength="256" placeholder="광고주명/광고타이틀" readonly="readonly"/>
        </div>
        <div class="textarea-box">
            <label class="textarea-label" for="questions">문의사항</label>
            <textarea id="questions" v-model="contents" placeholder="문의사항 내용을 기재해주세요." readonly="readonly"></textarea>
        </div>
        <div v-if="file" class="input-box align-center" :style="replys.length > 0 ? 'margin-bottom:1rem;' : 'margin-bottom:2rem;'">
            <label class="input-label" for="file-label">첨부파일</label>
            <label id="file-label" class="input-file" for="attachment" style="background-color: #f9f9f9;">
                <!-- <p v-if="!file" id="r-fileName">첨부할 파일을 추가해주세요</p> -->
                <p v-if="file" id="r-fileName">{{file.name}}</p>
            </label>
            <input type="file" id="attachment" ref="file" v-on:change="getFileName();" accept="image/*" readonly="readonly" disabled/>
        </div>
        <img v-if="file" :src="filepath" style="width:100%;">
        <div class="input-box reply-box" style="display:block;margin-bottom:2rem;" v-if="replys.length > 0">
          <label class="input-label" for="replys" style="font-size:0.85rem;font-weight:bold;">답변</label>
          <ul style="padding:0.312rem;" id="replys" class="home-detail__list" aria-labelledby="detail-title"  >
            <li v-for="(item,index) in replys">
              <p>
              <p v-html="item.contents"></p>
              <i class="reply-attached" v-if="item.filepath" :data-idx="index" @click.prevent="openImage"><label id="file-label" class="input-file" for="attachment"></label></i>
              </p><p>{{item.cre_at}} </p></li>
          </ul>
        </div>
        <div class="btns dbl">
            <button class="btn grey" title="목록보기" @click.prevent="cancel()" style="flex: 1 0 50%;">목록보기</button>
            <!--<button type="submit" class="btn colored black" title="수정하기" @click.prevent="request()">수정하기</button>-->
        </div>
        <div class="ar-popup">
            <div class="ar-popup__dimmer" @click.prevent="removePopup()"></div>
            <div class="ar-popup__content">
                <div class="popup-body">
                  <img :src="images">
                </div>
                <footer class="popup-ft">
                    <button class="ft-btn ok" @click.prevent="removePopup">확인</button>
                </footer>
            </div>
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
      replys: [],
      from_email: '',
      from_tel: '',
      title: '',
      contents: '',
      file: '',
      file_id: '',
      file_up: false,
      images : null
    }
  },
  methods: {
    cancel(){
      this.$router.push('/question_list')
    },
    removePopup() {
      document.querySelector('.ar-popup').classList.remove("active")
    },
    openImage(event){
      if(event.currentTarget.dataset.idx){
        var idx = event.currentTarget.dataset.idx
        console.log(idx,this.replys[idx].filepath)
        this.images = this.replys[idx].filepath
        document.querySelector('.ar-popup').classList.add("active")
      }
    },
    getList(){
      ApiService.post('front/boards/question/detail',{ id: this.$route.params.board_id }).then(res => {
        // console.log('api boards/question/detail res data :'+JSON.stringify(res.data))
          for(var keys of Object.keys(res.data.details)) {
            this[keys] = res.data.details[keys]
          }
          if(res.data.details.origin) this.file = { name : res.data.details.origin }
          if(res.data.details.file1) this.file_id = res.data.details.file1
          if(res.data.replys) this.replys = res.data.replys
          
      }).catch(error => {

      })
    },
    reset() {
      this.from_email = ''
      this.from_tel = ''
      this.title = ''
      this.contents = ''
      this.file = ''
      this.file_id = ''
    },
    getFileName() {
      this.file = this.$refs.file.files[0]
      this.file_up = true
    },
    uploadFile() {
      return new Promise((resolve, reject) => {
        const fd1 = new FormData()
            fd1.append('category', 'adsrun')
            fd1.append('file', this.file)
        ApiService.post('/front/file/upload', fd1, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          // console.log('api file/upload res data :'+JSON.stringify(res.data))
          if(res.data.result == 'ok') this.file_id = res.data.file_id
          resolve(true)
        }).catch(error => {
          reject(false)
        })
      })
    },
    async request() {
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
      
      if (this.file_up) {
        let up_files = await this.uploadFile()
        if(!up_files) {
          alert('파일 저장에 실패하였습니다')
          return
        }
      }
      ApiService.post('/front/boards/question/mod', {
        'title': this.title,
        'contents': this.contents,
        'from_email': this.from_email,
        'from_tel': this.from_tel,
        'file1' : this.file_id
      }).then(res => {
        // console.log('api boards/question/mod res data :'+JSON.stringify(res.data))
        if (res.data.result == 'ok') {
          alert('수정했습니다.')
          this.$router.push('/question_list')
          //this.reset()
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
