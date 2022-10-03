<template>
  <el-dialog title="规格选择" v-model="dialogVisible" width="80%" top="5vh">
    <el-container style="height: 65vh">
      <el-aside width="220px" class="flex flex-col justify-between">
        <div class="top">
          <div
            class="sku-list"
            v-for="item in tableData"
            :key="item"
            :class="{'active': activeId === item.id}"
            @click="clickSku(item.id)">
            {{ item.name }}
          </div>
        </div>
        <div class="bottom">
          <!-- 分页 -->
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
        </div>
      </el-aside>
      <el-main>
        <el-checkbox-group v-model="form.list">
          <el-checkbox v-for="item in list" :key="item" :label="item" border>
            {{item}}
          </el-checkbox>
        </el-checkbox-group>
        
      </el-main>
    </el-container>
    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import {ref, reactive} from 'vue'
  import {skusList} from '../../api/sku.js'

  const dialogVisible = ref(false)

  const loading = ref(false)
  // 分页
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  // 获取列表数据
  const tableData = ref([])
  const activeId = ref(0)
  // 选中的动态样式
  const list = ref([])
  const clickSku = (id) => {
    activeId.value = id
    list.value = []
    const currItem = tableData.value.find(item => item.id === id)
    if (currItem) {
      list.value = currItem.default.split(',')
      form.name = currItem.name
    }
  }
  const getTableList = async (page, query = {}) => {
    loading.value = true
    const res = await skusList(page, query)
    tableData.value = res.list
    total.value = res.totalCount
    if (tableData.value.length > 0) {
      clickSku(tableData.value[0].id)
    }
    loading.value = false
  }

  // 内容的多选框
  const form = reactive({
    list: [],
    name: ''
  })

  const callbacks = ref(null)
  const open = (callback = null) => {
    callbacks.value = callback
    getTableList(currentPage.value)
    dialogVisible.value = true
  }

  const submit = () => {
    // if (typeof callbacks.value === 'function') {
    //   callbacks.value(form)
    // }
    dialogVisible.value = false
  }

  defineExpose({
    open,
  })
</script>

<style>
  .sku-list {
    border-bottom: 1px solid #f4f4f4;
    @apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
  }
  .sku-list:hover, .active {
    @apply bg-blue-50;
  }
</style>
