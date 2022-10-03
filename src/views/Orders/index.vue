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
        @search="searchHandler"
        @reset="resetSearch">
        <SearchItem label="订单编号">
          <el-input
            v-model="searchForm.title"
            placeholder="订单编号"
            clearable></el-input>
        </SearchItem>
        <template #show>
          <SearchItem label="收货人">
            <el-input
              v-model="searchForm.name"
              placeholder="收货人"
              clearable>
            </el-input>
          </SearchItem>
          <SearchItem label="手机号">
            <el-input
              v-model="searchForm.phone"
              placeholder="手机号"
              clearable>
            </el-input>
          </SearchItem>
          <SearchItem label="开始时间">
            <el-date-picker
              v-model="searchForm.starttime"
              type="date"
              placeholder="开始时间"
              value-format="YYYY-MM-DD"
            />
          </SearchItem>
          <SearchItem label="结束时间">
            <el-date-picker
              v-model="searchForm.endtime"
              type="date"
              placeholder="结束时间"
              value-format="YYYY-MM-DD"
            />
          </SearchItem>
        </template>
      </MSearch>
      <el-divider></el-divider>
      <ListHeader
        firstButtonText="批量删除"
        firstButtonType="danger"
        :disabledRule="ids.length === 0"
        @add="deleteBundle"
        @refresh="refresh"
        :selection="ids">
        <template #export>
          <el-tooltip effect="dark" content="导出" placement="bottom">
            <el-button text @click="openDrawer">
              <el-icon :size="20"><Histogram /></el-icon>
            </el-button>
          </el-tooltip>
        </template>
      </ListHeader>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        v-loading="loading"
        @selection-change="selectionChange">
        <el-table-column type="selection"> </el-table-column>
        <el-table-column label="商品" width="300">
          <template #default="{row}">
            <div class="flex flex-col text-sm">
              <div class="flex-1">
                <p>订单号: <small>{{ row.no }}</small></p>
              </div>
              <div>
                <p>下单时间: <small>{{ row.create_time }}</small></p>
              </div>
              <div class="flex py-2 items-center" v-for="(item, index) in row.order_items" :key="index">
                <el-image :src="item.goods_item ? item.goods_item.cover : ''" fit="cover" :lazy="true" style="width:30px;height:30px;"></el-image>
                <p class="text-blue-500">{{ item.goods_item ? item.goods_item.title : '商品已被删除' }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="total_price"
          label="实付款"
          width="120"
          align="center" />
        <el-table-column label="买家" width="120">
          <template #default="{row}">
            <p>{{ row.user.nickname || row.user.username }}</p>
            <small>(用户ID: {{ row.user.id }})</small>
          </template>
        </el-table-column>
        <el-table-column
          label="交易状态"
          width="160">
          <template #default="{row}">
            <div>
              付款状态
              <el-tag v-if="row.payment_method === 'wechat'" type="success" size="small">微信支付</el-tag>
              <el-tag v-else-if="row.payment_method === 'alipay'" type="success" size="small">支付宝支付</el-tag>
              <el-tag v-else type="info" size="small">未支付</el-tag>
            </div>
            <div>
              发货状态
              <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">{{ row.ship_data ? '已发货' : '未发货' }}</el-tag>
            </div>
            <div>
              收货状态
              <el-tag :type="row.ship_status.received ? 'success' : 'info'" size="small">{{ row.ship_status.received ? '已收货' : '未收货' }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{row}">
            <el-button class="px-1" type="primary" size="small" text @click="openDetail(row)">订单详情</el-button>
            <el-button v-if="searchForm.tab === 'noship'" class="px-1" type="success" size="small" text @click="shipOrderHandler(row.id)">去发货</el-button>
            <el-button v-if="searchForm.tab === 'refunding'" class="px-1" type="success" size="small" text @click="handleRefund(row.id, 1)">同意退款</el-button>
            <el-button v-if="searchForm.tab === 'refunding'" class="px-1" type="danger" size="small" text @click="handleRefund(row.id, 0)">拒绝退款</el-button>
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

    <!-- 导出订单 -->
    <FormDrawer
      :drawerVisible="drawerVisible"
      title="导出订单"
      @close="drawerVisible = false"
      @confirm="addHandler"
      destroy-on-close>
      <el-form
        ref="formRef"
        :model="formData"
        label-width="120px"
        :inline="false">
        <el-form-item prop="title" label="订单类型">
          <el-select v-model="formData.tab" placeholder="订单类型">
            <el-option
              v-for="tab in tabList"
              :key="tab.name"
              :label="tab.name"
              :value="tab.key" />
          </el-select>
        </el-form-item>
        <el-form-item prop="title" label="时间范围">
          <el-date-picker
            v-model="formData.time"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
    </FormDrawer>

    <!-- 订单详情 -->
    <OrderDetail ref="orderDetailRef"></OrderDetail>

    <!-- 退款 -->
    <el-dialog
      title="同意退款"
      v-model="dialogVisible"
      width="30%"
    >
      <span>确定同意退款吗?</span>
      <template #footer>
        <span class="dialog-footer flex justify-around">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmRefund"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>

    <el-dialog
      title="拒绝退款"
      v-model="dialogVisible2"
      width="30%"
    >
      <el-input v-model="disagree_reason" placeholder="拒绝退款理由"></el-input>
      <template #footer>
        <span class="dialog-footer flex justify-around">
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" @click="refuseRefund"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 发货 -->
    <el-dialog
      title="发货资料"
      v-model="dialogVisible3"
      width="30%"
    >
      <el-input class="p-2" v-model="shipData.express_company" placeholder="快递公司"></el-input>
      <el-input class="p-2" v-model="shipData.express_no" placeholder="快递单号"></el-input>
      <template #footer>
        <span class="dialog-footer flex justify-around">
          <el-button @click="dialogVisible3 = false">取消</el-button>
          <el-button type="primary" @click="confirmShip"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
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
      key: 'nopay',
      name: '待支付',
    },
    {
      key: 'noship',
      name: '待发货',
    },
    {
      key: 'shiped',
      name: '待收货',
    },
    {
      key: 'received',
      name: '已收货',
    },
    {
      key: 'finish',
      name: '已完成',
    },
    {
      key: 'closed',
      name: '已关闭',
    },
    {
      key: 'refunding',
      name: '退款中',
    },
  ]
