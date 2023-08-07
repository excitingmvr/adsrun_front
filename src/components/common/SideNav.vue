<template>
	<!-- ** 사이드메뉴 ** -->
	<aside class="side-menu">
		<div class="side-menu__dimmer" onclick="hideSideMenu()"></div>
		<section class="side-menu__body">
			<header class="side-menu__hd">
				<button v-if="!isAuthenticated" class="logout-btn btn skyblue" @click="$router.push('/login')">로그인</button>
				<button v-if="isAuthenticated" class="logout-btn btn skyblue" onclick="activeLogoutPopup()">로그아웃</button>
			</header>
			<nav class="side-menu__nav">
				<ul class="nav-list">
					<li v-if="isAuthenticated"><router-link to="/mypage"><img src="/static/images/ico-mypage.png"/>마이페이지</router-link></li>
					<li v-if="isAuthenticated"><router-link to="/alertSetting"><img src="/static/images/ico-bell.png"/>알림설정</router-link></li>
					<li><router-link to="/notice"><img src="/static/images/ico-notice.png"/>공지사항<i style="right:5rem;" class="new-icon" v-if="isNew && isNew.indexOf('notice') > -1">N</i></router-link></li>
					<li><a @click.prevent="promotions"><img src="/static/images/ico-invite.png"/>초대하기</a></li>
					<!-- <li><a href="javascript:void(0)" onclick="this.create_dynamic_link('movePage', 'invite', '1')"><img src="/static/images/ico-invite.png"/>초대하기</a></li> -->
					<!-- <li><a href="javascript:void(0)" onclick="activeInvitePopup()"><img src="/static/images/ico-invite.png"/>초대하기</a></li> -->
					<li><router-link to="/question_list"><img src="/static/images/ico-msg.png"/>문의하기</router-link></li>
					<li><router-link to="/faq"><img src="/static/images/ico-faq.png"/>FAQ</router-link></li>
					<li><router-link to="/terms"><img src="/static/images/ico-doc.png"/>약관</router-link></li>
					<li><router-link to="/privacy"><img src="/static/images/ico-doc.png"/>개인정보처리방침</router-link></li>
					<li><!--<router-link to="/howto">--><a @click.prevent="info_url"><img src="/static/images/ico-info.png"/>사용법</a><!--</router-link>--></li>
					<li v-if="isAuthenticated && is_ios"><router-link to="/secession"><img src="/static/images/ico-user.png"/>회원탈퇴</router-link></li>
          <!--
					<li style="margin-top:50px"><router-link to="/register"><img src="/static/images/ico-user.png"/>선수 등록 (삭제예정)</router-link></li>
          -->
				</ul>
				<small v-if="app_version" style="margin-top: 1rem; margin-right: 0.5rem; float: right;">ver. {{ app_version }}</small>
			</nav>
		</section>
	</aside>
</template>

<script>
import { mapGetters } from 'vuex'
import { FirebaseDynamicLinks } from 'firebase-dynamic-links'
import ApiService from '@/common/api.service'
import API_URL from '@/common/url'

const firebaseDynamicLinks = new FirebaseDynamicLinks('AIzaSyDlw_XC-yLEQJJzLhUHgOsbkMEfzkexBpY');

export default {
	data() {
		return {
			is_ios : false,
			app_version : ''
		}
	},
	methods: {
		chk_ios(){
			if(navigator.userAgent.match(/ADSRUN_APP_IOS/i)){
					this.is_ios = true
			}
		},
		info_url() {
			if(navigator.userAgent.match(/ADSRUN_APP_IOS/i)){
				window.webkit.messageHandlers.pop.postMessage("https://adsrun.modoo.at/");
			}else if(navigator.userAgent.match(/ADSRUN_APP_ANDROID/i)){
				window.adsrunApp.pop('https://adsrun.modoo.at/');
			}else{
				window.open("https://adsrun.modoo.at/")
			}
		},
		promotions() {
			ApiService.post('/front/promotions',{'userId' : this.currentUser.id}).then(res => {
				// console.log("promotions data:"+ JSON.stringify(res.data));

				var txt = '';
				var nickName = '';
				if(res.data != null && res.data.data != null) {
					nickName = res.data.data.nickName;
					if(res.data.data.promotionYn == 'Y' && res.data.data.memberType == '10') {
						txt = '초대하기 프로모션 적용을 위해서는<br>회원정보가 입력되어야 합니다.'
					}
				}
				this.create_dynamic_link('10', this.currentUser.id, txt, nickName);
			}).catch(err => {
				console.log(err)
				this.create_dynamic_link('10', this.currentUser.id, '', this.currentUser.nickname);
			})
		},
		async create_dynamic_link(type, id, txt, nickname) {
			var title = '애즈러너가 당신을 애즈런에 초대합니다.';
			if(nickname != undefined && nickname != '') {
				title = nickname + ' ' + title;
			}

			const dynamicLinkInfo = {
				domainUriPrefix: 'https://adsrun.page.link',     // 링크에 사용될 도메인 (사전 설정 참고)
				link: 'https://adsrun.imweb.me?type=' + type + '&id=' + id, // App에서 받게 될 목적지 링크
				androidInfo: {
					androidPackageName: 'com.steven.adsrun', // 링크를 여는 데 사용될 App의 Package Name
					// androidFallbackLink: 'https://adsrun.imweb.me/'
				},
				iosInfo: {
					iosBundleId: 'com.mobileios.adsrun',   // 링크를 여는 데 사용될 App의 Bundle ID
					iosAppStoreId: '1522656816',       // App 미설치 시 App Store로 연결하기 위한 App의 Store ID
					// iosFallbackLink: 'https://adsrun.imweb.me/'
				},
				// navigationInfo: {
				// 	enableForcedRedirect: true,       // iOS에서 미리보기 페이지를 건너뛰고 앱으로 redirection 시킴
				// },
				socialMetaTagInfo: {
					socialTitle: title,
					socialImageLink: 'https://adsrun-front.s3.ap-northeast-2.amazonaws.com/static/images/adsrun_logo.png'
				}
			};
			const result = await firebaseDynamicLinks.createLink({ dynamicLinkInfo });
			console.log('dynamicLink shortLink : ' + result.shortLink);
			this.$emit('checkData', {url : result.shortLink, title : title, extra_txt : txt});
			activeInvitePopup();
    	},
		getAppVersion() {
			if(navigator.userAgent.match(/ADSRUN_APP_IOS/i)){
				window.webkit.messageHandlers.appVersion.postMessage("");
			}else if(navigator.userAgent.match(/ADSRUN_APP_ANDROID/i)){
				window.adsrunApp.appVersion();
			}
		},
		onAppVersion(event) {
			if(event.data != null && typeof event.data == 'object'){
				this.app_version = event.data.version;
			}
		}
	},
	computed: {
		...mapGetters(['isAuthenticated','isNew','currentUser'])
	},
	mounted() {
		window.addEventListener('message', this.onAppVersion, false)
		this.chk_ios()
		this.getAppVersion()
	},
	beforeDestroy() {
        window.removeEventListener('message', this.onAppVersion, false)
  	}
}
</script>