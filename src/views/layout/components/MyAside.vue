<template>
  <el-menu
    :default-active="$route.path"
    class="aside"
    :collapse="$store.getters.isCollapse"
    :style="{ width: $store.getters.isCollapse ? '64px' : '250px' }"
    :unique-opened="true"
    router
    :collapse-transition="false">
    <template v-if="$store.getters.userInfo.menus">
      <div>
        <template
          v-for="(menu, index) in $store.getters.userInfo.menus"
          :key="menu.id">
          <el-sub-menu :index="menu.name" v-if="menu.child.length > 0">
            <template #title>
              <el-icon>
                <component :is="menu.icon" class="mr-2"></component>
              </el-icon>
              <span>{{ menu.name }}</span>
            </template>
            <el-menu-item
              v-for="(subMenu, index) in menu.child"
              :key="subMenu.id"
              :index="subMenu.frontpath">
              <el-icon>
                <component :is="subMenu.icon" class="mr-2"></component>
              </el-icon>
              <span>{{ subMenu.name }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="menu.frontpath"></el-menu-item>
        </template>
      </div>
    </template>
  </el-menu>
</template>

<script setup>
  import {useStore} from 'vuex'
  const store = useStore()
</script>

<style>
  .aside {
    @apply shadow-md fixed h-screen bg-light-50 bottom-0 left-0 overflow-auto border-0;
    top: 64px;
  }

  ::-webkit-scrollbar {
    border: 0px;
  }


  /*隐藏文字*/
  .el-menu--collapse  .el-sub-menu__title span {
    display: none;
  }
  /*隐藏 > */
  .el-menu--collapse  .el-sub-menu__title .el-sub-menu__icon-arrow {
    display: none;
  }
</style>
