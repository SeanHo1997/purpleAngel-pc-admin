<template>
  <div class="tag-list">
    <el-tabs
      v-model="activeName"
      type="card"
      closable
      @tab-click="clickTab"
      @tab-remove="removeTab"
      >
      <el-tab-pane
        v-for="tab in tabList"
        :key="tab.path"
        :label="tab.title"
        :name="tab.path"
        closable
      >
      </el-tab-pane>
    </el-tabs>
    <!-- 下拉框 -->
    <span class="dropdown-container">
      <el-dropdown @command="commandHandler">
        <span class="el-dropdown-link">
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
            <el-dropdown-item command="closeAll">全部关闭</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
</template>

<script setup>
  import { ElNotification } from 'element-plus';
  import { ref } from 'vue'
  import { onBeforeRouteUpdate, useRouter } from 'vue-router'
  const router = useRouter()

  // tabs数据
  const tabList = ref([
    {
      title: '首页',
      path: '/',
    }
  ])

  const activeName = ref('/')
  
  // 监听router变化 添加选项卡
  onBeforeRouteUpdate((to, from) => {
    const obj = {
      title: to.meta.title,
      path: to.path
    }
    activeName.value = obj.path

    const index = tabList.value.findIndex(tab => tab.path === obj.path)
    if (index !== -1) {
      tabList.value.splice(index, 1)
      tabList.value.push(obj)
    } else {
      tabList.value.push(obj)
    }
  })

  // 点击tab跳转
  const clickTab = (p1) => {
    activeName.value = p1.props.name
    // console.log(p1)
    router.push(p1.props.name)
  }

  const removeTab = (name) => {
    // console.log(name)
    const index = tabList.value.findIndex(item => item.path === name)
    if (index === 0) return ElNotification({
      message: '不可删除',
      type: 'info'
    })
    if (name === activeName.value) {
      // 如果点击当前的tab
      router.push(tabList.value[index - 1].path)
      activeName.value = tabList.value[index - 1].path
      tabList.value.splice(index, 1)
    } else {
      // 点击不是当前的tab
      tabList.value.splice(index, 1)
    }
  }

  // 下拉菜单
  const commandHandler = (command) => {
    switch (command) {
      case 'closeOther':
        closeOther()
        break;
      case 'closeAll':
      closeAll()
        break;
    }
  }

  // 关闭其他
  const closeOther = () => {
    tabList.value = tabList.value.filter(tab => tab.path !== activeTab.value)
    tabList.value.unshift(
      {
        title: '首页',
        path: '/'
      }
    )
  }

  // 关闭全部
  const closeAll = () => {
    tabList.value = [
      {
        title: '首页',
        path: '/'
      }
    ]
    router.push('/')
  }
  </script>

  <style>
  .tag-list {
    @apply fixed top-[64px] w-[100%] h-[44px] bg-gray-200 flex justify-between items-center z-50;
  }

  .el-tabs--card>.el-tabs__header .el-tabs__item {
    border-bottom: 0px;
  }

  .el-tabs--card>.el-tabs__header .el-tabs__nav {
    border: 0;
  }

  .el-tabs__item {
    height: 32px;
    line-height: 32px;
    @apply mx-1 bg-white;
  }

  .el-tabs__header {
    margin-bottom: 0;
    @apply flex items-center;
  }

  .dropdown-container {
    @apply bg-white inline-block h-[32px] w-[32px] rounded flex items-center justify-center mx-2;
  }
  </style>
