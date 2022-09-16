<template>
  <el-container class="image-material bg-white rounded" :style="{ height: h + 'px' }">
    <el-header class="image-header px-0">
      <el-button type="primary" @click="addNewClass" class="mr-3">新增图库分类</el-button>
      <el-button type="warning" @click="uploadImage">上传图片</el-button>
    </el-header>
    <el-container :style="{ height: h + 'px' }">
      <Aside ref="asideRef"></Aside>
      <el-container>
        <Main ref="mainRef" :showCheckBox="props.showCheckBox"></Main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup>
  import { ref } from 'vue'
  import Aside from './components/aside.vue'
  import Main from './components/main.vue'

  const windowHeight = window.innerHeight || document.body.clientHeight
  const h = windowHeight - 44 - 64

  const props = defineProps({
    showCheckBox: {
      type: Boolean,
      defualt: false
    }
  })

  // 新增图库分类
  const asideRef = ref(null)
  const addNewClass = () => {
    asideRef.value.resetFormData()
    asideRef.value.drawerVisible = true
  }

  // 上传图片
  const mainRef = ref(null)
  const uploadImage = () => {
    mainRef.value.drawerVisible = true
  }
</script>

<style scoped>
  .image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
  }
</style>
