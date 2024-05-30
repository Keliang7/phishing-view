<script setup lang="tsx">
import { ref, reactive, unref, onMounted, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElTabs, ElTabPane, ElButton, ElCheckbox, ElMessage } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import {
  getBwListApi,
  getDomainListApi,
  getURLListApi,
  getTLSListApi,
  getExtListApi,
  exportApi
} from '@/api/dataManagement/pendUrl'
import { backtrackApi } from '@/api/dataManagement'
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
      list: res?.data.list,
      total: res?.data.total
    }
  }
})
const { loading, total, dataList, currentPage, pageSize } = tableState
const { setProps, getElTableExpose, getList } = tableMethods
//table
const tabColumns = [
  {
    label: t('tableDemo.bw'),
    name: 'bw'
  },
  {
    label: t('tableDemo.domainMonitor'),
    name: 'domain'
  },
  {
    label: t('tableDemo.urlLog'),
    name: 'URL'
  },
  {
    label: t('tableDemo.tlsLog'),
    name: 'TLS'
  },
  {
    label: t('tableDemo.extensionData'),
    name: 'Ext'
  }
]
const activeName = ref(tabColumns[0].name)
const columns = reactive<TableColumn[]>([])
const BWColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection',
    selectable: () => !isCheckedAll.value
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
    field: 'collectionStatus',
    label: '采集状态',
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
          <ElButton link type="primary" onClick={() => openDrawerInfo(data.row)}>
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
            <ElButton link type="primary" onClick={() => gatherFn(data.row)}>
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
const DomainColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection',
    selectable: () => !isCheckedAll.value
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
    field: 'collectionStatus',
    label: '采集状态',
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
          <ElButton link type="primary" onClick={() => gatherFn(data.row)}>
            {t('tableDemo.gather')}
          </ElButton>
        )
      }
    }
  }
]
const URLColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection',
    selectable: () => !isCheckedAll.value
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
    field: 'protocol',
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
    field: 'collectionStatus',
    label: '采集状态',
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
          <ElButton onClick={() => openDrawerInfo(data.row)} type="primary" link>
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
          <ElButton type="primary" link onClick={() => gatherFn(data.row)}>
            {t('tableDemo.gather')}
          </ElButton>
        )
      }
    }
  }
]
const TLSColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection',
    selectable: () => !isCheckedAll.value
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
    field: 'protocol',
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
    field: 'collectionStatus',
    label: '采集状态',
    width: 120
  },
  {
    field: 'gatherInfo',
    label: t('tableDemo.gatherInfo'),
    width: 120
  },
  {
    field: 'webInfo',
    label: '网页信息',
    width: 120,
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
          <ElButton type="primary" link onClick={() => gatherFn(data.row)}>
            {t('tableDemo.gather')}
          </ElButton>
        )
      }
    }
  }
]
const ExtColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection',
    selectable: () => !isCheckedAll.value
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
    field: 'protocol',
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
    field: 'collectionStatus',
    label: '采集状态',
    width: 120
  },
  {
    field: 'gatherInfo',
    label: t('tableDemo.gatherInfo'),
    width: 120
  },
  {
    field: 'webInfo',
    label: '网页信息',
    width: 120,
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
          <ElButton type="primary" link onClick={() => gatherFn(data.row)}>
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
const getTableData = async (params) => {
  let handler = new Map([
    ['bw', getBwListApi],
    ['domain', getDomainListApi],
    ['URL', getURLListApi],
    ['TLS', getTLSListApi],
    ['Ext', getExtListApi]
  ]).get(params)
  if (handler) {
    const res = await handler({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...searchData.value
    })
    return res
  }
}
const setTable = async (tableName) => {
  loading.value = true
  isCheckedAll.value = false
  const temp = {
    bw: BWColumns,
    domain: DomainColumns,
    URL: URLColumns,
    TLS: TLSColumns,
    Ext: ExtColumns
  }
  setProps({
    columns: temp[tableName]
  })
  await getList().then(() => {
    loading.value = false
  })
  //然后改一下导出的filedName
  fieldName.value = temp[tableName]
    .map((i) => {
      return {
        label: i.label,
        value: i.field
      }
    })
    .slice(1, -1)
}
//search
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
  getList()
}
// 采集任务事件
const isSelectData = ref(false)
const selectData = ref()
const gatherFn = async (data) => {
  if (!data) {
    const elTableRef = await getElTableExpose()
    const res = elTableRef?.getSelectionRows()
    selectData.value = res
  } else {
    selectData.value = [data]
  }
  isSelectData.value = true
}
//backtrack
const isBacktrack = ref(false)
const backtrackData = ref()
const backtrackFn = async (data) => {
  let temp = data.row.dataID
  const res = await backtrackApi({ id: temp })
  backtrackData.value = res
  isBacktrack.value = true
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
// 选择
const ids = ref([])
const isCheckedAll = ref(false)
const clearSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.clearSelection()
}
const getSelectedIds = async () => {
  const elTableRef = await getElTableExpose()
  ids.value = elTableRef?.getSelectionRows().map((i) => i.dataID)
}
watch(isCheckedAll, () => {
  clearSelection()
})
// 导出多选数据
const fieldName = ref()
fieldName.value = BWColumns.map((i) => {
  return {
    label: i.label,
    value: i.field
  }
}).slice(1, -1)
const isExport = ref(false)
const exportFn = async () => {
  await getSelectedIds()
  if (ids.value.length || isCheckedAll.value) {
    isExport.value = true
  } else {
    ElMessage.warning('请选择需要导出的数据')
  }
}
</script>
<template>
  <AdvancedSearch
    :title="t('tableDemo.pendUrl')"
    :dataArray="['url', 'domain', 'ip', 'collectionStatus', 'discoveryTime']"
    :tipTitle="'系统默认展示当天接入数据，最多可查看7天内数据，超出7天数据不会留存。'"
    @search-data="searchTable"
  />
  <ContentWrap class="table-box">
    <TableTop>
      <template #left>
        <ElTabs v-model="activeName" @tab-change="setTable">
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
        <ElButton type="default" @click="gatherFn(null)" :disabled="isCheckedAll">
          <Icon icon="ep:operation" /> 批量采集
        </ElButton>
        <ElButton type="primary" @click="exportFn">
          <Icon icon="tdesign:upload" /> 导出数据
        </ElButton>
      </template>
    </TableTop>
    <Table
      :class="{ 'is-checked-all': isCheckedAll }"
      :max-height="446"
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
    />
  </ContentWrap>
  <DrawerInfo v-model:isDrawer="isDrawerInfo" :title="titleDrawer" :bodyInfo="bodyInfo" />
  <SelectData
    v-if="isSelectData"
    v-model:isDrawer="isSelectData"
    :title="'数据采集'"
    :data="selectData"
  />
  <ExportFile
    v-if="isExport"
    v-model:isDrawer="isExport"
    title="待处理URL集合"
    :fieldName="fieldName"
    :ids="ids"
    :conditions="{ ...searchData, tableName: activeName }"
    :total="total"
    :axiosFn="exportApi"
    @clear-selection="clearSelection"
    @is-checked-all="
      (temp) => {
        isCheckedAll = temp
      }
    "
  />
  <Backtrack v-model:isDrawer="isBacktrack" :title="'数据回溯'" :backtrackData="backtrackData" />
</template>
<style lang="less" scoped></style>
