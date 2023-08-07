// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import store from '@/store'
import router from '@/router'
import SimpleVueValidation from 'simple-vue-validator'
import ApiService from '@/common/api.service'
import ErrorFilter from '@/common/error.filter'
import { CHECK_AUTH } from '@/store/actions.type'
import VueAnalytics from 'vue-analytics' 
import VueTagManager from "vue-tag-manager"   
import VueCookies from "vue-cookies"
import naver from 'vue-naver-maps';

Vue.config.productionTip = false
//Vue.config.devtools = true
Vue.use(require('vue-moment'))
Vue.use(SimpleVueValidation)
Vue.use(VueAnalytics,{
  id: 'UA-202641660-1', // 콘솔에서 본인의 키를 확인하세요!
  router // 원활한 트래킹을 위해 router를 꼭 바인드 해 주어야 합니다!
})
Vue.use(VueTagManager, {
  gtmId: 'GTM-5TN6GQQ'
})

Vue.use(naver, {
  clientID: 'rn5qrk314m',
  useGovAPI: false, //공공 클라우드 API 사용 (선택)
  subModules:'' // 서브모듈 (선택)
});

Vue.filter('error', ErrorFilter)
Vue.filter('comma', function (value) {
  if (!value) return 0
  return value.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
})
Vue.use(VueCookies);
Vue.$cookies.config("1d")

ApiService.init()

router.beforeEach((to, from, next) =>
  Promise.all([store.dispatch(CHECK_AUTH)]).then(next)
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
}).$mount('#app')
