<script setup lang="tsx">
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import { ref, unref } from 'vue'
// import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getListApi } from '@/api/dataExtension/extensionTask'
import { formatTime } from '@/utils/index'
// import { ElButton } from 'element-plus'
// const { t } = useI18n()
//
import { useRouter } from 'vue-router'
const router = useRouter()
//
const dataArray = ref(['loginName', 'loginIP'])
const { tableRegister, tableState } = useTable({
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
    label: '操作人'
  },
  {
    field: 'oprateResult',
    label: '操作结果'
  },
  {
    field: 'oprateTime',
    label: '操作时间',
    formatter: (data) => formatTime(data.createdTime, 'yyyy-MM-dd HH:mm:ss')
  }
]
const searchData = ref({})
const open = () => {
  console.log(123)
  // router.push({ name: 'ViewDetails', params: { id: 123 } })
  const url = router.resolve({ name: 'ViewDetails', params: { id: 123 } })
  window.open(url.href, '_blank')
}
</script>
<template>
  <button @click="open">click</button>
  <AdvancedSearch :dataArray="dataArray" :title="'登录日志管理'" />
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
  />
</template>
<style scoped></style>
