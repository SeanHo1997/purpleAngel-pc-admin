<template>
  <el-tag
    v-for="sku in props.skuItem.goodsSkusCardValue"
    :key="sku.value"
    class="mx-1"
    closable
    :disable-transitions="false"
    @close="handleClose(sku.id)">
    <!-- {{ sku.value }} -->
    <el-input v-model="sku.value" placeholder="选项值" size="small" @change="handleChange(sku)"></el-input>
  </el-tag>
  <el-input
    v-if="inputVisible"
    ref="InputRef"
    v-model="inputValue"
    class="ml-1 w-20"
    size="small"
    @keyup.enter="handleInputConfirm(props.skuItem.id, props.skuItem.name)"
    @blur="handleInputConfirm(props.skuItem.id, props.skuItem.name)" />
  <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
    新增规格值
  </el-button>
</template>

<script setup>
  import { nextTick, ref } from 'vue'
  // import {
  //   inputValue,
  //   inputVisible,
  //   InputRef,
  //   handleClose,
  //   showInput,
  //   handleInputConfirm
  // } from '@/composable/useSku'
  import { addSkuItemValue, updateSkuItemValue, deleteSkuItemValue } from '@/api/sku'
  import { ElNotification } from 'element-plus'

  const props = defineProps({
    skuItem: {
      type: Object,
      required: true,
    }
  })

// 增删改商品规格选项
 const inputValue = ref('')
 const inputVisible = ref(false)
 const InputRef = ref(null)

 const handleClose = (id) => {
  // 提交请求
  deleteSkuItemValue(id).then(() => {
    // 本地更新
    props.skuItem.goodsSkusCardValue.splice(props.skuItem.goodsSkusCardValue.findIndex(skuValue => skuValue.id === id), 1)
    ElNotification({
      message: '删除成功',
      type: 'success'
    })
  })

}

 const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}

// 确认添加选项值
 const handleInputConfirm = (skuId, skuName) => {
  if (inputValue.value) {
    // 服务器更新
    const postData = {
      goods_skus_card_id: skuId, //规格ID
      name: skuName, //规格名称
      order: 50, //排序
      value: inputValue.value //规格选项名称
    }
    addSkuItemValue(postData).then((res) => {
      inputVisible.value = false
      inputValue.value = ''
      // 本地更新
      props.skuItem.goodsSkusCardValue.push(res)
      ElNotification({
        message: '添加值成功',
        type: 'success'
      })
    })
  }
}

// 修改选项值
const handleChange = (sku) => {
  console.log(sku)
  updateSkuItemValue(sku.id, sku).then(() => {
    ElNotification({
        message: '更新成功',
        type: 'success'
      })
  })
}
</script>
