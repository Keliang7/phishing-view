<script setup lang="tsx">
import { ref, reactive, unref, watch, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElTabs, ElTabPane, ElButton, ElCheckbox, ElMessage, ElMessageBox } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import {
  getRuleApi,
  getVisualApi,
  getSamplelApi,
  exportApi,
  deleteSampleApi,
  deleteVisualApi,
  intoVisualLabApi
} from '@/api/systemManagement/PhishingRule'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import TableTop from '@/components/TableTop/TableTop.vue'
import UploadFile from './PhishingRuleComponent/UploadFile.vue'
import ExportFile from '@/components/ExportFile/ExportFile.vue'
import PhishingRuleOperate from '@/components/PhishingRuleOperate/PhishingRuleOperate.vue'
import DrawerInfo from '@/components/DrawerInfo/DrawerInfo.vue'
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
    type: 'selection',
    selectable: () => !isCheckedAll.value
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
    type: 'selection',
    selectable: () => !isCheckedAll.value
  },
  {
    field: 'id',
    label: '视觉检测规则ID',
    width: 140,
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'name',
    label: '视觉检测规则名称',
    width: 140,
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'phishingCount',
    label: '疑似仿冒数据量',
    width: 140,
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'address',
    label: '网站地址',
    width: 200,
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'webScreenshot',
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
    field: 'insertType',
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
            <ElButton type="danger" link onClick={() => delFn(data.row.id)}>
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
    type: 'selection',
    selectable: () => !isCheckedAll.value
  },
  {
    field: 'id',
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
    field: 'intent',
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
    field: 'fid',
    label: 'FID',
    width: 240
  },
  {
    field: 'icon',
    label: 'ICON',
    width: 240,
    formatter: (data) => <img class="max-w-18px" src={data.icon}></img>
  },
  {
    field: 'iconHash',
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
          <ElButton onClick={() => openDrawerInfo(data)} type="primary" link>
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
    field: 'UsageStatus',
    label: t('tableDemo.state'),
    width: 240
  },
  {
    field: 'createdBy',
    label: t('tableDemo.extractor'),
    width: 240
  },
  {
    field: 'victimType',
    label: t('tableDemo.victimType'),
    width: 240
  },
  {
    field: 'createdTime',
    label: t('tableDemo.extractedTime'),
    width: 300,
    formatter: (data) => formatTime(data.createdTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'updateBy',
    label: t('tableDemo.operator'),
    width: 240
  },
  {
    field: 'updateTime',
    label: '更新时间',
    width: 300,
    formatter: (data) => formatTime(data.updateTime, 'yyyy-MM-dd HH:mm:ss')
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
            <ElButton type="primary" link onClick={() => intoVisualLab(data.row.id)}>
              放入视觉分析库
            </ElButton>
            <ElButton type="primary" link onClick={() => addFn()}>
              {t('tableDemo.addDetectionRules')}
            </ElButton>
            <ElButton type="danger" link onClick={() => delFn(data.row.id)}>
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
  isCheckedAll.value = false
  const temp = { ruleColumns, visualColumns, sampleColumns }
  setProps({
    columns: temp[tableName]
  })
  dataArray.value = dataArrayMap[tableName] || []
  await getList()
  loading.value = false
}
const isDrawerInfo = ref(false)
const bodyInfo = ref()
const openDrawerInfo = (data) => {
  isDrawerInfo.value = true
  bodyInfo.value = [{ name: '网页信息', value: data.row.webInfo }]
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
const ids = ref([])
const isCheckedAll = ref(false)
const clearSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.clearSelection()
}
const getSelectedIds = async () => {
  const elTableRef = await getElTableExpose()
  ids.value = elTableRef?.getSelectionRows().map((i) => i.id)
}
watch(isCheckedAll, (newV) => {
  clearSelection()
  const dom = document.querySelector('.cell .el-checkbox span')
  if (newV) dom?.classList.add('is-disabled')
  if (!newV) dom?.classList.remove('is-disabled')
})
//导出
const isExport = ref(false)
const exportFn = async () => {
  await getSelectedIds()
  if (ids.value.length || isCheckedAll.value) {
    isExport.value = true
  } else {
    ElMessage.warning('请选择需要导出的数据')
  }
}
//导入
const isUploadFileDrawer = ref(false)
//仿冒检测特征增删改
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
//放入视觉分析库
const intoVisualLab = async (id) => {
  const res = await intoVisualLabApi({ sampleID: id })
  if (res.code == 0) {
    ElMessage.success({
      message: '截图添加成功'
    })
  }
}
//视觉分析库和仿冒样本库删除
const delFn = async (ids) => {
  let deleteApi
  ElMessageBox.confirm(t('common.delMessage'), t('common.delWarning'), {
    confirmButtonText: t('common.delOk'),
    cancelButtonText: t('common.delCancel'),
    type: 'warning'
  }).then(async () => {
    if (activeName.value == 'visualColumns') {
      deleteApi = deleteVisualApi
    } else {
      deleteApi = deleteSampleApi
    }
    let res
    if (ids) {
      res = await deleteApi({ IDs: [ids] })
    } else {
      res = await deleteApi({ IDs: [...ids.value] })
    }
    if (res.code == 0) {
      ElMessage.success(t('common.delSuccess'))
      isCheckedAll.value = false
      clearSelection()
      getList()
    }
  })
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
        <ElButton type="danger" @click="delFn(null)" v-show="activeName !== 'ruleColumns'">
          批量删除
        </ElButton>
        <ElButton
          type="primary"
          @click="isUploadFileDrawer = !isUploadFileDrawer"
          v-show="activeName === 'ruleColumns'"
        >
          导入数据
        </ElButton>
        <ElButton type="primary" @click="exportFn" v-show="activeName !== 'visualColumns'">
          <Icon icon="tdesign:upload" /> 导出数据
        </ElButton>
      </template>
    </TableTop>
    <Table
      :class="{ 'is-checked-all': isCheckedAll }"
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
    />
  </ContentWrap>
  <UploadFile v-model:isDrawer="isUploadFileDrawer" :title="'上传数据'" @get-data="getList" />
  <ExportFile
    v-model:isDrawer="isExport"
    title="仿冒规则检查"
    :ids="ids"
    :conditions="{ ...searchData }"
    :total="total"
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
  <DrawerInfo v-model:isDrawer="isDrawerInfo" :title="'网页信息查看'" :bodyInfo="bodyInfo" />
</template>
<style lang="less"></style>
