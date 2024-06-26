<script setup lang="tsx">
import { ref, unref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElCheckbox, ElMessage } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import {
  getListApi,
  deleteApi,
  exportApi,
  importApi,
  enableApi,
  disableApi
} from '@/api/systemManagement/RoughRule'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import TableTop from '@/components/TableTop/TableTop.vue'
import AddData from './RoughComponent/AddData.vue'
import UploadFile from '@/components/UploadFile/UploadFile.vue'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import ExportFile from '@/components/ExportFile/ExportFile.vue'
import { useSystemConstantsStore, useSystemConstantsWithOut } from '@/store/modules/systemConstant'
import { onMounted } from 'vue'
// 在应用程序加载时获取系统全局静态变量数据
const systemConstants = useSystemConstantsWithOut()
const staticField = useSystemConstantsStore()
onMounted(async () => {
  await systemConstants.fetchSystemConstants()
})
const { t } = useI18n()
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
  },
  fetchDelApi: async () => {
    const res = await deleteApi({ ids: unref(ids) })
    clearSelection()
    return !!res
  }
})
let { loading, total, dataList, currentPage, pageSize } = tableState
const { getList, getElTableExpose, delList } = tableMethods
const columns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection',
    selectable: () => !isCheckedAll.value
  },
  {
    field: 'id',
    label: '规则id'
  },
  {
    field: 'ruleName',
    width: 150,
    label: '规则名称'
  },
  {
    field: 'ruleContent',
    width: 150,
    label: '规则内容'
  },
  {
    field: 'isEnable',
    label: '是否启用',
    width: 90,
    formatter: (data) => (data.isEnable ? '启用' : '禁用')
  },
  {
    field: 'addType',
    label: '添加方式',
    width: 250
  },
  {
    field: 'applyTable',
    label: '数据表',
    width: 150,
    formatter: (data) => staticField.applyTable[data.applyTable]
  },
  {
    field: 'createdBy',
    label: '创建人',
    width: 250
  },
  {
    field: 'createdTime',
    label: '创建时间',
    width: 250,
    formatter: (data) => formatTime(data.createdTime, 'yyyy-MM-dd HH:mm:ss')
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
              disabled={data.row.isEnable}
              link
              onClick={() => enableData(data.row.id)}
            >
              启用
            </ElButton>
            <ElButton
              type="warning"
              disabled={!data.row.isEnable}
              link
              onClick={() => disableData(data.row.id)}
            >
              禁用
            </ElButton>
            <ElButton type="danger" link onClick={() => delData(data)}>
              {t('tableDemo.delete')}
            </ElButton>
          </div>
        )
      }
    }
  }
]
// 高级搜索
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
  await getList()
}
//导入数据
const isDrawerUploadFile = ref(false)
// 添加
const isDrawerAddData = ref(false)
//多选导出
const ids = ref([])
const isCheckedAll = ref(false)
const clearSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.clearSelection()
}
const getSelectedIds = async () => {
  const elTableRef = await getElTableExpose()
  ids.value = elTableRef?.getSelectionRows().map((i) => i.id)
}
watch(isCheckedAll, () => {
  clearSelection()
})
// 导出多选数据
const isExport = ref(false)
const exportFn = async () => {
  await getSelectedIds()
  if (ids.value.length || isCheckedAll.value) {
    isExport.value = true
  } else {
    ElMessage.warning('请选择需要导出的数据')
  }
}
const fieldName = ref()
fieldName.value = columns.slice(1, -1).map((i) => {
  return {
    label: i.label,
    value: i.field
  }
})

//删除
const delLoading = ref(false)
const delData = async (data) => {
  const elTableExpose = await getElTableExpose()
  ids.value = data ? [data.row.id] : elTableExpose?.getSelectionRows().map((v) => v.id) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}
// 启用
const enableData = async (data) => {
  await enableApi({ ids: [data] }).then(() => {
    ElMessage.success('数据启用成功')
    getList()
  })
}
// 禁用
const disableData = async (data) => {
  await disableApi({ ids: [data] }).then(() => {
    ElMessage.success('数据禁用成功')
    getList()
  })
}
</script>
<template>
  <AdvancedSearch
    :title="`粗放规则管理`"
    :total="total"
    :dataArray="['ruleContent', 'ruleName', 'addType', 'createdBy', 'createdTime']"
    @search-data="searchTable"
  />
  <ContentWrap>
    <TableTop>
      <template #right>
        <ElButton type="default">
          <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
        </ElButton>
        <ElButton type="danger" :disabled="isCheckedAll" @click="delData(null)">
          批量删除
        </ElButton>
        <ElButton type="primary" @click="isDrawerAddData = !isDrawerAddData"> 添加 </ElButton>
        <ElButton type="primary" @click="isDrawerUploadFile = !isDrawerUploadFile">
          导入数据
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
      row-key="id"
      :reserve-selection="true"
      :columns="columns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total
      }"
      @register="tableRegister"
    />
  </ContentWrap>
  <AddData
    v-if="isDrawerAddData"
    v-model:isDrawer="isDrawerAddData"
    :title="'添加粗放规则'"
    @get-data="getList"
  />
  <UploadFile
    v-if="isDrawerUploadFile"
    v-model:isDrawer="isDrawerUploadFile"
    :title="'粗放规则导入数据'"
    :axiosFn="importApi"
    @get-data="getList"
  />
  <ExportFile
    v-model:isDrawer="isExport"
    title="粗放规则管理"
    :ids="ids"
    :conditions="{ ...searchData }"
    :total="total"
    :axiosFn="exportApi"
    :field-name="fieldName"
    @clear-selection="clearSelection"
    @is-checked-all="
      (temp) => {
        isCheckedAll = temp
      }
    "
  />
</template>
<style scoped></style>
