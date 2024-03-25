<script setup lang="tsx">
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import { ref, unref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getTaskApi, deleteTaskApi } from '@/api/dataExtension'
import { formatTime } from '@/utils/index'
import { ElButton } from 'element-plus'
const { t } = useI18n()
const dataArray = ref(['roleName'])
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
    field: 'role',
    label: '角色'
  },
  {
    field: 'oprateBy',
    label: '操作人'
  },

  {
    field: 'createdTime',
    label: t('tableDemo.createdTime'),
    formatter: (data) => formatTime(data.createdTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'info',
    label: '说明'
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
            <ElButton type="danger" size="small" onClick={() => editData(data)}>
              编辑
            </ElButton>
            <ElButton type="danger" size="small" onClick={() => delData(data)}>
              删除
            </ElButton>
          </div>
        )
      }
    }
  }
]
const searchData = ref({})
//删除
const ids = ref<string[]>([])
const delData = (data) => {
  console.log(data)
}
//编辑
const editData = (data) => {
  console.log(data)
}
</script>
<template>
  <AdvancedSearch :dataArray="dataArray" />
  角色管理
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
