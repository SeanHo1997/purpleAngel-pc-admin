<template>
  <FormDrawer
    ref="formDrawerRef"
    v-model:drawerVisible="drawerVisible"
    title="商品详情"
    size="60%"
    destroy-on-close
    @confirm="submit">
    <el-form :model="formData" ref="form" label-width="80px" destroy-on-close>
      <el-form-item>
        <div style="border: 1px solid #ccc">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
             />
          <Editor
            style="height: 500px; overflow-y: hidden"
            v-model="formData.content"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated" />
        </div>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
  import {ref, reactive, shallowRef, onBeforeUnmount} from 'vue'
  import {readGoods, updateGoods} from '@/api/goods'
  import {ElNotification} from 'element-plus'
  import '@wangeditor/editor/dist/css/style.css'
  import {Editor, Toolbar} from '@wangeditor/editor-for-vue'

  const emit = defineEmits(['submited'])

  const drawerVisible = ref(false)
  const formData = reactive({
    content: '',
  })
  const goodsId = ref('')

  // 打开drawer
  const openDrawer = (row) => {
    goodsId.value = row.id
    readGoodsDetail(row.id)
    drawerVisible.value = true
  }

  // 关闭drawer
  // const closeDrawer = () => {
  //   console.log('1111111')
  //   drawerVisible.value = false
  // }

  // 读取商品资料
  const readGoodsDetail = (id) => {
    readGoods(id).then((res) => {
      formData.content = res.content
      drawerVisible.value = true
    })
  }

  // 提交详情
  const submit = async () => {
    await updateGoods(goodsId.value, formData)
    drawerVisible.value = false
    emit('submited')
    ElNotification({
      message: '提交成功',
      type: 'success',
    })
  }

  defineExpose({
    openDrawer,
  })

  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef()
  const mode = 'default' // 或 'simple'
  const toolbarConfig = {}
  const editorConfig = {placeholder: '请输入内容...'}

  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
  })

  const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
  }
</script>
