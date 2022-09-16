import service from '@/utils/request'

// 商品分类
export const goodsCate = () => {
  return service({
    url: `/admin/category`
  })
}

// 增加商品分类
export const addCate = (data) => {
  return service({
    url: '/admin/category',
    method: 'post',
    data
  })
}

// 修改商品分类
export const updateCate = (id, data) => {
  return service({
    url: `/admin/category/${id}`,
    method: 'post',
    data
  })
}

// 修改商品分类状态
export const cateStatus = (id, status) => {
  return service({
    url: `/admin/category/${id}/update_status`,
    method: 'post',
    data: {
      status
    }
  })
}

// 删除商品分类
export const delCate = (id) => {
  return service({
    url: `/admin/category/${id}/delete`,
    method: 'post'
  })
}

// 分类关联产品列表
export const cateRelatedGoods = (category_id) => {
  return service({
    url: `/admin/app_category_item/list?category_id=${category_id}`
  })
}

// 删除关联产品

export const delCateRelatedGoods = (id) => {
  return service({
    url: `/admin/app_category_item/${id}/delete`,
    method: 'post'
  })
}
