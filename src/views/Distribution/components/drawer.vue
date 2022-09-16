<template>
  <el-drawer :title="tt" v-model="dialogVisible" size="45%">
    <el-form :model="searchForm">
      <el-form-item label="时间选择">
        <el-radio-group v-model="searchForm.type">
          <el-radio label="all">全部</el-radio>
          <el-radio label="today">今天</el-radio>
          <el-radio label="yestoday">昨天</el-radio>
          <el-radio label="last7days">最近七天</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="searchForm.endtime" type="date" placeholder="开始时间" value-format="YYYY-MM-DD"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker v-model="searchForm.starttime" type="date" placeholder="结束时间" value-format="YYYY-MM-DD"></el-date-picker>
      </el-form-item>
      <el-form-item label="关键词">
        <el-input v-model="searchForm.keyword" placeholder="订单编号" clearable size="default"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-radio-group v-model="searchForm.level">
          <el-radio :label="0">全部</el-radio>
          <el-radio :label="1">一级推广</el-radio>
          <el-radio :label="2">二级推广</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandler">搜索</el-button>
        <el-button @click="resetSearchHandler">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 搜索关键词 -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <el-radio-group v-model="searchForm.type">
          <el-radio label="all">全部</el-radio>
          <el-radio label="today">今天</el-radio>
          <el-radio label="yestoday">昨天</el-radio>
          <el-radio label="last7days">最近七天</el-radio>
        </el-radio-group>
        <div>
          <el-date-picker v-model="searchForm.endtime" type="date" placeholder="开始时间" value-format="YYYY-MM-DD"></el-date-picker>
          <el-date-picker v-model="searchForm.starttime" type="date" placeholder="结束时间" value-format="YYYY-MM-DD"></el-date-picker>
          <el-input v-model="searchForm.keyword" placeholder="订单编号" clearable size="default"></el-input>
        </div>
      </div>
      <div>
      </div>
    </div>
    <el-divider></el-divider>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" stripe v-loading="loading">
      <template v-if="props.type === 'user'">
        <el-table-column prop="id" label="ID" />
        <el-table-column label="头像">
          <template #default="{ row }">
            <el-avatar size="40" :src="row.avatar">
              <!-- <img src="" alt=""> -->
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户信息" />
        <el-table-column prop="share_num" label="推广数量" />
        <el-table-column prop="share_order_num" label="推广订单数量" />
        <el-table-column prop="create_time" label="绑定时间" />
      </template>
      <template v-else>
        <div>
          <el-table-column label="订单号">
            <template #default="{ row }">
              {{ row.order.no }}
            </template>
          </el-table-column>
          <el-table-column label="用户名|昵称|手机">
            <template #default="{ row }">
              <div v-if="!row.order.user">用户已被删除</div>
              <div v-else>{{ row.order.user.username }} || {{ row.order.user.nickname }} || {{ row.order.user.phone }}</div>
            </template>
          </el-table-column>
          <el-table-column label="时间" prop="create_time"></el-table-column>
          <el-table-column label="返佣金额" prop="commission"></el-table-column>
        </div>
      </template>
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
  </el-drawer>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import {
    distriRecommandList,
    recommandOrderList
  } from '@/api/distribution'

  const props = defineProps({
    type: {
      type: String,
      required: true
    }
  })

  const tt = computed(() => {
    return props.type === 'user' ? '推广人列表' : '推广订单列表'
  })

  // 搜索
  const searchForm = reactive({
    keyword: '',
    type: 'all',
    starttime: '',
    endtime: '',
    level: 0
  })

  const dialogVisible = ref(false)
  const openDrawer = (id) => {
    searchForm.user_id = id
    dialogVisible.value = true
  }

  const loading = ref(false)
  // 分页
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  // 获取列表数据
  const tableData = ref([])
  const getTableList = async (page, query = {}) => {
    loading.value = true
    const res = props.type === 'user' ? await distriRecommandList(page, query) : await recommandOrderList(page, query)
    tableData.value = res.list
    total.value = res.totalCount
    loading.value = false
  }
  getTableList(currentPage.value, searchForm)

  const resetSearchForm = () => {
    searchForm.keyword = ''
    searchForm.type = 'all',
    searchForm.starttime = '',
    searchForm.endtime = '',
    searchForm.level = 0
  }
  const searchHandler = () => {
    getTableList(currentPage.value, searchForm)
  }
  // 重置搜索
  const resetSearchHandler = () => {
    resetSearchForm()
    currentPage.value = 1
    getTableList(currentPage.value)
  }

  defineExpose({
    openDrawer
  })
</script>

<style>
</style>
