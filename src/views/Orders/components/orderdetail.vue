<template>
  <el-drawer title="订单详情" v-model="drawerVisible" size="50%" destroy-on-close>
    <el-card shadow="never">
      <template #header>
        <b class="text-sm">订单信息</b>
      </template>
      <!-- card body -->
      <el-form label-width="80px">
        <el-form-item label="订单号">{{ detail.no }}</el-form-item>
        <el-form-item label="付款方式">{{ detail.payment_method }}</el-form-item>
        <el-form-item label="付款时间">{{ detail.paid_time }}</el-form-item>
        <el-form-item label="创建时间">{{ detail.create_time }}</el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <b class="text-sm">商品信息</b>
      </template>
      <!-- card body -->
      <el-form label-width="80px">
        <div class="flex mb-3" v-for="item in detail.order_items" :key="item.goods_id">
          <el-image v-if="item.goods_item.cover" :src="item.goods_item.cover" fit="cover" :lazy="true" style="width:80px;height:80px;" class="mx-3"></el-image>
          <div v-else style="width:80px;height:80px;" class="mx-3"></div>
          <div class="flex flex-col justify-around">
            <p class="text-sm">{{ item.goods_item.title }}</p>
            <p v-if="item.goods_skus">
              <el-tag type="info" size="small">
                {{ Object.values(item.goods_skus.skus).map(o => o.value).join(',') }}
              </el-tag>
            </p>
            <p class="text-sm text-red-600">{{ item.price + '￥' }}<span class="text-sm text-black"> * {{ item.num }}</span></p>
          </div>
        </div>
        <el-form-item label="成交价格">
          <span class="text-rose-500 font-bold">{{ '￥' + detail.total_price }}</span>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" v-if="detail.ship_data">
      <template #header>
        <b class="text-sm">发货信息</b>
      </template>
      <!-- card body -->
      <el-form label-width="80px">
        <el-form-item label="物流公司">{{ detail.ship_data.express_company }}</el-form-item>
        <el-form-item label="运单号">
          {{ detail.payment_method }}
          <el-button type="primary" text @click="openShippingInfoModel(detail.id)">物流信息</el-button>
          
        </el-form-item>
        <el-form-item label="发货时间">{{ detail.paid_time }}</el-form-item>
      </el-form>
    </el-card>
  </el-drawer>

  <!-- 物流信息 -->
  <ShippingInfo ref="shippingInfoRef"></ShippingInfo>
</template>

<script setup>
  import {ref, reactive} from 'vue'
  import ShippingInfo from './shippinginfo.vue'

  // drawer表单
  const drawerVisible = ref(false)
  const formData = reactive({
    tab: 'all',
    starttime: '',
    endtime: '',
    time: [],
  })

  // 打开drawer
  const detail = ref(null)
  const openDrawer = (row) => {
    detail.value = row
    drawerVisible.value = true
  }

  // 物流信息
  const shippingInfoRef = ref(null)
  const openShippingInfoModel = (id) => {
    shippingInfoRef.value.openDrawer(id)
  }

  defineExpose({
    openDrawer
  })
</script>

<style></style>
