<script setup lang="tsx">
import { ElDrawer, ElTimeline, ElTimelineItem } from 'element-plus'
import { formatTime } from '@/utils/index'
defineProps({
  title: {
    type: String,
    default: ''
  },
  isDrawer: {
    type: Boolean,
    default: false
  },
  backtrackData: {
    type: Object
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
    <p>{{ backtrackData?.data.suggestion || '优化建议：' + backtrackData?.data.suggestion }}</p>
    <p>溯源过程：</p>
    <ElTimeline>
      <el-timeline-item
        v-for="(item, index) in backtrackData?.data.flow"
        :key="item.content"
        :color="index == 0 ? 'orangeRed' : 'yellowGreen'"
        size="large"
        :hollow="true"
      >
        <div class="pt-20px pl-30px">
          <div>推送时间：{{ formatTime(item.time, 'yyyy-MM-dd HH:mm:ss') }}</div>
          <div>阶段：{{ item.status }}</div>
          <div>数据情况：{{ item.dataSituation }}</div>
          <div>处理情况：{{ item.dealSituation }}</div>
        </div>
      </el-timeline-item>
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
