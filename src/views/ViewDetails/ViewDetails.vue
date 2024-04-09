<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { ElDescriptions, ElDescriptionsItem, ElImage } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getListApi, getDataApi } from '@/api/dataGather/gatherResult'
import { formatTime } from '@/utils/index'
import { unref, ref, onMounted, Ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const columns: TableColumn[] = [
  {
    field: 'port',
    label: '端口'
  },
  {
    field: 'protocol',
    label: '协议'
  },
  {
    field: 'aimAddress',
    label: '目标地址',
    formatter: (data) => {
      return `${data.IP}:${data.port}`
    }
  },
  {
    field: 'screenshot',
    label: '网站截图',
    width: 200
  },
  {
    field: 'title',
    label: 'title'
  },
  {
    field: 'updateTime',
    label: '更新时间',
    formatter: (data) => formatTime(data.updateTime, 'yyyy-MM-dd HH:mm:ss')
  }
]

const { tableRegister, tableState } = useTable({
  // fetchDataApi方法用于异步获取表格数据
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ip: route.query.IP
    })
    return {
      list: res.data.list,
      total: res.data.total
    }
  }
})
let { loading, total, dataList, currentPage, pageSize } = tableState

interface TableInfo {
  FID: string
  ICON: string
  ICP: string
  IP: string
  createBy: string
  dataID: string
  domain: string
  domainHolder: string
  email: string
  netStatusCode: number
  place: string
  port: number
  protocol: string
  registerTime: number
  screenshot: string
  taskID: string
  taskName: string
  title: string
  updateTime: 0
  webInfo: string
  website: string
}

const tableInfo: Ref<TableInfo> = ref({
  FID: '',
  ICON: '',
  ICP: '',
  IP: '',
  createBy: '',
  dataID: '',
  domain: '',
  domainHolder: '',
  email: '',
  netStatusCode: 0,
  place: '',
  port: 0,
  protocol: '',
  registerTime: 0,
  screenshot: '',
  taskID: '',
  taskName: '',
  title: '',
  updateTime: 0, // 给 updateTime 赋初值
  webInfo: '',
  website: ''
})
onMounted(async () => {
  // 在组件挂载之前执行的逻辑
  const dataID = route.query.dataID
  const res = await getDataApi({ dataID })
  tableInfo.value = res.data
  console.log('table', tableInfo.value)
})
</script>
<template>
  <ContentWrap class="advance-search" style="margin-bottom: 20px">
    <div class="flex mb-50px">
      <div class="w-60%">
        <el-descriptions :title="`${route.query.IP}`">
          <el-descriptions-item label="任务名称：">{{ tableInfo.taskName }}</el-descriptions-item>
          <el-descriptions-item label="任务ID：">{{ tableInfo.taskID }}</el-descriptions-item>
          <el-descriptions-item label="创建人：">{{ tableInfo.createBy }}</el-descriptions-item>
          <el-descriptions-item label="协议：">
            {{ tableInfo.protocol }}
          </el-descriptions-item>
          <el-descriptions-item label="端口：">{{ tableInfo.port }}</el-descriptions-item>
          <el-descriptions-item label="网页状态码：">{{
            tableInfo.netStatusCode
          }}</el-descriptions-item>
          <el-descriptions-item label="title：">{{ tableInfo.title }}</el-descriptions-item>
          <el-descriptions-item label="FID：">{{ tableInfo.FID }}</el-descriptions-item>
          <el-descriptions-item label="更新时间：">{{ tableInfo.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="域名：">{{ tableInfo.domain }}</el-descriptions-item>
          <el-descriptions-item label="域名所有者：">{{
            tableInfo.domainHolder
          }}</el-descriptions-item>
          <el-descriptions-item label="注册邮箱：">{{ tableInfo.email }}</el-descriptions-item>
          <el-descriptions-item label="ICP备案：">{{ tableInfo.ICP }}</el-descriptions-item>
          <el-descriptions-item label="注册时间：">{{
            tableInfo.registerTime
          }}</el-descriptions-item>
          <el-descriptions-item label="地理位置：">{{ tableInfo.place }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="w-40%">
        <ElImage
          class="b-1 b-solid b-black round-10px"
          style="width: 60%; aspect-ratio: 1/1"
          :src="`${tableInfo.screenshot}`"
          fit="cover"
        >
          <template #error>
            <div class="h-100% flex justify-center items-center"
              ><Icon icon="ep:picture" />没有图片
            </div></template
          >
        </ElImage>
      </div>
    </div>
    <Table
      :height="300"
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      stripe
      row-key="dataID"
      :image-preview="['screenshot']"
      :reserve-selection="true"
      :columns="columns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total
      }"
      @register="tableRegister"
    />
  </ContentWrap>
</template>
<style scoped></style>
