<script setup lang="tsx">
import { ref, unref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElTabs, ElTabPane } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { getListApi, formApi } from '@/api/systemManagement/PhishingRecheck'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import TableTop from '@/components/TableTop/TableTop.vue'
import PhishingRecheckOperate from '@/components/PhishingRecheckOperate/PhishingRecheckOperate.vue'
const { t } = useI18n()
const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    const res = await getTableData(activeName.value)
    return {
      list: res.list,
      total: res.total
    }
  }
})
let { loading, total, dataList, currentPage, pageSize } = tableState
const { getList, addColumn, delColumn } = tableMethods
// 高级搜索的数据
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
  await getTableData(activeName.value)
}
// 定义分页器展示的内容
const layout = 'prev, pager, next, sizes,jumper,->, total'

const columns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'id',
    label: '特征ID'
  },
  {
    field: 'featureName',
    width: 120,
    label: '特征名称'
  },
  {
    field: 'featureContent',
    width: 200,
    label: '特征内容'
  },
  {
    field: 'victim',
    width: 180,
    label: '受害方'
  },
  {
    field: 'victimType',
    width: 120,
    label: '受害方分类'
  },
  {
    field: 'addType',
    width: 90,
    label: '添加方式'
  },
  {
    field: 'operationType',
    label: '操作类型',
    width: 90,
    formatter: (data) => {
      if (data.operationType === 'Add') return '新增'
      if (data.operationType === 'Edit') return '编辑'
      if (data.operationType === 'Delete') return '删除'
    }
  },
  {
    field: 'createdBy',
    label: '创建人'
  },
  {
    field: 'createdTime',
    label: '创建时间',
    width: 180,
    formatter: (data) => formatTime(data.createdTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    width: 120,
    slots: {
      default: (data) => {
        if (activeName.value === '未复核') {
          return (
            <div>
              <ElButton type="primary" link onClick={() => recheckOrViewFn(data, '复核规则复核')}>
                复核
              </ElButton>
            </div>
          )
        } else {
          return (
            <div>
              <ElButton type="primary" link onClick={() => recheckOrViewFn(data, '查看规则复核')}>
                查看
              </ElButton>
            </div>
          )
        }
      }
    }
  }
]
//更改表头
const editTabelColumn = (type) => {
  if (type === '未复核') {
    delColumn('reviewer')
    delColumn('reviewTime')
  } else {
    addColumn({
      field: 'reviewer',
      label: '复核人'
    })
    addColumn({
      field: 'reviewTime',
      width: 180,
      label: '复核时间',
      formatter: (data) => formatTime(data.reviewTime, 'yyyy-MM-dd HH:mm:ss')
    })
  }
}
//获取数据
const getTableData = async (params) => {
  loading.value = true
  const res = await getListApi({
    pageIndex: unref(currentPage),
    pageSize: unref(pageSize),
    checkStatus: params,
    ...searchData.value
  })
  dataList.value = res.data.list
  total.value = res.data.total
  loading.value = false
  return {
    list: dataList.value,
    total: total.value
  }
}
//tableTop
const tabHeadColumns = [
  {
    label: '未复核',
    name: '未复核'
  },
  {
    label: '复核通过',
    name: '复核通过'
  }
]
const activeName = ref(tabHeadColumns[0].name)
const handleClick = async (tab) => {
  editTabelColumn(tab.props.name)
  currentPage.value = 1
  pageSize.value = 10
  await getTableData(tab.props.name)
}
//复核查看
const operateTitle = ref('')
const isOperateDrawer = ref(false)
const operateData = ref()
const recheckOrViewFn = async (data, title) => {
  let res = await formApi({ featureID: +data.row.id })
  operateData.value = { featureID: +data.row.id, ...res.data }
  operateTitle.value = title
  isOperateDrawer.value = true
}
</script>
<template>
  <AdvancedSearch
    :title="'仿冒检测特征复核'"
    :total="total"
    :dataArray="[
      'featureContent',
      'addType',
      'createdBy',
      'createdTime',
      'id',
      'victim',
      'victimType',
      'operationType'
    ]"
    @search-data="searchTable"
  />
  <ContentWrap class="table-box">
    <TableTop>
      <template #left>
        <ElTabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <ElTabPane
            v-for="item in tabHeadColumns"
            :key="item.name"
            :label="item.label"
            :name="item.name"
          />
        </ElTabs>
      </template>
    </TableTop>
    <Table
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
        total: total,
        layout: layout
      }"
      @register="tableRegister"
    />
  </ContentWrap>
  <PhishingRecheckOperate
    :title="operateTitle"
    v-model:isDrawer="isOperateDrawer"
    :data="operateData"
    @get-data="getList"
  />
</template>
<style scoped></style>
