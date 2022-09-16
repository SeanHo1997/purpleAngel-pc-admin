import service from '@/utils/request'

// const queryFn = (queryParams) => {

// }

// 商品评价列表
export const goodsCommentList = (page) => {
  return service({
    url: `/admin/goods_comment/${page}`
    // ?title=${title}
  })
}

// 修改商品评价状态
export const updateGoodsCommentStatus = (id, status) => {
  return service({
    url: `/admin/goods_comment/${id}/update_status`,
    method: 'post',
    data: {
      status
    }
  })
}

// 回复商品评价
export const replyGoodsComment = (id, data) => {
  return service({
    url: `/admin/goods_comment/review/${id}`,
    method: 'post',
    data
  })
}
