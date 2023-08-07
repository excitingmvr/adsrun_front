<template>
  <div id="map" style="width:90vw; height: 60vh;"></div>
</template>

<script>
import ApiService from '@/common/api.service'
import loadScriptOnce from 'load-script-once'
import VueAxios from 'vue-axios'

export default {
  data() {
    return {
        api_key: 'AIzaSyDakGAd6o3ZBbBKhxV87HNJBoY0V-B9qIc',
        map : null,
        distance : null,
        totals : 0,
        seconds : 0,
        start_addr : '',
        end_addr : ''
    }
  },
  props: {
    lists : {
        type: Array,
        default: () => []
      }
  },
  watch: {
      lists(){
          this.changeList()
      }
  },
  computed: {

  },
  methods: {
    async loadScripts() {
        return new Promise((resolve, reject) => {
            loadScriptOnce(`//maps.googleapis.com/maps/api/js?key=${this.api_key}&region=kr`)
            .then(() => {
                this.map = new google.maps.Map(
                    document.getElementById('map'), {
                    zoom: 11,
                    center: { lat: 37.5642135 ,lng: 127.0016985 }
                });
                resolve()
            })
            .catch(err => {
                console.error(err)
                reject()
            })
        })  
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
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
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
    async changeList(){
        var load_maps = await this.loadScripts(),
            path_list = []
        //console.log(this.lists)
        var center;
        for(var i=0;i<this.lists.length;i++){
            path_list.push(new google.maps.LatLng(this.lists[i].Longitude, this.lists[i].Latitude))
            if(this.lists.length / 2 == i) center = new google.maps.LatLng(this.lists[i].Longitude, this.lists[i].Latitude)
            if(i > 0) {
                this.totals += this.getDistance({x : this.lists[i].Latitude, y: this.lists[i].Longitude},{x : this.lists[i-1].Latitude, y: this.lists[i-1].Longitude})
                var intervals = new Date(this.lists[i].CreAt).getTime() - new Date(this.lists[i-1].CreAt).getTime()
                if(intervals < 360000) this.seconds += intervals
            }

        }
        if(center != null) this.map.setCenter(center);
        var address = await this.getAddress(this.lists[0],this.lists[this.lists.length-1])
        //console.log(address)
        //console.log('path_list : ',path_list)
        this.$emit('total-distance',{totals : this.totals, seconds : this.seconds, start : this.start_addr, end : this.end_addr})
        var poly_path = new google.maps.Polyline({
                            path: path_list,
                            geodesic: true,
                            strokeColor: "#FF0000",
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                        })
        poly_path.setMap(this.map)
    },
    getAddress(start, end) {
        return new Promise((resolve, reject) => {
            
            ApiService.post('/front/history/getAddress',{ start : start, end : end, api_key : this.api_key }).then(res => {
                //console.log(res.data)
                if(res.data.origin_addresses) this.start_addr = res.data.origin_addresses[0]
                if(res.data.destination_addresses) this.end_addr = res.data.destination_addresses[0]
                resolve()
            })
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
  mounted() {
      this.loadScripts()
  }
}
</script>
