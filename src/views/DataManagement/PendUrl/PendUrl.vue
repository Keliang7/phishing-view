<script setup lang="tsx">
import { ref, reactive, unref, onMounted, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElTabs, ElTabPane, ElButton, ElCheckbox } from 'element-plus'
import { Table, TableColumn, TableSlotDefault } from '@/components/Table'
import { getBwListApi, exportApi, getBwDetailApi, backtrackApi } from '@/api/dataManagement/pendUrl'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import TableTop from '@/components/TableTop/TableTop.vue'
import DrawerInfo from '@/components/DrawerInfo/DrawerInfo.vue'
import SelectData from '@/components/SelectData/SelectData.vue'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import ExportFile from '@/components/ExportFile/ExportFile.vue'
import Backtrack from '@/components/Backtrack/Backtrack.vue'

const { t } = useI18n()
const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    let res = await getTableData(activeName.value)
    return {
      list: res.list,
      total: res.total
    }
  }
})
const { loading, total, dataList, currentPage, pageSize } = tableState
const { setProps, getElTableExpose } = tableMethods
// 查看网页信息
const isDrawerInfo = ref(false)
// 查看网页信息-弹窗标题
const titleDrawer = ref('')
// 查看网页信息-弹窗内容
const bodyInfo = ref([{}])
const dataArray = ref(['url', 'domain', 'ip', 'status', 'discoveryTime'])
const tipTitle = ref('系统默认展示当天接入数据，最多可查看7天内数据，超出7天数据不会留存。')

//tableTop
const tabColumns = [
  {
    label: t('tableDemo.bw'),
    name: 'bw'
  },
  {
    label: t('tableDemo.domainMonitor'),
    name: 'domainMonitor'
  },
  {
    label: t('tableDemo.urlLog'),
    name: 'urlLog'
  },
  {
    label: t('tableDemo.tlsLog'),
    name: 'tlsLog'
  },
  {
    label: t('tableDemo.extensionData'),
    name: 'extensionData'
  }
]

const activeName = ref(tabColumns[0].name)

