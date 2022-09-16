<template>
  <div>
    <el-card shadow="never" class="border-0">
    <ListHeader @add="openDrawer" @refresh="refresh"></ListHeader>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" stripe v-loading="loading">
      <el-table-column prop="name" label="优惠券名称" width="350px">
        <template #default="{ row }">
          <div class="border border-dashed py-2 px-4 rounded" :class=" formatStatus(row) === '领取中' ? 'active-status' : 'inactive-status'">
            <h5 class="font-bold text-md">{{ row.name }}</h5>
            <small>{{ row.start_time }} ~ {{ row.end_time  }}</small>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <span>{{ formatStatus(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="优惠类型">
        <template #default="{ row }">
          <el-tag>{{ row.type === 0 ? '满减' : '折扣' }} {{ row.type ? '￥'+row.value : row.value }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="发行数量">
      </el-table-column>
      <el-table-column prop="used" label="已使用">
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <div>
            <el-button v-if="formatStatus(row) === '未开始'"  text type="primary" @click="editFn(row)">修改</el-button>
            <el-popconfirm
              v-if="formatStatus(row) === '领取中'" 
              title="确认删除吗?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="confirmDel(row)">
              <template #reference>
                <el-button text type="primary">删除</el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
              v-if="formatStatus(row) !== '领取中'" 
              title="确认失效吗?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="changeStatus(row.id)">
              <template #reference>
                <el-button text type="danger">失效</el-button>
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
        <el-form-item prop="name" label="优惠券名称">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="优惠券类型">
          <el-radio-group v-model="formData.type" class="ml-4">
            <el-radio :label="0" size="large">满减</el-radio>
            <el-radio :label="1" size="large">折扣</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="value" label="面值">
          <el-input v-model="formData.value">
            <template #append>
              {{ formData.type ? '折' : '元' }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="total" label="发行量">
          <el-input-number v-model="formData.total" :min="0" :max="10000"></el-input-number>
        </el-form-item>
        <el-form-item prop="min_price" label="最低使用价格">
          <el-input v-model="formData.min_price"></el-input>
        </el-form-item>
        <el-form-item prop="end_time" label="活动时间">
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item prop="order" label="排序">
          <el-input-number v-model="formData.order" size="default" :min="0" :max="1000" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
  import {ref, reactive, computed} from 'vue'
  import {
    couponList,
    addCoupon,
    updateCoupon,
    updateCouponStatus,
    delCoupon,
  } from '@/api/coupon'
  import {ElNotification} from 'element-plus'

  const loading = ref(false)
  // 分页
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  // 获取列表数据
  const tableData = ref([])
  const roles = ref([])
  const getTableList = async (page) => {
    loading.value = true
    const res = await couponList(page)
    tableData.value = res.list
    total.value = res.totalCount
    loading.value = false
  }
  getTableList(currentPage.value)

  // 表单相关
  const drawerVisible = ref(false)
  const formData = reactive({
    name: '',
    type: 0,
    value: 0,
    total: 1000,
    min_price: 0,
    start_time: '',
    end_time: '',
    order: 50
  })
  const resetFormData = () => {
    formData.name = ''
    formData.type = 0
    formData.value = 0
    formData.total = 1000
    formData.min_price = 0
    formData.start_time = ''
    formData.end_time = ''
    formData.order = 50
  }

  // 状态转化函数
  const formatStatus = (row) => {
    let status = '领取中'
    const start_timeStamp = (new Date(row.start_time)).getTime()
    const end_timeStamp = (new Date(row.end_time)).getTime()
    const now = new Date().getTime()
    if (now < start_timeStamp) {
      status = '未开始'
    } else if (now > end_timeStamp) {
      status = '已结束'
    } else if (row.status === 0) {
      status = '已失效'
    }
    return status
  }
  // 时间选择
  const timeRange = computed({
    get() {
      return formData.start_time && formData.end_time ? [formData.start_time, formData.end_time] : []
    },
    set (val) {
      formData.start_time = val[0]
      formData.end_time = val[1]
    }
  })
  // 确认之前转换时间为时间戳
  const beforeSubmit = () => {
    formData.start_time = new Date(formData.start_time).getTime()
    formData.end_time = new Date(formData.end_time).getTime()
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
      beforeSubmit()
      if (!isEditId.value) {
        // 新增场景
        addCoupon(formData).then(() => {
          drawerVisible.value = false
          getTableList(currentPage.value)
          ElNotification({
            type: 'success',
            message: '添加成功',
          })
        })
      } else {
        // 编辑场景
        updateCoupon(isEditId.value, formData).then(() => {
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
    formData.name = row.name
    formData.type = row.type
    formData.value = row.value
    formData.total = row.total
    formData.min_price = row.min_price
    formData.start_time = row.start_time
    formData.end_time = row.end_time
    formData.order = row.order
    isEditId.value = row.id
    drawerVisible.value = true
  }

  // 修改状态
  const changeStatus = (id) => {
    updateCouponStatus(id, 0).then(async () => {
    getTableList(currentPage.value)
      ElNotification({
        type: 'success',
        message: '设置成功',
      })
    })
  }

  // 删除
  const confirmDel = (row) => {
    delCoupon(row.id)
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

<style>
  .active-status {
    @apply border-rose-200 bg-rose-50 text-rose-400;
  }
  .inactive-status {
    @apply border-gray-200 bg-gray-50 text-gray-400;
  }
</style>
