<template>
  <div>
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
          <Transition name="fade">
            <keep-alive>
              <component :is="Component"></component>
            </keep-alive>
          </Transition>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import MyHeader from '@/views/layout/components/MyHeader.vue'
import MyAside from '@/views/layout/components/MyAside.vue'
import MyTabsList from '@/views/layout/components/MyTabsList.vue'
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: all .5s;
  }

  .fade-enter-from {
    opacity: 0;
    transform: translateX(-30px);
  }

  .fade-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>
  