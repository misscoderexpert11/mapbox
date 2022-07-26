import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import VueMapbox from "vue-mapbox";
import Mapbox from "mapbox-gl";
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
Vue.use(VueMapbox, { mapboxgl: Mapbox });
new Vue({
  render: h => h(App),
}).$mount('#app')
