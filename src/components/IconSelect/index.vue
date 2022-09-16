<template>
  <div class="flex items-center">
    <el-icon v-if="modelValue" :size="20" class="mr-2"><component :is="modelValue"></component></el-icon>
    <el-select :model-value="modelValue" class="m-2" placeholder="图标" @change="changeHandler" :filterable="true" >
      <el-option
        v-for="item in icons"
        :key="item"
        :label="item"
        :value="item"
      >
        <div class="flex items-center justify-between">
          <el-icon><component :is="item"></component></el-icon>
          <span class="text-gray-500">{{ item }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import * as IconList from '@element-plus/icons-vue'

  defineProps({
    modelValue: String
  })
  const emit = defineEmits(['update:modelValue'])

  const icons = ref(Object.keys(IconList))

  const changeHandler = (val) => {
    emit('update:modelValue', val)
  }
</script>

<style>
</style>