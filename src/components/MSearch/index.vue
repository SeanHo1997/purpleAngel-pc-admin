<template>
  <el-form :model="searchForm" label-width="80px" class="my-6" size="small">
    <el-row :gutter="20">
      <el-col :span="8">
        <slot></slot>
      </el-col>
      <el-col :span="16">
        <div class="flex items-center justify-end">
          <el-button
            type="primary"
            size="small"
            @click="$emit('search', searchForm)"
            class="mr-3"
            >搜索</el-button
          >
          <el-button size="small" @click="$emit('reset')" class="mr-3">重置</el-button>
          <el-button
            v-if="$slots.show"
            type="primary"
            text
            @click="showSearch = !showSearch"
            >{{ showSearch ? '收起' : '展开' }}
            <el-icon v-if="showSearch"><ArrowUp /></el-icon>
            <el-icon v-else><ArrowDown /></el-icon>
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="showSearch" class="mt-5">
      <slot name="show"></slot>
    </el-row>
  </el-form>
</template>

<script setup>
  import {ref} from 'vue'

  // 搜索管理员

  const showSearch = ref(false)

  defineProps({
    searchForm: {
      type: Object,
    },
    cateList: {
      type: Array,
    },
  })
</script>

<style>
  .el-form-item--small {
    margin-bottom: 0 !important;
  }
  .ml3 {
    @apply: ml-3;
  }
</style>
