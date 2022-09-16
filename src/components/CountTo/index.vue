<template>
  {{ (data.num).toFixed(2) }}
</template>

<script setup>
  import { reactive, watch } from 'vue'
  import gsap from 'gsap'

  const props = defineProps({
    value: {
      type: Number,
      default: 0
    }
  })
  const data = reactive({
    num: 0
  })

  // 数字变化动画
  const animateToValue = () => {
    gsap.to(data, {
      duration: 0.5,
      num: props.value
    })
  }

  watch(() => props.value, () => {
    animateToValue()
  }, { immediate: true })
</script>

<style>
</style>
