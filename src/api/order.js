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

// 订单列表
export const orderList = (page, query) => {
  return service({
    url: `/admin/order/${page}${queryParams(query)}`
  })
}

// 删除订单
export const delOrders = (ids) => {
  return service({
    url: `/admin/order/delete_all`,
    method: 'post',
    data: {
      ids
    }
  })
}

// 订单发货
export const shipOrder = (id, data) => {
  return service({
    url: `/admin/order/${id}/ship`,
    method: 'post',
    data
  })
}

// 导出订单
export const exportOrder = (query) => {
  return service({
    url: `/admin/order/excelexport${queryParams(query)}`,
    method: 'post',
    responseType: 'blob'
  })
}

// 查看物流信息
export const ShippingInfo = (id) => {
  return service({
    url: `/admin/order/${id}/get_ship_info`
  })
}

// 审批退款
export const refund = (id, data) => {
  return service({
    url: `/admin/order/${id}/handle_refund`,
    method: 'post',
    data
  })
}
