<script setup lang="tsx">
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import { ref, unref } from 'vue'
// import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getTaskApi, deleteTaskApi } from '@/api/dataExtension'
import { formatTime } from '@/utils/index'
// import { ElButton } from 'element-plus'
// const { t } = useI18n()
const dataArray = ref(['loginName', 'loginIP'])
const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getTaskApi({
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
    const res = await deleteTaskApi({ rules: unref(ids) })
    return !!res
  }
})
const { loading, total, dataList, currentPage, pageSize } = tableState
const { setProps, getList, getElTableExpose, delList } = tableMethods
const columns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'loginName',
    label: '登录名'
  },
  {
    field: 'loginIP',
    label: '登录IP'
  },
  {
    field: 'oprateType',
    label: '操作方式'
  },
  {
    field: 'operateModule',
    label: '操作模块'
  },
  {
    field: 'oprateContent',
    label: '操作内容'
  },
  {
    field: 'oprateTime',
    label: '操作时间',
    formatter: (data) => formatTime(data.createdTime, 'yyyy-MM-dd HH:mm:ss')
  }
]
const searchData = ref({})
//删除
const ids = ref<string[]>([])
</script>
<template>
  <AdvancedSearch :dataArray="dataArray" />
  操作日志
  <Table
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
</template>
<style scoped></style>
