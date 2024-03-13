<script setup lang="tsx">
import { ref, reactive, unref, onMounted, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElTabs, ElTabPane, ElButton, ElCheckbox, ElMessageBox, ElMessage } from 'element-plus'
import { Table, TableColumn, TableSlotDefault } from '@/components/Table'
import { getPhishingDetectionApi, deletePhishingDetectionApi } from '@/api/systemManagement'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import { useSystemConstantsWithOut } from '@/store/modules/systemConstant'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import AddData from './PhishingRuleComponent/AddData.vue'
import GetData from './PhishingRuleComponent/GetData.vue'
import UploadFile from './PhishingRuleComponent/UploadFile.vue'
// import { useIcon } from '@/hooks/web/useIcon'
// 使用useI18n钩子函数获取国际化相关数据和方法
const { t } = useI18n()
// 使用useTable钩子函数获取table相关数据和方法
const { tableRegister, tableMethods, tableState } = useTable({
  // fetchDataApi方法用于异步获取表格数据
  fetchDataApi: async () => {
    let res = await getTableData(activeName.value)
    console.log(res)
    return {
      list: res.list,
      total: res.total
    }
  },
  fetchDelApi: async () => {
    const res = await deletePhishingDetectionApi(unref(ids))
    return !!res
  }
})
const systemConstants = useSystemConstantsWithOut()
// 高级搜索的数据
const searchData = ref({})
// 定义canShowPagination变量，用于控制是否显示分页
const canShowPagination = ref(true)
const dataArray = ref([
  'featureContent',
  'addType',
  'featureID',
  'victim',
  'victimType',
  'createdBy',
  'createdTime',
  'ruleCheck',
  'operate'
])
const optionArray = ref({
  systemAddType: systemConstants.whiteListFrom,
  ruleCheck: systemConstants.ruleCheck,
  victimType: systemConstants.victimType
})
// 获取tableState中的数据和方法
let { loading, total, dataList, currentPage, pageSize } = tableState
const { getList, setProps, getElTableExpose, delList } = tableMethods
// 定义表格切换器内容
const tabColumns = [
  {
    label: t('tableDemo.phishingDetectionFeature'),

    name: 'phishingDetectionFeature'
  },
  {
    label: t('tableDemo.visualAnalysisManagement'),

    name: 'visualAnalysisManagement'
  },
  {
    label: t('tableDemo.phishingSampleManagement'),
    name: 'phishingSampleManagement'
  }
]
const activeName = ref(tabColumns[0].name)
// 定义分页器展示的内容
const layout = 'prev, pager, next, sizes,jumper,->, total'
// 定义columns变量，用于存储表格的列配置
let columns = reactive<TableColumn[]>([])
// 仿冒检测规则表格列表
const DetectionColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'featureID',
    label: t('tableDemo.featureID'),
    width: 140
  },
  {
    field: 'matchPhishingNum',
    label: '疑似仿冒数据量',
    width: 240
  },
  {
    field: 'featureName',
    label: t('tableDemo.featureName'),
    width: 240
  },
  {
    field: 'featureContent',
    label: t('tableDemo.featureContent'),
    width: 240
  },
  {
    field: 'victim',
    label: t('tableDemo.victim'),
    width: 240
  },
  {
    field: 'victimType',
    label: t('tableDemo.victimType'),
    width: 240
  },
  {
    field: 'addType',
    label: t('tableDemo.addType'),
    width: 240
  },
  {
    field: 'state',
    label: t('tableDemo.state'),
    width: 240
  },
  {
    field: 'createdBy',
    label: t('tableDemo.createdBy'),
    width: 240
  },
  {
    field: 'createdTime',
    label: t('tableDemo.createdTime'),
    width: 300,
    formatter: (data) => formatTime(data.createdTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'reviewer',
    label: t('tableDemo.reviewer'),
    width: 240
  },
  {
    field: 'reviewTime',
    label: t('tableDemo.reviewTime'),
    width: 300,
    formatter: (data) => formatTime(data.createdTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    width: 200,
    slots: {
      default: (data) => {
        return (
          <div>
            <ElButton type="primary" size="small" onClick={() => editFn(data)}>
              {t('tableDemo.edit')}
            </ElButton>
            <ElButton type="danger" size="small" onClick={() => delData(data)}>
              {t('tableDemo.delete')}
            </ElButton>
          </div>
        )
      }
    }
  }
]
// 视觉分析库管理表格列表
const VisualColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'webName',
    label: t('tableDemo.webName'),
    width: 240
  },
  {
    field: 'webPicture',
    label: t('tableDemo.webPicture'),
    width: 240
  },
  {
    field: 'victim',
    label: t('tableDemo.victim'),
    width: 240
  },
  {
    field: 'victimType',
    label: t('tableDemo.victimType'),
    width: 240
  },
  {
    field: 'addType',
    label: t('tableDemo.addType'),
    width: 240
  },
  {
    field: 'createdBy',
    label: t('tableDemo.createdBy'),
    width: 240
  },
  {
    field: 'createdTime',
    label: t('tableDemo.createdTime'),
    width: 300,
    formatter: (data) => formatTime(data.createdTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    width: 200,
    slots: {
      default: (data) => {
        return (
          <div>
            <ElButton type="primary" size="small" onClick={() => editFn(data)}>
              {t('tableDemo.edit')}
            </ElButton>
            <ElButton type="danger" size="small" onClick={() => deleteFn(data)}>
              {t('tableDemo.delete')}
            </ElButton>
          </div>
        )
      }
    }
  }
]
// 仿冒特征库管理表格列表
const SignatureColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'dataID',
    label: t('tableDemo.dataID'),
    width: 240
  },
  {
    field: 'webScreenshot',
    label: t('tableDemo.webScreenshot'),
    width: 240
  },
  {
    field: 'domain',
    label: t('tableDemo.domain'),
    width: 240
  },
  {
    field: 'ip',
    label: t('tableDemo.ip'),
    width: 240
  },
  {
    field: 'victim',
    label: t('tableDemo.victim'),
    width: 240
  },
  {
    field: 'intention',
    label: t('tableDemo.intention'),
    width: 240
  },
  {
    field: 'victimType',
    label: t('tableDemo.victimType'),
    width: 240
  },
  {
    field: 'title',
    label: 'title',
    width: 240
  },
  {
    field: 'FID',
    label: 'FID',
    width: 240
  },
  {
    field: 'ICON',
    label: 'ICON',
    width: 240
  },
  {
    field: 'ICON_hash',
    label: 'ICON_hash',
    width: 240
  },
  {
    field: 'webInfo',
    label: t('tableDemo.webInfo'),
    width: 120,
    slots: {
      default: (data) => {
        return (
          <ElButton onClick={() => openDrawerInfo(data)} type="text" size="small">
            查看
          </ElButton>
        )
      }
    }
  },
  {
    field: 'domainEmail',
    label: t('tableDemo.domainEmail'),
    width: 240
  },
  {
    field: 'state',
    label: t('tableDemo.state'),
    width: 240
  },
  {
    field: 'extractor',
    label: t('tableDemo.extractor'),
    width: 240
  },
  {
    field: 'victimType',
    label: t('tableDemo.victimType'),
    width: 240
  },
  {
    field: 'extractedTime',
    label: t('tableDemo.extractedTime'),
    width: 300,
    formatter: (data) => formatTime(data.extractedTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'operator',
    label: t('tableDemo.operator'),
    width: 240
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    width: 200,
    slots: {
      default: (data) => {
        return (
          <div class={'operate-box'}>
            <ElButton type="primary" size="small" onClick={() => editFn(data)}>
              放入视觉分析库
            </ElButton>
            <ElButton type="primary" size="small" onClick={() => editFn(data)}>
              {t('tableDemo.addDetectionRules')}
            </ElButton>
            <ElButton type="danger" size="small" onClick={() => deleteFn(data)}>
              {t('tableDemo.delete')}
            </ElButton>
          </div>
        )
      }
    }
  }
]
// 在页面加载完成后，设置columns的值
onMounted(() => {
  setTimeout(() => {
    // 设置columns的值为一个包含列配置的数组
    setProps({
      columns: DetectionColumns
    })
  }, 0)
})

