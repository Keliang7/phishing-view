<script setup lang="tsx">
import { ref, unref, onMounted, watch, onBeforeMount } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElCheckbox } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { getListApi, exportApi } from '@/api/dataGather/gatherResult'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import TableTop from '@/components/TableTop/TableTop.vue'
import ExportFile from '@/components/ExportFile/ExportFile.vue'
import DrawerInfo from '@/components/DrawerInfo/DrawerInfo.vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()

// 使用useI18n钩子函数获取国际化相关数据和方法
// 使用useTable钩子函数获取table相关数据和方法
const { tableRegister, tableMethods, tableState } = useTable({
  // fetchDataApi方法用于异步获取表格数据
  immediate: true,
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
// 获取tableState中的数据和方法
let { loading, total, dataList, currentPage, pageSize } = tableState
const { getList, getElTableExpose } = tableMethods
// 高级搜索的数据
const searchData = ref({})
const searchTable = async (value) => {
  console.log('这边的搜索也执行了')
  searchData.value = value
  await getList()
}
const dataArray = ref([
  'taskID',
  'taskName',
  'createdBy',
  'title',
  'discoveryTime',
  'domain',
  'ip',
  'FID',
  'netStatusCode',
  'icon'
])
// 定义分页器展示的内容
const layout = 'prev, pager, next, sizes,jumper,->, total'
// 定义columns变量，用于存储表格的列配置
const resultColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'dataID',
    label: '数据ID',
    width: 300
  },
  {
    field: 'domain',
    label: '域名',
    width: 200
  },
  {
    field: 'IP',
    label: 'IP',
    width: 200,
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElButton type="text" onClick={() => action(data.row)}>
              {data.row.IP}
            </ElButton>
          </>
        )
      }
    }
  },
  {
    field: 'website',
    label: '网站地址',
    width: 200
  },
  {
    field: 'screenshot',
    label: '网站截图',
    width: 100
  },
  {
    field: 'protocol',
    label: '协议'
  },
  {
    field: 'port',
    label: '端口'
  },
  {
    field: 'title',
    label: 'title'
  },
  {
    field: 'info',
    label: '网页信息',
    slots: {
      default: (data) => {
        return (
          <ElButton type="primary" onClick={() => openDrawerInfo(data)} size="small">
            查看
          </ElButton>
        )
      }
    }
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
    field: 'netStatusCode',
    label: '网页状态码'
  },
  {
    field: 'domainHolder',
    label: '域名所有者'
  },
  {
    field: 'email',
    label: '注册邮箱'
  },
  {
    field: 'ICP',
    label: 'ICP备案'
  },
  {
    field: 'registerTime',
    label: '注册时间'
  },
  {
    field: 'taskID',
    label: '任务ID'
  },
  {
    field: 'tackName',
    label: '任务名称'
  },
  {
    field: 'updateTime',
    label: '更新时间',
    formatter: (data) => formatTime(data.updateTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'createBy',
    label: '创建人'
  }
]

const action = (data) => {
  const url = router.resolve({ path: '/ViewDetails', query: { IP: data.IP, dataID: data.dataID } })
  window.open(url.href, '_blank')
}
const isDrawerInfo = ref(false)
const bodyInfo = ref()
const openDrawerInfo = (data) => {
  isDrawerInfo.value = true
  bodyInfo.value = [{ name: '网页信息', value: data.row.webInfo }]
}

// 在页面加载完成后，设置columns的值

onBeforeMount(() => {
  // 在组件挂载之前执行的逻辑
  const route = useRoute()
  if (route.query && route.query.taskID) {
    console.log('我确定我执行了')
    const taskID = route.query.taskID
    searchData.value = { taskID }
  }
})
onMounted(() => {})
//是否全选
const isCheckedAll = ref(false)
const selectedData = ref<TableColumn[]>([])
const temp = ref<any[]>([])
const cancelData = ref<any[]>([])
const toggleSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.toggleAllSelection()
}
const handleSelectionChange = (selected: any[]) => {
  selectedData.value = selected.map((i) => i.dataID)
  if (temp.value.length > selectedData.value.length) {
    cancelData.value = temp.value.filter((i) => !selectedData.value.includes(i))
  }
}
watch(dataList, (newV) => {
  temp.value.push(...newV.map((i) => i.dataID))
  temp.value = [...new Set(temp.value)]
  if (isCheckedAll.value && !newV.some((i) => selectedData.value.includes(i.dataID))) {
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
const fieldName = resultColumns
  .map((i) => {
    return {
      label: i.label,
      value: i.field
    }
  })
  .slice(1, -1)
</script>
<template>
  <AdvancedSearch
    :total="total"
    :title="`采集结果查看`"
    :tipTitle="'系统默认展示当天拓线数据，最多可查看30天内数据，超出30天数据不会留存。'"
    :dataArray="dataArray"
    @search-data="searchTable"
  />
  <ContentWrap class="table-box">
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
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      stripe
      :image-preview="['screenshot']"
      row-key="dataID"
      :reserve-selection="true"
      :columns="resultColumns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total,
        layout: layout
      }"
      @register="tableRegister"
      @selection-change="handleSelectionChange"
    />
  </ContentWrap>
  <ExportFile
    v-model:isDrawer="isDrawerExportFile"
    title="采集结果管理"
    :data="initExportDate"
    :fieldName="fieldName"
    :axiosFn="exportApi"
    @clear-selection="clearSelection"
  />
  <DrawerInfo v-model:isDrawer="isDrawerInfo" :title="'网页信息查看'" :bodyInfo="bodyInfo" />
</template>
<style scoped></style>
