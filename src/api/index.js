import service from '@/utils/request'

// 首页统计数据
export const statistics1 = () => {
  return service({
    url: '/admin/statistics1'
  })
}

// 首页echarts统计数据
export const statistics3 = type => {
  return service({
    url: `/admin/statistics3?type=${type}`
  })
}


// 首页统计数据2
export const statistics2 = type => {
  return service({
    url: '/admin/statistics2'
  })
}
