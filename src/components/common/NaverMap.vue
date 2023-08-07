<template>
  <div>
   
 <div id="naverMap" style="width:90vw; height: 60vh;">
 </div>    
  </div>
 
</template>
     
     

<script>
import moment from 'moment'
import ApiService from '@/common/api.service'
// import googleMap from '@/components/common/googleMap'

import { mapGetters } from 'vuex'

export default {
  components: {
    
  },
  data() {
    return {
        distance : null,
        totals : 0,
        seconds : 0,
        start_addr : '',
        start_addr2 : '',
        end_addr : '',
        polyPath:[],
        path:[],
        center : null
      }
  },
  computed: {
   
  },
  props: {
    lists : {
        type: Array,
        default: () => []
      }
  },
  watch: {
     async lists(){
        console.log('lists!!')
      this.changeList()  
      await this.initMap()   
      }

  },
  methods: {
    
    onLoad(vue)
 {
   console.log('onLoad!!')
        this.map = vue;
      },
      async changeList(){
          console.log('changeList!!')
        
        var center;
         for(var i=0;i<this.lists.length;i++){
             this.polyPath.push({lat:this.lists[i].Latitude, lng:this.lists[i].Longitude})
              if(this.lists.length / 2 == i) this.center = new naver.maps.LatLng(this.lists[i].Latitude, this.lists[i].Longitude)
            if(i > 0) {
                this.totals += this.getDistance({x : this.lists[i].Latitude, y: this.lists[i].Longitude},{x : this.lists[i-1].Latitude, y: this.lists[i-1].Longitude})
                var intervals = new Date(this.lists[i].CreAt).getTime() - new Date(this.lists[i-1].CreAt).getTime()
                if(intervals < 360000) this.seconds += intervals
            }
         }
          this.start_addr = await this.getAddress(this.lists[0],this.lists[this.lists.length-1])
          this.end_addr = await this.getAddress(this.lists[this.lists.length-1],this.lists[this.lists.length-1])
         this.$emit('total-distance',{totals : this.totals, seconds : this.seconds, start : this.start_addr, end : this.end_addr})
    console.log('address:'+this.start_addr)
    },
     getDistance(start, end) {
        var R = 6371 // km 

        var x1 = start.x-end.x
        var dLat = x1* Math.PI / 180
        var x2 = start.y-end.y
        var dLon = x2* Math.PI / 180
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                        Math.cos(end.x* Math.PI / 180) * Math.cos(start.x* Math.PI / 180) * 
                        Math.sin(dLon/2) * Math.sin(dLon/2)
        var c = Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        var d = R * c 
        //console.log('Distance : ',d)
        
        return d
    },
    convertTimes(b){
        var a = b.split(' ')[1].split(':')
        a.splice(0,1)
        a.push('00')
        //console.log('times : ',b.split(' ')[0] + ' ' + a.join(':'))
        return b.split(' ')[0] + ' ' + a.join(':')
    },
      async initMap() {

       
     
 this.map = new naver.maps.Map(document.getElementById('naverMap'), {
      center: this.center,
      zoom: 11,
});



//markers.push(marker);


console.log("this.polyPath init:"+this.polyPath)
var polyline = new naver.maps.Polyline({
        path: this.polyPath,
        strokeColor: '#00CA00',
        strokeOpacity: 0.8,
        strokeWeight: 6,
        zIndex: 2,
        clickable: false,
        map: this.map 
    });




},
getAddress(start, end) {
        return new Promise((resolve, reject) => {
            
console.log('start:'+start.Latitude+' end:'+start.Longitude)
              
              
      var start_addr1 = ''


                      naver.maps.Service.reverseGeocode({
                      location: new naver.maps.LatLng(start.Latitude, start.Longitude),
                            }, function(status, response) {
                                if (status !== naver.maps.Service.Status.OK) {
                                    return alert('Something wrong!');
                                }

                                var result = response.result, // 검색 결과의 컨테이너
                                    items = result.items; // 검색 결과의 배열
                                    if(items[0].address) start_addr1 =  items[0].address
                                
                                resolve(start_addr1)
                                // do Something
                                
                                
                            });
               

                    

       
            /*
            const matrix = new google.maps.DistanceMatrixService();
            console.log(matrix)
            
            matrix.getDistanceMatrix({
                origins: [new google.maps.LatLng(start.Latitude, start.Longitude)],
                destinations: [new google.maps.LatLng(end.Latitude, end.Longitude)],
                travelMode: google.maps.TravelMode.DRIVING,
            }, function(response, status) {
                resolve(response)
            })*/
        })  
    }
  },
  mounted: function() {












}
}
</script>
