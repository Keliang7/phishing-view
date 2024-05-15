<script setup lang="tsx">
import { ref, reactive, unref, watch, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElTabs, ElTabPane, ElButton, ElCheckbox } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import {
  getRuleApi,
  getVisualApi,
  getSamplelApi,
  exportApi
} from '@/api/systemManagement/PhishingRule'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import TableTop from '@/components/TableTop/TableTop.vue'
import UploadFile from './PhishingRuleComponent/UploadFile.vue'
import ExportFile from '@/components/ExportFile/ExportFile.vue'
import PhishingRuleOperate from '@/components/PhishingRuleOperate/PhishingRuleOperate.vue'
const { t } = useI18n()
const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    let res = await getTableData(activeName.value)
    return {
      list: res?.data.list,
      total: res?.data.total
    }
  }
})
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
let { loading, total, dataList, currentPage, pageSize } = tableState
const { getList, setProps, getElTableExpose } = tableMethods
// tableTop
const tabColumns = [
  {
    label: t('tableDemo.phishingDetectionFeature'),
    name: 'ruleColumns'
  },
  {
    label: t('tableDemo.visualAnalysisManagement'),
    name: 'visualColumns'
  },
  {
    label: t('tableDemo.phishingSampleManagement'),
    name: 'sampleColumns'
  }
]
const activeName = ref(tabColumns[0].name)
let columns = reactive<TableColumn[]>([])
// 仿冒检测规则表格列表
const ruleColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'id',
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
const visualColumns: TableColumn[] = [
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
const sampleColumns: TableColumn[] = [
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
const getTableData = async (params) => {
  let handler = new Map([
    ['ruleColumns', getRuleApi],
    ['visualColumns', getVisualApi],
    ['sampleColumns', getSamplelApi]
  ]).get(params)
  if (handler) {
    const res = await handler({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...searchData.value
    })
    return res
  }
}
const setTable = async (tableName) => {
  loading.value = true
  const temp = { ruleColumns, visualColumns, sampleColumns }
  setProps({
    columns: temp[tableName]
  })
  dataArray.value = dataArrayMap[tableName] || []
  await getList()
  loading.value = false
}
const openDrawerInfo = (data) => {
  console.log(data)
}
// 高级搜索功能，接收从AdvancedSearch组件中传过来的数据
const searchData = ref({})
const dataArrayMap = {
  ruleColumns: [
    'featureContent',
    'addType',
    'createdBy',
    'createdTime',
    'featureID',
    'victim',
    'victimType',
    'checkStatus'
  ],
  visualColumns: ['websiteName', 'addType', 'victim', 'victimType', 'createdBy', 'createdTime'],
  sampleColumns: [
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
}
const searchTable = async (value) => {
  searchData.value = value
  getList()
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
  selectedData.value = selected.map((i) => i.id)
  if (temp.value.length >= selectedData.value.length) {
    cancelData.value = temp.value.filter((i) => !selectedData.value.includes(i))
  }
}
watch(dataList, (newV) => {
  temp.value.push(...newV.map((i) => i.id))
  temp.value = [...new Set(temp.value)]
  if (isCheckedAll.value && !newV.some((i) => selectedData.value.includes(i.id))) {
    toggleSelection()
  }
})
const clearSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.clearSelection()
}
watch(isCheckedAll, (newV) => {
  clearSelection()
  if (newV) {
    toggleSelection()
  } else {
    cancelData.value = []
    temp.value = dataList.value.map((i) => i.id)
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
onMounted(() => {
  setProps({
    columns: ruleColumns
  })
})
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
        <ElTabs v-model="activeName" class="demo-tabs" @tab-change="setTable">
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
      :max-height="446"
      stripe
      row-key="id"
      :reserve-selection="true"
      :image-preview="['webScreenshot']"
      :columns="columns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total,
        layout: 'prev, pager, next, sizes,jumper,->, total'
      }"
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
