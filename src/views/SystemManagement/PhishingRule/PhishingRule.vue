<script setup lang="tsx">
import { ref, reactive, unref, onMounted, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElTabs, ElTabPane, ElButton, ElCheckbox } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { getListApi, exportApi } from '@/api/systemManagement/PhishingRule'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import TableTop from '@/components/TableTop/TableTop.vue'
import UploadFile from './PhishingRuleComponent/UploadFile.vue'
import ExportFile from '@/components/ExportFile/ExportFile.vue'
// import DeleteData from './PhishingRuleComponent/DeleteData.vue'
import PhishingRuleOperate from '@/components/PhishingRuleOperate/PhishingRuleOperate.vue'
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
  }
})
// 高级搜索的数据
const searchData = ref({})
// 定义canShowPagination变量，用于控制是否显示分页
const canShowPagination = ref(true)
const dataArray = ref([
  'checkStatus',
  'featureContent',
  'addType',
  'createBy',
  'createTime',
  'featureID',
  'victim',
  'victimType'
])
// 获取tableState中的数据和方法
let { loading, total, dataList, currentPage, pageSize } = tableState
const { getList, setProps, getElTableExpose } = tableMethods
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
    width: 90
  },
  {
    field: 'count',
    label: '疑似仿冒数据量',
    width: 140
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
    width: 100
  },
  {
    field: 'checkStatus',
    label: t('tableDemo.state'),
    width: 100
  },
  {
    field: 'createdBy',
    label: t('tableDemo.createdBy'),
    width: 100
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
    width: 100
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
            <ElButton
              type="primary"
              link
              disabled={data.row.checkStatus === '未复核'}
              onClick={() => editFn(data)}
            >
              {t('tableDemo.edit')}
            </ElButton>
            <ElButton
              type="danger"
              link
              disabled={data.row.checkStatus === '未复核'}
              onClick={() => deleteFn(data)}
            >
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
            <ElButton type="primary" link onClick={() => editFn(data)}>
              {t('tableDemo.edit')}
            </ElButton>
            <ElButton type="danger" link onClick={() => deleteFn(data)}>
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
    width: 300,
    slots: {
      default: (data) => {
        return (
          <div class={'operate-box'}>
            <ElButton type="primary" link onClick={() => editFn(data)}>
              放入视觉分析库
            </ElButton>
            <ElButton type="primary" link onClick={() => editFn(data)}>
              {t('tableDemo.addDetectionRules')}
            </ElButton>
            <ElButton type="danger" link onClick={() => deleteFn(data)}>
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
  // 设置columns的值为一个包含列配置的数组
  setProps({
    columns: DetectionColumns
  })
})
const getTableData = async (params) => {
  console.log('chaxuntiaojian', searchData.value)
  loading.value = true
  if (params === 'phishingDetectionFeature') {
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
      columns: DetectionColumns
    })
    const res = await getListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...searchData.value
    })
    dataList.value = res.data.list
    total.value = res.data.total
  } else if (params === 'visualAnalysisManagement') {
    dataArray.value = ['websiteName', 'addType', 'victim', 'victimType', 'createdBy', 'createdTime']
    setProps({
      columns: VisualColumns
    })
  } else if (params === 'phishingSampleManagement') {
    dataArray.value = [
      'domain',
      'ip',
      'victim',
      'victimType',
      'addType',
      'title',
      'FID',
      'ICON_hash',
      'createdBy',
      'createdTime'
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
//导出
const isDrawerExportFile = ref(false)
const initExportDate = ref({})
const getSelections = () => {
  if (isCheckedAll.value) {
    initExportDate.value = {
      count: unref(total) - cancelData.value.length,
      exportDate: {
        exportAll: isCheckedAll.value,
        arrayNot: cancelData.value.map((i) => Number(i))
      }
    }
  } else {
    initExportDate.value = {
      count: selectedData.value.length,
      exportDate: {
        exportAll: isCheckedAll.value,
        ruleContents: selectedData.value.map((i) => Number(i))
      }
    }
  }
  isDrawerExportFile.value = true
}
//导入
const isUploadFileDrawer = ref(false)

//增删改
const operateTitle = ref('')
const isOperateDrawer = ref(false)
const operateType = ref('')
const operateData = ref()
const addFn = () => {
  operateFn('Add')
}
const editFn = (data) => {
  operateData.value = data.row
  operateFn('Edit')
}
const deleteFn = (data) => {
  operateData.value = data.row
  operateFn('Delete')
}
const operateFn = (type) => {
  if (type === 'Add') {
    operateTitle.value = '添加检测规则'
    operateType.value = 'Add'
  } else if (type === 'Edit') {
    operateTitle.value = '编辑检测规则'
    operateType.value = 'Edit'
  } else if (type === 'Delete') {
    operateTitle.value = '删除检测规则'
    operateType.value = 'Delete'
  }
  isOperateDrawer.value = true
}
</script>
<template>
  <AdvancedSearch
    :title="'仿冒检测规则管理'"
    :total="total"
    :dataArray="dataArray"
    :isTip="false"
    @search-data="searchTable"
  />
  <ContentWrap>
    <TableTop>
      <template #left>
        <ElTabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <ElTabPane
            v-for="item in tabColumns"
            :key="item.name"
            :label="item.label"
            :name="item.name"
          />
        </ElTabs>
      </template>
      <template #right>
        <ElButton type="default">
          <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
        </ElButton>
        <ElButton type="primary" @click="addFn"> 添加 </ElButton>
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
      </template>
    </TableTop>
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
  <UploadFile v-model:isDrawer="isUploadFileDrawer" :title="'上传数据'" @get-data="getList" />
  <ExportFile
    v-model:isDrawer="isDrawerExportFile"
    title="仿冒规则检查"
    :data="initExportDate"
    :axiosFn="exportApi"
    @clear-selection="clearSelection"
    @is-checked-all="
      (temp) => {
        isCheckedAll = temp
      }
    "
  />
  <PhishingRuleOperate
    :title="operateTitle"
    v-model:isDrawer="isOperateDrawer"
    :operateType="operateType"
    :data="operateData"
    @get-data="getList"
    @is-checked-all="
      (temp) => {
        isCheckedAll = temp
      }
    "
  />
</template>
<style lang="less"></style>
