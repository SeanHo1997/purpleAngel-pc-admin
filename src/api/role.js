import service from '@/utils/request'

// 角色列表
export const roleList = (page) => {
  return service({
    url: `/admin/role/${page}`
  })
}

// 增加角色
export const addRole = data => {
  return service({
    url: `/admin/role`,
    method: 'post',
    data
  })
}

// 修改角色
export const updateRole = (id, data) => {
  return service({
    url: `/admin/role/${id}`,
    method: 'post',
    data
  })
}

// 删除角色
export const delRole = (id) => {
  return service({
    url: `/admin/role/${id}/delete`,
    method: 'post'
  })
}

// 修改角色状态
export const roleStatus = (id, status) => {
  return service({
    url: `/admin/role/${id}/update_status`,
    method: 'post',
    data: {
      status
    }
  })
}

// 配置角色权限
export const setPermission = (data) => {
  return service({
    url: `/admin/role/set_rules`,
    method: 'post',
    data
  })
}