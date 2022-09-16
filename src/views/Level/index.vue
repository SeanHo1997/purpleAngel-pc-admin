<template>
  <div>
    <el-card shadow="never" class="border-0">
    <!-- 新增|刷新 -->
    <ListHeader @add="openDrawer" @refresh="refresh"></ListHeader>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" stripe v-loading="loading">
      <el-table-column prop="name" label="会员等级">
      </el-table-column>
      <el-table-column prop="level" label="等级权重">
      </el-table-column>
      <el-table-column prop="discount" label="折扣率(%)">
      </el-table-column>
      <el-table-column label="启用状态">
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
              title="确认删除会员等级吗?"
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
        label-width="120px"
        :inline="false">
        <el-form-item prop="name" label="会员等级名称">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item prop="level" label="等级权重">
          <el-input type="number" v-model="formData.level"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item prop="max_price" label="升级条件">
          <div>
            <small class="text-xs mr-2">消费金额满</small>
            <el-input type="number" v-model="formData.max_price" style="width: 50%"><template #append>元</template></el-input>
            <small class="text-gray-500 text-xs flex">设置会员等级所需要的累计消费必须大于等于0, 单位: 元</small>
          </div>
          <div>
            <small class="text-xs mr-2">消费次数满</small>
            <el-input type="number" v-model="formData.max_times" style="width: 50%"><template #append>次</template></el-input>
            <small class="text-gray-500 text-xs flex">设置会员等级所需要的购买量必须大于等于0, 单位: 次</small>
          </div>
        </el-form-item>
        <el-form-item prop="discount" label="折扣率">
          <el-input type="number" v-model="formData.discount"><template #append>(%)</template></el-input>
          <small class="text-gra-500">折扣率单位为百分比,如输入90,表示该会员等级的用户可以以商品原价的90%购买</small>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
  import {ref, reactive} from 'vue'
  import {
    levelList,
    addLevel,
    updateLevel,
    updateLevelStatus,
    deleteLevel,
  } from '@/api/level'
  import {ElNotification} from 'element-plus'
  import {ruleList} from '@/api/access'

  const loading = ref(false)
  // 分页
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  // 获取列表数据
  const tableData = ref([])
  const getTableList = async (page) => {
    loading.value = true
    const res = await levelList(page)
    tableData.value = res.list
    total.value = res.totalCount
    loading.value = false
  }
  getTableList(currentPage.value)

  // 删除
  const confirmDel = (row) => {
    deleteLevel(row.id)
      .then(() => {
        getTableList(currentPage.value)
        ElNotification({
          type: 'success',
          message: '删除成功',
        })
      })
      .catch(() => {})
  }

  // 表单相关
  const drawerVisible = ref(false)
  const formData = reactive({
    name: '', // 等级名称
    level: 1, // 等级权重
    status: 0, // 状态：0禁用1启用
    discount: 75, // 折扣率(%)
    max_price: 2000, // 累计消费金额
    max_times: 3 // 累计消费次数
  })
  const resetFormData = () => {
    formData.name = ''
    formData.level = 1
    formData.status = 0
    formData.discount = 75
    formData.max_price = 2000
    formData.max_times = 3
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
        addLevel(formData).then(() => {
          drawerVisible.value = false
          getTableList(currentPage.value)
          ElNotification({
            type: 'success',
            message: '添加成功',
          })
        })
      } else {
        // 编辑场景
        updateLevel(isEditId.value, formData).then(() => {
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
    formData.level = row.level
    formData.status = row.status
    formData.discount = row.discount
    formData.max_price = row.max_price
    formData.max_times = row.max_times
    drawerVisible.value = true
  }

  // 修改状态
  const changeStatus = ($event, id) => {
    updateLevelStatus(id, $event).then(async () => {
      ElNotification({
        type: 'success',
        message: '设置成功',
      })
    })
  }
</script>
