import service from '@/utils/request'

// 菜单权限列表
export const ruleList = () => {
  return service({
    url: `/admin/rule/1`
  })
}

// 增加角色
export const addRule = (data) => {
  return service({
    url: '/admin/rule',
    method: 'post',
    data
  })
}

// 修改菜单权限
export const updateRule = (data) => {
  return service({
    url: `/admin/rule/193`,
    method: 'post',
    data
  })
}

// 删除菜单权限
export const delRule = (id) => {
  return service({
    url: `/admin/rule/${id}/delete`,
    method: 'post'
  })
}

// 修改菜单权限状态
export const RuleStatus = (id, status) => {
  return service({
    url: `/admin/rule/${id}/update_status`,
    method: 'post',
    data: {
      status
    }
  })
}