// 定义表格内操作函数，用于处理点击表格列时的操作
const editFn = (data: TableSlotDefault) => {
  console.log(data)
}
const deleteFn = (data: TableSlotDefault) => {
  console.log(data)
}
const getTableData = async (params) => {
  loading.value = true
  if (params === 'phishingDetectionFeature') {
    dataArray.value = [
      'featureContent',
      'addType',
      'featureID',
      'victim',
      'victimType',
      'createdBy',
      'createdTime',
      'ruleCheck',
      'operate'
    ]
    setProps({
      columns: DetectionColumns
    })
    const res = await getPhishingDetectionApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...searchData.value
    })
    dataList.value = res.data.list
    total.value = res.data.total
  } else if (params === 'visualAnalysisManagement') {
    dataArray.value = ['addType', 'victim', 'victimType', 'createdBy', 'createdTime', 'operate']
    setProps({
      columns: VisualColumns
    })
  } else if (params === 'phishingSampleManagement') {
    dataArray.value = [
      'domain',
      'addType',
      'victim',
      'victimType',
      'createdBy',
      'createdTime',
      'operate'
    ]
    setProps({
      columns: SignatureColumns
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

const openDrawerInfo = (data) => {
  console.log(data)
}
// 高级搜索功能，接收从AdvancedSearch组件中传过来的数据
const searchTable = async (value) => {
  searchData.value = value
  currentPage.value = 1
  pageSize.value = 10
  await getTableData(activeName.value)
}
//选择全部
const isCheckedAll = ref(false)
const selectedData = ref<TableColumn[]>([])
const temp = ref<any[]>([])
const cancelData = ref<any[]>([])
const toggleSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.toggleAllSelection()
}
const handleSelectionChange = (selected: any[]) => {
  selectedData.value = selected.map((i) => i.featureID)
  if (temp.value.length > selectedData.value.length) {
    cancelData.value = temp.value.filter((i) => !selectedData.value.includes(i))
  }
}
watch(dataList, (newV) => {
  temp.value.push(...newV.map((i) => i.featureID))
  temp.value = [...new Set(temp.value)]
  if (isCheckedAll.value && !newV.some((i) => selectedData.value.includes(i.featureID))) {
    toggleSelection()
  }
})
const clearSelection = async () => {
  console.log('do')
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
      const res = await deletePhishingDetectionApi({ isCheckedAll: true, temp })
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

//添加
const isAddDataDrawer = ref(false)
//导出
const isGetDataDrawer = ref(false)
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
  isGetDataDrawer.value = true
}
//导入
const isUploadFileDrawer = ref(false)
</script>
<template>
  <ElTabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <ElTabPane v-for="item in tabColumns" :key="item.name" :label="item.label" :name="item.name" />
    <AdvancedSearch
      :dataArray="dataArray"
      :optionArray="optionArray"
      :isTip="false"
      @search-data="searchTable"
    />
    <ContentWrap>
      <div class="table-btn">
        <ElButton type="default">
          <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
        </ElButton>
        <ElButton type="danger" @click="deleteAllFn"> 批量删除 </ElButton>
        <ElButton type="primary" @click="isAddDataDrawer = !isAddDataDrawer"> 添加 </ElButton>

        <ElButton
          type="primary"
          @click="isUploadFileDrawer = !isUploadFileDrawer"
          v-show="activeName === 'phishingDetectionFeature'"
        >
          导入数据
        </ElButton>

        <ElButton
          type="primary"
          @click="getSelections"
          v-show="
            activeName === 'phishingDetectionFeature' || activeName === 'phishingSampleManagement'
          "
        >
          <Icon icon="tdesign:upload" /> 导出数据
        </ElButton>
      </div>
      <Table
        v-model:pageSize="pageSize"
        v-model:currentPage="currentPage"
        stripe
        row-key="featureID"
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
    </ContentWrap>
  </ElTabs>
  <AddData :title="'添加检测规则'" v-model:isDrawer="isAddDataDrawer" />
  <GetData v-model:isDrawer="isGetDataDrawer" :title="'导出数据'" :data="initData" />
  <UploadFile v-model:isDrawer="isUploadFileDrawer" :title="'上传数据'" />
</template>
<style lang="less">
.operate-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.operate-box button {
  width: fit-content;
  margin: 2px;
}
.demo-tabs > .el-tabs__content {
  padding: 0px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 500;
}
.el-tabs__header {
  margin: 0;
  background-color: #fff;
}
.el-tabs__item {
  margin-bottom: 15px;
}
.el-tabs__nav-wrap {
  position: static;
}
.table-btn {
  float: right;
  margin-bottom: 15px;
}
.el-pagination {
  float: right;
}
</style>
