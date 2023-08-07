<template>
    <div :class="lane && lane.length > 0 ? 'ar-wrap home alert-setting' : 'ar-wrap ads-applying progress-fixed'">
        <header-nav/>
        <!-- * 상단 배너이미지 * -->
        <aside class="top-banner layout">
            <img src="/static/images/img-top-banner_1.png" alt=""/>
        </aside>
        <div v-if="lane && lane.length > 0 " class="alert-setting__wrap layout" style="margin-bottom:0.5rem;">
            <ul class="alert-setting__list">
                <li>
                    <p>종료된 광고 안보이기</p>
                    <input type="checkbox" id="alert-1" hidden v-model="end_hide"/>
                    <label class="check-label" for="alert-1"></label>
                </li>
            </ul>
        </div>
        <ul v-if="lane && lane.length > 0" class="ad-list layout">
            <template v-for="item in lane">
                <li v-if="item.show">
                    <router-link :to="`/Ads/${item.id ? item.id : item.reserv_id}`"><img :src="item.image" alt=""/></router-link>
                    <i class="new-icon" style="left: 1rem;margin-top: 8px;" v-if="item.new">N</i>
                    <ProgressBar v-if="['모집중','진행중'].includes(getStatus(item.id ? item.status : item.reserve_status))" :datas="item"></ProgressBar>
                    <div class="ad-list__info">
                        <div class="info-box">
                            <h3>{{item.title}}</h3>
                            <ul class="car-icons">
                                <li v-if="item.ad_location.indexOf(2) > -1 || item.ad_location.indexOf(6) > -1 || item.ad_location.indexOf(7) > -1"><img src="/static/images/ico-car3.png" alt=""/></li>
                                <li v-if="item.ad_location.indexOf(3) > -1 || item.ad_location.indexOf(4) > -1"><img src="/static/images/ico-car4.png" alt=""/></li>
                                <li v-if="item.ad_location.indexOf(1) > -1"><img src="/static/images/ico-car2.png" alt=""/></li>
                                <li v-if="'B,C'.indexOf(item.ad_area_set) > -1" class="no-flex-item"><span v-if="item.ad_area_set == 'B'">차량등록지</span><span v-else>주요이동경로</span><span style="font-size:0.812rem;color:gray">&nbsp기준</span></li>
                            </ul>
                            <div class="inline-box">
                                <ul class="ads-list-item" v-if="'BC'.indexOf(item.ad_area_set) > -1" >
                                    <li class="area-icons" v-for="i in item.area_a">{{i}}</li>
                                </ul>
                                <ul class="ads-list-item ads-list-right" >
                                    <li class="area-icons">{{getStatus(item.id ? item.status : item.reserve_status)}}</li>
                                </ul>
                            </div>
                            
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <div v-if="box.visible" class="ads-applying__wrap layout">
            <section class="applying-box">
                <img v-if="v_ico" src="/static/images/ico-apply.png" alt=""/>
                <img v-if="!v_ico" src="/static/images/ico-cancel.png" alt=""/>
                <h3 v-html="box.title"></h3>
                <p v-html="box.msg"></p>
                <br>
                <p v-if="this.status">참여중인 광고 : <br>{{this.title}}</p>
                <ul class="num-box">
                    <li v-if="box.v_pct">
                        <p>모집율<strong class="yellow">{{box.pct}} %</strong></p>
                        <div class="bar-wrap">
                            <div class="bar" v-bind:style="{width: box.pct+'%'}"></div>
                        </div>
                    </li>
                    <li v-if="box.v_dday">
                        <p>D-days<strong v-html="box.dday"></strong></p>
                    </li>
                </ul>
            </section>
        </div>
    </div>
</template>
<script>
import ApiService from '@/common/api.service'
import HeaderNav from '@/components/common/HeaderNav'
import ProgressBar from '@/components/common/Progress'
import InfiniteLoading from 'vue-infinite-loading'
import { mapGetters } from 'vuex'

