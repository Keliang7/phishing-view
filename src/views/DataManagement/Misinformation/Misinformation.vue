<script setup lang="tsx">
import { ref, reactive, unref, onMounted, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElTabs, ElTabPane, ElButton, ElCheckbox } from 'element-plus'
import { Table, TableColumn, TableSlotDefault } from '@/components/Table'
import { getSuspectCounterfeitApi, getInjuredPartyApi } from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import { TabSideColumns } from '../types/index'
import DrawerInfo from '@/components/DrawerInfo/DrawerInfo.vue'
import { useSystemConstantsWithOut } from '@/store/modules/systemConstant'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'

// 使用useI18n钩子函数获取国际化相关数据和方法
const { t } = useI18n()
// 使用useTable钩子函数获取table相关数据和方法
const { tableRegister, tableMethods, tableState } = useTable({
  // fetchDataApi方法用于异步获取表格数据
  fetchDataApi: async () => {
    let res = await getTableData([activeNameH.value, activeNameS.value])

    return {
      list: res.list,
      total: res.total
    }
  }
})
const systemConstants = useSystemConstantsWithOut()
// 获取tableState中的数据和方法
let { loading, total, dataList, currentPage, pageSize } = tableState
const { setProps } = tableMethods
// 定义表格切换器内容
const tabHeadColumns = [
  {
    label: t('tableDemo.bw'),

    name: 'bw'
  },
  {
    label: t('tableDemo.domainMonitor'),

    name: 'domainMonitor'
  },
  {
    label: t('tableDemo.urlLog'),

    name: 'urlLog'
  },
  {
    label: t('tableDemo.tlsLog'),

    name: 'tlsLog'
  }
]
const tabSideColumns = ref<TabSideColumns[]>([])
const activeNameH = ref(tabHeadColumns[0].name)
const activeNameS = ref('1')
// 高级搜索的数据
const searchData = ref({})
// 定义分页器展示的内容
const layout = 'prev, pager, next, sizes,jumper,->, total'
// 定义columns变量，用于存储表格的列配置
let columns = reactive<TableColumn[]>([])
const Columns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'dataSourcesNum',
    label: t('tableDemo.dataSourcesNum'),
    width: 120,
    slots: {
      default: (data) => {
        return (
          <ElButton onClick={() => openDrawerInfo(data)} type="text" size="small">
            {`${data.row.dataSources.length}个`}
          </ElButton>
        )
      }
    }
  },
  {
    field: 'dataID',
    label: t('tableDemo.dataID'),
    width: 120
  },
  {
    field: 'webScreenshot',
    label: t('tableDemo.webScreenshot'),
    width: 130
  },
  {
    field: 'url',
    label: t('tableDemo.url'),
    width: 130
  },
  {
    field: 'domain',
    label: t('tableDemo.domain'),
    width: 130
  },
  {
    field: 'ip',
    label: t('tableDemo.ip'),
    width: 130
  },
  {
    field: 'victim',
    label: t('tableDemo.victim'),
    width: 130
  },
  {
    field: 'victimType',
    label: t('tableDemo.victimType'),
    width: 130
  },
  {
    field: 'intention',
    label: t('tableDemo.intention'),
    width: 130
  },
  {
    field: 'hitRule',
    label: t('tableDemo.hitRule'),
    width: 130
  },
  {
    field: 'featureNumber',
    label: t('tableDemo.featureNumber'),
    width: 130
  },
  {
    field: 'featureMatch',
    label: t('tableDemo.featureMatch'),
    width: 130
  },
  {
    field: 'webInfo',
    label: t('tableDemo.webInfo'),
    width: 130,
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
    field: 'title',
    label: 'title',
    width: 130
  },
  {
    field: 'webCode',
    label: t('tableDemo.webCode'),
    width: 130
  },
  {
    field: 'FID',
    label: 'FID',
    width: 130
  },
  {
    field: 'ICON',
    label: 'ICON',
    width: 130
  },
  {
    field: 'domainOwner',
    label: t('tableDemo.domainOwner'),
    width: 130
  },
  {
    field: 'phone',
    label: t('tableDemo.phone'),
    width: 130
  },
  {
    field: 'domainEmail',
    label: t('tableDemo.domainEmail'),
    width: 130
  },
  {
    field: 'discoveryTime',
    label: t('tableDemo.discoveryTime'),
    width: 180,
    formatter: (data) => formatTime(data.discoveryTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'pushTime',
    label: t('tableDemo.pushTime'),
    width: 180,
    formatter: (data) => formatTime(data.pushTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'analyseAffirmTime',
    label: t('tableDemo.analyseAffirmTime'),
    width: 180,
    formatter: (data) => formatTime(data.pushTime, 'yyyy-MM-dd HH:mm:ss')
  }
]
const checkedAll = ref(false)
// 定义canShowPagination变量，用于控制是否显示分页
const canShowPagination = ref(true)
const dataArray = ref(['url', 'domain', 'ip', 'dataSource', 'discoveryTime', 'victim', 'operate'])
const tipTitle = ref('系统默认展示当天接入数据，最多可查看5年内数据，超出5年数据不会留存。')
const optionArray = ref({ dataSource: systemConstants.phishingSource })
// 右侧弹窗信息
const isDrawerInfo = ref(false)
// 右侧弹窗信息-弹窗标题
const titleDrawer = ref('')
// 查看网页信息-弹窗内容
const bodyInfo = ref([{}])
// 查看网页信息-弹窗内容
const dataSourceInfo = ref([{}])
// 高级搜索功能，接收从AdvancedSearch组件中传过来的数据
const searchTable = async (value) => {
  searchData.value = value
  await getTableData([activeNameH.value, activeNameS.value])
}
// 映射表
const sourceMap = {
  bw: '报文监测子系统 获取',
  domainMonitor: '域名监测子系统 获取',
  urlLog: 'URL日志系统 获取',
  tlsLog: 'TLS日志系统 获取'
}
// 在页面加载完成后，设置columns的值
onMounted(async () => {
  await getInjuredParty(activeNameH.value)

  setTimeout(() => {
    // 设置columns的值为一个包含列配置的数组
    setProps({
      columns: Columns
    })
  }, 0)
})
const getInjuredParty = async (params: any) => {
  const res = await getInjuredPartyApi(params)
  tabSideColumns.value = res.data.list
  activeNameS.value = tabSideColumns.value[0].victimName
  console.log(tabSideColumns, 111)
}

// 表格查看信息事件
const openDrawerInfo = async (data: TableSlotDefault) => {
  if (data.column.property == 'dataSourcesNum') {
    isDrawerInfo.value = true
    titleDrawer.value = '数据源'
    console.log(data.column.property)
    bodyInfo.value = []
    dataSourceInfo.value = data.row.dataSources.map((item) => ({
      source: sourceMap[item.source],
      timestamp: formatTime(item.timestamp, 'yyyy-MM-dd HH:mm:ss')
    }))
  } else if (data.column.property == 'webInfo') {
    isDrawerInfo.value = true
    titleDrawer.value = '查看网页信息'
    bodyInfo.value = [
      {
        value: data.row.webInfo,
        name: 'HTML'
      }
    ]
    dataSourceInfo.value = []
  }
}
// 判断当前要展示的数据
const getTableData = async (params) => {
  loading.value = true
  if (params[0] === 'bw') {
    dataArray.value = ['url', 'domain', 'ip', 'dataSource', 'discoveryTime', 'victim', 'operate']
    const res = await getSuspectCounterfeitApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      originType: params[0],
      victimType: params[1],
      ...searchData.value
    })
    dataList.value = res.data.list
    total.value = res.data.total
  } else if (params[0] === 'domainMonitor') {
  } else if (params[0] === 'urlLog') {
  } else if (params[0] === 'tlsLog') {
  }
  loading.value = false
  return {
    list: dataList.value,
    total: total.value
  }
}
// 【tab切换】在这里用监听而不用点击事件，是因为v-model有异步延迟，点击切换，获取到的activeName显示的是上一个
watch(
  () => [activeNameH.value, activeNameS.value],
  async (newValue) => {
    currentPage.value = 1
    pageSize.value = 10
    await getTableData(newValue)
  },
  {
    immediate: true
  }
)
</script>
<template>
  <AdvancedSearch
    :dataArray="dataArray"
    :optionArray="optionArray"
    :tipTitle="tipTitle"
    @search-data="searchTable"
  />
  <ContentWrap class="table-box" :title="t('tableDemo.SuspectCounterfeit')">
    <div class="table-btn">
      <ElButton type="default">
        <ElCheckbox v-model="checkedAll" label="选择全部" size="large" />
      </ElButton>
      <ElButton type="default"> 批量设置 </ElButton>
      <ElButton type="primary"> 推送参数配置 </ElButton>
      <ElButton type="primary"> <Icon icon="tdesign:upload" /> 导出数据 </ElButton>
    </div>
    <ElTabs v-model="activeNameH" class="demo-tabs">
      <ElTabPane
        v-for="tabHead in tabHeadColumns"
        :key="tabHead.name"
        :label="tabHead.label"
        :name="tabHead.name"
      />
      <ElTabs v-model="activeNameS" type="card" tab-position="left" class="demo-tabs">
        <ElTabPane
          v-for="tabSide in tabSideColumns"
          :key="tabSide.victimKey"
          :label="`${tabSide.victimName}（${tabSide.count}）`"
          :name="tabSide.victimName"
        />
        <Table
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          stripe
          :columns="columns"
          :data="dataList"
          :loading="loading"
          :image-preview="['webScreenshot']"
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
      </ElTabs>
    </ElTabs>
  </ContentWrap>
  <DrawerInfo
    v-model:isDrawer="isDrawerInfo"
    :title="titleDrawer"
    :bodyInfo="bodyInfo"
    :dataSourceInfo="dataSourceInfo"
  />
</template>
<style lang="less" scoped>
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
  z-index: 888;
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
  top: 75px;
  z-index: 999;
}
.el-pagination {
  float: right;
}
</style>
