<template>
  <div id="app">
    <div class="container">
      <div id="map"></div>
      <div id="description">
        <div class="content">
          <img :src={} id="item_photo" alt="photo" />
          <h2 id="item_title"></h2>
          <p id="item_trailId"></p>
        </div>
        <div class="close">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16" @click="closePopup">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import axios from "axios";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
export default {
  data() {
    return {
      loading: false,
      location: "",
      access_token: 'pk.eyJ1IjoibmFyYWdoYWJhYnlhbjc3NyIsImEiOiJjbDVsMzJram8wZnk1M3FvMXg4Y2cxOTJ4In0.65P-1YJlyWGZhwGJM4fV3A',
      center: [46.86187,9.85762],
      map: {},
      data: [],
      longitude: null,
      latitude: null,
      popup: null,
      features: [],
      icon: null,
      coordinates: [],
      current: null,
      tracks: [],
      item_image: '',
      item_title: 'asdasd'
    };
  },
  mounted() {
    this.createMap();
    this.getDataByApi();
  },
  methods: {
    async createMap() {
      try {
        mapboxgl.accessToken = this.access_token;
        this.map = new mapboxgl.Map({
          container: "map",
          style: "https://api.maptiler.com/maps/hybrid/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
          center: [9.85762,46.86187],
          zoom: 11,
        });
        let geocoder = new MapboxGeocoder({
          accessToken: this.access_token,
          mapboxgl: mapboxgl,
          marker: false,
        });
        this.map.addControl(geocoder);
        geocoder.on("result", (e) => {
          const marker = new mapboxgl.Marker({
            draggable: true,
            color: "#D80739",
          })
              .setLngLat(e.result.center)
              .addTo(this.map);
          this.center = e.result.center;
          marker.on("dragend", (e) => {
            this.center = Object.values(e.target.getLngLat());
          });
        });
      } catch (err) {
        console.log("map error", err);
      }
    },
    async getLocation() {
      try {
        this.loading = true;
        const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.center[0]},${this.center[1]}.json?access_token=${this.access_token}`
        );
        this.loading = false;
        this.location = response.data.features[0].place_name;
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    copyLocation() {
      if (this.location) {
        navigator.clipboard.writeText(this.location);
        alert("Location Copied")
      }
      return;
    },
    getDataByApi() {
      axios.get('https://gist.githubusercontent.com/dutsik/3d23f1c562691381eeda4a93a564f521/raw/7287fc013df54704bb457fcd44228be82f8a1727/track_minimal.json').then((res) => {
        this.tracks = res.data
        // console.log(res.data.length)

        for(let tracksKey in this.tracks){
          let data = {
            'type' : 'Feature',
            'properties': {
              'color' : '#cd3434',
            },
            'geometry' : {
              'type' : 'LineString',
              'coordinates' : []
            }
          }

          data.properties.photos = this.tracks[tracksKey].photos
          data.properties.title = this.tracks[tracksKey].title
          let longitude = this.tracks[tracksKey].track.longitude.split(',')
          let latitude = this.tracks[tracksKey].track.latitude.split(',')

          for(const trackKey in latitude){
            let lat = latitude[trackKey]
            let lon = longitude[trackKey]
            let arr = []
            arr.push(lon)
            arr.push(lat)
            data.geometry.coordinates.push(arr)
          }
          this.data.push(data)


        }

        // this.data.splice(10, 275)
        console.log(this.data)
        this.data.forEach((item, index ) => {
          this.map.on('load', () => {
            this.map.addSource('route_'+index, {
              'type': 'geojson',
              'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                  'type': 'LineString',
                  'coordinates': item.geometry.coordinates
                }
              }
            });
            if(index % 5 === 1 ){
              this.map.addLayer({
                'id': 'route_'+index,
                'type': 'line',
                'source': 'route_'+index,
                'layout': {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                'paint': {
                  'line-color': '#808080',
                  'line-width': 4
                }
              });
            }
            else if(index % 5 === 2){

              this.map.addLayer({
                'id': 'route_'+index,
                'type': 'line',
                'source': 'route_'+index,
                'layout': {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                'paint': {
                  'line-color': '#564545',
                  'line-width': 4
                }
              });
            }
            else if(index % 5 === 3){

              this.map.addLayer({
                'id': 'route_'+index,
                'type': 'line',
                'source': 'route_'+index,
                'layout': {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                'paint': {
                  'line-color': '#4a0172',
                  'line-width': 4
                }
              });
            }
            else if(index % 5 === 4){

              this.map.addLayer({
                'id': 'route_'+index,
                'type': 'line',
                'source': 'route_'+index,
                'layout': {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                'paint': {
                  'line-color': '#113a79',
                  'line-width': 4
                }
              });
            }
            else if(index % 5 === 0){

              this.map.addLayer({
                'id': 'route_'+index,
                'type': 'line',
                'source': 'route_'+index,
                'layout': {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                'paint': {
                  'line-color': '#75000c',
                  'line-width': 4
                }
              });
            }
            var popup;
            this.map.on('mouseover', 'route_'+index, function (e) {
              popup = new mapboxgl.Popup({closeButton: false,})
                  .setLngLat(e.lngLat)
                  .setHTML(`<h2>${item.properties.title} <br /> <img src="${item.properties.photos.smallThumb} alt='Photo'" /></h2>`)
                  .addTo(this);


            });
            this.map.on('click', 'route_'+index, function () {
              document.getElementById('description').style.width = '20vw';
              document.getElementById('description').style.visibility = 'visible';
              document.getElementById('item_title').innerHTML = item.properties.title
              document.getElementById('item_photo').src = item.properties.photos.largeThumb
              document.getElementById('item_trailId').innerHTML = 'Trail id - ' +' ' + item.properties.photos.trailId
            });

            this.map.on('mouseout', 'route_'+index, function () {
              // if (this.popup) {
                // console.log(this.popup.remove())
                popup.remove();

              // }
            });


          });
          })
        })


      },
    closePopup(){
      document.getElementById('description').style.visibility='hidden'
      document.getElementById('description').style.width='0'
    }
    },



}
</script>

<style>
/*@import "assets/css/map.css";*/
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/

}

#map { position: absolute; top: 0; left: 0;bottom: 0; width: 100%; }
canvas{
  align-self: center;
  position: relative !important;
}
#description{
  padding: 20px;
  position: absolute;
  width: 0;
  height: -webkit-fill-available;;
  left: 0;
  top: 0;
  background-color: #fff;
  transition: width 1s;
  visibility: hidden;
  display: flex;
  justify-content: space-between;
}
#description .close svg{
  cursor: pointer;
  padding-left: 20px;
}
#item_photo{
  width: 100%;
}
</style>

