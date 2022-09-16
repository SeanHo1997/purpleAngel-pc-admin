<template>
  <el-main class="image-main p-0" v-loading="loading">
    <div class="main-top p-3">
      <el-row :gutter="10">
        <el-col :span="6" :offset="0" v-for="item in iamgeList" :key="item.id">
          <el-card
            shadow="hover"
            :body-style="{padding: 0}"
            class="mb-3 relative"
            :class="{ 'border-blue-500': item.checked }">
            <!-- card body -->
            <el-image
              :src="item.url"
              fit="cover"
              :lazy="true"
              class="h-[150px]"
              style="width: 100%"
              :preview-src-list="[item.url]"
              :initial-index="0"
            ></el-image>
            <div class="image-title">{{ item.name }}</div>
            <div class="flex items-center justify-center p-2">
              <el-checkbox v-if="props.showCheckBox" v-model="item.checked" @change="changeHandler(item)"></el-checkbox>
              <el-button type="primary" size="small" text @click="onUpdatingImage(item)">重命名</el-button>
              <el-button type="primary" size="small" text @click="onDeletingImage(item.id)" class="m-0">删除</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="main-bottom">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="currentChange" />
    </div>
  </el-main>

  <!-- 上传图片 -->
  <FormDrawer :drawerVisible="drawerVisible" title="上传图片" @confirm="confirmDrawer">
    <ImageUpload :data="activeId.value" @success="successUpload"></ImageUpload>
  </FormDrawer>
</template>

<script setup>
  import { specifiedImageList, updateImageName, deleteImage } from '@/api/imageMaterial'
  import {ref, watch, computed} from 'vue'
  import bus from '@/utils/mitt'
  import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
  const loading = ref(false)

  const props = defineProps({
    showCheckBox: {
      type: Boolean,
      defualt: false
    }
  })

  const imageClassList = ref([])
  const activeId = ref(0)

  bus.on('imageClassList', (val) => {
    imageClassList.value = val
    activeId.value = imageClassList.value[0].id
  })
  bus.on('activeId', (id) => {
    activeId.value = id
  })

  // 分页
  const currentPage = ref(1)
  const total = ref(0)
  const limit = ref(10)
  const currentChange = (e) => {
    currentPage.value = e
    getImageClass(currentPage.value)
  }

  // 获取指定分类的图片列表
  const iamgeList = ref([])
  const getImageList = async (id, page) => {
    loading.value = true
    const res = await specifiedImageList(id, page)
    // console.log(res)
    total.value = res.totalCount
    iamgeList.value = res.list.map(item => {
      item.checked = false
      return item
    })
    loading.value = false
  }

  // 当选中项发生变化获取数据
  watch(
    () => activeId.value,
    (id) => {
      getImageList(id, 1)
    }
  )

  // 修改图片名称
  const onUpdatingImage = (item) => {
    ElMessageBox.prompt('请输入名称', '重命名', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue: item.name
    })
    .then(({ value }) => {
      loading.value = true
      updateImageName(item.id ,value)
      .then(() => {
        // 刷新页面
        getImageList(activeId.value, currentPage.value)
        ElMessage({
          type: 'success',
          message: '重命名成功',
        })
      })
    }).catch(() => {
    }).finally(() => {
      loading.value = false
    })
  }

  // 删除图片
  const onDeletingImage = async (id) => {
    ElMessageBox.confirm('确认删除此图片吗？', '删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
    })
    .then(() => {
      loading.value = true
      deleteImage([id])
      .then(() => {
        // 刷新页面
        getImageList(activeId.value, currentPage.value)
        ElMessage({
          type: 'success',
          message: '已删除',
        })
      })
    }).catch(() => {
    }).finally(() => {
      loading.value = false
    })
  }

  // 抽屉组件 (用于上传图片)
  const drawerVisible = ref(false)
  const confirmDrawer = () => {
    console.log('confirm')
  }
  // 暴露子组件的内容供父组件使用
  defineExpose({
    drawerVisible
  })

  const emit = defineEmits(['avatar'])

  // 选中图片
  const checkNum = computed(() => {
    let num = 0
    iamgeList.value.forEach(item => {
      if (item.checked) num += 1
    })
    return num
  })
  const changeHandler = (item) => {
    if (item.checked && checkNum.value > 1) {
      item.checked = false
      ElNotification({
      type: 'warning',
      message: '超出选择数量'
    })
    } else if (item.checked && checkNum.value === 1) {
      // 发送事件
      bus.emit('image', item.url)
    }
  }

  // 上传图片成功
  const successUpload = () => {
    drawerVisible.value = false
    ElNotification({
      type: 'success',
      message: '上传成功'
    })
    getImageList(activeId.value, 1)
  }
</script>

<style scoped>
  .image-main {
    position: relative;
  }

  .image-main .main-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
  }

  .image-main .main-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    @apply flex justify-center items-center;
  }

  .image-title {
    @apply absolute text-center text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
    top: 122px;
    left: -1px;
    right: -1px;
  }
</style>
