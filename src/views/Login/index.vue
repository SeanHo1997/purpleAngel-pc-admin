<template>
  <el-row class="min-h-screen bg-indigo-500">
    <el-col :span="16" class="flex justify-center items-center flex-col">
      <div>
        <div class="font-bold text-5xl text-light-50 mb-4">欢迎光临</div>
        <div class="text-light-50">Vue3 + Vite 商城后台管理系统</div>
      </div>
    </el-col>
    <el-col
      :span="8"
      class="bg-light-50 flex justify-center items-center flex-col">
      <div class="font-bold text-4xl">欢迎回来</div>
      <div class="text-lg text-gray-400 my-6 flex justify-center items-center">
        <span class="inline-block h-[1px] w-16 bg-gray-300"></span>
        <span class="inline-block mx-1">账号密码登录</span>
        <span class="inline-block h-[1px] w-16 bg-gray-300"></span>
      </div>
      <el-form :rules="rules" :model="form" class="w-[250px]" ref="loginForm">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入账号">
            <template #prefix>
              <el-icon>
                <user />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            type="password"
            show-password>
            <template #prefix>
              <el-icon>
                <lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="w-[250px]"
            round
            color="#626aef"
            @click="loginHandler"
            :loading="loading"
            >登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
  import {ref, reactive} from 'vue'
  import {ElNotification} from 'element-plus'
  import {useRouter} from 'vue-router'
  import {useStore} from 'vuex'
  import {addAsyncRoutes} from '@/router'

  const loginForm = ref(null)
  const router = useRouter()
  // const cookies = useCookies()
  const loading = ref(false)
  const store = useStore()

  // 表单数据
  const form = reactive({
    username: '',
    password: '',
  })
  // 表单校验规则
  const rules = {
    username: [{trigger: 'blur', required: true, message: '用户名不能为空'}],
    password: [{trigger: 'blur', required: true, message: '用户名不能为空'}],
  }

  // 登录事件
  const loginHandler = () => {
    loading.value = true
    loginForm.value.validate((valid) => {
      if (valid) {
        // console.log('验证通过')
        store.dispatch('user/getToken', {
            username: form.username,
            password: form.password,
          }).then(() => {
            store.dispatch('user/getUserInfo')
          }).then(() => {
            router.push('/')
            // 拿到token和info后
            ElNotification({
              message: '登录成功',
              type: 'success',
              duration: 3000,
            })
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        console.log('验证失败')
        return false
      }
    })
  }
</script>

<style lang=""></style>
