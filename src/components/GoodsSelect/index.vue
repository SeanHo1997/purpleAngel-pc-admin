<template>
  <el-dialog
    title="商品选择"
    v-model="dialogVisible"
    width="80%">
    <div class="flex items-center justify-between mb-4">
      <div>
        <el-input placeholder="关键词" v-model="searchKey" clearable>
        </el-input>
      </div>
      <div>
        <el-button type="primary" size="small" @click="searchHandler"
          >搜索</el-button
        >
        <el-button type="info" size="small" @click="resetSearchHandler"
          >重置</el-button
        >
      </div>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" stripe v-loading="loading" @selection-change="selectionChange" height="300px;">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="商品">
        <template #default="{row}">
          <div class="flex items-center">
              <el-image :src="row.cover" fit="cover" :lazy="true" style="width: 50px; height: 50px"
                class="mr-3 rounded"></el-image>
              <div class="flex-1">
                <p>{{ row.title }}</p>
              </div>
            </div>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="总库存" width="90" />
      <el-table-column label="价格" width="150" align="center">
        <template #default="{row}">
          <span class="text-rose-500">{{ row.min_price }}</span>
          <el-divider direction="vertical"></el-divider>
          <span class="text-gray-500 text-sm">{{ row.min_oprice }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="flex justify-center items-center mt-3">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :curren-page="currentPage"
        :page-size="pageSize"
        @current-change="getTableList(currentPage)">
      </el-pagination>
    </el-row>
    <template #footer>
    <span>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmConnect">确认</el-button>
    </span>
    </template>
  </el-dialog>
  
</template>

<script setup>
  import { ref } from 'vue'
  import { goodsList, connetGoods } from '@/api/goods'
  import { ElNotification } from 'element-plus'

  const props = defineProps({
    category_id: {
      type: Number,
      required: true
    }
  })
  const emit = defineEmits(['refreshRecommandGoods'])

  const dialogVisible = ref(false)

  // 确定
  const confirm = () => {
    dialogVisible.value = false
  }

  // 分页
  const total = ref(0)
  const pageSize = ref(10)
  const currentPage = ref(1)

  // 获取列表数据
  const tableData = ref([])
  const loading= ref(false)

  const getTableList = async (page) => {
    loading.value = true
    const res = await goodsList(page)
    tableData.value = res.list
    total.value = res.totalCount
    loading.value = false
  }

  // 搜索
  const searchKey = ref('')
  const searchHandler = () => {
    getTableList(currentPage.value, searchKey.value)
  }
  // 重置搜索
  const resetSearchHandler = () => {
    currentPage.value = 1
    getTableList(currentPage.value)
  }

  // 勾选框
  const ids = ref([])
  const selectionChange = (e) => {
    ids.value = e.map(item => item.id)
  }

  const confirmConnect = () => {
    connetGoods(props.category_id, ids.value).then(() => {
      getTableList(currentPage.value)
      emit('refreshRecommandGoods')
      ElNotification({
        type: 'success',
        message: '更新成功'
      })
    })
  }

  defineExpose({
    dialogVisible,
    currentPage,
    getTableList
  })
</script>

<style>
</style>