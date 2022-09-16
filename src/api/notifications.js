import service from '@/utils/request'

// 公告列表
export const notiList = (page) => {
  return service({
    url: `/admin/notice/${page}`
  })
}

// 删除公告
export const delNoti = (id) => {
  return service({
    url: `/admin/notice/${id}/delete`,
    method: 'post'
  })
}

// 新增公告
export const addNoti = (data) => {
  return service({
    url: `/admin/notice`,
    method: 'post',
    data
  })
}

// 修改公告
export const updateNoti = (id, data) => {
  return service({
    url: `/admin/notice/${id}`,
    method: 'post',
    data
  })
}
