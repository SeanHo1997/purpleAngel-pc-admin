<template>
  <el-row :gutter="20" class="my-5">
    <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
      <el-card shadow="never">
        <div class="flex items-center">
          <el-icon :class="item.color" :size="20" class="text-white w-[40px] h-[40px] rounded-full">
            <User v-if="index === 0" />
            <ShoppingCart v-if="index === 1" />
            <PriceTag v-if="index === 2"/>
            <Timer v-if="index === 3"/>
          </el-icon>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6" :offset="0"></el-col>
    <el-col :span="6" :offset="0"></el-col>
    <el-col :span="6" :offset="0"></el-col>
  </el-row>
  
</template>

<script setup>
  import { distriStatistics } from '@/api/distribution'
  import { ref } from 'vue'

  const loading =ref(false)
  const list = ref([])
  const getDistriStatistics = () => {
    distriStatistics().then(res => {
      list.value = res.panels
    })
  }
  getDistriStatistics()
</script>

<style>
</style>
