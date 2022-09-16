<template>
  <el-aside width="220px" class="image-aside" v-loading="loading">
    <div class="aside-top">
      <div
        class="aside-list"
        :class="{'active-item': activeId === item.id}"
        v-for="item in imageClassList"
        :key="item.id"
        @click.stop="changeItem(item.id)">
        <span class="truncate">{{ item.name }}</span>
        <!-- 编辑图库分类 -->
        <el-button text type="primary" size="small" class="ml-auto px-1" @click.stop="onEditImageClass(item)">
          <el-icon :size="12"><Edit /></el-icon>
        </el-button>
        <!-- 删除时弹出气泡提示框 -->
        <span @click.stop>
          <el-popconfirm
            confirm-button-text="删除"
            cancel-button-text="取消"
            icon-color="#626AEF"
            title="确定删除此分类吗?"
            @confirm.stop="confirmEvent(item.id)"
          >
            <template #reference>
              <!-- 删除图库分类 -->
              <el-button text type="primary" size="small" class="px-1">
                <el-icon :size="12"><Close /></el-icon>
              </el-button>
            </template>
          </el-popconfirm>
        </span>
      </div>
    </div>
    <!-- 分页 -->
    <div class="aside-bottom">
      <el-pagination
        background
        layout="prev, next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="currentChange" />
    </div>
  </el-aside>
  <!-- 新增图库分类 -->
  <FormDrawer :drawerVisible="drawerVisible" :title=" isEditClass ? '修改' : '新增' " @confirm="confirmDrawer" @close="drawerVisible = false">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" :inline="false">
      <el-form-item prop="name" label="图库分类名称">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item prop="order" label="排序">
        <el-input-number v-model="formData.order" :min="0" :max="1000"></el-input-number>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import { imageClass, addImageClass, editImageClass, delImageCLass } from '@/api/imageMaterial'
  import { ElNotification } from 'element-plus';
  import bus from '@/utils/mitt'
  const loading = ref(false)

  // 获取图片分类
  const imageClassList = ref([])
  const activeId = ref(0)
  const getImageClass = async (page) => {
    loading.value = true
    const res = await imageClass(page)
    total.value = res.totalCount
    imageClassList.value = res.list
    bus.emit('imageClassList', res.list)
    loading.value = false
  }
  getImageClass(1).then(() => {
    // 选中分类的id
    activeId.value = imageClassList.value[0].id
  })
  
  // 改变选中分类项
  const changeItem = (id) => {
    activeId.value = id
    bus.emit('activeId', activeId.value)
  }

  // 分页
  const currentPage = ref(1)
  const total = ref(0)
  const limit = ref(10)
  const currentChange = (e) => {
    currentPage.value = e
    getImageClass(currentPage.value)
  }

  // 抽屉组件相关
  const drawerVisible = ref(false) // 由父组件调用变量为true
  // 表单绑定数据
  const formData = reactive({
    name: '',
    order: 50
  })
  const resetFormData = () => {
    formData.name = '',
    formData.order = 50
  }
  // 表单校验规则
  const rules = {
    name: [
      { required: true, message: '图库分类名称不能为空', trigger: 'blur' }
    ]
  }

  // 提交表单
  const formRef = ref(null)
  const confirmDrawer = () => {
    formRef.value.validate().then( async () => {
      // console.log('成功')
      if (isEditClass.value) {
        // 编辑模式
        await editImageClass(currentId.value, formData.name, formData.order)
        ElNotification({
          type: 'success',
          message: '编辑图库分类成功'
        })
        isEditClass.value = false
      } else {
        // 新增模式
          addImageClass(formData.name, formData.order).then(() => {
          ElNotification({
            type: 'success',
            message: '新增图库分类成功'
          })
        })
      }
      // 关闭drawer并刷新数据
      drawerVisible.value = false
      getImageClass(1)
    })
  }

  // 编辑图库分类
  const isEditClass = ref(false)
  const currentId = ref(0)
  const onEditImageClass = async (item) => {
    formData.name = item.name
    formData.order = item.order
    currentId.value = item.id
    isEditClass.value = true
    drawerVisible.value = true
  }

  // 删除图库分类
  const confirmEvent = async (id) => {
    await delImageCLass(id)
    getImageClass(currentPage.value)
    ElNotification({
      type: 'success',
      message: '删除图库分类成功'
    })
  }

  defineExpose({
    drawerVisible,
    confirmDrawer,
    resetFormData
  })
</script>

<style scoped>
  .image-aside {
    border: 1px solid #eeeeee;
    position: relative;
  }

  .image-aside .aside-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
  }

  .image-aside .aside-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    @apply flex justify-center items-center;
  }

  .aside-list {
    border-bottom: 1px solid #f4f4f4;
    @apply flex items-center p-3 text-xs text-gray-600;
  }

  .aside-list:hover,
  .active-item {
    @apply bg-blue-50;
  }
</style>
