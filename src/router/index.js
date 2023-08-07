import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

const requireAuth = () => (from, to, next) => {
  if (store.getters.isAuthenticated) return next() // isAuth === true면 페이지 이동
  next('/login?m=y') // isAuth === false면 다시 로그인 화면으로 이동
}

export default new Router({
  mode: 'history',
  routes: [
    // Adsrun App
    {
      path: '/',
      name: 'Landing',
      component: () => import('@/components/Landing')
    },
    {
      path: '/naverMap',
      name: 'naverMap',
      meta: {title: ''},
      component: () => import('@/components/common/NaverMap')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/components/Login')
    },
    {
      path: '/login/success',
      name: 'LoginSuccess',
      component: () => import('@/components/LoginSuccess')
    },
    {
      path: '/login/secession:user_id',
      name: 'LoginSecession',
      component: () => import('@/components/LoginSecession')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/components/Register')
    },
    {
      path: '/registerBasic',
      name: 'RegisterBasic',
      component: () => import('@/components/Register-basic')
    },
    {
      path: '/registerBank',
      name: 'RegisterBankister',
      component: () => import('@/components/Register-bank')
    },
    {
      path: '/registerCar',
      name: 'RegisterCar',
      component: () => import('@/components/Register-car')
    },
    {
      path: '/agreement',
      name: 'Agreement',
      component: () => import('@/components/Agreement')
    },
    {
      path: '/front',
      component: () => import('@/components/Front'),
      children: [
        {
          path: '/home',
          name: 'Home',
          meta: {title: ''},
          component: () => import('@/components/Home')
        },
        //로그인 필요없는 페이지
        {
          path: '/race/:race_id',
          name: 'Race',
          meta: {title: ''},
          component: () => import('@/components/sub/Race')
        },
        {
          path: '/racehistory/:race_id/:date',
          name: 'History',
          meta: {title: ''},
          component: () => import('@/components/sub/History')
        },
        {
          path: '/notice',
          name: 'Notice',
          meta: {title: '공지사항'},
          component: () => import('@/components/sub/Notice')
        },
        {
          path: '/faq',
          name: 'Faq',
          meta: {title: 'FAQ'},
          component: () => import('@/components/sub/Faq')
        },
        {
          path: '/terms',
          name: 'Terms',
          meta: {title: '약관동의'},
          component: () => import('@/components/sub/Terms')
        },
        {
          path: '/privacy',
          name: 'Privacy',
          meta: {title: '개인정보처리방침'},
          component: () => import('@/components/sub/Privacy')
        },
        {
          path: '/howto',
          name: 'Howto',
          meta: {title: '사용법'},
          component: () => import('@/components/sub/Howto')
        },
        //로그인 필요한 페이지
        {
          path: '/mypage',
          name: 'Mypage',
          meta: {title: '마이페이지'},
          beforeEnter: requireAuth(),
          component: () => import('@/components/sub/Mypage')
        },
        {
          path: '/mypage/mod',
          name: 'MypageMod',
          meta: {title: '마이페이지 정보변경'},
          beforeEnter: requireAuth(),
          component: () => import('@/components/sub/MypageMod')
        },
        {
          path: '/alertSetting',
          name: 'AlertSetting',
          meta: {title: '알림설정'},
          beforeEnter: requireAuth(),
          component: () => import('@/components/sub/AlertSetting')
        },
        {
          path: '/question',
          name: 'Question',
          meta: {title: '문의하기'},
          beforeEnter: requireAuth(),
          component: () => import('@/components/sub/Question')
        },
        {
          path: '/question_list',
          name: 'QuestionList',
          meta: {title: '문의하기'},
          component: () => import('@/components/sub/QuestionList')
        },
        {
          path: '/question/detail/:board_id',
          name: 'Question_Detail',
          meta: {title: '문의하기'},
          beforeEnter: requireAuth(),
          component: () => import('@/components/sub/QuestionDetail')
        },
        {
          path: '/question_spon',
          name: 'QuestionSpon',
          meta: {title: '광고 의뢰 문의 하기'},
          component: () => import('@/components/sub/QuestionSponsor')
        },
        {
          path: '/secession',
          name: 'Secession',
          meta: {title: '회원탈퇴'},
          beforeEnter: requireAuth(),
          component: () => import('@/components/sub/Secession')
        },
        {
          path: '/withdraw',
          name: 'Withdraw',
          meta: {title: '참여내역'},
          beforeEnter: requireAuth(),
          component: () => import('@/components/sub/Withdraw')
        },
        {
          path: '/withdraw/records',
          name: 'WithdrawRecords',
          meta: {title: '출금이력'},
          beforeEnter: requireAuth(),
          component: () => import('@/components/sub/WithdrawRecords')
        },
        {
          path: '/ads/list',
          name: 'AdsList',
          meta: {title: '참여중인광고'},
          beforeEnter: requireAuth(),
          component: () => import('@/components/sub/AdsList')
        },
        {
          path: '/ads/:race_id',
          name: 'Ads',
          meta: {title: '참여중인광고'},
          beforeEnter: requireAuth(),
          component: () => import('@/components/sub/Ads')
        },
        {
          path: '/ads/applying',
          name: 'AdsApplying',
          meta: {title: '참여중인광고'},
          //beforeEnter: requireAuth(),
          component: () => import('@/components/sub/AdsApplying')
        },
        {
          path: '/ads/proceeding',
          name: 'AdsProceeding',
          meta: {title: '참여중인광고'},
          beforeEnter: requireAuth(),
          component: () => import('@/components/sub/AdsProceeding')
        },
        {
          path: '/ads/photo/waiting',
          name: 'AdsPhotoWaiting',
          beforeEnter: requireAuth(),
          component: () => import('@/components/sub/AdsPhotoWaiting')
        },
        {
          path: '/ads/photo',
          name: 'AdsPhoto',
          beforeEnter: requireAuth(),
          component: () => import('@/components/sub/AdsPhoto')
        },
        {
          path: '/ads/success',
          name: 'AdsSuccess',
          beforeEnter: requireAuth(),
          component: () => import('@/components/sub/AdsSuccess')
        },
        {
          path: '/ads/failed',
          name: 'AdsFailed',
          beforeEnter: requireAuth(),
          component: () => import('@/components/sub/AdsFailed')
        },
        {
          path: '/ads/timeout',
          name: 'AdsTimeout',
          beforeEnter: requireAuth(),
          component: () => import('@/components/sub/AdsTimeout')
        }
      ]
    },
    {
      path: '*',
      name: 'error404',
      component: { template: '<div>Access Denied..</div>' }
    },
    {
      path: '/racehistory',
      name: 'HistoryB',
      meta: {title: ''},
      component: () => import('@/components/sub/History_b')
    }
  ]
})
