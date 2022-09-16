import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// windicss
import 'virtual:windi.css'
// router
import router from './router/index'
// icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// store
import store from './store/index'
// 组件
import components from './components/index'
// 指令
import directives from './directives/permission'
import 'default-passive-events'
// 路由守卫
import './permission'

const app = createApp(App)

// icon注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus)
app.use(router)
app.use(store)
app.use(components)
// 指令
app.use(directives)
app.mount('#app')
