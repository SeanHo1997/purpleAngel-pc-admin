<template>
  <el-dialog
    title="规格选择"
    v-model="dialogVisible"
    width="80%"
    top="5vh">
    <el-container style="height: 65vh">
      <el-aside width="220px">
        <div class="top">列表</div>
        <div class="bottom">分页</div>
      </el-aside>
      <el-main>内容</el-main>
    </el-container>
    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref } from 'vue'

  const dialogVisible = ref(false)

  const open = () => {
    dialogVisible.value = true
  }

  const submit = () => {}

  defineExpose({
    open
  })
</script>

<style>
</style>