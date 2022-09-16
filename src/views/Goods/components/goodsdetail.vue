<template>
  <FormDrawer ref="formDrawerRef" :drawerVisible="drawerVisible" title="商品详情" size="60%" destroy-on-close @confirm="submit" @close="drawerVisible = false">
    <el-form :model="formData" ref="form" label-width="80px" destroy-on-close>
      <el-form-item label="">
        <TinyEditor v-model="formData.content"></TinyEditor>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import { readGoods, updateGoods } from '@/api/goods'
  import { ElNotification } from 'element-plus';
  
  const emit = defineEmits(['submited'])

  const drawerVisible = ref(false)
  const formData = reactive({
    content: ''
  })
  const goodsId = ref('')

  // 打开drawer
  const openDrawer = (row) => {
    goodsId.value = row.id
    readGoodsDetail(row.id)
    drawerVisible.value = true
  }

  // 读取商品资料
  const readGoodsDetail = (id) => {
    readGoods(id).then(res => {
      formData.content = res.content
      drawerVisible.value = true
    })
  }

  // 提交详情
  const submit = async () => {
    await updateGoods(goodsId.value, formData)
    drawerVisible.value = false
    emit('submited')
    ElNotification({
      message: '提交成功',
      type: 'success'
    })
  }

  defineExpose({
    openDrawer
  })
</script>

<style>
</style>