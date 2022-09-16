<template>
  <div class="flex items-center justify-between mb-4">
    <div>
      <el-button :type="firstButtonType" size="small" @click="$emit('add')" class="mr-3" :disabled="disabledRule"
      >{{ firstButtonText }}</el-button>
      <el-popconfirm
        v-if="showSec"
        :title="`确认${secConfirmTitle}吗?`"
        confirm-button-text="确定"
        cancel-button-text="取消"
        @confirm="$emit('secHandler')">
        <template #reference>
          <el-button :disabled="!selection.length" class="mr-3" type="danger" size="small">{{SecButtonText}}</el-button>
        </template>
      </el-popconfirm>
      <slot></slot>
    </div>
    
    <div class="right">
      <el-tooltip effect="dark" content="刷新" placement="bottom">
        <el-button text @click="$emit('refresh')">
          <el-icon :size="20"><Refresh /></el-icon>
        </el-button>
      </el-tooltip>
      <!-- 导出功能 -->
      <slot name="export"></slot>
    </div>

  </div>
</template>

<script setup>
  defineEmits(['add', 'refresh', 'secHandler'])

  defineProps({
    firstButtonText: {
      type: String,
      default: '新增'
    },
    firstButtonType: {
      type: String,
      default: 'primary'
    },
    disabledRule: {
      type: Boolean
    },
    showSec: {
      type: Boolean,
      defualt: false
    },
    SecButtonText: {
      type: String
    },
    secConfirmTitle: {
      type: String,
      default: '删除规格'
    },
    selection: {
      type: Array,
    }
  })
</script>

<style>

</style>
