<template>
  <el-menu
    :default-active="$route.path"
    class="aside"
    :collapse="$store.getters.isCollapse"
    :style="{ width: $store.getters.isCollapse ? '64px' : '250px' }"
    :unique-opened="true"
    router
  >
    <template v-for="(menu, index) in menus" :key="menu.id">
      <el-sub-menu :index="menu.name" v-if="menu.child.length > 0" >
        <template #title>
          <el-icon>
            <component :is="menu.icon" class="mr-2"></component>
          </el-icon>
          <span>{{ menu.name }}</span>
        </template>
        <el-menu-item v-for="(subMenu, index) in menu.child" :key="subMenu.id" :index="subMenu.frontpath">
          <el-icon>
            <component :is="subMenu.icon" class="mr-2"></component>
          </el-icon>
          <span>{{ subMenu.name }}</span>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-else :index="menu.frontpath"></el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
  import { useStore } from 'vuex'
  const store = useStore()  

  const menus = store.getters.userInfo.menus
</script>

<style>
  .aside {
    width: 250px;
    @apply shadow-md fixed h-screen bg-light-50 bottom-0 left-0 overflow-auto border-0;
    top: 64px;
  }
  ::-webkit-scrollbar {
    border: 0px;
  }
</style>
