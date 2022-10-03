<template>
  <div>
    <!-- <Penals /> -->
    <el-card shadow="never" class="border-0">
    <!-- 搜索关键词 -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <el-radio-group v-model="searchForm.type" class="mb-3">
          <el-radio label="all">全部</el-radio>
          <el-radio label="today">今天</el-radio>
          <el-radio label="yestoday">昨天</el-radio>
          <el-radio label="last7days">最近七天</el-radio>
        </el-radio-group>
        <div>
          <div class="mb-3">
            <el-date-picker v-model="searchForm.endtime" type="date" placeholder="开始时间" value-format="YYYY-MM-DD"></el-date-picker>
            <el-date-picker v-model="searchForm.starttime" type="date" placeholder="结束时间" value-format="YYYY-MM-DD"></el-date-picker>
          </div>
          <el-input v-model="searchForm.keyWord" placeholder="订单编号" clearable size="default"></el-input>
        </div>
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
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="title" label="头像">
        <template #default="{row}">
          <div class="flex items-center">
            <el-avatar :size="40" :src="row.avatar" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="用户信息">
        <template #default="{row}">
          <div class="text-xs">
            <div class="text-xs">
              <p>用户： {{ row.username }}</p>
              <p>昵称： {{ row.nickname }}</p>
              <p>姓名： {{ row.user_info.name }}</p>
              <p>电话： {{ row.phone }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="share_num" label="推广用户数量" />
      <el-table-column prop="share_order_num" label="订单数量" />
      <el-table-column prop="order_price" label="订单金额" />
      <el-table-column prop="commission" label="账户佣金" />
      <el-table-column prop="cash_out_price" label="已提现金额" />
      <el-table-column prop="cash_out_time" label="提现次数" />
      <el-table-column prop="no_cash_out_price" label="未提现金额" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="{row}">
          <div>
            <el-button type="primary" size="small" text @click="openDrawer(row.id, 'user')"
            >推广人</el-button>
            <el-button type="primary" size="small" text @click="openDrawer(row.id, 'order')"
            >推广订单</el-button
            >
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

    <Drawer ref="userDrawerRef" type="user"></Drawer>
    <Drawer ref="orderDrawerRef" type="order"></Drawer>
  </div>
</template>

<script setup>
  import Penals from './components/panels.vue'
  import { ref, reactive } from 'vue'
  import {
    distriRecommandList,
  } from '@/api/distribution'
  import Drawer from './components/drawer.vue'
  const loading = ref(false)

  // 搜索
  const searchForm = reactive({
    type: 'all',
    keyWord: '',
    starttime: '',
    endtime: ''
  })
  // 重置数据
  const resetSearchForm = () => {
    searchForm.searchKey = ''
    searchForm.type = 'all',
    searchForm.starttime = '',
    searchForm.endtime = ''
  }

  // 分页
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  // 获取数据
  const tableData = ref([])
  const getTableList = async (page, query = {}) => {
    loading.value = true
    const res = await distriRecommandList(page, query)
    tableData.value = res.list
    total.value = res.totalCount
    loading.value = false
  }
  getTableList(currentPage.value, searchForm)

  // 搜素
  const searchHandler = () => {
    getTableList(currentPage.value, searchForm)
  }

  // 重置搜索
  const resetSearchHandler = () => {
    currentPage.value = 1
    resetSearchForm()
    getTableList(currentPage.value)
  }

  // 抽屉组件
  const userDrawerRef = ref(null)
  const orderDrawerRef = ref(null)
  const openDrawer = (id, type) => {
    if (type === 'user') {
      userDrawerRef.value.openDrawer(id)
    } else {
      orderDrawerRef.value.openDrawer(id)
    }
  }
</script>
