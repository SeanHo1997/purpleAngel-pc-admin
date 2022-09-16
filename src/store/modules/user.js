import { useCookies } from '@vueuse/integrations/useCookies'
import { TOKEN, USERINFO } from '@/constants'
import { login, userInfo } from '@/api/manager'
const cookie = useCookies()

export default {
  namespaced: true,
  state: () => {
    return {
      token: cookie.get(TOKEN) || null,
      userInfo: JSON.parse(window.localStorage.getItem(USERINFO)) || cookie.get(USERINFO) || null
    }
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      cookie.set(TOKEN, token)
    },
    setUserInfo(state, info) {
      state.userInfo = info
      // cookie.set(USERINFO, JSON.stringify(info)) // null ??
      window.localStorage.setItem(USERINFO, JSON.stringify(info))
    }
  },
  actions: {
    async getToken (context, obj) {
      const { token } = await login(obj.username, obj.password)
      context.commit('setToken', token)
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    async getUserInfo (context) {
      const info = await userInfo()
      context.commit('setUserInfo', info)
      return new Promise((resolve, reject) => {
        resolve(info.menus)
      })
    }
  }
}
