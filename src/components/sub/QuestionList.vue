<template>
  <div class="ar-wrap home-detail">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <!-- 문의하기 Form -->
    <div class="home-detail__wrap layout">
        <!-- * 광고 상세정보 * -->
        <template v-if="list.length > 0">
          <section class="home-detail__box" v-for='item in list' :data-id="item.id">
            <div class="question-title-box"  style="margin:0.8rem 0;transition : all 0.35s;" >
              <div style="display:flex;padding-left:1.5rem;justify-content: space-between;">
                <div style="display:flex;width:60%;" :data-id="item.id" >
                  <!-- <button v-if="item.cnt > 0" class="up-btn" style="position:relative;top:0;" title="접기/펴기 버튼" :data-id="item.id"  :data-cnt="item.cnt"></button> -->
                  <!-- <div v-if="item.cnt < 1" style="width: 1.3rem;height: 1.3rem;"/> -->
                  <h4 :data-id="item.id" @click.prevent="clickDetails">{{item.title}}</h4>
                </div>
                <h5 style="margin-block-start: 0; margin-block-end: 0;">{{item.cre_at}}</h5>
              </div>
              <ul class="home-detail__list" aria-labelledby="detail-title" :data-id="item.id" >
                <!--<li><p>{{item.contents}}</p><p>{{item.cre_at}}</p></li>-->
              </ul>
            </div>
          </section>
        </template>
        <template v-else>
          <section class="home-detail__box">
            <h3>문의사항이 없습니다</h3>
          </section>
        </template>
        <a href="/question" class="btn colored" style="font-weight: bold;position: fixed;bottom: 4.5rem;right: 1.8rem;border-radius: 50%; width: 3rem; height: 3rem;line-height: 1.3rem;font-size: 1.4rem;">+</a>
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
      list : [],
      height : {}
    }
  },
  methods: {
    getList(){
      return new Promise((resolve, reject) => {
        ApiService.post('/front/boards/question/lists').then(res => {
          // console.log('api boards/question/lists res data :'+JSON.stringify(res.data))
          this.list = res.data
          resolve()
        })
      })
      
    },
    clickDetails(event){
      this.$router.push('/question/detail/'+event.currentTarget.dataset.id)
    },
    toggleBox(event){
      if(event.currentTarget.dataset.cnt > 0){
        document.querySelectorAll('button').forEach(x => {
          if(x.dataset.id == event.target.dataset.id){
            var t = document.querySelector(`ul[data-id="${event.target.dataset.id}"]`),
                    innerList = ''
            if(x.classList.toString().indexOf('active') > -1){
              x.classList.remove('active')
              t.innerHTML = ''
            }else{
              x.classList.add('active')
              ApiService.post('/front/boards/question/reply',{boardid : event.target.dataset.id}).then(res => {
                // console.log('api boards/question/reply res data :'+JSON.stringify(res.data))
                console.log(t)
                for(var item of res.data){
                  innerList += `<li><p>${item.contents}</p><p>${item.cre_at}</p></li>`
                }
                t.innerHTML = innerList
              })
              
            }

          }
        })
      }
    },
    setHeight(){
      document.querySelectorAll('.home-detail__box').forEach( x => {
          this.height[x.dataset.id] = x.offsetHeight
      })
    }
  },
  async mounted() {
    await this.getList()
    this.setHeight()
  }
}
</script>
