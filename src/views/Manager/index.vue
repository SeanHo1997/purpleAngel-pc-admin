<template>
  <div>
    <el-card shadow="never" class="border-0">
    <!-- 搜索关键词 -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <el-input placeholder="管理员昵称" v-model="searchWord" clearable>
          <template #prepend> 关键词 </template>
        </el-input>
      </div>
      <div>
        <el-button type="primary" size="small" @click="searchHandler" class="mr-3"
          >搜索</el-button
        >
        <el-button type="default" size="small" @click="resetSearchHandler"
          >重置</el-button
        >
      </div>
    </div>
    <el-divider></el-divider>
    <ListHeader @add="openDrawer" @refresh="refresh"></ListHeader>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" stripe v-loading="loading">
      <el-table-column prop="title" label="管理员">
        <template #default="{row}">
          <div class="flex items-center">
            <el-avatar size="small" :src="row.avatar" />
            <div class="ml-3">
              <div>{{ row.username }}</div>
              <div>ID: {{ row.id }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="role.name" label="所属管理员" />
      <el-table-column prop="status" label="状态">
        <template #default="{row}">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus($event, row.id)"
            :disabled="row.super === 1" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="{row}">
          <small v-if="row.super === 1">暂无操作</small>
          <div v-else>
            <el-button type="primary" size="small" text @click="editFn(row)"
            >修改</el-button
            >
            <el-popconfirm
              title="确认删除此管理员吗?"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="confirmDel(row)">
              <template #reference>
                <el-button type="primary" size="small" text>删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row class="flex justify-center items-center mt-3">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :curren-page="currentPage"
        :page-size="pageSize"
        @current-change="getTableList(currentPage)">
      </el-pagination>
    </el-row>
    </el-card>

    <FormDrawer
      :title="isEditId ? '编辑' : '新增'"
      :drawerVisible="drawerVisible"
      @close="drawerVisible = false"
      @confirm="addHandler"
      destroy-on-close
      >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        :inline="false">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input type="password" show-password v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item prop="role_id" label="所属管理员">
          <el-select v-model="formData.role_id" placeholder="请选择角色管理员" size="large">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="是否启用">
          <el-switch v-model="formData.status"></el-switch>
        </el-form-item>
        <el-form-item prop="avatar" label="头像">
          <ChooseImage v-model="formData.avatar"></ChooseImage>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue'
  import {
    managerList,
    addManager,
    updateManager,
    delManager,
    updateMStatus,
  } from '@/api/manager'
  import { ElNotification } from 'element-plus'
  import bus from '@/utils/mitt'
  const loading = ref(false)

  // 搜索
  const searchWord = ref('')
  const searchHandler = () => {
    getTableList(currentPage.value, searchWord.value)
  }

  // 重置搜索
  const resetSearchHandler = () => {
    currentPage.value = 1
    searchWord.value = ''
    getTableList(currentPage.value)
  }

  // 分页
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  // 获取列表数据
  const tableData = ref([])
  const roles = ref([])
  const getTableList = async (page, keyword = '') => {
    loading.value = true
    const res = await managerList(page, keyword = '')
    tableData.value = res.list
    roles.value = res.roles // 所属管理员(角色)
    total.value = res.totalCount
    loading.value = false
  }
  getTableList(currentPage.value)

  // 删除
  const confirmDel = (row) => {
    delManager(row.id).then(() => {
      getTableList(currentPage.value)
      ElNotification({
        type: 'success',
        message: '删除成功',
      })
    }).catch(() => {})
  }

  // 表单相关
  const drawerVisible = ref(false)
  const formData = reactive({
    username: '',
    password: '',
    role_id: '',
    status: 0,
    avatar: '',
  })
  const rules = {
    username: [{trigger: 'blur', required: true, message: 'username不能为空'}],
    password: [{trigger: 'blur', required: true, message: 'password不能为空'}],
    role_id: [{trigger: 'blur', required: true, message: 'role_id不能为空'}],
    status: [{trigger: 'blur', required: true, message: 'status不能为空'}],
  }

  // 新增drawer打开
  const openDrawer = () => {
    isEditId.value = 0
    resetFormData()
    drawerVisible.value = true
  }

  // 确认新增
  const formRef = ref(null)
  const isEditId = ref(0) // 创建变量用于区分业务场景
  const addHandler = () => {
    formRef.value.validate().then(() => {
      if (!isEditId.value) {
        // 新增场景
        addManager(formData).then(() => {
          drawerVisible.value = false
          getTableList(currentPage.value)
          ElNotification({
            type: 'success',
            message: '添加成功',
          })
        })
      } else {
        // 编辑场景
        updateManager(isEditId.value, formData).then(
          () => {
            drawerVisible.value = false
            getTableList(currentPage.value)
            ElNotification({
              type: 'success',
              message: '更新成功',
            })
          }
        )
      }
    })
  }
  // 刷新
  const refresh = () => {
    getTableList(currentPage.value)
  }

  const resetFormData = () => {
    formData.username = ''
    formData.password = ''
    formData.role_id = ''
    formData.status = 0
    formData.avatar = ''
  }

  // 编辑
  const editFn = (row) => {
    isEditId.value = row.id
    formData.username = row.username
    formData.avatar = row.avatar
    formData.role_id = row.role_id
    formData.status = row.status
    drawerVisible.value = true
  }

  // 修改管理员状态
  const changeStatus = ($event, id) => {
    updateMStatus(id ,$event).then(() => {
      ElNotification({
        type: 'success',
        message: '更新成功'
      })
    })
  }

  // 头像
  onMounted(() => {
    bus.on('image', (url) => {
      formData.avatar = url
    })
  })
</script>
