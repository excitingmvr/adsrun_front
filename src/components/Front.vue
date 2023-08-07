<template>
  <div>
    <side-nav @checkData="chk_extra_data"/>
    <router-view @popupData="popup_data"/>
    <footer-nav/>
    <invite
    :short_url="short_url"
    :title="title"
    :extra_txt="extra_txt"/>
    <logout/>
    <custom-popup
    :content="content"
    :button="button"
    :url="url"/>
  </div>
</template>

<script>
import SideNav from '@/components/common/SideNav'
import FooterNav from '@/components/common/FooterNav'
import Invite from '@/components/common/Invite'
import Logout from '@/components/common/Logout'
import CustomPopup from '@/components/common/CustomPopup'

export default {
  components: {
    SideNav,
    FooterNav,
    Invite,
    Logout,
    CustomPopup
},
  data() {
    return{
      short_url : '',
      title : '',
      extra_txt : '',
      content: '',
      button:'',
      url:''
    }
  },
  methods: {
    chk_extra_data(data) {
      this.short_url = data.url;
      this.title = data.title;
      this.extra_txt = data.extra_txt;
    },
    popup_data(data) {
      console.log('popup_Data : ' + JSON.stringify(data));
      this.content = data.content;
      this.button = data.button;
      this.url = data.url;
    }
  },
  mounted() {
  }
}
</script>