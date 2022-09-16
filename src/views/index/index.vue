<template>
  <div>
    <el-row :gutter="20">
      <el-col v-if="panels.length" :span="6" :offset="0" v-for="(item, index) in panels" :key="index">
        <el-card shadow="hover" :body-style="{ padding: '20px' }" class="border-0">
          <template #header>
            <div class="flex justify-between">
              <span class="text-sm">{{ item.title }}</span>
              <el-tag
                :type="item.unitColor"
                  effect="plain"
                >
                {{ item.unit }}
              </el-tag>
            </div>
          </template>
          <span class="text-3xl font-bold text-gray-500">
            <!-- {{ item.value }} -->
            <CountTo :value="item.value"></CountTo>
          </span>
          <el-divider></el-divider>
          <div class="flex justify-between text-sm text-gray-500">
            <span>{{ item.subTitle }}</span>
            <span>{{ item.subValue }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col
        v-else
        :span="6"
        :offset="0"
        v-for="(item, index) in 4"
        :key="item.title">
        <el-skeleton animated loading>
          <template #template>
            <el-card
              shadow="hover"
              :body-style="{padding: '20px'}"
              class="border-0">
              <template #header>
                <div class="flex justify-between">
                  <el-skeleton-item variant="text" style="width: 30%" />
                  <el-skeleton-item variant="text" style="width: 30%" />
                </div>
              </template>
              <el-skeleton-item variant="text" style="width: 30%" />
              <el-divider></el-divider>
              <div class="flex justify-between text-sm text-gray-500">
                <el-skeleton-item variant="text" style="width: 30%" />
                <el-skeleton-item variant="text" style="width: 30%" />
              </div>
            </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </el-row>
    <!-- 导航卡片 -->
    <IndexNav></IndexNav>
    <el-row :gutter="20" class="mt-5">
      <!-- echarts -->
      <el-col :span="12" :offset="0">
        <ECharts></ECharts>
      </el-col>
      <!-- 右边卡片 -->
      <el-col :span="12" :offset="0" v-if="statistics2Data.goods">
        <IndexCard title="店铺及商品提示" tip="店铺及商品提示" :data="statistics2Data.goods" class="mb-2"></IndexCard>
        <IndexCard title="订单提示" tip="订单提示" tagType="danger" :data="statistics2Data.order"></IndexCard>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
  import { statistics1, statistics2 } from '@/api/index'
  import {ref} from 'vue'
  import IndexNav from './components/IndexTag.vue'
  import ECharts from './components/ECharts.vue'
  import IndexCard from './components/IndexCard.vue'

  // 获取首页统计数据
  const panels = ref([])
  const getStatistics1 = async () => {
    const res = await statistics1()
    panels.value = res.panels
  }
  getStatistics1()

  // 获取数据2
  const statistics2Data = ref({})
  const getStatistics2 = async () => {
    statistics2Data.value = await statistics2()
  }
  getStatistics2()
</script>

<style scoped>
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
</style>
