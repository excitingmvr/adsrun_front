<template>
  <div class="ar-wrap alert-setting">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <div class="alert-setting__wrap layout">
        <ul class="alert-setting__list">
            <li>
                <p>신규 광고 알림</p>
                <input type="checkbox" id="alert-1" hidden v-model="notify_ad" @change="updateAlertSetting()"/>
                <label class="check-label" for="alert-1"></label>
            </li>
            <li>
                <p>진행 상태 알림</p>
                <input type="checkbox" id="alert-2" hidden v-model="notify_flow" @change="updateAlertSetting()"/>
                <label class="check-label" for="alert-2"></label>
            </li>
            <li>
                <p>공지 사항 알림</p>
                <input type="checkbox" id="alert-3" hidden v-model="notify_notice" @change="updateAlertSetting()"/>
                <label class="check-label" for="alert-3"></label>
            </li>
            <li>
                <p>출금 완료 알림</p>
                <input type="checkbox" id="alert-4" hidden v-model="notify_withdraw" @change="updateAlertSetting()"/>
                <label class="check-label" for="alert-4"></label>
            </li>
        </ul>
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
      notify_ad: false,
      notify_flow: false,
      notify_notice: false,
      notify_withdraw: false
    }
  },
  methods: {
    getAlertSetting() {
      ApiService.post('/front/user/info/exists').then(res => {
        // console.log('api user/info/exists res data : ' + JSON.stringify(res.data))
        const info = res.data
        this.notify_ad = info.notify_ad ? (info.notify_ad == 'Y' ? true : false) : false
        this.notify_flow = info.notify_flow ? (info.notify_flow == 'Y' ? true : false) : false
        this.notify_notice = info.notify_notice ? (info.notify_notice == 'Y' ? true : false) : false
        this.notify_withdraw = info.notify_withdraw ? (info.notify_withdraw == 'Y' ? true : false) : false
      }).catch(err => {
        console.log(err)
      })
    },
    updateAlertSetting() {
      ApiService.post('/front/user/info/update', {
        'notify_ad': this.notify_ad ? 'Y' : 'N',
        'notify_flow': this.notify_flow ? 'Y' : 'N',
        'notify_notice': this.notify_notice ? 'Y' : 'N',
        'notify_withdraw': this.notify_withdraw ? 'Y' : 'N'
      }).then(res => {
        // console.log('api user/info/update res data : ' + JSON.stringify(res.data))
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted() {
    this.getAlertSetting()
  }
}
</script>
