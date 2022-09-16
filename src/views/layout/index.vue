<template>
  <el-container>
    <el-header>
      <MyHeader/>
    </el-header>
    <el-container>
      <el-aside :style="{ width: $store.getters.isCollapse ? '64px' : '250px' }">
        <MyAside/>
      </el-aside>
      <el-main class="px-0 pt-[44px]">
        <MyTabsList></MyTabsList>
        <!-- 二级路由 -->
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <component :is="Component"></component>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import MyHeader from '@/views/layout/components/MyHeader.vue'
import MyAside from '@/views/layout/components/MyAside.vue'
import MyTabsList from '@/views/layout/components/MyTabsList.vue'
</script>

<style scoped>
  .fade-enter-to,
  .fade-leave-from,
  .fade-enter-active,
  .fade-leave-active {
    opacity: 1;
    transition: all .3s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
  