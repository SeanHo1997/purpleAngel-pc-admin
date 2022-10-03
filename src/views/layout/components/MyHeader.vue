<template>
  <div class="header">
    <span class="logo" @click="$router.push('/')">
      <el-icon class="mr-1">
        <eleme-filled />
      </el-icon>
      蓝精灵后台管理系统
    </span>
    <el-tooltip effect="dark" content="折叠" placement="bottom-start">
      <el-icon class="icon-btn" @click="toggleCollapse">
        <fold />
      </el-icon>
    </el-tooltip>
    <el-tooltip effect="dark" content="刷新" placement="bottom-start">
      <el-icon class="icon-btn" @click="refreshHandler">
        <refresh />
      </el-icon>
    </el-tooltip>
    <div class="ml-auto flex justify-center items-center">
      <el-tooltip effect="dark" content="全屏" placement="bottom-start">
        <el-icon class="icon-btn" @click="toggle">
          <full-screen v-if="isFullscreen" />
          <aim v-else />
        </el-icon>
      </el-tooltip>
      <el-dropdown class="dropdown" @command="commandHandler">
        <span class="el-dropdown-link flex items-center">
          <el-avatar
            class="mr-2"
            :size="25"
            :src="$store.getters.userInfo.avatar || 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'" />
          <div class="text-indigo-100">
            {{ $store.getters.userInfo.username }}
          </div>
          <el-icon class="el-icon-right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-item command="password">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </template>
      </el-dropdown>
    </div>
  </div>
  <!-- 退出登录对话框 -->
  <el-dialog
    v-model="dialogVisible"
    title="退出登录"
    width="30%">
    <span>确定退出登录吗?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = true">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <FormDrawer ref="formDrawer" title="修改密码" size="45%" @confirm="confirmChangePassword" :drawer="drawer" @close="closeDrawer">
    <el-form
      label-width="100px"
      :rules="rules"
      :model="passwordForm"
      ref="form">
      <el-form-item label="旧密码" prop="oldpassword">
        <el-input
          type="password"
          show-password
          placeholder="请输入旧密码"
          v-model="passwordForm.oldpassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input
          type="password"
          show-password
          placeholder="请输入新密码"
          v-model="passwordForm.password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="repassword">
        <el-input
          type="password"
          show-password
          placeholder="请再次输入新密码"
          v-model="passwordForm.repassword"></el-input>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
  import {useFullscreen} from '@vueuse/core'
  import {ElNotification} from 'element-plus'
  import {ref, reactive} from 'vue'
  import {useRouter} from 'vue-router'
  import {useStore} from 'vuex'
  import { updatePassword } from '@/api/manager'

  const store = useStore()
  const router = useRouter()
  const {isFullscreen, toggle} = useFullscreen()

  const dialogVisible = ref(false)

  const commandHandler = (command) => {
    if (command === 'password') {
      openDrawer()
    } else {
      logoutHandler()
    }
  }

  // 修改密码
  const drawer = ref(false)
  const formDrawer = ref(null)
  const openDrawer = () => {
    drawer.value = true
  }
  const closeDrawer = () => {
    drawer.value = false
  }
  const loading = ref(false)
  const form = ref(null)
  const passwordForm = reactive({
    oldpassword: '',
    password: '',
    repassword: ''
  })
  const rules = {
    oldpassword: [
      { trigger: 'blur', required: true, message: '旧密码不能为空' }
    ],
    password: [
    { trigger: 'blur', required: true, message: '密码不能为空' }
    ],
    repassword: [
    { trigger: 'blur', required: true, message: '新密码不能为空' }
    ],
  }

  // 确认修改密码
  const confirmChangePassword = () => {
    form.value.validate().then(async () => {
      loading.value = true
      const res = await updatePassword(passwordForm.oldpassword, passwordForm.password, passwordForm.repassword)
      // console.log(res)
      ElNotification({
        type: 'success',
        message: '密码修改成功',
        duration: 3000
      })
      
    }).finally(() => {
      loading.value = false
    })
  }


  // 退出登录
  const logoutHandler = () => {
    router.push('/login')
    store.commit('user/setToken', null)
    store.commit('user/setUserInfo', null)
    ElNotification({
      message: '已退出登录',
      duration: 3000
    })
  }

  // 刷新
  const refreshHandler = () => {
    location.reload()
  }

  // 折叠侧边栏
  const toggleCollapse = () => {
    store.commit('app/toggleCollapse')
  }
</script>

<style>
  .header {
    @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0 z-50;
    height: 64px;
  }

  .logo {
    width: 250px;
    @apply flex justify-center items-center text-xl font-thin cursor-pointer;
  }

  .icon-btn {
    @apply flex justify-center items-center mr-5 cursor-pointer;
    width: 42px;
    height: 64px;
  }

  .icon-btn:hover {
    @apply bg-indigo-600;
  }

  .dropdown {
    height: 64px;
    cursor: pointer;
    @apply flex justify-center items-center mx-5;
  }
</style>
