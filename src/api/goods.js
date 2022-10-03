import service from '@/utils/request'

const queryParams = (query) => {
  let q = []
  for (const key in query) {
    q.push(key + '=' + query[key])
  }
  let res = q ? ('?' + q.join('&')) : ''
  return res
}

// 商品列表
export const goodsList = (page, query) => {
  return service({
    url: `/admin/goods/${page}${queryParams(query)}`
  })
}

// 新增商品
export const addGoods = (data) => {
  return service({
    url: '/admin/goods',
    method: 'post',
    data
  })
}

// 修改商品
export const updateGoods = (id, data) => {
  return service({
    url: `/admin/goods/${id}`,
    method: 'post',
    data
  })
}

// 删除商品
export const delGoods = (ids) => {
  return service({
    url: `/admin/goods/delete_all`,
    method: 'post',
    data: {
      ids
    }
  })
}

// 批量上架/下架
export const updateBundle = (ids, status) => {
  return service({
    url: `/admin/goods/changestatus`,
    method: 'post',
    data: {
      ids,
      status
    }
  })
}

// 关联商品
export const connetGoods = (category_id, goods_ids) => {
  return service({
    url: `/admin/app_category_item`,
    method: 'post',
    data: {
      category_id,
      goods_ids
    }
  })
}

// 商品资料
export const readGoods = (id) => {
  return service({
    url: `admin/goods/read/${id}`
  })
}

// 设置商品轮播图
export const goodsCarousel = (id, data) => {
  return service({
    url: `/admin/goods/banners/${id}`,
    method: 'post',
    data
  })
}

// 选择sku规格值
export const chooseSkuNSetSkuCard = (id, data) => {
  return service({
    url: `/admin/goods_skus_card/${id}/set`,
    method: 'post',
    data
  })
}

// 恢复删除商品
export const restoreGoods = (ids) => {
  return service({
    url: `/admin/goods/restore`,
    method: 'post',
    data: {
      ids
    }
  })
}

// 彻底删除商品
export const destoryGoods = (ids) => {
  return service({
    url: `/admin/goods/destroy`,
    method: 'post',
    data: {
      ids
    }
  })
}
