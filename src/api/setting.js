import service from '@/utils/request'

// 获取系统原有配置
export const sysconfig = () => {
  return service({
    url: `/admin/sysconfig`
  })
}

// 修改系统设置
export const updateSysconfig = (data) => {
  return service({
    url: `/admin/sysconfig`,
    method: 'post',
    data
  })
}

// 交易设置
export const uploadAction = '/api/admin/sysconfig/upload'

