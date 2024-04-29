<script setup lang="tsx">
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import { ref, unref, watch, onBeforeMount } from 'vue'
import { Table, TableColumn } from '@/components/Table'
import { ElButton, ElCheckbox } from 'element-plus'
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
    type: 'selection'
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
// 选择全部
const isCheckedAll = ref(false)
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
    tip-title="温馨提示：系统默认展示当天拓线任务，最多可查看XX天内任务，超出XX天任务不会留存。"
    @search-data="searchTable"
  />
  <ContentWrap>
    <TableTop>
      <template #right>
        <ElButton type="default">
          <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
        </ElButton>
        <ElButton type="primary" @click="getSelections">
          <Icon icon="tdesign:upload" /> 导出数据
        </ElButton>
      </template>
    </TableTop>
    <Table
      :max-height="446"
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      stripe
      row-key="ruleContent"
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
    <ExportFile
      v-model:isDrawer="isDrawerExportFile"
      title="拓线结果管理"
      :data="initExportDate"
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
