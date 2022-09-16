<template>
  <div>
    <el-card shadow="never" class="border-0">
    <!-- 新增|刷新 -->
    <ListHeader @add="openDrawer" @refresh="refresh" showSec SecButtonText="批量删除" @secHandler="deleteBundle" :selection="ids"></ListHeader>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" stripe v-loading="loading" @selection-change="changeSelection">
      <el-table-column type="selection" prop="name">
      </el-table-column>
      <el-table-column prop="name" label="规格名称">
      </el-table-column>
      <el-table-column prop="default" label="规格值">
      </el-table-column>
      <el-table-column prop="order" label="排序">
      </el-table-column>
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
      <el-table-column label="操作" width="220" align="center">
        <template #default="{row}">
          <small v-if="row.super === 1">暂无操作</small>
          <div v-else>
            <el-button type="primary" size="small" text @click="editFn(row)"
              >修改</el-button
            >
            <el-popconfirm
              title="确认删除规格吗?"
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
      @confirm="addHandler">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        :inline="false">
        <el-form-item prop="name" label="规格名">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item prop="order" label="排序">
          <el-input-number v-model="formData.order" size="default" :min="0" :max="1000">
          </el-input-number>
        </el-form-item>
        <el-form-item prop="default" label="规格值">
          <TagInput v-model="formData.default"></TagInput>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
  import {ref, reactive} from 'vue'
  import {
    skusList,
    addSkus,
    updateSkus,
    updateSkusStatus,
    delSkus,
  } from '@/api/sku'
  import {ElNotification} from 'element-plus'

  const loading = ref(false)
  // 分页
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  // 获取列表数据
  const tableData = ref([])
  const getTableList = async (page) => {
    loading.value = true
    const res = await skusList(page)
    tableData.value = res.list
    total.value = res.totalCount
    loading.value = false
  }
  getTableList(currentPage.value)

  // 表单相关
  const drawerVisible = ref(false)
  const formData = reactive({
    name: '',
    status: 1,
    order: 50,
    default: ''
  })
  const resetFormData = () => {
    formData.name = ''
    formData.status = 1
    formData.order = 50
    formData.default = ''
  }
  const rules = {
    name: [{trigger: 'blur', required: true, message: '不能为空'}],
    status: [{trigger: 'blur', required: true, message: '不能为空'}],
    order: [{trigger: 'blur', required: true, message: '不能为空'}],
    default: [{trigger: 'blur', required: true, message: '不能为空'}],
  }
  // 新增
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
        addSkus(formData).then(() => {
          drawerVisible.value = false
          getTableList(currentPage.value)
          ElNotification({
            type: 'success',
            message: '添加成功',
          })
        })
      } else {
        // 编辑场景
        updateSkus(isEditId.value, formData).then(() => {
          drawerVisible.value = false
          getTableList(currentPage.value)
          ElNotification({
            type: 'success',
            message: '更新成功',
          })
        })
      }
    })
  }

  // 刷新
  const refresh = () => {
    getTableList(currentPage.value)
  }

  // 编辑
  const editFn = (row) => {
    isEditId.value = row.id
    formData.name = row.name
    formData.status = row.status
    formData.desc = row.desc
    drawerVisible.value = true
  }

  // 修改状态
  const changeStatus = ($event, id) => {
    updateSkusStatus(id, $event).then(async () => {
      ElNotification({
        type: 'success',
        message: '设置成功',
      })
    })
  }

  // 删除
  const confirmDel = (row) => {
    delSkus([row.id])
      .then(() => {
        getTableList(currentPage.value)
        ElNotification({
          type: 'success',
          message: '删除成功',
        })
      })
      .catch(() => {})
  }

  // 批量删除
  const ids = ref([])
  const changeSelection = (e) => {
    ids.value = e.map(item => item.id)
  }
  const deleteBundle = () => {
    delSkus(ids.value)
      .then(() => {
        getTableList(currentPage.value)
        ElNotification({
          type: 'success',
          message: '删除成功',
        })
      })
      .catch(() => {})
  }
</script>
