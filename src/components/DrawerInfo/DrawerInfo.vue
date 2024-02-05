<script setup lang="tsx">
import { ElDrawer, ElInput } from 'element-plus'
defineProps({
  title: {
    type: String,
    default: ''
  },
  isDrawer: {
    type: Boolean,
    default: false
  },
  requestBody: {
    type: String,
    default: '暂无内容'
  },
  responseBody: {
    type: String,
    default: '暂无内容'
  }
})
const emit = defineEmits(['update:isDrawer'])
const close = () => {
  console.log('关闭弹窗')
  emit('update:isDrawer', false)
}
const open = () => {
  console.log('打开弹窗')
}
</script>
<template>
  <ElDrawer
    :title="title"
    :modelValue="isDrawer"
    :before-close="close"
    custom-class="drawerWidth"
    @open="open"
  >
    <div>
      <p>请求体：</p>
      <ElInput
        :modelValue="requestBody"
        type="textarea"
        :autosize="{ minRows: 11, maxRows: 16 }"
        :disabled="true"
        resize="none"
        placeholder="暂无内容"
      />
    </div>
    <div>
      <p>响应体：</p>
      <ElInput
        :modelValue="responseBody"
        type="textarea"
        :autosize="{ minRows: 11, maxRows: 16 }"
        :disabled="true"
        resize="none"
        placeholder="暂无内容"
      />
    </div>
  </ElDrawer>
</template>
<style lang="less" scope>
.el-drawer__title {
  font-size: 18px;
}
.el-drawer__header {
  margin-bottom: 0px;
  padding-bottom: 20px;
  border-bottom: 2px solid #ebeef5;
}
</style>
