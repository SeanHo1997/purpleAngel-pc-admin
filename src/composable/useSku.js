import { reactive, ref, nextTick } from 'vue'
import { addSkuItem, updateSkuItem, deleteSkuItem, sortSkuItem, addSkuItemValue, updateSkuItemValue, deleteSkuItemValue } from '@/api/sku'
import { ElNotification } from 'element-plus'

export const goodsSkusList = ref([])
export const goodsId = ref(0)

// 添加商品规格
export const addSkuData = reactive({
  goods_id: 0, //商品ID
  name: '', //规格名称
  order: 50, //排序
  type: 0 //规格类型 0文字
})

// 添加规格
export const onaddingSku = () => {
  // 此时赋值id才有效
  addSkuData.goods_id = goodsId.value
  goodsSkusList.value.push(addSkuData)
}

// 确认添加规格
export const addSkuHandler = async () => {
  const res = await addSkuItem(addSkuData)
  goodsSkusList.value.push({
    ...res,
    goodsSkusCardValue: []
  })
  ElNotification({
    message: '添加规格成功',
    type: 'success'
  })
}

// 修改商品规格
export const updateSkuItemHandler = async (item) => {
  addSkuData.goods_id = item.goods_id
  addSkuData.name = item.name
  addSkuData.order = item.order

  await updateSkuItem(item.id, addSkuData)
  ElNotification({
    message: '修改规格成功',
    type: 'success'
  })
}

// 删除商品规格
export const deleteSkuHandler = async (id) => {
  await deleteSkuItem(id)

  ElNotification({
    message: '删除规格成功',
    type: 'success'
  })
}

const swapArray = (arr, i1, i2) => {
  // const tempItem = arr[i1]
  // arr[i1] = arr[i2]
  // arr.splice(i2, 1)
  // arr[i2 - 1] = tempItem
  // return arr
  arr[i1] = arr.splice(arr[i2], 1, arr[i1])[0]
  return arr
}

// 上一项
const moveUp = (arr, i) => {
  swapArray(arr, i, i - 1)
}

// 下一项
const moveDown = (arr, i) => {
  swapArray(arr, i, i + 1)
}

// 排序规格选项
export const sortCard = (action, i) => {
  if (action === 'up') {
    moveUp(goodsSkusList.value, i)
  } else {
    moveDown(goodsSkusList.value, i)
  }

  const clonedList = goodsSkusList.value.map((item, index) => {
    return {
      id: item.id,
      order: index + 1
    }
  })

  sortSkuItem(clonedList).then(() => {
    ElNotification({
      message: '排序成功',
      type: 'success'
    })
  })
}
