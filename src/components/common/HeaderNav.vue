<template>
  <!-- ** 헤더 ** -->
  <header class="header">
    <button class="menu-btn" title="메뉴버튼" onclick="showSideMenu()">
      <div></div>
      <i class="new-icon" v-if="isNew && isNew.indexOf('notice') > -1" style="top: 1rem;">N</i>
    </button>
    <h1 v-if="is_home" class="hd-logo">
      <img src="/static/images/adsrun-bl.png" alt="Ads-Run" class="adsrun-logo"/>
    </h1>
    <h1 v-if="!is_home" class="hd-logo txt">{{ $route.meta.title }}</h1>
    <a v-if="is_mypage" href="#" class="setting-btn" title="마이페이지 정보변경" @click.prevent="$router.push('/registerBasic')">
      <span></span>
    </a>
        <!-- Global site tag (gtag.js) - Google Analytics -->
<!-- Global site tag (gtag.js) - Google Analytics -->

  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['isNew'])
  },
  data() {
    return {
      is_home: false,
      is_mypage: false
    }
  },
  methods: {
    initTitle() {
      console.log(this.$route.name)
      const titleImgNames = ['Home', 'Race', 'Mypage']
      if (titleImgNames.indexOf(this.$route.name) > -1) {
        this.is_home = true
      }
      if (this.$route.name == 'Mypage') {
        this.is_mypage = true
      }
    }
  },
  mounted() {
    hideSideMenu()
    removeLogoutPopup()
    removeInvitePopup()
    removeCustomPopup()
    this.initTitle()
  }
}
</script>