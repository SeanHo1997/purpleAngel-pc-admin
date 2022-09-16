import { createStore } from 'vuex'
import user from './modules/user'
import app from './modules/app'
import getters from './getters'

const store = createStore({
  modules: {
    user,
    app,
    // imageMaterial
  },
  getters
})

export default store