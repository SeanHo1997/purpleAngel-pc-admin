import { useCookies } from '@vueuse/integrations/useCookies'
const cookie = useCookies()
import { TOKEN } from '@/constants'

// 获取
export const getToken = () => {
  cookie.get(TOKEN)
}

// 清除
export const delToken = () => {
  cookie.remove(TOKEN)
}

// 设置
export const setToken = () => {
  cookie.set(TOKEN)
}
