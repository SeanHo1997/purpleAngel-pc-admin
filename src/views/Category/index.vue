<template>
  <div>
    <el-card shadow="never" class="border-0">
    <ListHeader @refresh="refresh" @add="openDrawer"></ListHeader>
    <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }" v-loading="loading" node-key="id" :default-expanded-keys="defaultExpandedKeys">
      <template #default="{ node, data }">
        <div>
          <span>{{ data.name }}</span>
        </div>
        <div class="ml-auto">
          <el-button text type="primary" size="small" @click="openGoodsDrawer(data)">推荐商品</el-button>
          <el-switch v-model="data.status" :active-value="1" :inactive-value="0" @change="changeStatus($event, data)"></el-switch>
          <el-button text type="primary" @click.stop="editFn(data)">修改</el-button>
          <el-popconfirm
              title="确认删除此管理员吗?"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm.stop="confirmDel(data)">
              <template #reference>
                <el-button text type="primary">删除</el-button>
              </template>
          </el-popconfirm>
        </div>
      </template>
    </el-tree>
    </el-card>
    
    <FormDrawer
      :title="isEditId ? '编辑' : '新增'"
      :drawerVisible="drawerVisible"
      @close="drawerVisible = false"
      @confirm="addHandler"
      >
      <el-form
        ref="formRef"
        :model="formData"
        label-width="120px"
        :inline="false">
        <el-form-item prop="name" label="分类名称">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>

    <goodsDrawer ref="goodsDrawerRef"></goodsDrawer>
  </div>
</template>
<script setup>
  import { ref, reactive } from 'vue'
  import ListHeader from '@/components/ListHeader/index.vue'
  import { goodsCate, addCate, updateCate, cateStatus, delCate } from '@/api/category'
  import { ElNotification } from 'element-plus'
  import goodsDrawer from './components/goodsDrawer.vue'

  const defaultExpandedKeys = ref([])

  const loading = ref(false)

  // 获取列表数据
  const tableData = ref([])
  const getTableList = async () => {
    loading.value = true
    const res = await goodsCate()
    tableData.value = res
    loading.value = false
  }
  getTableList()

  // 刷新
  const refresh = () => {
    getTableList()
  }

  // 表单相关
  const drawerVisible = ref(false)
  const formData = reactive({
    name: ''
  })
  const resetFormData = () => {
    formData.name = ''
  }

  // 打开新增按钮
  const openDrawer = () => {
    isEditId.value = 0
    resetFormData()
    drawerVisible.value = true
  }
  // 确认新增
  const formRef = ref(null)
  const isEditId = ref(0) // 创建变量用于区分业务场景
  const addHandler = () => {
    formRef.value.validate().then(() => {
      if (!isEditId.value) {
        // 新增场景
        addCate(formData).then(() => {
          drawerVisible.value = false
          goodsCate(currentPage.value)
          ElNotification({
            type: 'success',
            message: '添加成功',
          })
        })
      } else {
        // 编辑场景
        updateCate(isEditId.value, formData).then(
          () => {
            drawerVisible.value = false
            getTableList()
            ElNotification({
              type: 'success',
              message: '更新成功',
            })
          }
        )
      }
    })
  }

  // 编辑
  const editFn = (data) => {
    isEditId.value = data.id
    formData.name = data.name
    drawerVisible.value = true
  }

  // 删除
  const confirmDel = (data) => {
    delCate(data.id).then(() => {
      getTableList()
      ElNotification({
        type: 'success',
        message: '删除成功',
      })
    }).catch(() => {})
  }

  // 修改状态
  const changeStatus = ($event, data) => {
    cateStatus(data.id ,$event).then(() => {
      ElNotification({
        type: 'success',
        message: '更新成功'
      })
    })
  }


  const goodsDrawerRef = ref(null)
  const openGoodsDrawer = (data) => {
    goodsDrawerRef.value.category_id = data.id
    goodsDrawerRef.value.openDrawer()
  }
</script>

<style>
  .el-tree-node__content {
    padding: 20px 0;
  }
</style>
