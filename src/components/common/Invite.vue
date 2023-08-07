<template>
	<!-- ** 초대하기 팝업 ** -->
	<div class="ar-popup invite-popup">
		<div class="ar-popup__dimmer" onclick="removeInvitePopup()"></div>
		<div class="ar-popup__content">
			<div class="popup-body">
				<button class="invite-popup__close" onclick="removeInvitePopup()">
					<img src="/static/images/close-popup-x.png" alt="닫기"/>
				</button>
				<p>공유하기</p>
				<ul class="invite-list">
					<li>
						<button class="invite-btn">
							<img src="/static/images/invite-kakao.png" alt="" @click.prevent="kakaoShare"/>
							카카오톡
						</button>
					</li>
					<!--
					<li>
						<button class="invite-btn">
							<img src="/static/images/invite-insta.png" alt=""/>
							인스타그램
						</button>
					</li>
					-->
					<li>
						<button class="invite-btn">
							<img src="/static/images/invite-gmail.png" alt="" @click.prevent="mailShare"/>
							메일
						</button>
					</li>
					<li>
						<button class="invite-btn">
							<img src="/static/images/invite-msg.png" alt="" @click.prevent="textShare"/>
							메세지
						</button>
					</li>
				</ul>
				<div v-if="this.extra_txt" style="margin-top:20px;font-size: 0.75rem;"><div v-html="this.extra_txt"></div></div>
			</div>
		</div>
	</div>
</template>
<script>


export default {
	props: {
		short_url: {
			type: String
		},
		title: {
			type: String
		},
		extra_txt: {
			type: String
		}
	},
	data() {
		return {
			is_ios : false,
		}
	},
	methods: {
	  kakaoShare(){
		// Kakao.Link.sendCustom({
		// 	templateId: 35077
		// })
		Kakao.Link.sendDefault({
			objectType: 'feed',
			content: {
				title: this.title,
				description: this.short_url,
				imageUrl:
					'https://adsrun-front.s3.ap-northeast-2.amazonaws.com/static/images/adsrun_logo.png',
				imageWidth: 800,
				imageHeight: 800,
				link: {
					mobileWebUrl: this.short_url,
					webUrl: this.short_url,
				}
			},
			buttons: [{
				title: '자세히 보기',
				link: {
					mobileWebUrl: this.short_url,
					webUrl: this.short_url,
				},
			}],
		})
	  },
	textShare(){
		var text_href = this.is_ios ? 'sms:&' : 'sms:?'
		text_href += 'body=' + this.title + '%0a' + this.short_url + '%0a%0a\"일상의 드라이빙을 가치있게\"'
		location.href = text_href
	},
	mailShare(){
		location.href = 'mailto:?subject='+ this.title + '&body=' + this.title + '%0a' + this.short_url + '%0a%0a\"일상의 드라이빙을 가치있게\"'
	},
	chk_ios(){
		if(navigator.userAgent.match(/ADSRUN_APP_IOS/i)){
				this.is_ios = true
		}
	}
  },
  mounted() {
	this.chk_ios()
  }
}
</script>