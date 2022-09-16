<template>
  <div>
    <FormDrawer :drawerVisible="drawerVisible" @close="closeDrawer" title="推荐商品" confirmText="关联" @confirm="confirmHandler">
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column label="商品封面" width="180">
        <template #default="{ row }">
          <el-image :src="row.cover" fit="cover" :lazy="true" style="width: 64px; height: 64px"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            title="确定删除此关联商品吗?"
            @confirm="deleteGoods(row)"
          >
            <template #reference>
              <el-button type="primary" text size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    </FormDrawer>

    <GoodsSelect ref="goodsSelectRef" :category_id="category_id" @refreshRecommandGoods="getDataList(category_id)"></GoodsSelect>
  </div>

</template>

<script setup>
  import { ref } from 'vue'
  import { cateRelatedGoods, delCateRelatedGoods } from '@/api/category'
  import { ElNotification } from 'element-plus'

  const drawerVisible = ref(false)

  const category_id = ref(0)

  // 打开
  const openDrawer = () => {
    getDataList(category_id.value)
    drawerVisible.value = true
  }
  // 关闭
  const closeDrawer = () => {
    drawerVisible.value = false
  }

  // 获取对应分类的关联商品数据
  const tableData = ref([])
  const getDataList = async (id) => {
    const res = await cateRelatedGoods(id)
    tableData.value = res
  }

  // 删除关联商品
  const deleteGoods = (row) => {
    console.log(row)
    delCateRelatedGoods(row.id).then(() => {
      getDataList(category_id.value)
      ElNotification({
        type: 'success',
        message: '删除成功'
      })
    })
  }

  // 商品选择
  const goodsSelectRef = ref(null)
  const confirmHandler = () => {
    goodsSelectRef.value.getTableList(goodsSelectRef.value.currentPage)
    goodsSelectRef.value.dialogVisible = true
  }

  defineExpose({
    openDrawer,
    category_id
  })
</script>

<style>
</style>