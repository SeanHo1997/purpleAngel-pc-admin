
export default {
  install(app) {
    app.directive('permission', {
      mounted(el, binding) {
        cojnsole.log(binding.value)
      }
    })
  }
}
