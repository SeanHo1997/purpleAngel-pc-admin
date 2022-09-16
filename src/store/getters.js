export default {
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  avatar: state => state.user.userInfo.avatar,
  isCollapse: state => state.app.isCollapse,
  menus: state => state.user.userInfo.menus,
  ruleNames: state => state.user.userInfo.ruleNames
}
