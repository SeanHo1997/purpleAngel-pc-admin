<template>
  <FormDrawer
    ref="formDrawerRef"
    :drawerVisible="drawerVisible"
    title="商品规格"
    size="70%"
    destroy-on-close
    @confirm="submit"
    @close="drawerVisible = false">
    <el-form :model="formData" ref="formRef" label-width="80px" destroy-on-close>
      <el-form-item label="规格类型">
        <el-radio-group v-model="formData.sku_type">
          <el-radio :label="0">单规格</el-radio>
          <el-radio :label="1">多规格</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 单规格 -->
      <template v-if="formData.sku_type === 0">
        <el-form-item label="市场价格">
          <el-input v-model="formData.sku_value.oprice"
            ><template #append>元</template></el-input
          >
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input v-model="formData.sku_value.pprice"
            ><template #append>元</template></el-input
          >
        </el-form-item>
        <el-form-item label="成本价格">
          <el-input v-model="formData.sku_value.cprice"
            ><template #append>元</template></el-input
          >
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="formData.sku_value.weight"
            ><template #append>公斤</template></el-input
          >
        </el-form-item>
        <el-form-item label="商品体积">
          <el-input v-model="formData.sku_value.volume"
            ><template #append>立方米</template></el-input
          >
        </el-form-item>
      </template>
      
      <!-- 多规格 -->
      <template v-else>
        <SkuCard :goodsId="goodsId"></SkuCard>
      </template>
    </el-form>
  </FormDrawer>
</template>

<script setup>
  import {ref, reactive} from 'vue'
  import {readGoods} from '@/api/goods'
  import SkuCard from './sku/skucard.vue'
  import {
    goodsSkusList
  } from '@/composable/useSku'

  const emit = defineEmits(['submited'])

  const drawerVisible = ref(false)
  const formData = reactive({
    sku_type: 0,
    sku_value: {
      oprice: 0,
      pprice: 0,
      cprice: 0,
      weight: 0,
      volume: 0
    },
  })

  // 打开drawer
  const goodsId = ref(0)
  const openDrawer = (row) => {
    goodsId.value = row.id
    readGoodsDetail(row.id)
    drawerVisible.value = true
  }

  // 读取商品资料
  const readGoodsDetail = (id) => {
    readGoods(id).then((res) => {
      formData.sku_type = res.sku_type
      // 由于返回的数据的sku_value是Null 故在此做个判断
      if (res.sku_value !== null) {
        formData.sku_value = res.sku_value
      }

      // 拿到规格数据
      goodsSkusList.value = res.goodsSkusCard

      drawerVisible.value = true
    })
  }

  // 提交添加
  const submit = () => {
    emit('submited')
    drawerVisible.value = false
  }

  defineExpose({
    openDrawer,
  })
</script>

<style></style>
