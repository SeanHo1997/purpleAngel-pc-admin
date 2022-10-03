<template>
  <el-form-item label="规格选项">
    <el-card shadow="never" class="w-full mb-3" v-for="(item, index) in goodsSkusList" :key="index">
      <template #header>
        <div class="flex items-center">
          <!-- 规格名称 -->
          <!-- <el-input :disabled="editStatus === false" :placeholder="item.name" v-model="item.name"><template #append><el-icon @click="chooseSkuHandler(item)" class="hover:(bg-gray-50)"><more/></el-icon></template> -->
          <!-- </el-input> -->
          <!-- 上一项 -->
          <el-button size="small" @click="sortCard('up', index)" class="mx-3" :disabled="index === 0"><el-icon><Top/></el-icon></el-button>
          <!-- 下一项 -->
          <el-button size="small" @click="sortCard('down', index)" class="mx-3" :disabled="index === goodsSkusList.length - 1"><el-icon><Bottom/></el-icon></el-button>
          <!-- 修改 -->
          <el-button size="small" @click="updateSkuItemHandler(item)" class="mx-3">{{ editStatus ? '完成编辑' : '编辑' }}</el-button>
          <el-button v-show="editStatus" size="small" @click="cancelSkuEdit" class="mx-3">取消编辑</el-button>
          <!-- 删除 -->
          <el-popconfirm
            title="确定删除此规格吗？"
            confirmButtonText="删除"
            cancelButtonText="取消"
            confirmButtonType="primary"
            cancelButtonType="text"
            @confirm="deleteSkuHandler(item.id)">
            <template #reference>
              <el-button size="small" class="mx-3"><el-icon><Delete/></el-icon></el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
      <!-- card body -->
      <!-- 规格值 -->
      <SkuCardItem :skuItem="item" :editStatus="editStatus"></SkuCardItem>
    </el-card>
    <el-button type="success" size="small" @click="startAddSku">添加规格</el-button>
  </el-form-item>

  <ChooseSku ref="chooseSkuRef"></ChooseSku>

  <!-- 添加规格 -->
  <el-dialog v-model="dialogFormVisible" title="添加规格">
    <el-form :model="addSkuData">
      <el-form-item label="规格名" label-width="80px">
        <el-input v-model="addSkuData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="规格排序" label-width="80px">
        <el-input-number v-model="addSkuData.order" :min="1" :max="1000"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer flex justify-evenly">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddSku"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import SkuCardItem from './skucarditem.vue'
  import { updateSkuItem, addSkuItem, deleteSkuItem } from '@/api/sku'
  import {
    editStatus,
    goodsSkusList,
    sortCard,
    chooseSkuNSetSkuCardHanlder
  } from '@/composable/useSku'
  import { ref,reactive } from 'vue'
  import { ElNotification } from 'element-plus'

  const props = defineProps({
    goodsId: {
      type: Number,
      default: 111
    }
  })

  const chooseSkuRef = ref(null)
  const chooseSkuHandler = (item) => {
    console.log(item)
    chooseSkuRef.value.open((value) => {
      console.log(value)
      chooseSkuNSetSkuCardHanlder(item.id, {
        name: value.name,
        value: value.list
      })
    })
  }

  // 添加商品规格初始数据
  const addSkuData = reactive({
    goods_id: props.goodsId, //商品ID
    name: '', //规格名称
    order: 50, //排序
    type: 0 //规格类型 0文字
  })
  const resetAddSkuData = () => {
    addSkuData.goods_id = props.goodsId, //商品ID
    addSkuData.name = '', //规格名称
    addSkuData.order = 50, //排序
    addSkuData.type = 0 //规格类型 0文字
  }

  // 开始添加规格
  const startAddSku = () => {
    resetAddSkuData()
    dialogFormVisible.value = true
  }

  // 取消编辑规格
  const cancelSkuEdit = () => {
    editStatus.value = false
  }

  // 确定添加规格!
  const confirmAddSku = async () => {
    const res = await addSkuItem(addSkuData)
    goodsSkusList.value.push({
      ...res,
      goodsSkusCardValue: []
    })
    dialogFormVisible.value = false
    ElNotification({
      message: '添加规格成功',
      type: 'success'
    })
  }

  // 修改商品规格
  const updateSkuItemHandler = async (item) => {
    editStatus.value = !editStatus.value
    if (editStatus.value === false) {
      addSkuData.goods_id = item.goods_id
      addSkuData.name = item.name
      addSkuData.order = item.order
      await updateSkuItem(item.id, addSkuData)
      ElNotification({
        message: '修改规格成功',
        type: 'success'
      })
    }
  }

  // 删除商品规格
  const deleteSkuHandler = async (id) => {
    await deleteSkuItem(id)
    // 更新前端视图
    const i = goodsSkusList.value.findIndex(item => item.id === id)
    goodsSkusList.value.splice(i, 1)

    ElNotification({
      message: '删除规格成功',
      type: 'success'
    })
  }

  const dialogFormVisible = ref(false)
</script>

<style>
  .el-card__header {
    @apply bg-gray-50 p-2;
  }
</style>