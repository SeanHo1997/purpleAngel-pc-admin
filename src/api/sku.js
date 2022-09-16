import service from '@/utils/request'

// 商品规格列表
export const skusList = (page) => {
  return service({
    url: `/admin/skus/${page}`
  })
}

// 增加商品规格
export const addSkus = data => {
  return service({
    url: `/admin/skus`,
    method: 'post',
    data
  })
}

// 修改商品规格
export const updateSkus = (id, data) => {
  return service({
    url: `/admin/skus/${id}`,
    method: 'post',
    data
  })
}

// 修改商品规格状态
export const updateSkusStatus = (id, status) => {
  return service({
    url: `/admin/skus/${id}/update_status`,
    method: 'post',
    data: {
      status
    }
  })
}

// 批量删除商品规格
export const delSkus = (ids) => {
  return service({
    url: `/admin/skus/delete_all`,
    method: 'post',
    data: {
      ids
    }
  })
}

// 更新商品规格
export const updateGoodsSku = (id, data) => {
  return service({
    url: `/admin/goods/updateskus/${id}`,
    method: 'post',
    data
  })
}

// 添加商品规格选项
export const addSkuItem = (data) => {
  return service({
    url: `/admin/goods_skus_card`,
    method: 'post',
    data
  })
}

// 修改商品规格选项
export const updateSkuItem = (id, data) => {
  return service({
    url: `/admin/goods_skus_card/${id}`,
    method: 'post',
    data
  })
}

// 删除商品规格选项
export const deleteSkuItem = (id) => {
  return service({
    url: `/admin/goods_skus_card/${id}/delete`,
    method: 'post'
  })
}

// 排序商品规格选项
export const sortSkuItem = (sortdata) => {
  return service({
    url: `/admin/goods_skus_card/sort`,
    method: 'post',
    data: {
      sortdata
    }
  })
}

// 添加商品规格选项的值
export const addSkuItemValue = (data) => {
  return service({
    url: `/admin/goods_skus_card_value`,
    method: 'post',
    data
  })
}

// 修改商品规格选项的值
export const updateSkuItemValue = (id, data) => {
  return service({
    url: `/admin/goods_skus_card_value/${id}`,
    method: 'post',
    data
  })
}

// 删除商品规格选项的值
export const deleteSkuItemValue = (id) => {
  return service({
    url: `/admin/goods_skus_card_value/${id}/delete`,
    method: 'post'
  })
}
