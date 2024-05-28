<script setup lang="tsx">
import { ElDrawer, ElTimeline, ElTimelineItem } from 'element-plus'
import { formatTime } from '@/utils/index'
defineProps({
  isDrawer: {
    type: Boolean,
    default: false
  },
  dataSourceData: {
    type: Array<{
      source: string
      timestamp: number
    }>
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
// const sourceMap = {
//   bw: '报文监测子系统 获取',
//   domainMonitor: '域名监测子系统 获取',
//   urlLog: 'URL日志系统 获取',
//   tlsLog: 'TLS日志系统 获取'
// }
</script>
<template>
  <ElDrawer
    :title="'数据源'"
    :modelValue="isDrawer"
    :before-close="close"
    custom-class="drawerWidth"
    @open="open"
  >
    <ElTimeline>
      <el-timeline-item
        v-for="(item, index) in dataSourceData"
        :key="item.source"
        :color="index == 0 ? 'lightBlue' : 'yellowGreen'"
        size="large"
        :hollow="true"
      >
        <div class="pt-20px pl-30px">
          <div>推送时间：{{ formatTime(item.timestamp, 'yyyy-MM-dd HH:mm:ss') }}</div>
          <div>{{ item.source }} 获取</div>
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
