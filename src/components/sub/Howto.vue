<template>
  <div class="ar-wrap how-to-use">
    <header-nav/>
    <!-- * 상단 배너이미지 * -->
    <aside class="top-banner layout">
        <img src="/static/images/img-top-banner_1.png" alt=""/>
    </aside>
    
    <div class="how-to-use__wrap layout">
        <section class="use-section">
            <h3>페이스북</h3>
            <a class="use-box" href="#">
                <div class="img-box" style="background-image:url('/static/images/use-img.png');"></div>
                <div class="txt-box">
                    <h4>애즈런 이용방법 설명</h4>
                    <p>애즈런 서비스를 이용하기 위해서는 먼저 이 렇게 이렇게 해야합니다. 가입이 끝나고 나..</p>
                    <p class="link">facebook.com/abc123</p>
                </div>
            </a>
        </section>
        <section class="use-section">
            <h3>네이버</h3>
            <a class="use-box" href="#">
                <div class="img-box" style="background-image:url('/static/images/use-img.png');"></div>
                <div class="txt-box">
                    <h4>애즈런 이용방법 설명</h4>
                    <p>애즈런 서비스를 이용하기 위해서는 먼저 이 렇게 이렇게 해야합니다. 가입이 끝나고 나..</p>
                    <p class="link">blog.naver.com/123</p>
                </div>
            </a>
        </section>
        <section class="use-section">
            <h3>페이스북</h3>
            <a class="use-box" href="#">
                <div class="img-box" style="background-image:url('/static/images/use-img.png');"></div>
                <div class="txt-box">
                    <h4>애즈런 이용방법 설명</h4>
                    <p>애즈런 서비스를 이용하기 위해서는 먼저 이 렇게 이렇게 해야합니다. 가입이 끝나고 나..</p>
                    <p class="link">youtube.co.kr/abc134</p>
                </div>
            </a>
        </section>
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/components/common/HeaderNav'

export default {
  components: {
    HeaderNav
  }  
}
</script>