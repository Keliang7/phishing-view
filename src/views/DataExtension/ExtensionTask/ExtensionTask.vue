<script setup lang="tsx">
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import { onMounted, ref, unref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox, ElRow, ElCol } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getListApi, exportApi, statisticsApi } from '@/api/dataExtension/extensionTask'
import { formatTime } from '@/utils/index'
import TableTop from '@/components/TableTop/TableTop.vue'
import TableSide from '@/components/TableSide/TableSide.vue'
import ExportFile from '@/components/ExportFile/ExportFile.vue'
import DataExtension from '@/components/DataExtension/DataExtension.vue'
import { useRouter } from 'vue-router'
const { t } = useI18n()
const dataArray = ref(['taskID', 'taskName', 'createdBy', 'createdTime', 'distributeTypeExt'])
const { tableRegister, tableMethods, tableState } = useTable({
  immediate: false,
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      taskStatus: activeNameS.value,
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
    field: 'taskID',
    width: 180,
    label: '任务ID'
  },
  {
    field: 'taskName',
    width: 240,
    label: '任务名称'
  },
  {
    field: 'taskType',
    width: 90,
    label: '任务类型'
  },
  {
    field: 'distributeType',
    width: 90,
    label: '下发方式'
  },
  {
    field: 'extensionResult',
    width: 90,
    label: '拓线结果',
    slots: {
      default: (data) => {
        return (
          <div>
            <ElButton type="primary" link onClick={() => viewData(data)}>
              {data.row.extensionResult}
            </ElButton>
          </div>
        )
      }
    }
  },
  {
    field: 'useTime',
    width: 90,
    label: '任务耗时',
    formatter: (data) => {
      console.log(data)
      return (
        <div style={{ display: 'flex' }}>
          <span style={{ display: data.useTime / 1000 > 86400 ? 'block' : 'none' }}>
            {Math.floor(data.useTime / 1000 / 86400)}天
          </span>
          <span style={{ display: data.useTime / 1000 > 3600 ? 'block' : 'none' }}>
            {Math.floor(((data.useTime / 1000) % 86400) / 3600)}时
          </span>
          <span style={{ display: data.useTime / 1000 > 60 ? 'block' : 'none' }}>
            {Math.floor(((data.useTime / 1000) % 3600) / 60)}分
          </span>
          <span style={{ display: data.useTime / 1000 > 0 ? 'block' : 'none' }}>
            {Math.floor(data.useTime / 1000) % 60}秒
          </span>
        </div>
      )
    }
  },
  {
    field: 'createdBy',
    label: '创建人'
  },
  {
    field: 'createdTime',
    label: t('tableDemo.createdTime'),
    width: 180,
    formatter: (data) => formatTime(data.createdTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'startTime',
    label: '任务开始时间',
    width: 180,
    formatter: (data) => formatTime(data.startTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'endTime',
    label: '任务结束时间',
    width: 180,
    formatter: (data) => formatTime(data.endTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    width: 200,
    headerAlign: 'center',
    align: 'center',
    slots: {
      default: (data) => {
        return (
          <div>
            <ElButton type="primary" link onClick={() => viewData(data)}>
              数据
            </ElButton>
            <ElButton type="primary" link onClick={() => editData(data)}>
              编辑
            </ElButton>
          </div>
        )
      }
    }
  }
]
//tableSide
const tabSideColumns = ref()
const setTableSide = async () => {
  const res = await statisticsApi()
  tabSideColumns.value = res.data.list.sort((a, b) => b.count - a.count)
  activeNameS.value = tabSideColumns.value[0].name
}
const activeNameS = ref()
const setActiveNameS = (name) => {
  activeNameS.value = name
  getList()
}
onMounted(async () => {
  await setTableSide()
  getList()
})
// 高级搜索功能，接收从AdvancedSearch组件中传过来的数据
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
</script>
<template>
  <AdvancedSearch
    :dataArray="dataArray"
    :total="total"
    :title="'拓线任务管理'"
    tip-title="系统默认展示当天拓线任务，最多可查看30天内任务，超出30天任务不会留存。"
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
  <ExportFile
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
