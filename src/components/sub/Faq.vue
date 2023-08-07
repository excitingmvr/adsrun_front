<template>
  <div class="ar-wrap faq">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <div class="faq__wrap layout">
        <ul class="faq-list">
            <li v-for="(item, index) in faqList" :key="item.id" z-index="0">
                <a @click.prevent="toggleFAQ(index)" class="title">
                    <mark class="q-mark">Q</mark>
                    <p>{{item.title}}</p>
                </a>
                <div class="contents">{{item.contents}}
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
                <img :src="images" style="width:95%;margin:auto;">
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
  data() {
    return {
      faqs: [],
      faqList: [],
      images : ''
    }
  },
  components: {
    HeaderNav
  },
  methods: {
    removePopup() {
      document.querySelector('.ar-popup').classList.remove("active")
    },
    openImage(event){
      if(event.currentTarget.dataset.idx){
        var idx = event.currentTarget.dataset.idx,
            fileidx = event.currentTarget.dataset.fileidx
        //console.log(idx,fileidx, this.faqList[idx].files)
        this.images = this.faqList[idx].files[fileidx]['path']
        document.querySelector('.ar-popup').classList.add("active")
      }
    },
    toggleFAQ(i) {
      this.faqs = document.querySelectorAll('.faq-list > li');
      for(let n=0; n<this.faqs.length; n++) {
        if(n !== i) {
          this.faqs[n].classList.remove('active');
        } else {
          if(this.faqs[n].classList.contains('active')) {
            this.faqs[n].classList.remove('active');
          }
          else this.faqs[n].classList.add('active');
        }
      }
    },
    getList() {
      ApiService.post('/front/boards/list', {
        'category': 'faq',
        'start': 0,
        'length': 15
      }).then(res => {
        // console.log('api /boards/list res data : ' + JSON.stringify(res.data))
        for(var item of res.data.data){
          var li = []
          for(var i=1;i<=5;i++){
            if(item['origin'+i]) li.push({origin : item['origin'+i], path: item['filepaht'+i]})
          }
          item.files = li
        }
        this.faqList = res.data.data
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
