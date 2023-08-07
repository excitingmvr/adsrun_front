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
            <label class="input-label" for="sender">보내는 사람</label>
            <input type="email" size="5" id="sender" v-model="from_email" maxlength="128" placeholder="회신받을 이메일을 입력해주세요"/>
        </div>
        <div class="input-box align-center" style="margin-bottom:2rem;">
            <label class="input-label" for="phone">전화번호</label>
            <input type="tel" size="5" id="phone" v-model="from_tel" maxlength="20" placeholder="연락받을 전화번호를 입력해주세요."/>
        </div>
        <div class="input-box align-center">
            <label class="input-label" for="adTitle">제목</label>
            <input type="text" size="5" id="adTitle" v-model="title" maxlength="256" placeholder="광고주명/광고타이틀"/>
        </div>
        <div class="textarea-box">
            <label class="textarea-label" for="questions">문의사항</label>
            <textarea id="questions" v-model="contents" placeholder="문의사항 내용을 기재해주세요."></textarea>
        </div>
        <div class="input-box align-center" style="margin-bottom:2rem;">
            <label class="input-label" for="file-label">첨부파일</label>
            <label id="file-label" class="input-file" for="attachment" style="background-color: #f9f9f9;">
                <p v-if="!file" id="r-fileName">첨부할 파일을 추가해주세요</p>
                <p v-if="file" id="r-fileName">{{file.name}}</p>
            </label>
            <input type="file" id="attachment" ref="file" v-on:change="getFileName();" accept="image/*" />
        </div>
        <div class="btns dbl">
            <button class="btn grey" title="취소" @click.prevent="reset()">취소</button>
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
      from_email: '',
      from_tel: '',
      title: '',
      contents: '',
      file: '',
      file_id: ''
    }
  },
  methods: {
    reset() {
      this.from_email = ''
      this.from_tel = ''
      this.title = ''
      this.contents = ''
      this.file = ''
      this.file_id = ''
      this.$router.push('/question_list')
    },
    getFileName() {
      if(this.$refs.file.files[0] != null) {
        console.log('file name : '+this.$refs.file.files[0].name)
        this.createImage(this.$refs.file.files[0]);
      }
    },
    async createImage(file) { 
        const reader = new FileReader();

        // Wait for the data url to be loaded from the file
        const dataURL = await new Promise(resolve => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });

        // Wait for the image to be loaded
        const img = new Image();
        await new Promise(resolve => {
            img.onload = resolve;
            img.src = dataURL;
        });

        // Resize the image with a canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        // This is an addition to keep the aspect ratio of the image so it won't get distorted
        const [maxWidth, maxHeight] = [1080, 1080];
        const [imgWidth, imgHeight] = [
            img.naturalWidth,
            img.naturalHeight
        ];
        const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);

        canvas.width = imgWidth * ratio;
        canvas.height = imgHeight * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        this.image = canvas.toDataURL('image/jpeg', 1.0);

        let binary = window.atob(this.image.split(',')[1])
        let array = []
        for (var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i))
        }
        let blobData = new Blob([new Uint8Array(array)], {type: 'image/jpeg'})
        this.file = new File([blobData], file.name)
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
      
      if (this.file) {
        let up_files = await this.uploadFile()
        if(!up_files) {
          alert('파일 저장에 실패하였습니다')
          return
        }
      }
      ApiService.post('/front/boards/question/add', {
        'title': this.title,
        'contents': this.contents,
        'from_email': this.from_email,
        'from_tel': this.from_tel,
        'file1' : this.file_id
      }).then(res => {
        // console.log('api boards/question/add res data :'+JSON.stringify(res.data))
        if (res.data.result == 'ok') {
          alert('전송되었습니다.')
          this.$router.push('/question_list')
          //this.reset()
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
