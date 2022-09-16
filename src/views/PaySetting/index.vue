<template>
  <el-card shadow="never" :body-style="{padding: '20px'}" v-loading="loading">
    <el-form :model="form" label-width="160px">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="支付设置" name="first">
          <el-table :data="tableData" border stripe>
            <el-table-column label="支付方式" align="left">
              <template #default="{ row }">
                <div class="flex items-center">
                  <el-image :src="row.src" fit="cover" :lazy="true" style="width: 40px; height: 40px;" class="rounded mr-2"></el-image>
                  <div>
                    <h6>{{ row.name }}</h6>
                    <small class="text-gray-500 mt-1">{{ row.desc }}</small>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template #default="{ row }">
                <el-button text type="primary" size="small" @click="openDrawer(row.name)">配置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="购物设置" name="second">
          <el-form-item label="未支付订单">
            <el-input type="number" v-model="form.close_order_minute" placeholder="未支付订单">
              <template #append>
                分钟后自动关闭
              </template>
            </el-input>
            <small class="text-gray-500" flex mt-1>订单确定后未付款，n分钟后自动关闭，设置0不自动关闭</small>
          </el-form-item>
          <el-form-item type="number" label="已发货订单">
            <el-input v-model="form.auto_received_day" placeholder="已发货订单">
              <template #append>
                天后自动确认收货
              </template>
            </el-input>
            <small class="text-gray-500" flex mt-1>如果在期间未确认收货，系统将自动完成收货，设置0不自动收货</small>
          </el-form-item>
          <el-form-item type="number" label="已完成订单">
            <el-input v-model="form.after_sale_day" placeholder="已完成订单">
              <template #append>
                天内允许申请售后
              </template>
            </el-input>
            <small class="text-gray-500" flex mt-1>订单完成后，用户在n天内可以发起售后申请，设置0不允许申请售后</small>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="default" @click="submit"
              >保存</el-button
            >
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <FormDrawer ref="formDrawerRef" @confirm="submit" :drawerVisible="drawerVisible" title="支付">
      <el-form v-if="drawerType === '支付宝支付'" :model="form" label-width="80px">
        <el-form-item label="app_id">
          <el-input v-model="form.alipay.app_id" placeholder="app_id"></el-input>
        </el-form-item>
        <el-form-item label="ali_public_key">
          <el-input v-model="form.alipay.ali_public_key" placeholder="ali_public_key" type="textarea" rows="4"></el-input>
        </el-form-item>
        <el-form-item label="private_key">
          <el-input v-model="form.alipay.private_key" placeholder="private_key" type="textarea" rows="4"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-else :model="form" label-width="80px">
        <el-form-item label="公众号App ID">
          <el-input v-model="form.wxpay.app_id" placeholder="app_id"></el-input>
        </el-form-item>
        <el-form-item label="小程序 APP ID">
          <el-input v-model="form.wxpay.miniapp_id" placeholder="miniapp_id"></el-input>
        </el-form-item>
        <el-form-item label="小程序 Secret Key">
          <el-input v-model="form.wxpay.private_key" placeholder="private_key"></el-input>
        </el-form-item>
        <el-form-item label="cert_client">
          <el-upload
            :action="uploadAction"
            :headers="$store.getters.token"
            :limit="1"
            accept=".pem"
            :on-success="uploadSuccess">
             <!-- <template #trigger><el-button size="small" type="primary">select file</el-button></template> -->
            <el-button size="small" type="primary" @click="">点击上传</el-button>
            <template #tip>
              <p class="text-rose-500">{{ form.wxpay.cert_client ? form.wxpay.cert_client : '未配置' }}</p>
              <div class="el-upload__tip">例如：apiclient_cert.pem</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="cert_key">
          <el-upload
            :action="uploadAction"
            :headers="$store.getters.token"
            :limit="1"
            accept=".pem"
            :on-success="uploadKeySuccess">
             <!-- <template #trigger><el-button size="small" type="primary">select file</el-button></template> -->
            <el-button size="small" type="primary" @click="">点击上传</el-button>
            <template #tip>
              <p class="text-rose-500">{{ form.wxpay.cert_key ? form.wxpay.cert_key : '未配置' }}</p>
              <div class="el-upload__tip">例如：cert_key.pem</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
  import {reactive, ref} from 'vue'
  import { sysconfig, updateSysconfig, uploadAction } from '@/api/setting'
  import {ElNotification} from 'element-plus'

  const loading = ref(false)
  const form = reactive({
    close_order_minute: 30,
    auto_received_day: 7,
    after_sale_day: 23,
    alipay: {
      app_id: '****已配置****',
      ali_public_key: '****已配置****',
      private_key: '****已配置****',
    },
    wxpay: {
      app_id: '****已配置****',
      miniapp_id: '****已配置****',
      secret: '****已配置****',
      appid: '****已配置****',
      mch_id: '****已配置****',
      key: '****已配置****',
      cert_client: '****已配置****.pem',
      cert_key: '****已配置****.pem',
    },
    ship: '****已配置****',
  })
  const activeTab = ref('first')

  // 表格
  const tableData=  ref([
    {
      name: '支付宝支付',
      desc: '该系统支持即时到账接口',
      src: 'https://upload.shejihz.com/2020/02/b804ab44a283c45574825e1ea0499bb5.jpg'
    },
    {
      name: '微信支付',
      desc: '该系统支持微信网页支付和扫码支付',
      src: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.v7cA1LDQSvri5lYUZIUAnAHaFR?pid=ImgDet&rs=1'
    },
  ])

  // 打开drawer
  const formDrawerRef = ref(null)
  const drawerVisible = ref(false)
  const drawerType = ref('')
  const openDrawer = (rowName) => {
    drawerType.value = rowName
    getSysconfig()
    drawerVisible.value = true
  }

  // 获取默认配置
  const getSysconfig = () => {
    loading.value = true
    sysconfig()
      .then((res) => {
        console.log(res)
        for (const key in form) {
          form[key] = res[key]
        }
        // form.password_encrypt = form.password_encrypt.split(',')
      })
      .finally(() => {
        loading.value = false
      })
  }

  // 修改配置
  const submit = () => {
    loading.value = true
    updateSysconfig(form)
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

  // 上传成功回调
  const uploadSuccess = (response, uploadFile, uploadFiles) => {
    form.wxpay.cert_client = response.data
  }
  const uploadKeySuccess = (response, uploadFile, uploadFiles) => {
    form.wxpay.cert_key = response.data
  }
</script>

<style scoped>
  .el-tab-pane {
    margin-top: 16px;
  }
</style>
