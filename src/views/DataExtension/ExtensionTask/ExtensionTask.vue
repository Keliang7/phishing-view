<script setup lang="tsx">
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import { onMounted, ref, unref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox, ElRow, ElCol, ElMessage } from 'element-plus'
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
    type: 'selection',
    selectable: () => !isCheckedAll.value
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
const activeNameS = ref()
const setTableSide = async (searchParams) => {
  const res = await statisticsApi(searchParams)
  tabSideColumns.value = res.data.list.sort((a, b) => b.count - a.count)
  setActiveNameS(tabSideColumns.value[0].name)
}
const setActiveNameS = (name) => {
  activeNameS.value = name
  getList()
}
onMounted(async () => {
  await setTableSide(null)
})
// 高级搜索功能，接收从AdvancedSearch组件中传过来的数据
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
  await setTableSide(value)
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
//多选
const ids = ref([])
const isCheckedAll = ref(false)
const clearSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.clearSelection()
}
const getSelectedIds = async () => {
  const elTableRef = await getElTableExpose()
  ids.value = elTableRef?.getSelectionRows().map((i) => i.taskID)
}
watch(isCheckedAll, () => {
  clearSelection()
})
// 导出多选数据
const fieldName = ref()
fieldName.value = columns
  .map((i) => {
    return {
      label: i.label,
      value: i.field
    }
  })
  .slice(1, -1)
const isExport = ref(false)
const exportFn = async () => {
  await getSelectedIds()
  if (ids.value.length || isCheckedAll.value) {
    isExport.value = true
  } else {
    ElMessage.warning('请选择需要导出的数据')
  }
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
        <ElButton type="primary" @click="exportFn">
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
          :class="{ 'is-checked-all': isCheckedAll }"
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
        />
      </ElCol>
    </ElRow>
  </ContentWrap>
  <DataExtension v-model:isDrawer="isDataExtension" :title="'创建任务'" />
  <ExportFile
    v-if="isExport"
    v-model:isDrawer="isExport"
    title="拓线任务管理"
    :fieldName="fieldName"
    :ids="ids"
    :conditions="{ ...searchData }"
    :total="total"
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
