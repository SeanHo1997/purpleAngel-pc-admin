<template>
  <el-card shadow="always" :body-style="{padding: '20px'}">
    <template #header>
      <div class="flex justify-between">
        <span class="text-sm">订单统计</span>
        <el-check-tag
          :checked="item.value === activeTag"
          style="margin-right: 8px"
          v-for="item in tagArr"
          :key="item.text"
          @click="changeTag(item.value)"
          >{{ item.text }}</el-check-tag>
      </div>
    </template>
    <!-- card body -->
    <div id="chart" ref="el" style="width: 100%; height: 300px;"></div>
  </el-card>
</template>

<script setup>
  import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
  import * as echarts from 'echarts'
  import { statistics3 } from '@/api/index'
  // import { useResizeObserver } from '@vueuse/core'

  // tag数据
  const tagArr = [
    {
      text: '近一个月',
      value: 'month',
    },
    {
      text: '近一周',
      value: 'week',
    },
    {
      text: '近24小时',
      value: 'hour',
    },
  ]
  // 激活的tag
  const activeTag = ref('week')
  // 点击tag事件
  const changeTag = (tag) => {
    // console.log(tag)
    activeTag.value = tag
  }

  // 获取echart的x,y轴真实数据
  const chartData = ref({})
  const getStatistics3 = async (type) => {
    chartData.value = await statistics3(type)
  }

  // 设置echart图标
  var myChart
  onMounted(() => {
    const chartDom = document.getElementById('chart')
    myChart = echarts.init(chartDom)
      getStatistics3('week').then(() => {
      let option = {
        xAxis: {
          type: 'category',
          data: chartData.value.x
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: chartData.value.y,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      }
      // console.log(option)
      myChart.setOption(option)
      })
  })

  // tag变化 echarts的数据也变化
  watch(() => activeTag.value, (val) => {
    const chartDom = document.getElementById('chart')
    myChart = echarts.init(chartDom)
    getStatistics3(val).then(() => {
      let option = {
        xAxis: {
          type: 'category',
          data: chartData.value.x
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: chartData.value.y,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      }
      // console.log(option)
      myChart.setOption(option)
    })
  })

  // 组件销毁前先销毁echarts
  onBeforeUnmount(() => {
    if (myChart) myChart.dispose()
  })
</script>

<style lang=""></style>
