<template>
  <el-card shadow="never" :body-style="{padding: '20px'}" v-loading="loading">
    <el-form :model="form" label-width="160px">
      <h5 class="bg-gray-100 p-3 rounded mb-5">基础设置</h5>
      <el-form-item label="分销启用">
        <el-radio-group v-model="form.distribution_open">
          <el-radio :label="0" border>禁用</el-radio>
          <el-radio :label="1" border>开启</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="分销海报图">
        <ChooseAvatar :limit="9" v-model="form.spread_banners"></ChooseAvatar>
      </el-form-item> -->
      <h5 class="bg-gray-100 p-3 rounded mb-5">反佣设置</h5>
      <el-form-item label="一级返佣比例">
        <div>
          <el-input
          v-model="form.store_first_rebate"
          type="number"
          placeholder="一级返佣比例"
          style="width: 50%"><template #append>%</template></el-input>
          <small class="ml-2 text-gray-500">订单交易成功后给上级返佣的比例0-100</small>
        </div>
      </el-form-item>
      <el-form-item label="二级返佣比例">
        <div>
          <el-input
          v-model="form.store_second_rebate"
          type="number"
          placeholder="二级返佣比例"
          style="width: 50%"><template #append>%</template></el-input>
          <small class="ml-2 text-gray-500">订单交易成功后给上级返佣的比例0-100</small>
        </div>
      </el-form-item>
      <el-form-item label="自购返佣">
        <div>
          <el-radio-group v-model="form.is_self_brokerage">
            <el-radio :label="1" border>是</el-radio>
            <el-radio :label="0" border>否</el-radio>
          </el-radio-group>
          <small class="ml-2 text-gray-500">是否看齐自购返佣</small>
        </div>
      </el-form-item>
      
      <h5 class="bg-gray-100 p-3 rounded mb-5">结算设置</h5>
      <el-form-item label="结算时间">
        <div>
          <el-input
          v-model="form.settlement_days"
          type="number"
          placeholder="一级返佣比例"
          style="width: 50%"><template #prepend>订单完成后</template><template #append>天</template></el-input>
          <small class="ml-2 text-gray-500">订单交易成功后给上级返佣的比例0-100</small>
        </div>
      </el-form-item>
      <el-form-item label="佣金到账时间">
        <div>
          <el-radio-group v-model="form.brokerage_method">
            <el-radio label="hand" border>手动到账</el-radio>
            <el-radio label="wx" border>自动到账(微信)</el-radio>
          </el-radio-group> 
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="update"
          >保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
  import {reactive, ref} from 'vue'
  import {distriSetting, updateDistriSetting} from '@/api/distribution'
  import {ElNotification} from 'element-plus'

  const loading = ref(false)
  const form = reactive({
    distribution_open: 1, //分销启用:0禁用1启用
    store_first_rebate: 10, //一级返佣比例：0~100
    store_second_rebate: 20, //二级返佣比例：0~100
    spread_banners: [
      'http://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/public/62710076cd93e.png',
    ], //分销海报图
    is_self_brokerage: 1, //自购返佣:0否1是
    settlement_days: 7, //结算时间（单位：天）
    brokerage_method: 'hand', //佣金到账方式:hand手动,wx微信
  })
  const activeTab = ref('first')

  // 获取默认配置
  const getSysconfig = () => {
    loading.value = true
    distriSetting()
      .then((res) => {
        for (const key in form) {
          form[key] = res[key]
        }
        // form.password_encrypt = form.password_encrypt.split(',')
      })
      .finally(() => {
        loading.value = false
      })
  }
  getSysconfig()

  // 修改配置
  const update = () => {
    loading.value = true
    updateDistriSetting(form)
      .then(() => {
        // form.password_encrypt = form.password_encrypt.join(',')
        getSysconfig()
        ElNotification({
          type: 'success',
          message: '更新成功',
        })
      })
      .finally(() => {
        loading.value = false
      })
  }
</script>

<style>
  .el-tabs-pane {
    margin-bottom: 16px;
  }
</style>