export default {
  components: {
    HeaderNav, InfiniteLoading, ProgressBar
  },
  data() {
    return {
        status : '',
        end_hide: false,
        res : {},
        lane : [],
        box : { visible : false }
    }
  },
  watch: {
      end_hide(newVal,oldVal){
            window.localStorage.setItem('showAdsList',newVal)
            this.lane.forEach( x => {
                if(newVal){
                    if(x.reserve_status == 'C' || ['FA','FF','SF','T1','T2','T3','T4'].includes(x.status)) x.show = false
                }else{
                    x.show = true
                }
            })
        }
  },
  computed: {
    ...mapGetters(['isNew'])
  },
  methods: {
      checkLogs(){
          ApiService.post('/front/log/check',{'type' : 'flow'}).then(res => {
            // console.log('api log/check type flow res data : ' + JSON.stringify(res.data))
               if(res.data.result) this.$store.commit('setIsnew',this.isNew.replaceAll('flow,','').replaceAll('flow',''))
          })

          ApiService.post('/front/log/searchAds', { 'action' : 'query' }).then(res => {

            // console.log('api log/searchAds action query res data : ' + JSON.stringify(res.data))
            this.lane = this.lane.map( x => {
                if(res.data.includes(x.id)) x['new'] = true
                return x
            })
          })
      },
      getApplying() {
        ApiService.post('/front/ads/check').then(res => {
            // console.log('api ads/check res data : ' + JSON.stringify(res.data))
         
            if(!res.data.status) {
                alert('로그인하셔야 보실 수 있어요~')
                this.$router.push('/login')
            }
            ApiService.post('/front/ads/list').then(res => {
                // console.log('api ads/list res data : ' + JSON.stringify(res.data))
                this.end_hide = window.localStorage.getItem('showAdsList') == 'true' ? true : false
                res.data.lane.forEach( x => {
                    if(this.end_hide){
                        if(x.reserve_status == 'C' || ['FA','FF','SF','T1','T2','T3','T4'].includes(x.status)) x.show = false; else x.show = true
                    }else{
                        x.show = true
                    } 
                })
                this.lane = res.data.lane
                this.checkLogs()
                console.log(this.lane)
                if (this.lane == null || this.lane.length == 0) {
                    this.box.visible = true         
                    this.box.title = '참여중인 광고가 없습니다!'
                    this.box.msg = '광고에 참여하여 상금을 획득하세요.'
                    this.box.v_pct = false
                    this.box.v_dday = false 
                    this.v_ico = true
                    this.activeProgress = false
                    this.status = false
                }else{
                    
                }
            })
        })
      },
      getStatus(status) {
          let result;
          switch (status) {
            case 'DR': result = '배송준비중';break;
            case 'DW': result = '배송중';break;
            case 'SW': result = '시작대기'; break;
            case 'SU': result = '시작올림';  break;
            case 'SR': result = '시작올림재요청'; break;
            //case 'SA': result = '시작승인'; break;
            case 'SA': result = '진행중'; break;
            case 'SF': result = '시작실패'; break;
            case 'FW': result = '종료대기'; break;
            case 'FU': result = '종료올림';  break;
            case 'FR': result = '종료올림재요청'; break;
            case 'FA': result = '종료승인'; break;
            case 'FF': result = '종료실패'; break;
            case 'T1': result = '타임아웃(시작대기)'; break;
            case 'T2': result = '타임아웃(시작올림재요청)'; break;
            case 'T3': result = '타임아웃(종료대기)'; break;
            case 'T4': result = '타임아웃(종료올림재요청)'; break;
            case 'N' : result = '모집중'; break;
            case 'R' : result = '모집중'; break;
            case 'R' : result = '모집중'; break;
            case 'E' : result = '모집완료'; break;
            case 'C' : result = '광고취소'; break;
            case 'WC' : result = '광고취소'; break;
          }
          return result;
      }
  },
  mounted() {
    this.$store.commit('setLocation','ads/list')
    this.getApplying()
  }
}
</script>