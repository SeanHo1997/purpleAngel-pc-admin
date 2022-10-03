import { reactive, ref } from 'vue'
import { sortSkuItem, addSkuItemValue, updateSkuItemValue, deleteSkuItemValue } from '@/api/sku'
import { ElNotification } from 'element-plus'
import { chooseSkuNSetSkuCard } from '@/api/goods'

export const goodsSkusList = ref([])
export const editStatus = ref(false)

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
  return swapArray(arr, i, i - 1)
}

// 下一项
const moveDown = (arr, i) => {
  return swapArray(arr, i, i + 1)
}

// 排序规格选项
export const sortCard = (action, i) => {
  if (action === 'up') {
    goodsSkusList.value = moveUp(goodsSkusList.value, i)
  } else {
    goodsSkusList.value = moveDown(goodsSkusList.value, i)
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

// 设置选择规格
const loading = ref(false)
export const chooseSkuNSetSkuCardHanlder = (id, data) => {
  const item = goodsSkusList.value.find(item => item.id === id)
  loading.value = true
  chooseSkuNSetSkuCard(id, data).then(res => {
    console.log(res)
    item.name = item.text = res.goods_skus_card.name
    item.goodsSkusCardValue = res.goods_skus_card_value.map(o => {
      o.text = o.value || '属性值'
      return o
    }).fianlly(() => {
      loading.value = false
    })
  })
}
