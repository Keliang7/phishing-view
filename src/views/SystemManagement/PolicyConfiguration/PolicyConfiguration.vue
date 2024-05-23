<script setup lang="tsx">
import { ref, unref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElCheckbox, ElMessageBox, ElMessage } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { getListApi, deleteApi, exportApi } from '@/api/systemManagement/PhishingConfiguration'
import { getStaticFileApi } from '@/api/downLoadCenter'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import TableTop from '@/components/TableTop/TableTop.vue'
import AddData from './PolicyComponent/AddData.vue'
import UploadFile from './PolicyComponent/UploadFile.vue'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import ExportFile from '@/components/ExportFile/ExportFile.vue'

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
    const res = await deleteApi({ rules: unref(ids) })
    return !!res
  }
})
let { loading, total, dataList, currentPage, pageSize } = tableState
const { getList, getElTableExpose, delList } = tableMethods
const dataArray = ref(['ruleContent', 'addType', 'createdBy', 'createdTime'])
const whiteColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection',
    selectable: () => !isCheckedAll.value
  },
  {
    field: 'ruleContent',
    label: t('tableDemo.ruleContent'),
    width: 300
  },
  {
    field: 'addType',
    width: 150,
    label: t('tableDemo.addType')
  },
  {
    field: 'createdBy',
    label: t('tableDemo.createdBy')
  },
  {
    field: 'createdTime',
    label: t('tableDemo.createdTime'),
    width: 250,
    formatter: (data) => formatTime(data.createdTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    slots: {
      default: (data) => {
        return (
          <div>
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
  ids.value = elTableRef?.getSelectionRows().map((i) => i.ruleContent)
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
//删除
const delLoading = ref(false)
const delData = async (data) => {
  const elTableExpose = await getElTableExpose()
  ids.value = data
    ? [data.row.ruleContent]
    : elTableExpose?.getSelectionRows().map((v) => v.ruleContent) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}
//全选删除
const deleteAllFn = async () => {
  if (isCheckedAll.value) {
    ElMessageBox.confirm(t('common.delMessage'), t('common.delWarning'), {
      confirmButtonText: t('common.delOk'),
      cancelButtonText: t('common.delCancel'),
      type: 'warning'
    }).then(async () => {
      const res = await deleteApi({ isCheckedAll: true })
      if (res) {
        ElMessage.success(t('common.delSuccess'))
        isCheckedAll.value = false
        getList()
        clearSelection()
      }
    })
  } else {
    delData(null)
    clearSelection()
  }
}
</script>
<template>
  <AdvancedSearch
    :title="`白名单管理`"
    :total="total"
    :dataArray="dataArray"
    @search-data="searchTable"
  />
  <ContentWrap>
    <TableTop>
      <template #right>
        <ElButton type="default">
          <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
        </ElButton>
        <ElButton type="danger" @click="deleteAllFn"> 批量删除 </ElButton>
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
      row-key="ruleContent"
      :reserve-selection="true"
      :columns="whiteColumns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total
      }"
      @register="tableRegister"
    />
  </ContentWrap>
  <AddData
    v-model:isDrawer="isDrawerAddData"
    :title="'添加白名单'"
    :placeholder="`请输入确认非仿冒网站的域名，匹配成功将不会入库。
一行一个域名，可输入多行，最多输入1000行。`"
    @get-data="getList"
  />
  <UploadFile
    v-model:isDrawer="isDrawerUploadFile"
    :title="'上传文件'"
    :axiosFn="getStaticFileApi"
    @get-data="getList"
  />
  <ExportFile
    v-model:isDrawer="isExport"
    title="白名单管理"
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
