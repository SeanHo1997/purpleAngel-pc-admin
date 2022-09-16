<template>
  <div>
    <el-drawer
    :model-value="drawerVisible"
    :size="size"
    :title="title"
    :direction="direction"
    @close="closeFn"
    :destroy-on-close="destroyOnClose">
    <div class="drawer">
      <div class="body">
        <slot></slot>
      </div>
      <div class="actions">
        <el-button @click="closeDrawer">取消</el-button>
        <el-button type="primary" @click="confirmDrawer">{{ confirmText }}</el-button>
      </div>
    </div>
    </el-drawer>
  </div>
</template>

<script setup>
  import {ref} from 'vue'

  defineProps({
    title: {
      type: String,
      default: 'title'
    },
    size: {
      type: String,
      default: '45%'
    },
    drawerVisible: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: '确认'
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    }
  })
  const emit = defineEmits(['confirm', 'close'])

  const direction = ref('rtl')

  // 确定
  const confirmDrawer = () => {
    emit('confirm')
  }
  // 取消
  const closeDrawer = () => {
    emit('close')
  }

  const closeFn = () => {
    emit('close')
  }
</script>

<style>
  .drawer {
    @apply flex flex-col;
  }
  .drawer .body {
    @apply flex-1;
  }
  .drawer .actions {
    height: 50px;
    @apply flex justify-between items-center mt-3;
  }
</style>
