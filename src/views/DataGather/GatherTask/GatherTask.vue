<script setup lang="tsx">
import { ref, unref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElCheckbox, ElMessageBox, ElMessage } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { getListApi, deleteApi, stopApi, exportApi } from '@/api/dataGather/gatherTask'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import { useRouter } from 'vue-router'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import SelectData from '@/components/SelectData/SelectData.vue'
import ExportFile from '@/components/ExportFile/ExportFile.vue'
import TableTop from '@/components/TableTop/TableTop.vue'

// 使用useI18n钩子函数获取国际化相关数据和方法
const { t } = useI18n()
// 使用useTable钩子函数获取table相关数据和方法
const { tableRegister, tableMethods, tableState } = useTable({
  // fetchDataApi方法用于异步获取表格数据
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
  },
  fetchDelApi: async () => {
    const res = await deleteApi({ taskID: unref(ids) })
    return !!res
  }
})

// 获取tableState中的数据和方法
let { loading, total, dataList, currentPage, pageSize } = tableState
const { getList, getElTableExpose, delList } = tableMethods
// 高级搜索的数据
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
  await getList()
}
const dataArray = ref([
  'taskID',
  'taskName',
  'createdBy',
  'createdTime',
  'finishTime',
  'distributeType',
  'probeType',
  'taskStatus'
])

// 定义分页器展示的内容
const layout = 'prev, pager, next, sizes,jumper,->, total'
// 定义columns变量，用于存储表格的列配置
const tableColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'taskID',
    label: '任务ID',
    width: 200
  },
  {
    field: 'taskName',
    label: '任务名称',
    width: 200
  },
  {
    field: 'probeType',
    label: '探测类型',
    width: 100
  },
  {
    field: 'probeContent',
    label: '探测内容',
    width: 200
  },
  {
    field: 'taskStatus',
    label: '任务状态'
  },
  {
    field: 'distributeType',
    label: '下发方式',
    width: 100
  },
  {
    field: 'priority',
    label: '优先级'
  },
  {
    field: 'taskStartTime',
    label: '任务开始时间',
    formatter: (data) => formatTime(data.taskStartTime, 'yyyy-MM-dd HH:mm:ss'),
    width: 180
  },
  {
    field: 'taskFinishTime',
    label: '任务结束时间',
    formatter: (data) => {
      return data.taskUseTime <= 0 ? 0 : formatTime(data.taskFinishTime, 'yyyy-MM-dd HH:mm:ss')
    },
    width: 180
  },
  {
    field: 'taskUseTime',
    label: '任务耗时',
    formatter: (data) => {
      return (
        <div style={{ display: 'flex' }}>
          <span style={{ display: data.taskUseTime / 1000 > 86400 ? 'block' : 'none' }}>
            {Math.floor(data.taskUseTime / 1000 / 86400)}天
          </span>
          <span style={{ display: data.taskUseTime / 1000 > 3600 ? 'block' : 'none' }}>
            {Math.floor(((data.taskUseTime / 1000) % 86400) / 3600)}时
          </span>
          <span style={{ display: data.taskUseTime / 1000 > 60 ? 'block' : 'none' }}>
            {Math.floor(((data.taskUseTime / 1000) % 3600) / 60)}分
          </span>
          <span style={{ display: data.taskUseTime / 1000 > 0 ? 'block' : 'none' }}>
            {Math.floor(data.taskUseTime / 1000) % 60}秒
          </span>
        </div>
      )
    },
    width: 180
  },
  {
    field: 'createBy',
    label: '创建人'
  },
  {
    field: 'createTime',
    label: '创建时间',
    formatter: (data) => formatTime(data.createTime, 'yyyy-MM-dd HH:mm:ss'),
    width: 180
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    width: 250,
    slots: {
      default: (data) => {
        return (
          <div>
            <ElButton
              type="primary"
              link
              disabled={data.row.taskStatus === '执行中'}
              onClick={() => viewData(data)}
            >
              查看数据
            </ElButton>
            <ElButton
              type="danger"
              link
              disabled={data.row.taskStatus === '完成'}
              onClick={() => stopTask(data)}
            >
              停止任务
            </ElButton>
            <ElButton
              type="danger"
              link
              disabled={data.row.taskStatus === '执行中'}
              onClick={() => delData(data)}
            >
              {t('tableDemo.delete')}
            </ElButton>
          </div>
        )
      }
    }
  }
]
//操作
const router = useRouter()
const viewData = (data) => {
  const taskID = data.row.taskID
  router.push({
    name: 'GatherResult',
    query: { taskID }
  })
}
const stopTask = async (data) => {
  const res = await stopApi(data.row.taskID)
  if (res.code === 0) {
    ElMessage.success('停止任务成功')
  }
  console.log(res)
}

