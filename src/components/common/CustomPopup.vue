<template>
	<!-- ** 커스텀 팝업 ** -->
	<div class="ar-popup custom-popup">
		<div class="ar-popup__dimmer"></div>
		<div class="ar-popup__content">
			<div class="popup-body">
				<div class="popup-txt">
					<p v-html="this.content"></p>
				</div>
			</div>
			<footer class="popup-ft">
				<button class="ft-btn ok" @click.prevent="pop_url">{{ this.button }}</button>
			</footer>
		</div>
	</div>
</template>

<script>

export default {
	props: {
		content: {
			type: String
		},
		button: {
			type: String
		},
		url: {
			type: String
		}
	},
	methods: {
		pop_url(){
			console.log('pop)url:'+this.url);

			if(navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone|iPod/i) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)){
				window.webkit.messageHandlers.pop.postMessage(this.url+"");
			}else{
				window.adsrunApp.pop(this.url);
			}

			removeCustomPopup();
			window.location.reload(true);
		},
	}

}
</script>