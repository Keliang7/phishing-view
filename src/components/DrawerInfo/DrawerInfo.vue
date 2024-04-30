<script setup lang="tsx">
import { ElDrawer, ElInput } from 'element-plus'

defineProps({
  isDrawer: {
    type: Boolean,
    default: false
  },
  bodyInfo: {
    type: Object,
    default: null
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
    :title="'查看网页信息'"
    :modelValue="isDrawer"
    :before-close="close"
    custom-class="drawerWidth"
    @open="open"
  >
    <div v-for="(item, index) in bodyInfo" :key="index">
      <p>{{ item.name }}</p>
      <ElInput
        :modelValue="item.value"
        type="textarea"
        :autosize="{ minRows: 11, maxRows: 16 }"
        :disabled="true"
        resize="none"
        :placeholder="'暂无内容'"
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
