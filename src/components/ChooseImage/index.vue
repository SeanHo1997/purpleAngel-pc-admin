<template>
  <div class="flex flex-wrap">
    <div v-if="typeof props.modelValue === 'object' && preview" class="flex flex-wrap">
      <div
        v-for="image in props.modelValue"
        :key="image"
        class="wrapper relative left-0 right-0 top-0 bottom-0"
        >
        <el-image
          :src="image"
          fit="cover"
          class="absolute w-[100px] h-[100px] rounded border mr-2"
          :lazy="true"
        ></el-image>
        <el-icon
          class="absolute right-[5px] top-[5px] cursor-pointer bg-light-800 rounded-full z-100"
          @click="removeImage(image)"
          ><CircleClose/>
        </el-icon>
      </div>
    </div>
    <div v-else-if="props.modelValue !== '' && preview" class="flex flex-wrap">
      <div
        class="choose-image-btn absolute left-0 right-0 top-0 bottom-0"
        >
        <el-image
          :src="props.modelValue"
          fit="cover"
          class="relative w-[100px] h-[100px] rounded border mr-2 hover:(opacity-70)"
          :lazy="true"
        ></el-image>
        <el-icon
          class="absolute right-[5px] top-[5px] cursor-pointer bg-light-800 rounded-full"
          style="z-index: 50"
          @click="removeImage"
          ><CircleClose/>
        </el-icon>
      </div>
    </div>
    <div v-if="preview" class="choose-image-btn" @click="open">
      <el-icon :size="25" class="text-gray-500"><Plus /></el-icon>
    </div>

    <el-dialog title="选择图片" v-model="dialogVisible" width="80%">
      <ImageMaterial showCheckBox></ImageMaterial>
      <template #footer>
        <span class="flex justify-evenly">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import {ref, onMounted} from 'vue'
  import bus from '@/utils/mitt'

  const dialogVisible = ref(false)

  const props = defineProps({
    modelValue: {
      type: [String, Array],
      default: () => { [] }
    },
    preview: {
      type: Boolean,
      default: true
    }
  })

  const emit = defineEmits(['update:modelValue'])

  // 打开弹出框
  const callbackFn = ref(null)
  const open = (callback = null) => {
    callbackFn.value = callback
    dialogVisible.value = true
  }

  // 监听勾选
  const url = ref('')
  onMounted(() => {
    bus.on('image', (val) => {
      url.value = val
    })
  })

  // 确认选择
  const confirm = () => {
    if (typeof callbackFn.value === 'function') { 
      callbackFn.value([...props.modelValue, url.value])
    }
    emit('update:modelValue', [...props.modelValue, url.value])
    dialogVisible.value = false
  }

  // 清除选中头像
  const removeImage = (image) => {
    if (typeof props.modelValue !== 'object') {
      emit('update:modelValue', '')
    } else {
      const data = props.modelValue.filter(item => item !== image)
      emit('update:modelValue', data)
    }
  }

  defineExpose({
    open
  })
</script>

<style>
  .choose-image-btn {
    @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100) px-3 py-5;
  }

  .wrapper {
    @apply w-[100px] h-[100px] rounded border hover:(bg-gray-100);
  }
</style>
