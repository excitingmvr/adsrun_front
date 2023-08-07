<template>
  <div class="ar-wrap notice-list">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
      <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>

    <div class="notice-list__wrap layout">
      <!-- * 공지사항 리스트 * -->
      <ul class="n-list">
        <li v-for="(item, index) in noticeList" :key="index">
          <a href="#" @click.prevent="toggleNotice(index)"><p>{{item.title}}</p><span>{{ [ item.cre_at, 'YYYY-MM-DD HH:mm:ss' ] | moment('YYYY-MM-DD') }}</span></a>
          <div class="content"> 
             <p v-html="getNoticeDetail(item.contents)" @click="pop_url"></p>
              <template v-if="item.files.length > 0">
                <div v-for="(file, index_file) in item.files" class="input-box align-center" style="margin:1rem 0;" :data-idx="index" :data-fileidx="index_file" @click.stop.prevent="openImage">
                    <label id="file-label" class="input-file" for="attachment" style="background-color: #f9f9f9;">
                        <p v-if="file.origin" id="r-fileName">{{file.origin}}</p>
                    </label>
                    <input type="file" id="attachment" ref="file"   accept="image/*" readonly="readonly" disabled/>
                </div>
              </template>
          </div>
        </li>
      </ul>
      <div class="ar-popup">
          <div class="ar-popup__dimmer" @click.prevent="removePopup()"></div>
          <div class="ar-popup__content">
              <div class="popup-body">
                <img :src="images"  style="width:95%;margin:auto;">
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
import { mapGetters } from 'vuex'

export default {
  components: {
    HeaderNav
  },
  data() {
    return {
      noticeList: [],
      images:''
    }
  },
  computed: {
    ...mapGetters(['isNew'])
  },
  methods: {
    removePopup() {
      document.querySelector('.ar-popup').classList.remove("active")
    },
    openImage(event){
      if(event.currentTarget.dataset.idx){
        var idx = event.currentTarget.dataset.idx,
            fileidx = event.currentTarget.dataset.fileidx
        //console.log(idx,fileidx, this.noticeList[idx].files)
        this.images = this.noticeList[idx].files[fileidx]['path']
        document.querySelector('.ar-popup').classList.add("active")
      }
    },
    checkLogs(){
        ApiService.post('/front/log/check',{'type' : 'notice'}).then(res => {
          // console.log('api log/check type notice res data :'+JSON.stringify(res.data))
              if(res.data.result) this.$store.commit('setIsnew',this.isNew.replaceAll('notice,','').replaceAll('notice',''))
        })
    },
    toggleNotice(i) {
      const notices = document.querySelectorAll('.n-list > li')
      for(let n=0; n<notices.length; n++) {
        if(n !== i) {
          notices[n].classList.remove('active')
        }
        else {
          if(notices[n].classList.contains('active')) {
            notices[n].classList.remove('active')
          }
          else {
            notices[n].classList.add('active')
          }
        }
      }
    },
    getNoticeList() {
      ApiService.post('/front/boards/list', {
        'category': 'notice',
        'start': 0,
        'length': 15
      }).then(res => {
        // console.log('api boards/list res data :'+JSON.stringify(res.data))
        this.checkLogs()
        for(var item of res.data.data){
          var li = []
          for(var i=1;i<=5;i++){
            if(item['origin'+i]) li.push({origin : item['origin'+i], path: item['filepaht'+i]})
          }
          item.files = li
        }
        this.noticeList = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    getNoticeDetail(content) { 
      const link = new RegExp(/((((https|http):\/)|bit.ly)\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?)/, 'gm');
      return  content.replace(link, '<a style="color: #4b70fd;" id="$1">$1</a>');
    },
    pop_url(e){
      let clickedUrl = e.target.id;
      if(clickedUrl == null || clickedUrl == "") {
        return;
      }

      if(navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone|iPod/i) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
        window.webkit.messageHandlers.pop.postMessage(clickedUrl+"");
      } else{
        window.adsrunApp.pop(clickedUrl+"");
      }
    }
  },
  mounted() {
    this.getNoticeList()
  }  
}
</script>
