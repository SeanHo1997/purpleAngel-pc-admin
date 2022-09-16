<template>
  <el-form-item label="规格选项">
    <el-card shadow="never" class="w-full mb-3" v-for="(item, index) in goodsSkusList" :key="index">
      <template #header>
        <div class="flex items-center">
          <!-- 规格名称 -->
          <el-input :placeholder="item.name" v-model="item.name"><template #append><el-icon @click="$refs.chooseSkuRef.open()"><more/></el-icon></template>
          </el-input>
          <!-- 上一项 -->
          <el-button size="small" @click="sortCard('up', index)" class="mx-3" :disabled="index === 0"><el-icon><Top/></el-icon></el-button>
          <!-- 下一项 -->
          <el-button size="small" @click="sortCard('down', index)" class="mx-3" :disabled="index === goodsSkusList.length - 1"><el-icon><Bottom/></el-icon></el-button>
          <!-- 修改 -->
          <el-button size="small" @click="updateSkuItemHandler(item)" class="mx-3">修改</el-button>
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
      <SkuCardItem :skuItem="item"></SkuCardItem>
    </el-card>
    <el-button type="success" size="small" @click="onaddingSku">添加规格</el-button>
  </el-form-item>

  <ChooseSku ref="chooseSkuRef"></ChooseSku>
</template>

<script setup>
import SkuCardItem from './skucarditem.vue'
import {
  addSkuData,
  onaddingSku,
  goodsSkusList,
  updateSkuItemHandler,
  deleteSkuHandler,
  sortCard
} from '@/composable/useSku'
import { ref } from 'vue'

const chooseSkuRef = ref(null)
</script>

<style>
  .el-card__header {
    @apply bg-gray-50 p-2;
  }
</style>