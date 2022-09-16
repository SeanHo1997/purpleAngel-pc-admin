<template>
  <el-drawer title="物流信息" v-model="drawerVisible" size="45%" destroy-on-close>
    <el-card shadow="never">
      <!-- card body -->
      <div class="flex items-center">
        <el-image
          :src="info.logo"
          fit="fill"
          :lazy="true"
          style="width: 60; height: 60px"
          class="rounded border mr-3"></el-image>
        <div>
          <p>物流公司: {{ info.typename }}</p>
          <p>物流单号: {{ info.number }}</p>
        </div>
      </div>
    </el-card>

    <el-card shadow="never">
      <!-- card body -->
      <el-timeline>
        <el-timeline-item placement="top" v-for="item in info.list" :key="item.time" :timestamp="item.time">
          <el-card>
            <h4>{{ item.status }}</h4>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </el-drawer>
</template>

<script setup>
  import {ref} from 'vue'
  import {ShippingInfo} from '@/api/order'
  import { ElNotification } from 'element-plus'

  // drawer表单
  const drawerVisible = ref(false)

  // 打开drawer
  const id = ref(0)
  const info = ref({})
  const openDrawer = (val) => {
    id.value = val
    ShippingInfo(id.value).then((res) => {
      if (res.status !== 0) return ElNotification({
        message: res.msg
      })
      info.value = res.result
      drawerVisible.value = true
    })
  }

  defineExpose({
    openDrawer,
  })
</script>

<style></style>