// 定义columns变量，用于存储表格的列配置
let columns = reactive<TableColumn[]>([])
// BW监测子系统表头内容
const BWColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'dataID',
    label: t('tableDemo.dataID'),
    width: 120
  },
  {
    field: 'ruleID',
    label: t('tableDemo.ruleID'),
    width: 120
  },
  {
    field: 'url',
    label: t('tableDemo.url'),
    width: 150
  },
  {
    field: 'domain',
    label: t('tableDemo.domain'),
    width: 130
  },
  {
    field: 'ipv4',
    label: t('tableDemo.ipv4'),
    width: 120
  },
  {
    field: 'ipv6',
    label: t('tableDemo.ipv6'),
    width: 180
  },
  {
    field: 'aimPort',
    label: t('tableDemo.aimPort'),
    width: 120
  },
  {
    field: 'discoveryTime',
    label: `${t('tableDemo.discoveryTime')}（进入系统时间）`,
    width: 200,
    formatter: (data) => formatTime(data.discoveryTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'featureMatchState',
    label: t('tableDemo.featureMatchState'),
    width: 120
  },
  {
    field: 'status',
    label: t('tableDemo.state'),
    width: 120
  },
  {
    field: 'gatherInfo',
    label: t('tableDemo.gatherInfo'),
    width: 120
  },
  {
    field: 'webInfo',
    label: t('tableDemo.webInfo'),
    align: 'center',
    width: 100,
    slots: {
      default: (data) => {
        return (
          <ElButton link type="primary" onClick={() => openDrawerInfo(data)}>
            查看
          </ElButton>
        )
      }
    }
  },
  {
    field: 'startTime',
    label: t('tableDemo.startTime'),
    width: 180,
    formatter: (data) => formatTime(data.startTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'endTime',
    label: t('tableDemo.endTime'),
    width: 180,
    formatter: (data) => formatTime(data.endTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    width: 150,
    slots: {
      default: (data) => {
        return (
          <div>
            <ElButton link type="primary" onClick={() => gatherFn(data)}>
              {t('tableDemo.gather')}
            </ElButton>
            <ElButton link type="primary" onClick={() => backtrackFn(data)}>
              回溯
            </ElButton>
          </div>
        )
      }
    }
  }
]
// 域名监测子系统表头内容
const DomainColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'dataID',
    label: t('tableDemo.dataID'),
    width: 120
  },
  {
    field: 'domain',
    label: t('tableDemo.domain'),
    width: 130
  },
  {
    field: 'discoveryTime',
    label: `${t('tableDemo.discoveryTime')}（进入系统时间）`,
    width: 200,
    formatter: (data) => formatTime(data.discoveryTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'featureMatchState',
    label: t('tableDemo.featureMatchState'),
    width: 120
  },
  {
    field: 'state',
    label: t('tableDemo.state'),
    width: 120
  },
  {
    field: 'gatherInfo',
    label: t('tableDemo.gatherInfo'),
    width: 120
  },
  {
    field: 'startTime',
    label: t('tableDemo.startTime'),
    width: 180,
    formatter: (data) => formatTime(data.startTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'endTime',
    label: t('tableDemo.endTime'),
    width: 180,
    formatter: (data) => formatTime(data.startTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    width: 120,
    slots: {
      default: (data) => {
        return (
          <ElButton link type="primary" onClick={() => gatherFn(data)}>
            {t('tableDemo.gather')}
          </ElButton>
        )
      }
    }
  }
]
// URL日志子系统表头内容
const URLColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'dataID',
    label: t('tableDemo.dataID'),
    width: 120
  },
  {
    field: 'url',
    label: t('tableDemo.url'),
    width: 150
  },
  {
    field: 'domain',
    label: t('tableDemo.domain'),
    width: 130
  },
  {
    field: 'ipv4',
    label: t('tableDemo.ipv4'),
    width: 120
  },
  {
    field: 'ipv6',
    label: t('tableDemo.ipv6'),
    width: 180
  },
  {
    field: 'protocolType',
    label: t('tableDemo.protocolType'),
    width: 120
  },
  {
    field: 'aimPort',
    label: t('tableDemo.aimPort'),
    width: 120
  },
  {
    field: 'discoveryTime',
    label: `${t('tableDemo.discoveryTime')}（进入系统时间）`,
    width: 200,
    formatter: (data) => formatTime(data.discoveryTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'featureMatchState',
    label: t('tableDemo.featureMatchState'),
    width: 120
  },
  {
    field: 'state',
    label: t('tableDemo.state'),
    width: 120
  },
  {
    field: 'gatherInfo',
    label: t('tableDemo.gatherInfo'),
    width: 120
  },
  {
    field: 'webInfo',
    label: t('tableDemo.webInfo'),
    width: 120,
    showOverflowTooltip: false,
    slots: {
      default: (data) => {
        return (
          <ElButton onClick={() => openDrawerInfo(data)} type="primary" link>
            查看
          </ElButton>
        )
      }
    }
  },
  {
    field: 'startTime',
    label: t('tableDemo.startTime'),
    width: 180,
    formatter: (data) => formatTime(data.startTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'endTime',
    label: t('tableDemo.endTime'),
    width: 180,
    formatter: (data) => formatTime(data.endTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    width: 120,
    slots: {
      default: (data) => {
        return (
          <ElButton type="primary" link onClick={() => gatherFn(data)}>
            {t('tableDemo.gather')}
          </ElButton>
        )
      }
    }
  }
]
// TLS日志子系统表头内容
const TLSColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'dataID',
    label: t('tableDemo.dataID'),
    width: 120
  },
  {
    field: 'domain',
    label: t('tableDemo.domain'),
    width: 130
  },
  {
    field: 'ipv4',
    label: t('tableDemo.ipv4'),
    width: 120
  },
  {
    field: 'ipv6',
    label: t('tableDemo.ipv6'),
    width: 180
  },
  {
    field: 'protocolType',
    label: t('tableDemo.protocolType'),
    width: 120
  },
  {
    field: 'aimPort',
    label: t('tableDemo.aimPort'),
    width: 120
  },
  {
    field: 'discoveryTime',
    label: `${t('tableDemo.discoveryTime')}（进入系统时间）`,
    width: 200,
    formatter: (data) => formatTime(data.discoveryTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'featureMatchState',
    label: t('tableDemo.featureMatchState'),
    width: 120
  },
  {
    field: 'state',
    label: t('tableDemo.state'),
    width: 120
  },
  {
    field: 'gatherInfo',
    label: t('tableDemo.gatherInfo'),
    width: 120
  },
  {
    field: 'certInfo',
    label: t('tableDemo.certInfo'),
    width: 120,
    slots: {
      default: (data) => {
        return (
          <ElButton onClick={() => openDrawerInfo(data)} type="primary" link>
            查看
          </ElButton>
        )
      }
    }
  },
  {
    field: 'startTime',
    label: t('tableDemo.startTime'),
    width: 180,
    formatter: (data) => formatTime(data.startTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'endTime',
    label: t('tableDemo.endTime'),
    width: 180,
    formatter: (data) => formatTime(data.endTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    width: 120,
    slots: {
      default: (data) => {
        return (
          <ElButton type="primary" link onClick={() => gatherFn(data)}>
            {t('tableDemo.gather')}
          </ElButton>
        )
      }
    }
  }
]
const ExTColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'dataID',
    label: t('tableDemo.dataID'),
    width: 120
  },
  {
    field: 'domain',
    label: t('tableDemo.domain'),
    width: 130
  },
  {
    field: 'ipv4',
    label: t('tableDemo.ipv4'),
    width: 120
  },
  {
    field: 'ipv6',
    label: t('tableDemo.ipv6'),
    width: 180
  },
  {
    field: 'protocolType',
    label: t('tableDemo.protocolType'),
    width: 120
  },
  {
    field: 'aimPort',
    label: t('tableDemo.aimPort'),
    width: 120
  },
  {
    field: 'discoveryTime',
    label: `${t('tableDemo.discoveryTime')}（进入系统时间）`,
    width: 200,
    formatter: (data) => formatTime(data.discoveryTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'featureMatchState',
    label: t('tableDemo.featureMatchState'),
    width: 120
  },
  {
    field: 'state',
    label: t('tableDemo.state'),
    width: 120
  },
  {
    field: 'gatherInfo',
    label: t('tableDemo.gatherInfo'),
    width: 120
  },
  {
    field: 'certInfo',
    label: t('tableDemo.certInfo'),
    width: 120,
    slots: {
      default: (data) => {
        return (
          <ElButton onClick={() => openDrawerInfo(data)} type="primary" link>
            查看
          </ElButton>
        )
      }
    }
  },
  {
    field: 'startTime',
    label: t('tableDemo.startTime'),
    width: 180,
    formatter: (data) => formatTime(data.startTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'endTime',
    label: t('tableDemo.endTime'),
    width: 180,
    formatter: (data) => formatTime(data.endTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    width: 120,
    slots: {
      default: (data) => {
        return (
          <ElButton type="primary" link onClick={() => gatherFn(data)}>
            {t('tableDemo.gather')}
          </ElButton>
        )
      }
    }
  }
]
onMounted(() => {
  setProps({
    columns: BWColumns
  })
})
// 采集任务事件
const isSelectData = ref(false)
const selectData = ref()
const gatherFn = (data: TableSlotDefault) => {
  isSelectData.value = true
  selectData.value = [data.row]
}
//批量采集
const gatherAllFn = () => {
  isSelectData.value = true
  selectData.value = selectedData.value
}
//回溯
const isBacktrack = ref(false)
const backtrackData = ref()
const backtrackFn = async (data) => {
  let temp = data.row.dataID
  const res = await backtrackApi({ id: temp })
  backtrackData.value = res
  isBacktrack.value = true
}
// 表格查看信息事件
const openDrawerInfo = async (data: TableSlotDefault) => {
  let res
  if (activeName.value == 'bw') {
    isDrawerInfo.value = true
    titleDrawer.value = '查看网页信息'
    res = await getBwDetailApi(data.row.dataID)
    bodyInfo.value = [
      {
        value: res.data.webInfo.request,
        name: '请求体'
      },
      {
        value: res.data.webInfo.response,
        name: '响应体'
      }
    ]
  } else if (activeName.value == 'urlLog') {
    isDrawerInfo.value = true
    titleDrawer.value = '查看网页信息'
    res = await getBwDetailApi(data.row.dataID)
    bodyInfo.value = [
      {
        value: res.data.webInfo.request,
        name: '请求体'
      },
      {
        value: res.data.webInfo.response,
        name: '响应体'
      }
    ]
  } else {
    isDrawerInfo.value = true
    titleDrawer.value = '查看证书信息'
    res = await getBwDetailApi(data.row.dataID)
    bodyInfo.value = [
      {
        value: res.data.webInfo.request,
        name: '证书信息'
      }
    ]
  }
}
//高级搜索
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
  await getTableData(activeName.value)
}
const getTableData = async (params) => {
  loading.value = true
  if (params === 'bw') {
    setProps({
      columns: BWColumns
    })
    const res = await getBwListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...searchData.value
    })
    dataList.value = res.data.list
    total.value = res.data.total
  } else if (params === 'domainMonitor') {
    setProps({
      columns: DomainColumns
    })
  } else if (params === 'urlLog') {
    setProps({
      columns: URLColumns
    })
  } else if (params === 'tlsLog') {
    setProps({
      columns: TLSColumns
    })
  } else if (params === 'extensionData') {
    setProps({
      columns: ExTColumns
    })
  }
  loading.value = false
  return {
    list: dataList.value,
    total: total.value
  }
}
// 表格切换器的点击事件
const handleClick = async (tab) => {
  currentPage.value = 1
  pageSize.value = 10
  await getTableData(tab.props.name)
}

// 选择全部
const isCheckedAll = ref(false)
const selectedId = ref<any[]>([])
const selectedData = ref()
const temp = ref<any[]>([])
const cancelData = ref<any[]>([])
const toggleSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.toggleAllSelection()
}
const handleSelectionChange = (selected: any[]) => {
  selectedId.value = selected.map((i) => i.dataID)
  if (temp.value.length > selectedId.value.length) {
    cancelData.value = temp.value.filter((i) => !selectedId.value.includes(i))
  }
  selectedData.value = selected
}
watch(dataList, (newV) => {
  temp.value.push(...newV.map((i) => i.dataID))
  temp.value = [...new Set(temp.value)]
  if (isCheckedAll.value && !newV.some((i) => selectedId.value.includes(i.dataID))) {
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

// 导出多选数据
const fieldName = BWColumns.map((i) => {
  return {
    label: i.label,
    value: i.field
  }
}).slice(1, -1)
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
      count: selectedId.value.length,
      exportDate: {
        exportAll: isCheckedAll.value,
        ruleContents: selectedId.value
      }
    }
  }
  titleDrawer.value = '导出数据'
  isDrawerExportFile.value = true
}
</script>
<template>
  <AdvancedSearch
    :title="t('tableDemo.pendUrl')"
    :dataArray="dataArray"
    :tipTitle="tipTitle"
    @search-data="searchTable"
  />
  <ContentWrap class="table-box">
    <TableTop>
      <template #left>
        <ElTabs type="card" v-model="activeName" @tab-click="handleClick">
          <ElTabPane
            v-for="item in tabColumns"
            :key="item.name"
            :label="item.label"
            :name="item.name"
          />
        </ElTabs>
      </template>
      <template #right>
        <ElButton type="default">
          <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
        </ElButton>
        <ElButton type="default" @click="gatherAllFn">
          <Icon icon="ep:operation" /> 批量采集
        </ElButton>
        <ElButton type="primary" @click="getSelections">
          <Icon icon="tdesign:upload" /> 导出数据
        </ElButton>
      </template>
    </TableTop>
    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      stripe
      row-key="dataID"
      :columns="columns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total,
        layout: 'prev, pager, next, sizes,jumper,->, total'
      }"
      @register="tableRegister"
      :reserve-selection="true"
      @selection-change="handleSelectionChange"
    />
  </ContentWrap>
  <DrawerInfo v-model:isDrawer="isDrawerInfo" :title="titleDrawer" :bodyInfo="bodyInfo" />
  <SelectData v-model:isDrawer="isSelectData" :title="'添加任务'" :data="selectData" />
  <ExportFile
    v-model:isDrawer="isDrawerExportFile"
    title="待处理URL集合"
    :fieldName="fieldName"
    :data="initExportDate"
    :axiosFn="exportApi"
    @clear-selection="clearSelection"
    @is-checked-all="
      (temp) => {
        isCheckedAll = temp
      }
    "
  />
  <Backtrack
    v-model:isDrawer="isBacktrack"
    :title="'数据回溯'"
    :backtrackData="backtrackData"
    :dataSourceInfo="{ name: 'wangdao' }"
  />
</template>
<style lang="less" scoped></style>
