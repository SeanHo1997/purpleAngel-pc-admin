import service from '@/utils/request'

// 优惠券列表
export const couponList = (page) => {
  return service({
    url: `/admin/coupon/${page}`
  })
}

// 增加优惠券
export const addCoupon = data => {
  return service({
    url: `/admin/coupon`,
    method: 'post',
    data
  })
}

// 修改优惠券
export const updateCoupon = (id, data) => {
  return service({
    url: `/admin/coupon/${id}`,
    method: 'post',
    data
  })
}

// 失效优惠券
export const updateCouponStatus = (id, status) => {
  return service({
    url: `/admin/coupon/${id}/update_status`,
    method: 'post',
    data: {
      status
    }
  })
}

// 删除优惠券
export const delCoupon = (id) => {
  return service({
    url: `/admin/coupon/${id}/delete`,
    method: 'post'
  })
}
