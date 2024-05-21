<script setup lang="tsx">
import { ref, unref, watch, onBeforeMount } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElCheckbox, ElMessage } from 'element-plus'
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
const { tableRegister, tableMethods, tableState } = useTable({
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
let { loading, total, dataList, currentPage, pageSize } = tableState
const { getList, getElTableExpose } = tableMethods
// 高级搜索的数据
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
  await getList()
}
// 定义columns变量，用于存储表格的列配置
const resultColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection',
    selectable: () => !isCheckedAll.value
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
            <ElButton type="primary" link onClick={() => action(data.row)}>
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
    field: 'port',
    label: '端口'
  },
  {
    field: 'title',
    label: 'title',
    width: 200
  },
  {
    field: 'info',
    label: '网页信息',
    headerAlign: 'center',
    align: 'center',
    width: 100,
    slots: {
      default: (data) => {
        return (
          <ElButton type="primary" link onClick={() => openDrawerInfo(data)}>
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
    label: 'ICON',
    formatter: (data) => <img class="max-w-18px" src={data.ICON}></img>
  },
  {
    field: 'netStatusCode',
    label: '网页状态码',
    width: 120,
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'domainHolder',
    width: 120,
    headerAlign: 'center',
    align: 'center',
    label: '域名所有者'
  },
  {
    field: 'email',
    width: 100,
    headerAlign: 'center',
    align: 'center',
    label: '注册邮箱'
  },
  {
    field: 'ICP',
    label: 'ICP备案'
  },
  {
    field: 'registerTime',
    width: 180,
    headerAlign: 'center',
    label: '注册时间',
    formatter: (data) => formatTime(data.registerTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'taskID',
    width: 180,
    label: '任务ID'
  },
  {
    field: 'tackName',
    width: 120,
    label: '任务名称'
  },
  {
    field: 'updateTime',
    label: '更新时间',
    width: 180,
    headerAlign: 'center',
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
onBeforeMount(() => {
  // 在组件挂载之前执行的逻辑
  const route = useRoute()
  if (route.query && route.query.taskID) {
    const taskID = route.query.taskID
    searchData.value = { taskID }
  }
})
//多选
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
fieldName.value = resultColumns
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
</script>
<template>
  <AdvancedSearch
    :total="total"
    :title="`采集结果查看`"
    :tipTitle="'系统默认展示当天拓线数据，最多可查看30天内数据，超出30天数据不会留存。'"
    :dataArray="[
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
    ]"
    @search-data="searchTable"
  />
  <ContentWrap class="table-box">
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
      :class="{ 'is-checked-all': isCheckedAll }"
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      :max-height="446"
      stripe
      :image-preview="['screenshot']"
      row-key="dataID"
      :reserve-selection="true"
      :columns="resultColumns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total,
        layout: 'prev, pager, next, sizes,jumper,->, total'
      }"
      @register="tableRegister"
    />
  </ContentWrap>
  <ExportFile
    v-model:isDrawer="isExport"
    title="采集结果查看"
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
  <DrawerInfo v-model:isDrawer="isDrawerInfo" :title="'网页信息查看'" :bodyInfo="bodyInfo" />
</template>
<style scoped></style>
