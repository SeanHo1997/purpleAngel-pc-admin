<template>
  <el-card shadow="never" :body-style="{padding: '20px'}" v-loading="loading">
    <el-form :model="form" label-width="160px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="物流查询key" label-width="120px">
          <el-input v-model="form.ship" placeholder="物流查询key"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" @click="submit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-form>
  </el-card>
</template>

<script setup>
  import {reactive, ref} from 'vue'
  import { sysconfig, updateSysconfig } from '@/api/setting'
  import {ElNotification} from 'element-plus'

  const loading = ref(false)
  const form = reactive({
    ship: ''
  })

  // 获取默认配置
  const getSysconfig = () => {
    loading.value = true
    sysconfig()
      .then((res) => {
        console.log(res)
        for (const key in form) {
          form[key] = res[key]
        }
        // form.password_encrypt = form.password_encrypt.split(',')
      })
      .finally(() => {
        loading.value = false
      })
  }

  // 修改配置
  const submit = () => {
    loading.value = true
    updateSysconfig(form)
      .then(() => {
        // form.password_encrypt = form.password_encrypt.join(',')
        getSysconfig()
        ElNotification({
          type: 'success',
          message: '更新成功',
        })
      })
      .finally(() => {
        loading.value = false
      })
  }
</script>

<style scoped>
  .el-tabs__header {
    margin-bottom: 32px;
  }
</style>
