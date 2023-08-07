<template>
    <div class="ar-wrap mypage">
        <header-nav/>
        <!-- * 상단 배너이미지 * -->
        <aside class="top-banner layout">
            <img src="/static/images/img-top-banner_1.png" alt=""/>
        </aside>
        
        <div class="mypage__wrap layout">
            <!-- 개인정보 -->
            <section v-if="me" class="mypage-box">
                <h3>개인정보</h3>
                <ul class="mypage-list">
                    <li>
                        <p>이름</p>
                        <p>{{me.name}}</p>
                    </li>
                    <li>
                        <p>생년월일/성별</p>
                        <p>{{me.serial_no.substr(0,6)}} / {{gender(me.serial_no.substr(6,1))}}</p>
                    </li>
                    <li>
                        <p>전화번호</p>
                        <p>{{mobile(me.phone)}}</p>
                    </li>
                    <li>
                        <p>이메일</p>
                        <p>{{me.u_mail}}</p>
                    </li>
                    <li>
                        <p>연락처 이메일</p>
                        <p>{{me.email}}</p>
                    </li>
                    <li>
                        <p>주소</p>
                        <p>{{me.addr1}} {{me.addr2}}</p>
                    </li>
                </ul>
            </section>
            <!-- 차량정보 -->
            <section v-if="me" class="mypage-box">
                <h3>차량정보</h3>
                <ul class="mypage-list">
                    <li>
                        <p>차량번호</p>
                        <p>{{me.car_num}}</p>
                    </li>
                    <li>
                        <p>차명</p>
                        <p>{{me.car_name}}</p>
                    </li>
                    <li>
                        <p>차종</p>
                        <p>{{me.car_type}}</p>
                    </li>
                    <li>
                        <p>년식</p>
                        <p>{{me.car_year}}</p>
                    </li>
                    <li>
                        <p>색상</p>
                        <p>{{me.car_color}}</p>
                    </li>
                    <li>
                      <p>차량등록지</p>
                      <p>{{me.car_addr}}</p>
                    </li>
                </ul>
            </section>
            <!-- 계좌정보 -->
            <section v-if="me" class="mypage-box">
                <h3>계좌정보</h3>
                <ul class="mypage-list">
                    <li>
                        <p>은행</p>
                        <p>{{me.account_bank}}</p>
                    </li>
                    <li>
                        <p>예금주</p>
                        <p>{{me.account_holder}}</p>
                    </li>
                    <li>
                        <p>계좌번호</p>
                        <p>{{me.account_num}}</p>
                    </li>
                </ul>
            </section>
             <!-- 주소 -->
            <section v-if="me" class="mypage-box edit-box">
                <h3>주요 이동 경로</h3>
                <ul class="mypage-list">
                    <li>
                        <p>주소1(배송지)</p>
                        <p>{{me.addr1+' '+me.addr2}}</p>
                    </li>
                    <li>
                        <p>주소2(주운행지역)</p>
                        <p>{{me.c_addr}} </p>
                    </li>
                </ul>
            </section>
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
      me: null
    }
  },
  methods: {
    gender(num) {
      return (num % 2) == 1 ? '남' : '여'
    },
    mobile(num) {
      let ret = ''
      if (num.length == 11) {
        ret = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
      } else if (num.length == 8) {
        ret = num.replace(/(\d{4})(\d{4})/, '$1-$2')
      } else {
        ret = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
      }
      return ret
    },
    getMypage() {
      ApiService.post('/front/user/runner/info').then(res => {
        // console.log('api runner/info res data :'+JSON.stringify(res.data))
        if (res.data && res.data['phone']) {
          
          this.me = res.data
          console.log("1")
          this.getArea1()
          this.getArea2()
        } else {
          if(confirm('회원 정보가 없습니다.\n등록하시겠습니까?')){
            this.$router.push('/registerBasic')
          }else{
            this.$router.push('/home')
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getArea1() {
        ApiService.post('/front/getArea1', {}).then(res => {
          // console.log('api getArea1 res data :'+JSON.stringify(res.data))
             for (let i = 0; i < res.data.length; i++) {
                  if(res.data[i].id == this.me.ad_area_a.split(',')[1]){
                   console.log("2")
                  this.me.c_addr = res.data[i].area_name
                  console.log(this.me.c_addr) 
                  }
                }
              
        }).catch(err => {
          this.loading = false;
          console.log(err)
        })

      },
      getArea2() {
        ApiService.post('/front/getArea2', {'id': this.me.ad_area_a.split(',')[1]}).then(res => {
          // console.log('api getArea2 res data :'+JSON.stringify(res.data))
             for (let i = 0; i < res.data.length; i++) {
                 if(res.data[i].id == this.me.ad_area_b.split(',')[1]){
                  this.me.c_addr += " " + res.data[i].area_name
                  console.log(this.me.c_addr1) 
                  }
                }
        }).catch(err => {
          this.loading = false;
          console.log(err)
        })

      },
  },
  mounted() {
    this.getMypage()
  }
}
</script>
