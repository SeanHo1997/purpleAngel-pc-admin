import service from '@/utils/request'

// 会员等级列表
export const levelList = (page) => {
  return service({
    url: `admin/user_level/${page}`
  })
}

// 增加会员等级
export const addLevel = data => {
  return service({
    url: `/admin/user_level`,
    method: 'post',
    data
  })
}

// 修改会员等级
export const updateLevel = (id, data) => {
  return service({
    url: `/admin/user_level/${id}`,
    method: 'post',
    data
  })
}

// 修改会员等级状态
export const updateLevelStatus = (id, status) => {
  return service({
    url: `/admin/user_level/${id}/update_status`,
    method: 'post',
    data: {
      status
    }
  })
}

// 删除会员等级

export const deleteLevel = (id) => {
  return service({
    url: `/admin/user_level/${id}/delete`,
    method: 'post'
  })
}