//是否全选
const isCheckedAll = ref(false)
const selectedId = ref<any>([])
const selectedData = ref()
const temp = ref<any[]>([])
const cancelData = ref<any[]>([])
const toggleSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.toggleAllSelection()
}
const handleSelectionChange = (selected: any[]) => {
  selectedId.value = selected.map((i) => i.taskID)
  if (temp.value.length > selectedId.value.length) {
    cancelData.value = temp.value.filter((i) => !selectedId.value.includes(i))
  }
  selectedData.value = selected
}
watch(dataList, (newV) => {
  temp.value.push(...newV.map((i) => i.taskID))
  temp.value = [...new Set(temp.value)]
  if (isCheckedAll.value && !newV.some((i) => selectedId.value.includes(i.taskID))) {
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
//删除
const ids = ref<string[]>([])
const delLoading = ref(false)
const delData = async (data) => {
  const elTableExpose = await getElTableExpose()
  ids.value = data
    ? [data.row.taskID]
    : elTableExpose?.getSelectionRows().map((v) => v.taskID) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}
//批量删除
const deleteAllFn = async () => {
  const temp = cancelData.value
  if (isCheckedAll.value) {
    ElMessageBox.confirm(t('common.delMessage'), t('common.delWarning'), {
      confirmButtonText: t('common.delOk'),
      cancelButtonText: t('common.delCancel'),
      type: 'warning'
    }).then(async () => {
      const res = await deleteApi({ isCheckedAll: true, temp })
      if (res.code == 0) {
        ElMessage.success(t('common.delSuccess'))
        isCheckedAll.value = false
        toggleSelection()
        getList()
      }
    })
  } else {
    delData(null)
  }
}

// 添加

// 导出多选数据
const fieldName = tableColumns
  .map((i) => {
    return {
      label: i.label,
      value: i.field
    }
  })
  .slice(1, -1)
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
  isDrawerExportFile.value = true
}

//创建任务
const isSelectData = ref(false)
const buildTaskFn = () => {
  isSelectData.value = true
}
// 定义canShowPagination变量，用于控制是否显示分页
const canShowPagination = ref(true)
</script>
<template>
  <AdvancedSearch
    :total="total"
    :dataArray="dataArray"
    @search-data="searchTable"
    :title="`任务采集管理`"
  />
  <ContentWrap class="table-box">
    <TableTop>
      <template #right>
        <ElButton type="default">
          <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
        </ElButton>
        <ElButton type="default" @click="deleteAllFn"> 批量删除 </ElButton>
        <ElButton type="primary" @click="buildTaskFn">创建任务</ElButton>
        <ElButton type="primary" @click="getSelections">
          <Icon icon="tdesign:upload" /> 导出数据
        </ElButton>
      </template>
    </TableTop>

    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      stripe
      row-key="taskID"
      :reserve-selection="true"
      :columns="tableColumns"
      :data="dataList"
      :loading="loading"
      :pagination="
        canShowPagination
          ? {
              total: total,
              layout: layout
            }
          : undefined
      "
      @register="tableRegister"
      @selection-change="handleSelectionChange"
    />
  </ContentWrap>
  <SelectData :isFile="true" v-model:isDrawer="isSelectData" :title="'添加任务'" />
  <ExportFile
    v-model:isDrawer="isDrawerExportFile"
    title="数据采集任务"
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
</template>
<style scoped></style>
