<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 搜索关键词 -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <el-input placeholder="搜索关键词" v-model="searchWord" clearable>
            <template #prepend>关键词</template>
          </el-input>
        </div>
        <div>
          <el-button type="primary" size="small" @click="searchHandler" class="mr-3"
            >搜索</el-button
          >
          <el-button type="default" size="small" @click="resetSearchHandler"
            >重置</el-button
          >
        </div>
      </div>
      <el-divider></el-divider>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" stripe v-loading="loading">
        <el-table-column type="expand">
          <template #default="{row}">
            <div class="flex">
              <el-avatar
                size="50"
                :src="row.user.avatar"
                fit="cover"
                class="mr-3"></el-avatar>
              <div class="flex-1">
                <h6 class="flex items-center">
                  {{ row.user.nickname || row.user.username }}
                  <small class="text-gray-400 ml-2">{{ row.review_time }}</small>
                  <el-button size="small" class="ml-auto" @click="textAreaVisible = !textAreaVisible">回复</el-button>
                </h6>
                {{ row.review.data }}
                <div class="py-2">
                  <el-image
                    v-for="item in row.review.image"
                    :key="item"
                    :src="item"
                    fit="cover"
                    :lazy="true"
                    style="width: 100px; height: 100px"
                    class="rounded"></el-image>
                </div>
                  <div
                  v-if="!textAreaVisible"
                  class="mt-3 bg-gray-100 p-3 rounded"
                  v-for="item in row.extra"
                  :key="item">
                  <h6 class="flex font-bold">
                    客服
                    <el-button type="info" size="small" class="ml-auto"
                      @click="changeComment(item.data)"
                      >修改</el-button
                    >
                  </h6>
                  <p>{{ item.data }}</p>
                </div>
                <!-- 输入框 -->
                <div v-if="textAreaVisible">
                  <el-input
                    type="textarea"
                    placeholder="评论内容"
                    v-model="formData.data"
                    :rows="2"
                    clearable></el-input>
                  <div class="py-2">
                    <el-button
                      type="primary"
                      size="small"
                      @click="replyHandler(row.id)"
                      >回复</el-button
                    >
                    <el-button size="small" class="ml-2" @click="textAreaVisible = false">取消</el-button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="70"></el-table-column>
        <el-table-column label="商品">
          <template #default="{row}">
            <div class="flex items-center">
              <el-image
                :src="row.goods_item ? row.goods_item.cover : ''"
                fit="fill"
                :lazy="true"
                style="width: 50px; height: 50px"
                class="rounded"></el-image>
              <div>
                <h6>{{ row.goods_item?.title ?? '商品已被删除' }}</h6>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评价信息" width="200">
          <template #default="{row}">
            <div>
              <p>用户: {{ row.user.nickname || row.user.username }}</p>
              <el-rate
                v-model="row.rating"
                disabled
                show-score
                text-color="#ff9900" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="评价时间"
          width="180"
          align="center"
          prop="review_time">
          <template #default="{row}">
            <div>用户: {{ row.user.username }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="{row}">
            <el-switch
              :modelValue="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="changeStatus($event, row.id)"></el-switch>
          </template>
        </el-table-column>
      </el-table>
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
    </el-card>
  </div>
</template>

<script setup>
  import {ref, reactive} from 'vue'
  import {
    goodsCommentList,
    updateGoodsCommentStatus,
    replyGoodsComment,
  } from '@/api/GoodsComment'
  import {ElNotification} from 'element-plus'

  // 搜索
  const searchWord = ref('')
  const searchHandler = () => {
    getTableList(currentPage.value, (searchWord.value).trim())
  }
  // 重置搜索
  const resetSearchHandler = () => {
    currentPage.value = 1
    searchWord.value = ''
    getTableList(currentPage.value)
  }

  const loading = ref(false)
  // 分页
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  // 获取列表数据
  const tableData = ref([])
  const getTableList = async (page, searchWord = '') => {
    loading.value = true
    const res = await goodsCommentList(page, searchWord)
    tableData.value = res.list
    total.value = res.totalCount
    loading.value = false
  }
  getTableList(currentPage.value)

  // 表单相关
  const formData = reactive({
    data: '',
  })
  const resetFormData = () => {
    formData.data = ''
  }

  // 回复评论
  const textAreaVisible = ref(false)
  const replyHandler = (id) => {
    replyGoodsComment(id, formData).then(() => {
      resetFormData()
      textAreaVisible.value = false
      getTableList(currentPage.value)
      ElNotification({
        type: 'success',
        message: '更新成功',
      })
    })
  }

  // 修改评论
  const changeComment = (data) => {
    formData.data = data
    textAreaVisible.value = true
  }

  // 修改状态
  const changeStatus = ($event, id) => {
    updateGoodsCommentStatus(id, $event).then(() => {
      getTableList(currentPage.value)
      ElNotification({
        type: 'success',
        message: '更新成功',
      })
    })
  }
</script>
