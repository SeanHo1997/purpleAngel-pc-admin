<template>
  <div>
    <el-card shadow="never" class="border-0">
      <el-tabs
        v-model="searchForm.tab"
        @tab-click="tabChange"
        class="demo-tabs">
        <el-tab-pane
          v-for="tab in tabList"
          :label="tab.name"
          :name="tab.key"></el-tab-pane>
      </el-tabs>
      <MSearch
        :cateList="cateList"
        @search="searchHandler"
        @reset="resetSearch">
        <SearchItem label="关键词">
          <el-input
            v-model="searchForm.title"
            placeholder="商品名称"
            clearable></el-input>
        </SearchItem>
        <template #show>
          <SearchItem label="商品分类">
            <el-select
              v-model="searchForm.category_id"
              placeholder="请选择商品分类"
              clearable>
              <el-option
                v-for="item in cateList"
                :key="item.name"
                :label="item.name"
                :value="item.id" />
            </el-select>
          </SearchItem>
        </template>
      </MSearch>
      <el-divider></el-divider>
      <ListHeader
        @add="openDrawer"
        @refresh="refresh"
        showSec
        @secHandler="updateBundleFn"
        SecButtonText="批量上架"
        secConfirmTitle="上架"
        :selection="ids">
        <el-button
          v-if="searchForm.tab === 'all' || searchForm.tab === 'off'"
          class="mr-3"
          size="small"
          @click="statusOn"
          :disabled="!ids.length"
          >上架</el-button
        >
        <el-button
          v-if="searchForm.tab === 'all' || searchForm.tab === 'saling'"
          class="mr-3"
          size="small"
          @click="statusOff"
          :disabled="!ids.length"
          >下架</el-button
        >
      </ListHeader>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        v-loading="loading"
        @selection-change="selectionChange">
        <el-table-column type="selection" prop="name"> </el-table-column>
        <el-table-column label="商品" width="300">
          <template #default="{row}">
            <div class="flex items-center">
              <el-image
                :src="row.cover"
                fit="cover"
                :lazy="true"
                style="width: 50px; height: 50px"
                class="mr-3 rounded"></el-image>
              <div class="flex-1">
                <p>{{ row.title }}</p>
                <div>
                  <span class="text-rose-500">￥{{ row.min_price }}</span>
                  <el-divider direction="vertical"></el-divider>
                  <span class="text-gray-500 text-xs"
                    >￥{{ row.min_oprice }}</span
                  >
                </div>
                <p class="text-gray-400 text-xs mb-1">
                  分类:{{ row.category ? row.category.name : '未分类' }}
                </p>
                <p class="text-gray-400 text-xs">
                  创建事件: {{ row.create_time }}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="sale_count"
          label="实际销量"
          width="100"
          align="center" />
        <el-table-column label="商品状态" width="200">
          <template #default="{row}">
            <el-tag :type="row.status ? 'success' : 'danger'" size="small">{{
              row.status ? '上架' : '仓库'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-if="searchForm.tab !== 'delete'"
          label="审核状态"
          width="200">
          <template #default="{row}">
            <div v-if="row.ischeck === 0">
              <el-button plain type="success" size="small" class="block"
                >通过审核</el-button
              >
              <el-button plain type="danger" size="small" class="block mt-2"
                >拒绝审核</el-button
              >
            </div>
            <span v-else>{{
              row.ischeck === 1 ? '审核通过' : '审核不通过'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stock"
          label="总库存"
          width="100"
          align="center" />
        <el-table-column label="操作" align="center">
          <template #default="{row}">
            <div v-if="searchForm.tab === 'delete'">暂无操作</div>
            <div v-else>
              <el-button
                type="primary"
                size="small"
                text
                @click="editFn(row)"
                class="px-1"
                >修改</el-button
              >
              <el-button type="primary" size="small" text class="px-1" @click="openSkusDrawer(row)"
                >商品规格</el-button
              >
              <el-button
                type="primary"
                size="small"
                text
                @click="openBannersDrawer(row)"
                class="px-1"
                >设置轮播图</el-button
              >
              <el-button
                type="primary"
                size="small"
                text
                class="px-1"
                @click="openGoodsDetailDrawer(row)"
                >商品详情</el-button
              >
              <el-popconfirm
                title="确认删除此商品吗?"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="confirmDel(row)"
                class="px-1">
                <template #reference>
                  <el-button type="primary" size="small" text>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
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

    <!-- 新增|编辑 -->
    <FormDrawer
      :title="isEditId ? '编辑' : '新增'"
      :drawerVisible="drawerVisible"
      @close="drawerVisible = false"
      @confirm="addHandler"
      destroy-on-close>
      <el-form
        ref="formRef"
        :model="formData"
        label-width="120px"
        :inline="false">
        <el-form-item prop="title" label="商品名称">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item prop="category_id" label="商品分类">
          <el-select v-model="formData.category_id" placeholder="商品分类">
            <el-option
              v-for="item in cateList"
              :key="item.category_id"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="cover" label="商品封面">
          <ChooseImage
            v-model="formData.cover"
            @avatar="avatarHandler"></ChooseImage>
        </el-form-item>
        <el-form-item prop="desc" label="商品描述">
          <el-input v-model="formData.desc"></el-input>
        </el-form-item>
        <el-form-item prop="unit" label="商品单位">
          <el-input v-model="formData.unit"></el-input>
        </el-form-item>
        <el-form-item prop="stock" label="总库存">
          <el-input v-model="formData.stock" type="number"
            ><template #append>件</template></el-input
          >
        </el-form-item>
        <el-form-item prop="min_stock" label="库存预警">
          <el-input v-model="formData.min_stock"
            ><template #append>件</template></el-input
          >
        </el-form-item>
        <el-form-item prop="status" label="是否上架">
          <el-radio-group v-model="formData.status" class="ml-4">
            <el-radio :label="0" size="large">仓库</el-radio>
            <el-radio :label="1" size="large">上架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="stock_display" label="库存是否显示">
          <el-radio-group v-model="formData.stock_display" class="ml-4">
            <el-radio :label="0" size="large">隐藏</el-radio>
            <el-radio :label="1" size="large">显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="min_price" label="最低销售价">
          <el-input v-model="formData.min_price"
            ><template #append>元</template></el-input
          >
        </el-form-item>
        <el-form-item prop="min_oprice" label="最低原价">
          <el-input v-model="formData.min_oprice"
            ><template #append>元</template></el-input
          >
        </el-form-item>
      </el-form>
    </FormDrawer>

    <!-- 轮播图 -->
    <Banners ref="bannersRef" @submited="afterSubmitBanners"></Banners>
    <!-- 商品详情 -->
    <GoodsDetail ref="goodsDetailRef" @submited="afterSubmitGoodsDetail"></GoodsDetail>
    <!-- 规格 -->
    <Skus ref="skusRef" @submited="afterSubmitSkus"></Skus>
  </div>
</template>

<script>
  // 标签栏
  const tabList = [
    {
      key: 'all',
      name: '全部',
    },
    {
      key: 'checking',
      name: '审核中',
    },
    {
      key: 'saling',
      name: '出售中',
    },
    {
      key: 'off',
      name: '已下架',
    },
    {
      key: 'min_stock',
      name: '库存警告',
    },
    {
      key: 'delete',
      name: '回收站',
    },
  ]
</script>

<script setup>
  import {ref, reactive} from 'vue'
  import {
    goodsList,
    addGoods,
    updateGoods,
    delGoods,
    updateBundle,
  } from '@/api/goods'
  import {goodsCate} from '@/api/category'
  import {ElNotification} from 'element-plus'
  import Banners from './components/banners.vue'
  import GoodsDetail from './components/goodsdetail.vue'
  import Skus from './components/skus.vue'

  // 标签栏
  const tabChange = () => {
    getTableList(currentPage.value, searchForm.tab)
  }

  // 搜索
  const searchForm = reactive({
    tab: 'all',
    title: '',
    category_id: '',
  })
  const searchHandler = (val) => {
    getTableList(currentPage.value, val)
  }
  // 重置搜索
  const resetSearch = () => {
    currentPage.value = 1
    searchForm.title = ''
    searchForm.category_id = ''
    getTableList(currentPage.value)
  }

  const loading = ref(false)
  // 分页
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  // 获取列表数据
  const tableData = ref([])
  const roles = ref([])
  const getTableList = async (page, query = {}) => {
    loading.value = true
    const res = await goodsList(page, query)
    tableData.value = res.list
    roles.value = res.roles // 所属管理员(角色)
    total.value = res.totalCount
    loading.value = false
  }
  getTableList(currentPage.value)

  // 删除
  const confirmDel = (row) => {
    delGoods([row.id])
      .then(() => {
        getTableList(currentPage.value)
        ElNotification({
          type: 'success',
          message: '删除成功',
        })
      })
      .catch(() => {})
  }

  // 表单相关
  const drawerVisible = ref(false)
  const formData = reactive({
    title: '', //商品名称
    category_id: '', //商品分类
    cover: '', //商品封面
    desc: '', //商品描述
    unit: '', //商品单位
    stock: 200, //总库存
    min_stock: 10, //库存预警
    status: 1, //是否上架 0仓库1上架
    stock_display: 1, //库存显示 0隐藏1显示
    min_price: 100, //最低销售价
    min_oprice: 100, //最低原价
  })
  const resetFormData = () => {
    formData.title = ''
    formData.category_id = ''
    formData.cover = ''
    formData.desc = ''
    formData.unit = ''
    formData.stock = 200
    formData.min_stock = 10
    formData.status = 1
    formData.stock_display = 1
    formData.min_price = 100
    formData.min_oprice = 100
  }

  // 封面
  const avatarHandler = (cover) => {
    formData.cover = cover
  }

  // 新增
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
        addGoods(formData).then(() => {
          drawerVisible.value = false
          getTableList(currentPage.value)
          ElNotification({
            type: 'success',
            message: '添加成功',
          })
        })
      } else {
        // 编辑场景
        updateGoods(isEditId.value, formData).then(() => {
          drawerVisible.value = false
          getTableList(currentPage.value)
          ElNotification({
            type: 'success',
            message: '更新成功',
          })
        })
      }
    })
  }
  // 刷新
  const refresh = () => {
    getTableList(currentPage.value)
  }

  // 编辑
  const editFn = (row) => {
    formData.title = row.title
    formData.category_id = row.category_id
    formData.cover = row.cover
    formData.desc = row.desc
    formData.unit = row.unit
    formData.stock = row.stock
    formData.min_stock = row.min_stock
    formData.status = row.status
    formData.stock_display = row.stock_display
    formData.min_price = row.min_price
    formData.min_oprice = row.min_oprice
    isEditId.value = row.id
    drawerVisible.value = true
  }

  // 商品分类
  const cateList = ref([])
  const getCate = () => {
    goodsCate().then((res) => {
      cateList.value = res
    })
  }
  getCate()

  // 批量上架
  const ids = ref([])
  const selectionChange = (e) => {
    ids.value = e.map((item) => item.id)
  }
  const updateBundleFn = () => {
    updateBundle(ids.value, 1).then(() => {
      ElNotification({
        type: 'success',
        message: '上架成功',
      })
    })
  }
  // 上架
  const statusOn = () => {
    updateBundle(ids.value, 1).then(() => {
      ElNotification({
        type: 'success',
        message: '上架成功',
      })
    })
  }
  // 下架
  const statusOff = () => {
    updateBundle(ids.value, 0).then(() => {
      ElNotification({
        type: 'success',
        message: '下架成功',
      })
    })
  }

  // 轮播图
  const bannersRef = ref(null)
  const openBannersDrawer = (row) => {
    bannersRef.value.openDrawer(row)
  }
  // 提交完轮播图后
  const afterSubmitBanners = () => {
    getTableList(currentPage.value)
  }

  // 商品详情
  const goodsDetailRef = ref(null)
  const openGoodsDetailDrawer = (row) => {
    goodsDetailRef.value.openDrawer(row)
  }
  // 提交商品详情
  const afterSubmitGoodsDetail = () => {
    getTableList(currentPage.value)
  }

  // 商品规格
  const skusRef = ref(null)
  const openSkusDrawer = (row) => {
    skusRef.value.openDrawer(row)
  }
  // 提交商品规格
  const afterSubmitSkus = () => {
    getTableList(currentPage.value)
  }
</script>

<style>
  .el-button + .el-button {
    margin-left: 0;
  }
</style>
