<template>
  <div>
    <el-card shadow="never" class="border-0">
    <!-- 新增|刷新 -->
    <ListHeader @add="openDrawer" @refresh="refresh"></ListHeader>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" stripe v-loading="loading">
      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="创建时间" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="{row}">
          <el-button type="primary" size="small" text @click="editFn(row)">修改</el-button>
          <el-popconfirm
            title="确认删除此公告吗?"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="confirmDel(row.id)">
            <template #reference>
              <el-button type="primary" size="small" text>删除</el-button>
            </template>
          </el-popconfirm>
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
      @current-change="getNotiList(currentPage)" />
    </el-row>
    </el-card>
    <!-- 新增公告 -->
    <FormDrawer :title=" isEditId ? '编辑公告' : '新增公告' " :drawerVisible="drawerVisible" @close="drawerVisible = false" @confirm="addNotiHandler">
      <el-form ref="formRef" :model="formData" label-width="120px" :inline="false">
        <el-form-item prop="title" label="公告标题">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="公告内容">
          <el-input type="textarea" v-model="formData.content"></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
  import {ref, reactive} from 'vue'
  import {notiList, delNoti, addNoti, updateNoti} from '@/api/notifications.js'
  import {ElNotification} from 'element-plus'
  const loading = ref(false)

  // 分页
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  // 获取表格数据
  const tableData = ref([])
  const getTableList = (page) => {
    loading.value = true
    notiList(page).then((res) => {
      tableData.value = res.list
      total.value = res.totalCount
    })
    loading.value = false
  }
  getTableList(currentPage.value)

  // 删除公告
  const confirmDel = (id) => {
    delNoti(id).then(() => {
      getTableList(currentPage.value)
      ElNotification({
        type: 'success',
        message: '删除成功',
      })
    }).catch(() => {})
  }

  // 表单
  const drawerVisible = ref(false)
  const formData = reactive({
    title: '',
    content: ''
  })
  const resetFormData = () => {
    formData.title = ''
    formData.content = ''
  }

  // 打开新增公告
  const openDrawer = () => {
    isEditId.value = 0
    resetFormData()
    drawerVisible.value = true
  }

  // 确认添加公告
  const formRef = ref(null)
  const isEditId = ref(0) // 创建变量用于区分业务场景
  const addNotiHandler = () => {
    formRef.value.validate().then(() => {
      if (!isEditId.value) {
      // 新增场景
      addNoti(formData).then(() => {
      drawerVisible.value = false
      getTableList(currentPage.value)
      ElNotification({
        type: 'success',
        message: '公告发布成功'
      })
    })
      } else {
        // 编辑场景
        updateNoti(isEditId.value, formData).then(() => {
          drawerVisible.value = false
          getTableList(currentPage.value)
          ElNotification({
            type: 'success',
            message: '编辑公告成功'
          })
        })
      }
    })
  }

  // 刷新
  const refresh = () => {
    getNotiList(currentPage.value)
  }

  // 编辑公告
  const editFn = (row) => {
    isEditId.value = row.id
    formData.title = row.title
    formData.content = row.content
    drawerVisible.value = true
  }
</script>

<style></style>
