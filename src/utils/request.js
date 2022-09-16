import axios from 'axios'
import { ElNotification } from 'element-plus';
import { useCookies } from '@vueuse/integrations/useCookies'
import { TOKEN } from '@/constants';
import store from '@/store';

const service = axios.create({
  baseURL: '/api',
  timeout: 5000
})

service.interceptors.request.use(config => {
  const cookie = useCookies()
  const token = cookie.get(TOKEN)
  if (token) {
    config.headers['token'] = token
  }
  return config
}, err => {
  Promise.reject(err)
})

service.interceptors.response.use(response => {
  return response.request.responseType == 'blob' ? response.data : response.data.data
}, err => {
  ElNotification({
    message: err.response.data.msg || '请求失败',
    type: 'error',
    duration: 3000
  })
  Promise.reject(err)
})

export default service
