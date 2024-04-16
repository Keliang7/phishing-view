<script setup lang="tsx">
import { ref, unref, onMounted, watch, h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import {
  ElTabs,
  ElTabPane,
  ElButton,
  ElCheckbox,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElMessageBox,
  ElRow,
  ElCol
} from 'element-plus'
import { Icon } from '@/components/Icon'
import { FormSchema } from '@/components/Form'
import { Table, TableColumn, TableSlotDefault } from '@/components/Table'
import {
  getSuspectCounterfeitApi,
  getInjuredPartyApi,
  backtrackApi,
  exportApi
} from '@/api/dataManagement/counterfeitManagement'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import { TabSideColumns } from '../types/index'
import DrawerInfo from '@/components/DrawerInfo/DrawerInfo.vue'
import DrawerOperate from '@/components/DrawerOperate/DrawerOperate.vue'
import DataExtension from '@/components/DataExtension/DataExtension.vue'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import TableTop from '@/components/TableTop/TableTop.vue'
import TableSide from '@/components/TableSide/TableSide.vue'
import router from '@/router'
import ExportFile from '@/components/ExportFile/ExportFile.vue'
import Backtrack from '@/components/Backtrack/Backtrack.vue'
import SelectData from '@/components/SelectData/SelectData.vue'
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
// 获取tableState中的数据和方法
let { loading, total, dataList, currentPage, pageSize } = tableState
const { setProps, getElTableExpose } = tableMethods
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
  },
  {
    label: t('tableDemo.extensionData'),
    name: 'extensionData'
  }
]
const tabSideColumns = ref<TabSideColumns[]>([])
const activeNameH = ref(tabHeadColumns[0].name)
const activeNameS = ref('1')
const setActiveNameS = (index) => {
  activeNameS.value = index
}
// 高级搜索的数据
const searchData = ref({})
// 定义分页器展示的内容
const layout = 'prev, pager, next, sizes,jumper,->, total'
// 定义columns变量，用于存储表格的列配置
const Columns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'dataSourcesNum',
    label: t('tableDemo.dataSourcesNum'),
    align: 'center',
    width: 120,
    slots: {
      default: (data) => {
        return (
          <ElButton onClick={() => openDrawerInfo(data)} type="primary" link>
            {`${data.row.dataSources?.length}个`}
          </ElButton>
        )
      }
    }
  },
  {
    field: 'dataID',
    label: t('tableDemo.dataID'),
    width: 290
  },
  {
    field: 'webScreenshot',
    label: t('tableDemo.webScreenshot'),
    width: 130
  },
  {
    field: 'url',
    label: t('tableDemo.url'),
    width: 290
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
    width: 60
  },
  {
    field: 'featureMatch',
    label: t('tableDemo.featureMatch'),
    width: 130
  },
  {
    field: 'webInfo',
    label: t('tableDemo.webInfo'),
    align: 'center',
    width: 130,
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
    field: 'title',
    label: 'title',
    width: 220
  },
  {
    field: 'webCode',
    label: t('tableDemo.webCode'),
    width: 60
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
    field: 'gatherTime',
    label: t('tableDemo.gatherTime'),
    width: 180,
    formatter: (data) => formatTime(data.gatherTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'gatherState',
    label: t('tableDemo.gatherState'),
    width: 120
  },
  {
    field: 'extensionTime',
    label: t('tableDemo.extensionTime'),
    width: 180,
    formatter: (data) => formatTime(data.extensionTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'extensionState',
    label: t('tableDemo.extensionState'),
    width: 120
  },
  {
    field: 'pushTime',
    label: t('tableDemo.pushTime'),
    width: 180,
    formatter: (data) => formatTime(data.pushTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'pushState',
    label: t('tableDemo.pushState'),
    width: 120
  },
  {
    field: 'analyseAffirmTime',
    label: t('tableDemo.analyseAffirmTime'),
    width: 180,
    formatter: (data) => formatTime(data.pushTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'analyseAffirmState',
    label: t('tableDemo.analyseAffirmState'),
    width: 180,
    formatter: (data) => formatTime(data.pushTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    width: 320,
    slots: {
      default: (data) => {
        return (
          <div class="action-btn">
            <ElButton type="primary" link onClick={() => gatherFn(data)}>
              {t('tableDemo.gather')}
            </ElButton>
            <ElButton disabled type="primary" link onClick={() => extensionFn(data)}>
              {t('tableDemo.extension')}
            </ElButton>
            <ElButton type="primary" link onClick={() => backtrackFn(data)}>
              {t('tableDemo.recall')}
            </ElButton>
            <ElButton disabled type="primary" link onClick={() => addCounterfeitFn(data)}>
              {t('tableDemo.addCounterfeitSample')}
            </ElButton>
          </div>
        )
      }
    }
  }
]
const checkedAll = ref(false)
const dataArray = ref(['url', 'domain', 'ip', 'status', 'victim', 'victimType', 'discoveryTime'])

// 右侧弹窗信息
const isDrawerInfo = ref(false)
const isDrawerTimeLine = ref(false)
// 右侧弹窗信息-弹窗标题
const titleDrawer = ref('')
// 查看网页信息-弹窗内容
const bodyInfo = ref([{}])
// 查看回溯信息-弹窗内容
const dataSourceInfo = ref([{}])

// 高级搜索功能，接收从AdvancedSearch组件中传过来的数据
const searchTable = async (value) => {
  searchData.value = value
  await getTableData([activeNameH.value, activeNameS.value])
}
// 任务弹窗
const isDrawerOperate = ref(false)

// 任务弹窗表单数据
const drawerData = ref<FormSchema[]>()
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
    setProps({
      columns: Columns
    })
  }, 0)
})
// 获取侧边栏数据
const getInjuredParty = async (params: any) => {
  const res = await getInjuredPartyApi(params)
  tabSideColumns.value = res.data.list
  activeNameS.value = tabSideColumns.value[0].victimName
}
// 定义表格内操作函数，用于处理点击表格列时的操作
const addCounterfeitFn = (data: TableSlotDefault) => {
  console.log(data)
  ElMessageBox({
    title: '提示',
    message: h('p', null, [
      h(Icon, {
        icon: 'ep:warning-filled',
        size: 25,
        style: 'font-size:25px; color:#ffba00; margin-right:10px; top:5px'
      }),
      h('span', null, '特征提取成功 '),
      h(
        'i',
        {
          style: 'color: #32AA9F;cursor:pointer',
          onClick: () => {
            router.push({ path: '/system_management/phishing_rule' })
            // 页面跳转成功之后，关闭提示窗口
            ElMessageBox.close()
          }
        },
        '去查看'
      )
    ])
  })
}
//采集
const isSelectData = ref(false)
const selectData = ref()
const gatherFn = (data: TableSlotDefault) => {
  isSelectData.value = true
  selectData.value = [data.row]
}
// 批量采集
const gatherAllFn = () => {
  isSelectData.value = true
  selectData.value = selectedData.value
}
//回溯
const isBacktrack = ref(false)
const backtrackData = ref()
const backtrackFn = async (data) => {
  let temp = data.row.dataID
  const res = await backtrackApi({ id: temp })
  backtrackData.value = res
  console.log(backtrackData.value)
  isBacktrack.value = true
}
//拓线
const isDataExtension = ref(false)
const extensionFn = (data: any) => {
  titleDrawer.value = '创建任务'
  console.log('拓线任务', data)
  isDataExtension.value = true
}
// 表格查看信息事件
const openDrawerInfo = async (data: TableSlotDefault) => {
  if (data.column.property == 'dataSourcesNum') {
    isDrawerTimeLine.value = true
    titleDrawer.value = '数据源'
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
  }
}
// 判断当前要展示的数据
const getTableData = async (params) => {
  loading.value = true
  dataArray.value = ['url', 'domain', 'ip', 'expandStatus', 'victim', 'victimType', 'discoveryTime']
  const res = await getSuspectCounterfeitApi({
    pageIndex: unref(currentPage),
    pageSize: unref(pageSize),
    originType: params[0],
    victimType: params[1],
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
// 选择全部
const isCheckedAll = ref(false)
const selectedData = ref<TableColumn[]>([])
const temp = ref<any[]>([])
const cancelData = ref<any[]>([])
const toggleSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.toggleAllSelection()
}
const handleSelectionChange = (selected: any[]) => {
  selectedData.value = selected.map((i) => i.dataID)
  if (temp.value.length > selectedData.value.length) {
    cancelData.value = temp.value.filter((i) => !selectedData.value.includes(i))
  }
}
watch(dataList, (newV) => {
  temp.value.push(...newV.map((i) => i.dataID))
  temp.value = [...new Set(temp.value)]
  if (isCheckedAll.value && !newV.some((i) => selectedData.value.includes(i.dataID))) {
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
//导出数据
const isDrawerExportFile = ref(false)
const initExportDate = ref({})
const getSelections = () => {
  if (isCheckedAll.value) {
    initExportDate.value = {
      count: unref(total) - cancelData.value.length,
      exportDate: {
        exportAll: isCheckedAll.value,
        arrayNot: cancelData.value
      }
    }
  } else {
    initExportDate.value = {
      count: selectedData.value.length,
      exportDate: {
        exportAll: isCheckedAll.value,
        ruleContents: selectedData.value
      }
    }
  }
  titleDrawer.value = '导出数据'
  isDrawerExportFile.value = true
}
</script>
<template>
  <AdvancedSearch
    :title="t('tableDemo.CounterfeitManagement')"
    :dataArray="dataArray"
    :tipTitle="'系统默认展示当天接入数据，最多可查看5年内数据，超出5年数据不会留存。'"
    @search-data="searchTable"
  />
  <ContentWrap class="table-box">
    <TableTop>
      <template #left>
        <ElTabs v-model="activeNameH" class="demo-tabs">
          <ElTabPane
            v-for="tabHead in tabHeadColumns"
            :key="tabHead.name"
            :label="tabHead.label"
            :name="tabHead.name"
          />
        </ElTabs>
      </template>
      <template #right>
        <ElButton type="default" @click="toggleSelection()">
          <ElCheckbox v-model="checkedAll" label="选择全部" size="large" />
        </ElButton>
        <ElDropdown class="mx-12px">
          <ElButton type="default"> 批量设置 </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem @click="gatherAllFn()">{{ t('tableDemo.gather') }}</ElDropdownItem>
              <ElDropdownItem @click="extensionFn(selectedData)">{{
                t('tableDemo.extension')
              }}</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
        <ElButton type="primary" @click="getSelections">
          <Icon icon="tdesign:upload" /> 导出数据
        </ElButton>
      </template>
    </TableTop>
    <ElRow>
      <ElCol :span="3">
        <TableSide :data="tabSideColumns" @change="setActiveNameS" />
        <!-- <ElTabs style="color: springgreen" v-model="activeNameS" tab-position="left">
            <ElTabPane
              v-for="tabSide in tabSideColumns"
              :key="tabSide.victimKey"
              :name="tabSide.victimName"
            >
              <template #label>
                <div>{{ `${tabSide.victimName}（${tabSide.count}）` }}</div>
              </template>
              <div>123</div>
            </ElTabPane>
          </ElTabs> -->
      </ElCol>
      <ElCol :span="21">
        <Table
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          stripe
          row-key="dataID"
          :reserve-selection="true"
          :columns="Columns"
          :data="dataList"
          :loading="loading"
          :image-preview="['webScreenshot']"
          :pagination="{
            total: total,
            layout: layout
          }"
          @register="tableRegister"
          @selection-change="handleSelectionChange"
        />
      </ElCol>
    </ElRow>
  </ContentWrap>
  <DrawerInfo v-model:isDrawer="isDrawerInfo" :title="titleDrawer" :bodyInfo="bodyInfo" />
  <!-- 添加v-if的原因是：为了确保每次打开弹窗都重新渲染了一遍，不受上次打开弹窗的影响 -->
  <DrawerOperate
    v-if="isDrawerOperate"
    v-model:isDrawer="isDrawerOperate"
    :title="titleDrawer"
    :drawerData="drawerData"
  />
  <DataExtension v-model:isDrawer="isDataExtension" :title="'创建任务'" />
  <ExportFile
    v-model:isDrawer="isDrawerExportFile"
    title="仿冒数据管理"
    :data="initExportDate"
    :axiosFn="exportApi"
    @clear-selection="clearSelection"
    @is-checked-all="
      (temp) => {
        isCheckedAll = temp
      }
    "
  />
  <Backtrack
    v-model:isDrawer="isBacktrack"
    :title="'数据回溯'"
    :backtrackData="backtrackData"
    :dataSourceInfo="{ name: 'wangdao' }"
  />
  <SelectData
    :isFile="true"
    v-model:isDrawer="isSelectData"
    :title="'采集任务'"
    :data="selectData"
  />
</template>
<style lang="less" scoped></style>
