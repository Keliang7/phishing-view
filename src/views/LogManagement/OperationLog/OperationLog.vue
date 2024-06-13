<script setup lang="tsx">
import { ref, unref, watch } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { getListApi, clearApi } from '@/api/logManagement/oprationLog'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import TableTop from '@/components/TableTop/TableTop.vue'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'

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
let { loading, total, dataList, currentPage, pageSize } = tableState
const { getList, getElTableExpose } = tableMethods
const dataArray = ref(['account', 'clientIP'])
const columns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'accountName',
    label: '登录名'
  },
  {
    field: 'clientIP',
    label: '登录IP'
  },
  {
    field: 'operaType',
    label: '操作方式'
  },
  {
    field: 'operaModel',
    label: '操作模块'
  },
  {
    field: 'operaDesc',
    label: '操作内容'
  },
  {
    field: 'oprateTime',
    width: 180,
    label: '操作时间',
    formatter: (data) => formatTime(data.createdTime, 'yyyy-MM-dd HH:mm:ss')
  }
]
// 高级搜索
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
  await getList()
}
//多选导出
const ids = ref([])
const isCheckedAll = ref(false)
const clearSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.clearSelection()
}
const getSelectedIds = async () => {
  const elTableRef = await getElTableExpose()
  ids.value = elTableRef?.getSelectionRows().map((i) => i.logID + '')
}
watch(isCheckedAll, () => {
  clearSelection()
})
// 清空日志
const clearFn = async () => {
  ElMessageBox.confirm('您确定要清空日志吗？', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => await getSelectedIds())
    .then(async () => {
      await clearApi({ ids: ids.value })
        .then(async () => {
          ElMessage.success('清空数据成功')
          await clearSelection()
          getList()
        })
        .catch(() => {})
    })
}
</script>
<template>
  <AdvancedSearch
    :title="'操作日志管理'"
    :total="total"
    :dataArray="dataArray"
    @search-data="searchTable"
  />
  <ContentWrap>
    <TableTop>
      <template #right>
        <ElButton type="danger" @click="clearFn"> 删除日志 </ElButton>
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
</template>
<style scoped></style>