</script>

<script setup>
  import {ref, reactive} from 'vue'
  import {
    orderList,
    delOrders,
    shipOrder,
    exportOrder,
    refund
  } from '@/api/order'
  import {ElNotification} from 'element-plus'
  import OrderDetail from './components/orderdetail.vue'
  const loading = ref(false)

  // 标签栏
  const tabChange = () => {
    getTableList(currentPage.value, searchForm)
  }

  // 搜索
  const searchForm = reactive({
    tab: 'all',
    no: '',
    starttime: '',
    endtime: '',
    name: '',
    phone: '',
  })
  const searchHandler = () => {
    getTableList(currentPage.value, searchForm)
  }
  // 重置搜索
  const resetSearch = () => {
    currentPage.value = 1
    searchForm.title = ''
    searchForm.category_id = ''
    getTableList(currentPage.value)
  }

  // 分页
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  // 获取列表数据
  const tableData = ref([])
  const getTableList = async (page, query = {}) => {
    loading.value = true
    const res = await orderList(page, query)
    tableData.value = res.list
    total.value = res.totalCount
    loading.value = false
  }
  getTableList(currentPage.value)

  // 批量删除
  const ids = ref([])
  const selectionChange = (e) => {
    ids.value = e.map((item) => item.id)
  }
  const deleteBundle = async () => {
    await delOrders(ids.value)
    getTableList(currentPage.value)
    ElNotification({
      type: 'success',
      message: '删除成功'
    })
  }

  // drawer表单
  const drawerVisible = ref(false)
  const formData = reactive({
    tab: 'all',
    starttime: '',
    endtime: '',
    time: []
  })
  const resetFormData = () => {
    formData.tab = 'all'
    formData.starttime = ''
    formData.endtime = ''
    formData.time = ''
  }

  // 打开drawer
  const openDrawer = () => {
    resetFormData()
    drawerVisible.value = true
  }

  // 刷新
  const refresh = () => {
    getTableList(currentPage.value)
  }

  // 导出订单
  const addHandler = () => {
    formData.starttime = formData.time[0]
    formData.endtime = formData.time[1]
    delete formData.time
    exportOrder(formData).then((res) => {
      console.log(res)
      // 返回undefined 预览显示乱码？？？
      let url = window.URL.createObjectURL(new Blob([res]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      let filename = (new Date()).getTime() + '.xlsx'
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      drawerVisible.value = false
      ElNotification({
        type: 'success',
        message: '导出成功'
      })
    })
  }

  // 订单详情
  const orderDetailRef = ref(null)
  const openDetail = (row) => {
    orderDetailRef.value.openDrawer(row)
  }

  // 审批退款
  const dialogVisible = ref(false)
  const dialogVisible2 = ref(false)
  const disagree_reason = ref('')
  const confirmRefund = () => {
    refund(rowId.value, {
      agree: 1
    })
  }
  const refuseRefund = () => {
    refund(rowId.value, {
      agree: 0,
      disagree_reason: disagree_reason.value
    })
  }
  const rowId = ref(0)
  const handleRefund = (id, isAgree) => {
    rowId.value = id
    if (isAgree === 0) {
      // 拒绝
      dialogVisible2.value = true
    } else {
      // 同意
      dialogVisible.value = true
    }
  }

  // 订单发货
  const dialogVisible3 = ref(false)
  const shipData = reactive({
    express_company: '',
    express_no: ''
  })
  const shipOrderHandler = (id) => {
    rowId.value = id
    dialogVisible3.value = true
  }
  const confirmShip = async () => {
    await shipOrder(rowId.value, shipData)
    dialogVisible3.value = false
    getTableList(currentPage.value)
    ElNotification({
      type: 'success',
      message: '发货成功'
    })
  }
</script>

<style>
  .el-button + .el-button {
    margin-left: 0;
  }
</style>
