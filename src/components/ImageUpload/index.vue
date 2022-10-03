<template>
  <el-upload
    drag
    :action="imageUploadAction"
    multiple
    :headers="{token}"
    name="img"
    :data="data"
    :on-success="uploadSuccess"
    :on-error="uploadError"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      将图片拖拽至此或者<em>点击此处上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        只支持jpg/png格式,且图片大小上线为500KB
      </div>
    </template>
  </el-upload>
</template>

<script setup>
import { imageUploadAction } from '@/api/imageMaterial'
import { useStore } from 'vuex'
import { computed } from 'vue'
const store = useStore()

const props = defineProps({
  data: Object
})

const emit = defineEmits(['success', 'error'])

// 上传成功的回调
const uploadSuccess = (response, uploadFile, uploadFiles) => {
  console.log(response)
  emit('success', { response, uploadFile, uploadFiles })
}

// 上传失败的回调
const uploadError = (error, uploadFile, uploadFiles) => {
  emit('error', { error, uploadFile, uploadFiles })
  const msg = JSON.parse(error.message).msg
  console.log(msg)
}

const token = computed(() => store.getters.token)
</script>
