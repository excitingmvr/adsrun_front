<template>
	<!-- ** 로그아웃 팝업 ** -->
	<div class="ar-popup logout-popup">
		<div class="ar-popup__dimmer" onclick="removeLogoutPopup()"></div>
		<div class="ar-popup__content">
			<div class="popup-body">
				<div class="popup-txt">
					<p>애즈런 서비스에서<br/>로그아웃 하시겠습니까?</p>
				</div>
			</div>
			<footer class="popup-ft">
				<button class="ft-btn no" onclick="removeLogoutPopup()">취소</button>
				<button class="ft-btn ok" @click.prevent="logout">확인</button>
			</footer>
		</div>
	</div>
</template>

<script>
import { LOGOUT } from '@/store/actions.type'

export default {
  methods: {
    logout() {
      Promise.all([this.$store.dispatch(LOGOUT)]).then(() => {
        window.location.href = '/login'
        //this.$router.replace({ path: '/home' }).catch(err => {})
		if(navigator.userAgent.match(/ADSRUN_APP_IOS/i)){
			window.webkit.messageHandlers.logout.postMessage("");
		} else if(navigator.userAgent.match(/ADSRUN_APP_ANDROID/i)){
			window.adsrunApp.logout();
		}
      })
    }
  }
}
</script>