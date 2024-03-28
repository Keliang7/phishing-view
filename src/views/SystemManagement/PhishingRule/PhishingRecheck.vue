<script setup lang="tsx">
import { ref, reactive, unref, onMounted } from 'vue'
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
const { setProps, getList } = tableMethods
// 高级搜索的数据
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
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
  await getTableData(activeName.value)
}
// 定义分页器展示的内容
const layout = 'prev, pager, next, sizes,jumper,->, total'

let columns = reactive<TableColumn[]>([])
const unRecheck: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'featureID',
    label: '特征ID'
  },
  {
    field: 'featureName',
    label: '特征名称'
  },
  {
    field: 'featureContent',
    label: '特征内容'
  },
  {
    field: 'victim',
    label: '受害方'
  },
  {
    field: 'victimType',
    label: '受害方分类'
  },
  {
    field: 'addType',
    label: '添加方式'
  },
  {
    field: 'operationType',
    label: '操作类型',
    formatter: (data) => {
      if (data.operationType === 'Add') return '添加'
      if (data.operationType === 'Edit') return '编辑'
      if (data.operationType === 'Delete') return '删除'
    }
  },
  {
    field: 'createdBy',
    label: '提交人'
  },
  {
    field: 'createdTime',
    label: '提交时间',
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
        return (
          <div>
            <ElButton type="primary" size="small" onClick={() => recheckFn(data)}>
              复核
            </ElButton>
          </div>
        )
      }
    }
  }
]
const rechecked: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'featureID',
    label: '特征ID'
  },
  {
    field: 'featureName',
    label: '特征名称'
  },
  {
    field: 'featureContent',
    label: '特征内容'
  },
  {
    field: 'victim',
    label: '受害方'
  },
  {
    field: 'victimType',
    label: '受害方分类'
  },
  {
    field: 'addType',
    label: '添加方式'
  },
  {
    field: 'operationType',
    label: '操作类型',
    formatter: (data) => {
      if (data.operationType === 'Add') return '添加'
      if (data.operationType === 'Edit') return '编辑'
      if (data.operationType === 'Delete') return '删除'
    }
  },
  {
    field: 'createdBy',
    label: '提交人'
  },
  {
    field: 'createdTime',
    label: '提交时间',
    formatter: (data) => formatTime(data.createdTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'reviewer',
    label: '复核人'
  },
  {
    field: 'reviewTime',
    label: '复核时间',
    formatter: (data) => formatTime(data.reviewTime, 'yyyy-MM-dd HH:mm:ss')
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
        return (
          <div>
            <ElButton type="primary" size="small" onClick={() => viewFn(data)}>
              查看
            </ElButton>
          </div>
        )
      }
    }
  }
]
const getTableData = async (params) => {
  loading.value = true
  if (params === '未复核') {
    setProps({
      columns: unRecheck
    })
    const res = await getListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      checkStatus: params,
      ...searchData.value
    })
    dataList.value = res.data.list
    total.value = res.data.total
  } else if (params === '复核通过') {
    setProps({
      columns: rechecked
    })
    const res = await getListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      check: params,
      ...searchData.value
    })
    dataList.value = res.data.list
    total.value = res.data.total
  }
  loading.value = false
  return {
    list: dataList.value,
    total: total.value
  }
}
const handleClick = async (tab) => {
  currentPage.value = 1
  pageSize.value = 10
  await getTableData(tab.props.name)
}
// 在页面加载完成后，设置columns的值
onMounted(() => {
  // 设置columns的值为一个包含列配置的数组
  setProps({
    columns: unRecheck
  })
})
//复核查看
const operateTitle = ref('')
const isOperateDrawer = ref(false)
const operateData = ref()
const isDo = ref(true)
const recheckFn = async (data) => {
  let res = await formApi({ featureID: +data.row.featureID })
  operateData.value = { featureID: +data.row.featureID, ...res.data }
  operateFn('recheck')
}
const viewFn = async (data) => {
  let res = await formApi({ featureID: +data.row.featureID })
  operateData.value = { featureID: +data.row.featureID, ...res.data }
  operateFn('view')
}
const operateFn = (type) => {
  if (type === 'recheck') {
    operateTitle.value = '复核规则复核'
    isDo.value = true
  } else if (type === 'view') {
    operateTitle.value = '查看规则复核'
    isDo.value = false
  }
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
      'featureID',
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
      stripe
      row-key="taskID"
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
    :isDo="isDo"
    @get-data="getList"
  />
</template>
<style scoped></style>
