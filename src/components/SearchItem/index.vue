<template>
  <el-form-item :label="label">
    <slot></slot>
  </el-form-item>
</template>

<script setup>
  defineProps({
    label: {
      type: String,
    },
  })
</script>

<style></style>
