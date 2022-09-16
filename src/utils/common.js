// import {ElNotification} from 'element-plus'
// import { ref } from 'vue'


// // 代码逻辑复用模块
// export const initTable = (options = {}) => {

//   // 搜索管理员
//   const searchKey = ref('')
//   const searchManager = () => {
//     getTableList(currentPage.value, searchKey.value)
//   }
//   // 重置搜索
//   const resetSearchManager = () => {
//     currentPage.value = 1
//     getTableList(currentPage.value)
//   }

//   const loading = ref(false)
//   // 分页
//   const total = ref(0)
//   const currentPage = ref(1)
//   const pageSize = ref(10)
//   // 获取列表数据
//   const tableData = ref([])
//   const roles = ref([])
//   const getTableList = async (page, keyword = '') => {
//     loading.value = true
//     const res = await options.tableList(page, keyword = '')
//     if (options.onGetListSuccess && typeof options.onGetListSuccess === 'function') {
//       options.onGetListSuccess(res)
//     } else {
//       tableData.value = res.list
//       // roles.value = res.roles // 所属管理员(角色)
//       total.value = res.totalCount
//       loading.value = false
//     }
//   }
//   getTableList(currentPage.value)
//   // 删除
//   const confirmDel = (row) => {
//     deleteFn(row.id).then(() => {
//       getTableList(currentPage.value)
//       ElNotification({
//         type: 'success',
//         message: '删除成功',
//       })
//     }).catch(() => {})
//   }

//   return {
//     searchManager,
//     searchKey,
//     resetSearchManager,
//     loading,
//     total,
//     currentPage,
//     pageSize,
//     tableData,
//     roles,
//     getTableList,
//     confirmDel
//   }
// }
