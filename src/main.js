import 'virtual:windi.css'
import { createApp } from 'vue'
import App from './App.vue'
import store from "./store/store"
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faNetworkWired, faRoute, faLayerGroup, faCircle, faAngleRight } from '@fortawesome/free-solid-svg-icons'

library.add(faNetworkWired, faRoute, faLayerGroup, faCircle, faAngleRight)

const app = createApp(App)
app
.use(PerfectScrollbar)
.use(store)
.component('font-awesome-icon', FontAwesomeIcon)
.mount("#app")


