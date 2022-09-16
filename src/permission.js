import router from '@/router/index'
import store from './store/index'
import nprogress from 'nprogress'
import "nprogress/nprogress.css"

const whiteList = ['/404']

router.beforeEach(async (to, from, next) => {
  nprogress.start()
  const token = store.getters.token
  const userInfo = store.getters.userInfo
  if (token) {
    // if (!userInfo) {
    //   await store.dispatch('user/getUserInfo')
    // }
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (to.path !== '/login') {
      ElNotification({
        message: '请先登录',
        type: 'info',
        duration: 3000
      })
      next('/login')
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  nprogress.done()
})
