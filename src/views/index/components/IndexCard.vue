<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex justify-between">
        <span class="text-sm">{{ title }}</span>
        <el-tag :type="tagType" effect="plain">
          {{ tip }}
        </el-tag>
      </div>
    </template>
    <!-- card body -->
    <el-row>
      <el-col :span="6" :offsert="0" v-for="item in data" :key="item.label">
        <el-card shadow="hover" class="border-0 bg-light-400">
          <div class="flex flex-col items-center justify-center">
            <span class="text-xl mb-2">{{ item.value }}</span>
            <span class="text-sm text-gray-500">{{ item.label }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
  defineProps({
    data: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    tagType: {
      type: String,
      default: 'success'
    },
    tip: {
      type: String,
      required: true
    }
  })
</script>

<style></style>
