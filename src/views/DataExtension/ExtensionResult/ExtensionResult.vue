<script setup lang="tsx">
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import { ref, unref, watch, onBeforeMount } from 'vue'
import { Table, TableColumn } from '@/components/Table'
import { ElButton, ElCheckbox, ElMessage } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { getListApi, exportApi } from '@/api/dataExtension/extensionResult'
import { formatTime } from '@/utils/index'
import TableTop from '@/components/TableTop/TableTop.vue'
import ExportFile from '@/components/ExportFile/ExportFile.vue'
import { ContentWrap } from '@/components/ContentWrap'
import DrawerInfo from '@/components/DrawerInfo/DrawerInfo.vue'
import { useRoute } from 'vue-router'
const dataArray = ref([
  'taskID',
  'taskName',
  'createdBy',
  'title',
  'discoveryTime',
  'domain',
  'ip',
  'FID',
  'netStatusCode'
])
const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
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
    field: 'dataID',
    label: '数据ID'
  },
  {
    field: 'aimSeed',
    label: '目标种子'
  },
  {
    field: 'extensionRule',
    label: '拓线规则'
  },
  {
    field: 'extensionResult',
    label: '拓线结果（IP|域名|URL）',
    width: 200
  },
  {
    field: 'FID',
    label: 'FID'
  },
  {
    field: 'webInfo',
    label: '网页信息',
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
    field: 'title',
    label: 'title'
  },
  {
    field: 'netStatusCode',
    width: 120,
    label: '网页状态码'
  },
  {
    field: 'place',
    label: '地理位置'
  },
  {
    field: 'updateTime',
    label: '更新时间',
    formatter: (data) => formatTime(data.updateTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'taskID',
    label: '任务ID'
  },
  {
    field: 'taskName',
    label: '任务名称'
  },
  {
    field: 'createdBy',
    label: '创建人'
  }
]
//查看网页信息
const isDrawerInfo = ref(false)
const bodyInfo = ref()
const openDrawerInfo = (data) => {
  isDrawerInfo.value = true
  bodyInfo.value = [{ name: '网页信息', value: data.row.webInfo }]
}
// 高级搜索功能，接收从AdvancedSearch组件中传过来的数据
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
  await getList()
}
// 多选
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
watch(isCheckedAll, (newV) => {
  clearSelection()
  const dom = document.querySelector('.cell .el-checkbox span')
  if (newV) dom?.classList.add('is-disabled')
  if (!newV) dom?.classList.remove('is-disabled')
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
onBeforeMount(() => {
  // 在组件挂载之前执行的逻辑
  const route = useRoute()
  if (route.query && route.query.taskID) {
    console.log('我确定我执行了')
    const taskID = route.query.taskID
    searchData.value = { taskID }
  }
})
</script>
<template>
  <AdvancedSearch
    :dataArray="dataArray"
    :total="total"
    :title="'拓线结果查看'"
    tip-title="系统默认展示当天拓线任务，最多可查看30天内任务，超出30天任务不会留存。"
    @search-data="searchTable"
  />
  <ContentWrap>
    <TableTop>
      <template #right>
        <ElButton type="default">
          <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
        </ElButton>
        <ElButton type="primary" @click="exportFn">
          <Icon icon="tdesign:upload" /> 导出数据
        </ElButton>
      </template>
    </TableTop>
    <Table
      :max-height="446"
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      stripe
      row-key="dataID"
      :reserve-selection="true"
      :columns="columns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total
      }"
      @register="tableRegister"
    />
    <ExportFile
      v-if="isExport"
      v-model:isDrawer="isExport"
      title="拓线结果管理"
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
  </ContentWrap>
  <DrawerInfo v-model:isDrawer="isDrawerInfo" :title="'网页信息查看'" :bodyInfo="bodyInfo" />
</template>
<style scoped></style>
