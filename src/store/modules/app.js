
export default {
  namespaced: true,
  state: () => {
    return {
      isCollapse: false
    }
  },
  mutations: {
    toggleCollapse (state) {
      state.isCollapse = !state.isCollapse
    }
  }
}
