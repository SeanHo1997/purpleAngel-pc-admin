<template>
  <div>
    <el-card shadow="never" class="border-0">
    <!-- 新增|刷新 -->
    <ListHeader @add="openDrawer" @refresh="refresh"></ListHeader>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" stripe v-loading="loading">
      <el-table-column prop="title" label="角色">
        <template #default="{row}">
          <div class="flex items-center">
            <div class="ml-3">
              <div>{{ row.name }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="角色描述">
        <template #default="{row}">
          <div class="ml-3">
            <div>{{ row.desc }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{row}">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus($event, row.id)"
            :disabled="row.super === 1" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template #default="{row}">
          <small v-if="row.super === 1">暂无操作</small>
          <div v-else>
            <el-button type="primary" size="small" text @click="editFn(row)"
              >修改</el-button
            >
            <el-button
              type="primary"
              size="small"
              text
              @click="openDrawer2(row)"
              >配置权限</el-button
            >
            <el-popconfirm
              title="确认删除此管理员吗?"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="confirmDel(row)">
              <template #reference>
                <el-button type="primary" size="small" text>删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row class="flex justify-center items-center mt-3">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :curren-page="currentPage"
        :page-size="pageSize"
        @current-change="getTableList(currentPage)">
      </el-pagination>
    </el-row>
    </el-card>

    <!-- 新增|修改 -->
    <FormDrawer
      :title="isEditId ? '编辑' : '新增'"
      :drawerVisible="drawerVisible"
      @close="drawerVisible = false"
      @confirm="addHandler">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        :inline="false">
        <el-form-item prop="name" label="角色名">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-switch v-model="formData.status"></el-switch>
        </el-form-item>
        <el-form-item prop="desc" label="角色描述">
          <el-input
            v-model="formData.desc"
            :active-value="1"
            :inactive-value="0"></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>

    <!-- 权限配置 -->
    <FormDrawer
      title="配置权限"
      :drawerVisible="drawerVisible2"
      @close="drawerVisible2 = false"
      @confirm="addHandler2">
      <el-tree
        ref="treeRef"
        :data="rules"
        :props="{ label: 'name', children: 'child', value: 'rule_id' }"
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="defaultCheckedKeys"
        show-checkbox
        node-key="id"
        default-expand-all
        @check="checkHandler"
      >
        <template #default="{ node, data }">
          <el-tag :type="data.menu ? '' : 'info'" size="small">{{ data.menu ? '菜单' : '权限' }}</el-tag>
          <span class="ml-2 text-sm">{{ data.name }}</span>
        </template>
      </el-tree>
    </FormDrawer>
  </div>
</template>

<script setup>
  import {ref, reactive} from 'vue'
  import {
    roleList,
    addRole,
    updateRole,
    delRole,
    roleStatus,
    setPermission,
  } from '@/api/role'
  import {ElNotification} from 'element-plus'
  import {ruleList} from '@/api/access'
  const loading = ref(false)

  // 分页
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  // 获取列表数据
  const tableData = ref([])
  const getTableList = async (page) => {
    loading.value = true
    const res = await roleList(page)
    tableData.value = res.list
    total.value = res.totalCount
    loading.value = false
  }
  getTableList(currentPage.value)

  // 删除
  const confirmDel = (row) => {
    delRole(row.id)
      .then(() => {
        getTableList(currentPage.value)
        ElNotification({
          type: 'success',
          message: '删除成功',
        })
      })
      .catch(() => {})
  }

  // 表单相关
  const drawerVisible = ref(false)
  const formData = reactive({
    name: '',
    status: 1,
    desc: '',
  })
  const resetFormData = () => {
    formData.name = ''
    formData.status = 1
    formData.desc = ''
  }

  // 新增
  const openDrawer = () => {
    isEditId.value = 0
    resetFormData()
    drawerVisible.value = true
  }

  // 确认新增
  const formRef = ref(null)
  const isEditId = ref(0) // 创建变量用于区分业务场景
  const addHandler = () => {
    formRef.value.validate().then(() => {
      if (!isEditId.value) {
        // 新增场景
        addRole(formData).then(() => {
          drawerVisible.value = false
          getTableList(currentPage.value)
          ElNotification({
            type: 'success',
            message: '添加成功',
          })
        })
      } else {
        // 编辑场景
        updateRole(isEditId.value, formData).then(() => {
          drawerVisible.value = false
          getTableList(currentPage.value)
          ElNotification({
            type: 'success',
            message: '更新成功',
          })
        })
      }
    })
  }

  // 刷新
  const refresh = () => {
    getTableList(currentPage.value)
  }

  // 编辑
  const editFn = (row) => {
    isEditId.value = row.id
    formData.name = row.name
    formData.status = row.status
    formData.desc = row.desc
    drawerVisible.value = true
  }

  // 修改状态
  const changeStatus = ($event, id) => {
    roleStatus(id, $event).then(async () => {
      ElNotification({
        type: 'success',
        message: '设置成功',
      })
    })
  }

  // 权限配置相关
  const formData2 = reactive({
    id: '',
    rule_ids: [],
    name: ''
  })

  const drawerVisible2 = ref(false)
  // 菜单权限
  const rules = ref([])
  const defaultExpandedKeys = ref([])
  let defaultCheckedKeys = ref([])
  const treeRef = ref(null)
  const openDrawer2 = async (row) => {
    const res = await ruleList()
    rules.value = res.list
    formData2.id = row.id
    formData2.name = row.name
    defaultExpandedKeys.value = res.list.map(item => item.id)
    // 当前角色拥有的权限id (打开后再操作)
    drawerVisible2.value = true
    // 方法1
    defaultCheckedKeys.value = row.rules.map(item => item.id)
    // 方法2
    // const ids = row.rules.map(item => item.id)
    // treeRef.value.setCheckedKeys(ids)
  }
  const addHandler2 = () => {
    setPermission(formData2).then(() => {
      drawerVisible2.value = false
      getTableList(currentPage.value)
      ElNotification({
        type: 'success',
        message: '添加权限成功',
      })
    })
  }

  // 选中树形节点事件
  const checkHandler = (p1, p2) => {
    const { checkedKeys, halfCheckedKeys } = p2
    formData2.rule_ids = [...checkedKeys, ...halfCheckedKeys]
    console.log(formData2.rule_ids)
  }
</script>
