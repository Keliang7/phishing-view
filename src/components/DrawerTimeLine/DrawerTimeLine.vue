<script setup lang="tsx">
import { ElDrawer, ElTimeline, ElTimelineItem } from 'element-plus'

defineProps({
  title: {
    type: String,
    default: ''
  },
  isDrawer: {
    type: Boolean,
    default: false
  },
  dataSourceInfo: {
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
    :title="title"
    :modelValue="isDrawer"
    :before-close="close"
    custom-class="drawerWidth"
    @open="open"
  >
    <ElTimeline>
      <ElTimelineItem
        v-for="(item, index) in dataSourceInfo"
        :key="index"
        :color="index == '0' ? '#009dd9' : '#f59a23'"
        :timestamp="item.timestamp"
        placement="top"
      >
        {{ item.source }}
      </ElTimelineItem>
    </ElTimeline>
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
