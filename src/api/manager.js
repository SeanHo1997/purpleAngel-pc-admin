import service from '@/utils/request'

// 登录
export const login = (username, password) => {
  return service({
    url: '/admin/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

// 获取管理员信息
export const userInfo = () => {
  return service({
    url: '/admin/getinfo',
    method: 'post'
  })
}

// 修改密码
export const updatePassword = (oldpassword, password, repassword) => {
  return service({
    url: '/admin/updatepassword',
    method: 'post',
    data: {
      oldpassword,
      password,
      repassword
    }
  })
}

// 管理员列表
export const managerList = (page, keyword = '') => {
  return service({
    url: `/admin/manager/${page}?limit=10&keyword=${keyword}`
  })
}

// 新增管理员
export const addManager = (data) => {
  return service({
    url: '/admin/manager',
    method: 'post',
    data
  })
}

// 修改管理员
export const updateManager = (id, data) => {
  return service({
    url: `/admin/manager/${id}`,
    method: 'post',
    data
  })
}

// 删除管理员
export const delManager = (id) => {
  return service({
    url: `/admin/manager/${id}/delete`,
    method: 'post'
  })
}

// 修改管理员状态
export const updateMStatus = (id, status) => {
  return service({
    url: `/admin/manager/${id}/update_status`,
    method: 'post',
    data: {
      status
    }
  })
}
