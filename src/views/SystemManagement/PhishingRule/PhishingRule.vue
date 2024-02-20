<script setup lang="tsx">
import { ref, reactive, unref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElTabs, ElTabPane, ElButton, ElCheckbox } from 'element-plus'
import { Table, TableColumn, TableSlotDefault } from '@/components/Table'
import { getPhishingDetectionApi } from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import { useSystemConstantsWithOut } from '@/store/modules/systemConstant'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'

// 使用useI18n钩子函数获取国际化相关数据和方法
const { t } = useI18n()
// 使用useTable钩子函数获取table相关数据和方法
const { tableRegister, tableMethods, tableState } = useTable({
  // fetchDataApi方法用于异步获取表格数据
  fetchDataApi: async () => {
    let res = await getTableData(activeName.value)

    return {
      list: res.list,
      total: res.total
    }
  }
})
const systemConstants = useSystemConstantsWithOut()
// 高级搜索的数据
const searchData = ref({})
const checkedAll = ref(false)
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
const { setProps } = tableMethods
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
    label: t('tableDemo.phishingMorphemeManagement'),
    name: 'phishingMorphemeManagement'
  },
  {
    label: t('tableDemo.phishingSignatureManagement'),
    name: 'phishingSignatureManagement'
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
            <ElButton type="text" size="small" onClick={() => editFn(data)}>
              {t('tableDemo.edit')}
            </ElButton>
            <ElButton type="text" size="small" onClick={() => deleteFn(data)}>
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
            <ElButton type="text" size="small" onClick={() => editFn(data)}>
              {t('tableDemo.edit')}
            </ElButton>
            <ElButton type="text" size="small" onClick={() => deleteFn(data)}>
              {t('tableDemo.delete')}
            </ElButton>
          </div>
        )
      }
    }
  }
]
// 仿冒词素库管理表格列表
const MorphemeColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'domain',
    label: t('tableDemo.domain'),
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
            <ElButton type="text" size="small" onClick={() => editFn(data)}>
              {t('tableDemo.edit')}
            </ElButton>
            <ElButton type="text" size="small" onClick={() => deleteFn(data)}>
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
          <div>
            <ElButton type="text" size="small" onClick={() => editFn(data)}>
              {t('tableDemo.picToBlacklist')}
            </ElButton>
            <ElButton type="text" size="small" onClick={() => editFn(data)}>
              {t('tableDemo.iconToMorpheme')}
            </ElButton>
            <ElButton type="text" size="small" onClick={() => editFn(data)}>
              {t('tableDemo.addDetectionRules')}
            </ElButton>
            <ElButton type="text" size="small" onClick={() => deleteFn(data)}>
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
  } else if (params === 'phishingMorphemeManagement') {
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
      columns: MorphemeColumns
    })
  } else if (params === 'phishingSignatureManagement') {
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
          <ElCheckbox v-model="checkedAll" label="选择全部" size="large" />
        </ElButton>
        <ElButton type="default"> 批量删除 </ElButton>
        <ElButton type="primary"> 添加 </ElButton>

        <ElButton type="primary" v-show="activeName === 'phishingDetectionFeature'">
          导入数据
        </ElButton>

        <ElButton
          type="primary"
          v-show="
            activeName === 'phishingDetectionFeature' ||
            activeName === 'phishingSignatureManagement'
          "
        >
          <Icon icon="tdesign:upload" /> 导出数据
        </ElButton>
      </div>
      <Table
        v-model:pageSize="pageSize"
        v-model:currentPage="currentPage"
        stripe
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
      />
    </ContentWrap>
  </ElTabs>
</template>
<style lang="less" scoped>
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
