<template>
	<section :class="status ? 'progress-box' : 'progress-box no-padding'">
        <p v-if="!status">모집율<strong class="yellow">{{pct}} %</strong></p>
        <div class="bar-wrap">
            <img v-if="status" src="/static/images/ico-car-yellow.png" alt="" v-bind:style="{left: pct+'%'}"/>
            <div class="bar" v-bind:style="{width: pct+'%'}"></div>
        </div>
        <div v-if="status" class="date-wrap">
            <p>{{beg_date}}</p>
            <p>{{end_date}}</p>
        </div>
            <p v-if="!status">D-days<strong v-html="dday"></strong></p>
    </section>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    datas : {
        type: Object
    }
  },
  data() {
      return {
        status: false, //시작승인 - true, 모집중 - false
        pct: '',
        dday: '',
        end_date: '',
        beg_date: '',
        unit_price: ''
      }
  },
  methods: {
    getInit : function(){
      if(this.datas){
          this.status = this.datas.id ? true :false
          if(this.status){
            let beg_dt = moment(this.datas.beg, 'YYYY-MM-DD HH:mm:ss')
            let end_dt = moment(this.datas.beg, 'YYYY-MM-DD HH:mm:ss').add(this.datas.ad_duration, 'days')
            let ja =  moment().diff(beg_dt, 'hour')
            let dday = moment.duration(end_dt.diff(moment()))
            dday = dday.asDays() <= 0 ? 0 : Math.ceil(dday.asDays())
            console.log(ja,dday)
            let pct = ((ja/(this.datas.ad_duration * 24))*100).toFixed(1)
            console.log('pct:'+pct)
            this.pct = pct > 100 ? 100 : pct < 0 ? 0 : pct
            console.log('this.pct:'+this.pct)
            this.beg_date = beg_dt.format('YYYY.MM.DD')
            this.end_date = end_dt.format('YYYY.MM.DD')
            this.dday = dday
            this.unit_price = this.datas.unit_price
            console.log('beg_dt:'+this.beg_date)
            console.log('end_date:'+this.end_date)
          }else{
            let pct = ((this.datas.reserve_cnt/this.datas.recruit_num)*100).toFixed(1)
            this.pct = pct > 100 ? 100 : pct
            if (moment(this.datas.recruit_end, 'YYYY-MM-DD HH:mm:ss') > moment()) {
              this.dday = moment(this.datas.recruit_end, 'YYYY-MM-DD HH:mm:ss').diff(moment(), 'days')+1+'일'
            } else {
              this.dday = '종료'
            }
          }
      }
    }
  },
  mounted() {
      this.getInit()
  }
}
</script>