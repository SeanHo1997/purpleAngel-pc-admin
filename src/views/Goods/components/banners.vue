<template>
  <el-drawer title="设置轮播图" v-model="drawerVisible" direction="rtl" size="50%"
    :destroy-on-close="true">
    <el-form :model="formData" ref="form" label-width="80px" :inline="false" size="default">
      <el-form-item label="轮播图">
        <ChooseImage v-model="formData.banners"></ChooseImage>
      </el-form-item>
      <el-form-item>
        <div class="w-[100%] flex justify-evenly mt-7">
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button>取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import { readGoods, goodsCarousel } from '@/api/goods'
  import { ElNotification } from 'element-plus';
  
  const emit = defineEmits(['submited'])

  const drawerVisible = ref(false)
  const formData = reactive({
    banners: []
  })

  // 打开drawer
  const goodsId = ref('')
  const openDrawer = (row) => {
    goodsId.value = row.id
    readGoodsDetail(row.id)
    drawerVisible.value = true
  }

  // 读取商品资料
  const readGoodsDetail = (id) => {
    readGoods(id).then(res => {
      formData.banners = res.goodsBanner.map(item => item.url)
    })
  }

  // 提交轮播图
  const submit = async () => {
    await goodsCarousel(goodsId.value, formData)
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