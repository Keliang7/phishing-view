<script setup lang="tsx">
import { ref, reactive, unref, onMounted, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElCheckbox, ElMessageBox, ElMessage, ElTabs, ElTabPane } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { getPolicyWhiteListApi, deleteWhiteListApi } from '@/api/systemManagement'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import { useSystemConstantsWithOut } from '@/store/modules/systemConstant'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import ReCheck from './PhishingRecheckComponent/ReCheck.vue'
import View from './PhishingRecheckComponent/View.vue'
// 使用useI18n钩子函数获取国际化相关数据和方法
const { t } = useI18n()
// 使用useTable钩子函数获取table相关数据和方法
const { tableRegister, tableMethods, tableState } = useTable({
  // fetchDataApi方法用于异步获取表格数据
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getPolicyWhiteListApi({
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
    const res = await deleteWhiteListApi(unref(ids))
    return !!res
  }
})
const systemConstants = useSystemConstantsWithOut()
// 获取tableState中的数据和方法
let { loading, total, dataList, currentPage, pageSize } = tableState
const { setProps, getList, getElTableExpose, delList } = tableMethods
// 高级搜索的数据
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
  await getList()
}
const dataArray = ref([
  'featureContent',
  'addType',
  'createdBy',
  'createdTime',
  'featureID',
  'victim',
  'victimType',
  'operationType'
])
const optionArray = ref({ systemAddType: systemConstants.whiteListFrom })

// 定义分页器展示的内容
const layout = 'prev, pager, next, sizes,jumper,->, total'
const tabHeadColumns = [
  {
    label: '未复核',
    name: 'unRecheck'
  },
  {
    label: '复核通过',
    name: 'rechecked'
  }
]
const activeName = ref(tabHeadColumns[0].name)
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
    field: 'operateType',
    label: '操作类型'
  },
  {
    field: 'submitBy',
    label: '提交人'
  },
  {
    field: 'submitTime',
    label: '任务耗时',
    formatter: (data) => formatTime(data.taskUseTime, 'yyyy-MM-dd HH:mm:ss')
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
            <ElButton type="primary" size="small" onClick={() => reCheck(data)}>
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
    field: 'operateType',
    label: '操作类型'
  },
  {
    field: 'submitBy',
    label: '提交人'
  },
  {
    field: 'submitTime',
    label: '提交时间',
    formatter: (data) => formatTime(data.submitTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'recheckBy',
    label: '复核人'
  },
  {
    field: 'recheckTime',
    label: '任务耗时',
    formatter: (data) => formatTime(data.recheckTime, 'yyyy-MM-dd HH:mm:ss')
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
            <ElButton type="primary" size="small" onClick={() => view(data)}>
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
  if (params === 'unRecheck') {
    dataArray.value = [
      'featureContent',
      'addType',
      'createdBy',
      'createdTime',
      'featureID',
      'victim',
      'victimType',
      'checkStatus'
    ]
    setProps({
      columns: unRecheck
    })
    // const res = await getPhishingDetectionApi({
    //   pageIndex: unref(currentPage),
    //   pageSize: unref(pageSize),
    //   ...searchData.value
    // })
    // dataList.value = res.data.list
    // total.value = res.data.total
  } else if (params === 'rechecked') {
    setProps({
      columns: rechecked
    })
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
//操作
const isDrawerReCheck = ref(false)
const reCheck = (data) => {
  titleDrawer.value = '复核规则复核'
  isDrawerReCheck.value = true
  console.log(data)
}
const isDrawerView = ref(false)
const view = (data) => {
  titleDrawer.value = '复核规则复核'
  isDrawerView.value = true
  console.log(data)
}
// 在页面加载完成后，设置columns的值
onMounted(() => {
  // 设置columns的值为一个包含列配置的数组
  setProps({
    columns: unRecheck
  })
})
//是否全选
const isCheckedAll = ref(false)
const selectedData = ref<TableColumn[]>([])
const temp = ref<any[]>([])
const cancelData = ref<any[]>([])
const toggleSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.toggleAllSelection()
}
const handleSelectionChange = (selected: any[]) => {
  selectedData.value = selected.map((i) => i.taskID)
  if (temp.value.length > selectedData.value.length) {
    cancelData.value = temp.value.filter((i) => !selectedData.value.includes(i))
    console.log(cancelData.value)
  }
}
watch(dataList, (newV) => {
  temp.value.push(...newV.map((i) => i.taskID))
  temp.value = [...new Set(temp.value)]
  if (isCheckedAll.value && !newV.some((i) => selectedData.value.includes(i.taskID))) {
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
    ? [data.row.ruleContent]
    : elTableExpose?.getSelectionRows().map((v) => v.ruleContent) || []
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
      const res = await deleteWhiteListApi({ isCheckedAll: true, temp })
      if (res) {
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
const placeholderInfo = ref('')
const titleDrawer = ref('')
const isDrawerAddData = ref(false)
const isDrawerGetData = ref(false)
const isDrawerUploadFile = ref(false)
const addWhiteList = async () => {
  titleDrawer.value = '复核规则复核'
  isDrawerAddData.value = true
  placeholderInfo.value =
    '请输入确认非仿冒网站的域名，匹配成功将不会入库。\n一行一个域名，可输入多行，最多输入1000行。'
}
//导出数据
const initData = ref({})
const getSelections = () => {
  if (isCheckedAll.value) {
    initData.value = {
      isCheckedAll: isCheckedAll.value,
      total,
      cancelData: cancelData.value.length
    }
  } else {
    initData.value = { pickCount: selectedData.value.length }
  }
  titleDrawer.value = '导出数据'
  isDrawerGetData.value = true
}
//上传文件
const uploadFile = () => {
  titleDrawer.value = '上传文件'
  isDrawerUploadFile.value = true
}

// 定义canShowPagination变量，用于控制是否显示分页
const canShowPagination = ref(true)
</script>
<template>
  <AdvancedSearch :dataArray="dataArray" :optionArray="optionArray" @search-data="searchTable" />
  <ContentWrap :title="`仿冒检测特征复核(${total})`" class="table-box">
    <div class="table-btn">
      <ElButton type="default">
        <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
      </ElButton>
      <ElButton type="default" @click="deleteAllFn"> 批量删除 </ElButton>
      <ElButton type="primary" @click="addWhiteList"> 添加 </ElButton>

      <ElButton type="primary" @click="uploadFile"> 导入数据 </ElButton>

      <ElButton type="primary" @click="getSelections">
        <Icon icon="tdesign:upload" /> 导出数据
      </ElButton>
    </div>
    <ElTabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <ElTabPane
        v-for="item in tabHeadColumns"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      />
      <Table
        v-model:pageSize="pageSize"
        v-model:currentPage="currentPage"
        stripe
        row-key="taskID"
        :reserve-selection="true"
        :columns="columns"
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
    </ElTabs>
  </ContentWrap>
  <ReCheck v-model:isDrawer="isDrawerReCheck" :title="titleDrawer" />
  <View v-model:isDrawer="isDrawerView" :title="titleDrawer" />
  <GetData v-model:isDrawer="isDrawerGetData" :title="titleDrawer" :data="initData" />
  <UploadFile v-model:isDrawer="isDrawerUploadFile" :title="'上传'" />
</template>
<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 0px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 500;
}
.table-box {
  position: relative;
}
.el-tabs__header {
  z-index: 9;
}
.el-tabs__item {
  margin-bottom: 15px;
}
.el-tabs__nav-wrap {
  position: static;
}
.table-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 10;
}
.el-pagination {
  float: right;
}
</style>
