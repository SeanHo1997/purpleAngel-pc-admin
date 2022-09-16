import router from '@/router/index'
import store from './store/index'
import nprogress from 'nprogress'
import "nprogress/nprogress.css"
import { ElNotification } from 'element-plus'

const whiteList = ['/404']

router.beforeEach(async (to, from, next) => {
  // console.log(to.path)
  nprogress.start()
  const token = store.getters.token
  const userInfo = store.getters.userInfo
  if (token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (to.path !== '/login') {
      next('/login')
      ElNotification({
        message: '请先登录',
        type: 'info',
        duration: 3000
      })
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  nprogress.done()
})
