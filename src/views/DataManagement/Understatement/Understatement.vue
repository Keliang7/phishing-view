<script setup lang="tsx">
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import { ref, unref, watch, onMounted } from 'vue'
import { ElButton, ElCheckbox, ElRow, ElCol } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getListApi, statisticsApi } from '@/api/dataManagement/understatement'
import { exportApi } from '@/api/dataManagement'
import { formatTime } from '@/utils/index'
import TableTop from '@/components/TableTop/TableTop.vue'
import TableSide from '@/components/TableSide/TableSide.vue'
import DrawerInfo from '@/components/DrawerInfo/DrawerInfo.vue'
import DataSource from '@/components/DataSource/DataSource.vue'
import ExportFile from '@/components/ExportFile/ExportFile.vue'
import DataExtension from '@/components/DataExtension/DataExtension.vue'
import { useRouter } from 'vue-router'
const { tableRegister, tableMethods, tableState } = useTable({
  immediate: false,
  fetchDataApi: async () => {
    const res = await getListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      victimType: unref(activeNameS),
      ...searchData.value
    })
    return {
      list: res.data.list,
      total: res.data.total
    }
  }
})
const { loading, total, dataList, currentPage, pageSize } = tableState
const { getList, getElTableExpose } = tableMethods
const columns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'dataCount',
    label: '数据来源个数',
    width: 120,
    align: 'center',
    formatter(data) {
      return (
        <ElButton type="primary" link onClick={() => dataSource(data)}>
          {data.dataSources.length}
        </ElButton>
      )
    }
  },
  {
    field: 'misReason',
    label: '漏报原因',
    width: 200
  },
  {
    field: 'dataID',
    label: '数据ID',
    width: 300
  },
  {
    field: 'screenshot',
    label: '网站截图',
    width: 300
  },
  {
    field: 'url',
    label: 'URL',
    width: 200
  },
  {
    field: 'domain',
    label: '域名',
    width: 200
  },
  {
    field: 'ip',
    label: 'IP',
    width: 200
  },
  {
    field: 'victim',
    label: '受害方'
  },
  {
    field: 'victimType',
    width: 120,
    label: '受害方分类'
  },
  {
    field: 'intention',
    label: '意图'
  },
  {
    field: 'featureID',
    width: 100,
    label: '特征编号'
  },
  {
    field: 'feature',
    width: 100,
    label: '匹配特征'
  },
  {
    field: 'webInfo',
    label: '网页信息',
    headerAlign: 'center',
    align: 'center',
    width: 100,
    slots: {
      default: (data) => {
        return (
          <ElButton onClick={() => openDrawerInfo(data.row)} type="primary" link>
            查看
          </ElButton>
        )
      }
    }
  },
  {
    field: 'title',
    label: 'title',
    width: 200
  },
  {
    field: 'netStatusCode',
    label: '网页状态码',
    width: 120,
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'FID',
    label: 'FID'
  },
  {
    field: 'ICON',
    label: 'ICON'
  },
  {
    field: 'domainHolder',
    width: 120,
    headerAlign: 'center',
    align: 'center',
    label: '域名所有者'
  },
  {
    field: 'tele',
    label: '电话'
  },
  {
    field: 'email',
    width: 120,
    headerAlign: 'center',
    align: 'center',
    label: '域名注册邮箱'
  },
  {
    field: 'discoveryTime',
    width: 180,
    headerAlign: 'center',
    label: '发现时间',
    formatter: (data) => formatTime(data.discoveryTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'selectTime',
    width: 180,
    headerAlign: 'center',
    label: '采集时间',
    formatter: (data) => formatTime(data.selectTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'selectStatus',
    width: 180,
    headerAlign: 'center',
    label: '采集状态'
  },
  {
    field: 'extensionTime',
    width: 180,
    headerAlign: 'center',
    label: '拓线时间',
    formatter: (data) => formatTime(data.ExtTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'extensionStatus',
    label: '拓线状态',
    width: 180,
    headerAlign: 'center'
  },
  {
    field: 'pushTime',
    label: '推送时间',
    width: 180,
    formatter: (data) => formatTime(data.pushTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'pushStatus',
    label: '推送状态',
    width: 180,
    headerAlign: 'center'
  },
  {
    field: 'fxczGetTime',
    label: '分析处置系统获取时间',
    width: 180,
    headerAlign: 'center',
    formatter: (data) => formatTime(data.fxczGetTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: 200,
    headerAlign: 'center',
    align: 'center',
    slots: {
      default: (data) => {
        return (
          <div>
            <ElButton type="primary" link onClick={() => viewData(data)}>
              采集
            </ElButton>
            <ElButton type="primary" link onClick={() => editData(data)}>
              加入仿冒样本库
            </ElButton>
          </div>
        )
      }
    }
  }
]
//tableSide
const tabSideColumns = ref()
const activeNameS = ref()
const setTableSide = async () => {
  const res = await statisticsApi()
  tabSideColumns.value = res.data.list.sort((a, b) => b.count - a.count)
  activeNameS.value = tabSideColumns.value[0].name
  getList()
}
const setActiveNameS = (name) => {
  activeNameS.value = name
  getList()
}
onMounted(async () => {
  await setTableSide()
})
// 高级搜索功能，接收从AdvancedSearch组件中传过来的数据
const dataArray = ref(['url', 'domain', 'ip', 'status', 'discoveryTime', 'victim', 'misReason'])
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
  await getList()
}
//查看数据
const router = useRouter()
const viewData = (data) => {
  const taskID = data.row.taskID
  router.push({
    name: 'ExtensionResult',
    query: { taskID }
  })
}
//编辑
const editData = (data) => {
  console.log(data)
  extensionFn()
}
//是否全选
const isCheckedAll = ref(false)
// 选择全部
const selectedData = ref<TableColumn[]>([])
const temp = ref<any[]>([])
const cancelData = ref<any[]>([])
const toggleSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.toggleAllSelection()
}
const handleSelectionChange = (selected: any[]) => {
  selectedData.value = selected.map((i) => i.ruleContent)
  if (temp.value.length > selectedData.value.length) {
    cancelData.value = temp.value.filter((i) => !selectedData.value.includes(i))
    console.log(cancelData.value)
  }
}
watch(dataList, (newV) => {
  temp.value.push(...newV.map((i) => i.ruleContent))
  temp.value = [...new Set(temp.value)]
  if (isCheckedAll.value && !newV.some((i) => selectedData.value.includes(i.ruleContent))) {
    toggleSelection()
  }
})
const clearSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.clearSelection()
}
watch(isCheckedAll, () => {
  if (isCheckedAll.value) {
    toggleSelection()
  } else {
    clearSelection()
  }
})
//导出数据
const isDrawerExportFile = ref(false)
const initExportDate = ref({})
const getSelections = () => {
  if (isCheckedAll.value) {
    initExportDate.value = {
      count: unref(total) - cancelData.value.length,
      exportDate: {
        exportAll: isCheckedAll.value,
        arrayNot: cancelData.value
      }
    }
  } else {
    initExportDate.value = {
      count: selectedData.value.length,
      exportDate: {
        exportAll: isCheckedAll.value,
        ruleContents: selectedData.value
      }
    }
  }
  isDrawerExportFile.value = true
}
//创建任务
const isDataExtension = ref(false)
const extensionFn = () => {
  isDataExtension.value = true
}
// 查看网页信息
const isDrawerInfo = ref(false)
const titleDrawer = ref('')
const bodyInfo = ref([{}])
const openDrawerInfo = async (data) => {
  isDrawerInfo.value = true
  titleDrawer.value = '查看网页信息'
  bodyInfo.value = [
    {
      value: data.webInfo.request,
      name: '请求体'
    },
    {
      value: data.webInfo.response,
      name: '响应体'
    }
  ]
}
//数据源
const isDataSource = ref(false)
const dataSourceData = ref()
const dataSource = (data) => {
  isDataSource.value = true
  dataSourceData.value = data.dataSource
}
</script>
<template>
  <AdvancedSearch
    :dataArray="dataArray"
    :total="total"
    :title="'漏报数据管理'"
    tip-title="系统默认展示当天接入数据，最多可查看5年内数据，超出5年数据不会留存。"
    @search-data="searchTable"
  />
  <ContentWrap>
    <TableTop>
      <template #right>
        <ElButton type="default">
          <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
        </ElButton>
        <ElButton type="primary" @click="extensionFn"> 创建任务 </ElButton>
        <ElButton type="primary" @click="getSelections">
          <Icon icon="tdesign:upload" /> 导出数据
        </ElButton>
      </template>
    </TableTop>
    <ElRow>
      <ElCol :span="3">
        <TableSide :data="tabSideColumns" @change="setActiveNameS" />
      </ElCol>
      <ElCol :span="21">
        <Table
          :max-height="446"
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          stripe
          row-key="taskID"
          :reserve-selection="true"
          :columns="columns"
          :data="dataList"
          :loading="loading"
          :pagination="{
            total: total
          }"
          @register="tableRegister"
          @selection-change="handleSelectionChange"
        />
      </ElCol>
    </ElRow>
  </ContentWrap>
  <DataExtension v-model:isDrawer="isDataExtension" :title="'创建任务'" />
  <DrawerInfo v-model:isDrawer="isDrawerInfo" :title="titleDrawer" :bodyInfo="bodyInfo" />
  <DataSource v-model:isDrawer="isDataSource" :dataSourceData="dataSourceData" />
  <ExportFile
    v-if="isDrawerExportFile"
    v-model:isDrawer="isDrawerExportFile"
    title="拓线任务管理"
    :data="initExportDate"
    :axiosFn="exportApi"
    @clear-selection="clearSelection"
    @is-checked-all="
      (temp) => {
        isCheckedAll = temp
      }
    "
  />
</template>
<style scoped></style>
