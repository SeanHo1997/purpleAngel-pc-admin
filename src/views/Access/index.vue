<template>
  <div>
    <el-card shadow="never" class="border-0">
    <ListHeader @refresh="refresh" @add="openDrawer"></ListHeader>
    <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }" v-loading="loading" node-key="id" :default-expanded-keys="defaultExpandedKeys">
      <template #default="{ node, data }">
        <div>
          <el-tag size="small" :type="data.menu ? '' : 'info'">{{ data.menu? '菜单' : '权限' }}</el-tag>
          <el-icon v-if="data.icon" :size="16" class="ml-2">
            <component :is="data.icon"></component>
          </el-icon>
          <span>{{ data.name }}</span>
        </div>
        <div class="ml-auto">
          <span @click.stop>
            <el-switch v-model="data.status" :active-value="1" :inactive-value="0" @change="changeStatus($event, data)"></el-switch>
          </span>
          <el-button text type="primary" @click.stop="editFn(data)">修改</el-button>
          <!-- <el-button text type="primary">增加</el-button> -->
          <el-popconfirm
              title="确认删除此管理员吗?"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm.stop="confirmDel(data)">
              <template #reference>
                <el-button text type="primary" @click.stop>删除</el-button>
              </template>
            </el-popconfirm>
        </div>
      </template>
    </el-tree>
    </el-card>
    
    <FormDrawer
      :title="isEditId ? '编辑' : '新增'"
      :drawerVisible="drawerVisible"
      @close="drawerVisible = false"
      @confirm="addHandler"
      >
      <el-form
        ref="formRef"
        :model="formData"
        label-width="120px"
        :inline="false">
        <el-form-item prop="rule_id" label="上级菜单ID">
          <el-cascader :options="rulesList" :props="{ value: 'id', label: 'name', children: 'child', checkStrictly: true, emitPath: false }" v-model="formData.rule_id" placeholder="请选择上级菜单" />
        </el-form-item>
        <el-form-item prop="menu" label="类型">
          <el-radio-group v-model="formData.menu" class="ml-4">
            <el-radio :label="1" size="large">菜单</el-radio>
            <el-radio :label="0" size="large">权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="name" label="菜单权限名称">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item prop="icon" label="菜单图标" v-if="formData.menu === 1">
          <IconSelect v-model="formData.icon"></IconSelect>
        </el-form-item>
        <el-form-item v-if="formData.menu === 0 && formData.rule_id > 0" prop="frontpath" label="前端路由">
          <el-input v-model="formData.frontpath"></el-input>
        </el-form-item>
        <el-form-item v-if="formData.menu === 0" prop="condition" label="后端规则">
          <el-input v-model="formData.condition"></el-input>
        </el-form-item>
        <el-form-item v-if="formData.menu === 0" prop="method" label="请求方式">
          <el-select v-model="formData.method" class="m-2" placeholder="请求方式" size="large">
            <el-option
              v-for="item in ['GET', 'POST', 'PUT', 'DELETE']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="order" label="排序">
          <el-input-number v-model="formData.order" :min="0" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item prop="status" label="是否启用">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>
<script setup>
  import { ref, reactive } from 'vue'
  import ListHeader from '@/components/ListHeader/index.vue';
  import { ruleList, addRule, updateRule, delRule, RuleStatus } from '@/api/access'
  import { ElNotification } from 'element-plus';
  import IconSelect from '../../components/IconSelect/index.vue';
import { update } from 'lodash';

  const defaultExpandedKeys = ref([])

  const loading = ref(false)
  // 分页
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  // 获取列表数据
  const tableData = ref([])
  const rulesList = ref([]) // 权限列表
  const getTableList = async (page) => {
    loading.value = true
    const res = await ruleList(page)
    tableData.value = res.list
    total.value = res.totalCount
    rulesList.value = res.rules
    loading.value = false
  }
  getTableList(currentPage.value)

  // 刷新
  const refresh = () => {
    getTableList(currentPage.value)
  }

  // 表单相关
  const drawerVisible = ref(false)
  const formData = reactive({
    rule_id: 0, // 上级菜单ID
    menu: 1, // 是否是菜单，0否1是
    name: '', // 菜单/权限名称
    condition: '', // 后端规则，由后端提供的接口别名（menu为0时必填）
    method: '', // 请求方式：GET/POST/PUT/DELETE（menu为0时必填）
    status: 1, // 是否启用
    order: 50, // 排序
    icon: '', // element-plus图标（menu为1必填）
    frontpath: '' // 对应前端路由路径（menu为1且rule_id>0时必填）
  })

  // const rules = {
  //   rule_id: [{trigger: 'blur', required: true, message: '不能为空'}],
  //   menu: [{trigger: 'blur', required: true, message: '不能为空'}],
  //   name: [{trigger: 'blur', required: true, message: '不能为空'}],
  //   condition: [{trigger: 'blur', required: true, message: '不能为空'}],
  //   method: [{trigger: 'blur', required: true, message: '不能为空'}],
  //   status: [{trigger: 'blur', required: true, message: '不能为空'}],
  //   order: [{trigger: 'blur', required: true, message: '不能为空'}],
  //   icon: [{trigger: 'blur', required: true, message: '不能为空'}],
  //   frontpath: [{trigger: 'blur', required: true, message: '不能为空'}],
  // }

  // 打开新增按钮
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
        addRule(formData).then(() => {
          drawerVisible.value = false
          getTableList(currentPage.value)
          ElNotification({
            type: 'success',
            message: '添加成功',
          })
        })
      } else {
        // 编辑场景
        updateRule(formData).then(
          () => {
            drawerVisible.value = false
            getTableList(currentPage.value)
            ElNotification({
              type: 'success',
              message: '更新成功',
            })
          }
        )
      }
    })
  }

  const resetFormData = () => {
    formData.rule_id = 0
    formData.menu = 1
    formData.name = ''
    formData.condition = ''
    formData.method = ''
    formData.status = 1
    formData.order = 50
    formData.icon = ''
    formData.frontpath = ''
  }

  // 编辑
  const editFn = (data) => {
    isEditId.value = data.id
    formData.rule_id = data.id
    formData.menu = data.menu
    formData.name = data.name
    formData.condition = data.condition
    formData.method = data.method
    formData.status = data.status
    formData.order = data.order
    formData.icon = data.icon
    formData.frontpath = data.frontpath
    drawerVisible.value = true
  }

  // 删除
  const confirmDel = (data) => {
    delRule(data.id).then(() => {
      getTableList(currentPage.value)
      ElNotification({
        type: 'success',
        message: '删除成功',
      })
    }).catch(() => {})
  }

  // 修改状态
  const changeStatus = ($event, data) => {
    RuleStatus(data.id ,$event).then(() => {
      ElNotification({
        type: 'success',
        message: '更新成功'
      })
    })
  }

</script>

<style>
  .el-tree-node__content {
    padding: 20px 0;
  }
</style>
