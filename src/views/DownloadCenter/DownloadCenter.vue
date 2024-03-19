<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn, TableSlotDefault } from '@/components/Table'
import { getDownloadCenterListApi, getDownloadCenterFileApi } from '@/api/table'
import { reactive, unref } from 'vue'
import { ElTag, ElButton } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'

const { tableRegister, tableState } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getDownloadCenterListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize)
    })
    return {
      list: res.data.list,
      total: res.data.total
    }
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState

const { t } = useI18n()

const columns = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'fileName',
    label: '文件名称'
  },
  {
    field: 'fileSource',
    label: '文件来源'
  },
  {
    field: 'status',
    label: '状态',
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return (
        <ElTag
          type={cellValue === 'success' ? 'success' : cellValue === 'fail' ? 'danger' : 'info'}
        >
          {cellValue === 'success' ? '创建成功' : cellValue === 'fail' ? '创建失败' : '文件生成中'}
        </ElTag>
      )
    }
  },
  {
    field: 'createdAt',
    label: '日期',
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return <div>{new Date(cellValue).toLocaleString()}</div>
    }
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    slots: {
      default: (data) => {
        return (
          <ElButton type="primary" onClick={() => actionFn(data)}>
            立即下载
          </ElButton>
        )
      }
    }
  }
])
const actionFn = async (data: TableSlotDefault) => {
  let res = await getDownloadCenterFileApi({ key: data.row.fileName })
  const blob = new Blob([res.data], { type: 'text/xlsx' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.row.fileName}.xlsx`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
</script>
<template>
  <ContentWrap title="下载中心">
    <template #header>
      <div @click="$router.go(-1)" class="cursor-pointer position-absolute right-0">{{
        '返回'
      }}</div>
    </template>
    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      :columns="columns"
      :data="dataList"
      row-key="id"
      :loading="loading"
      sortable
      :pagination="{
        total: total
      }"
      @register="tableRegister"
    />
  </ContentWrap>
</template>
