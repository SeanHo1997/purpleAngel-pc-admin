import service from '@/utils/request'

const queryParams = (query) => {
  let q = []
  for (const key in query) {
    if (!query[key]) continue
    q.push(key + '=' + query[key])
  }
  let res = q ? ('?' + q.join('&')) : ''
  return res
}

// 分销数据统计
export const distriStatistics = () => {
  return service({
    url: `/admin/agent/statistics`
  })
}

// 分销推广员列表
export const distriRecommandList = (page, query = {}) => {
  return service({
    url: `/admin/agent/${page}${queryParams(query)}`
  })
}

// 推广订单列表
export const recommandOrderList = (page, query = {}) => {
  return service({
    url: `/admin/user_bill/${page}${queryParams(query)}`
  })
}

// 获取分销配置
export const distriSetting = () => {
  return service({
    url: `/admin/distribution_setting/get`
  })
}

// 修改分销配置
export const updateDistriSetting = (data) => {
  return service({
    url: `/admin/distribution_setting/set`,
    method: 'post',
    data
  })
}
