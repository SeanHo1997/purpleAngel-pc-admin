// import FormDrawer from './FormDrawer/index.vue'
import { defineAsyncComponent } from 'vue'

export default {
  install (app) {
    // app.component('FormDrawer', FormDrawer)
    const components = import.meta.glob('./*/index.vue')
    for(const obj of Object.entries(components)) {
      // console.log(obj)
      // console.log(obj[0].split('/')[1])
      app.component(obj[0].split('/')[1], defineAsyncComponent(obj[1]))
    }
  }
}
