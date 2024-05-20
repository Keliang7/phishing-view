<script setup lang="tsx">
import { ref, unref, watch, h, onMounted } from 'vue'
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
  ElCol,
  ElMessage
} from 'element-plus'
import { Icon } from '@/components/Icon'
import { FormSchema } from '@/components/Form'
import { Table, TableColumn, TableSlotDefault } from '@/components/Table'
import { getListApi, statisticsApi, exportApi } from '@/api/dataManagement/counterfeitManagement'
import { backtrackApi, joinSampApi } from '@/api/dataManagement'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
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
const { t } = useI18n()
const { tableRegister, tableMethods, tableState } = useTable({
  immediate: false,
  fetchDataApi: async () => {
    let res = await getListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      tableName: unref(activeNameH),
      victimType: unref(activeNameS),
      ...searchData.value
    })
    return {
      list: res.data.list,
      total: res.data.total
    }
  }
})
const { loading, total, dataList, currentPage, pageSize } = tableState
const { getElTableExpose, getList } = tableMethods
const Columns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection',
    selectable: () => !isCheckedAll.value
  },
  {
    field: 'count',
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
    field: 'featureNumber',
    label: t('tableDemo.featureNumber'),
    align: 'center',
    width: 90
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
    align: 'center',
    width: 100
  },
  {
    field: 'FID',
    label: 'FID',
    width: 130
  },
  {
    field: 'ICON',
    label: 'ICON',
    formatter: (data) => <img class="max-w-18px" src={data.ICON}></img>
  },
  {
    field: 'domainOwner',
    label: t('tableDemo.domainOwner'),
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
    formatter: (data) => formatTime(data.analyseAffirmTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'analyseAffirmState',
    label: t('tableDemo.analyseAffirmState'),
    width: 180
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
            <ElButton type="primary" link onClick={() => addCounterfeitFn(data.row.dataID)}>
              {t('tableDemo.addCounterfeitSample')}
            </ElButton>
          </div>
        )
      }
    }
  }
]
//tableTop,tableSide逻辑
const tabHeadColumns = [
  {
    label: t('tableDemo.bw'),
    name: 'bw'
  },
  {
    label: t('tableDemo.domainMonitor'),
    name: 'domain'
  },
  {
    label: t('tableDemo.urlLog'),
    name: 'URL'
  },
  {
    label: t('tableDemo.tlsLog'),
    name: 'TLS'
  },
  {
    label: t('tableDemo.extensionData'),
    name: 'EXT'
  }
]
const activeNameH = ref(tabHeadColumns[0].name)
const setActiveNameH = async (name) => {
  activeNameH.value = name
  await setTableSide(name)
}
const tabSideColumns = ref()
const activeNameS = ref()

const setTableSide = async (tableName) => {
  const res = await statisticsApi({ tableName })
  tabSideColumns.value = res.data.list.sort((a, b) => b.count - a.count)
  activeNameS.value = tabSideColumns.value[0].name
  getList()
}
const setActiveNameS = (name) => {
  activeNameS.value = name
  getList()
}
onMounted(async () => {
  await setTableSide(activeNameH.value)
})
//搜索逻辑
const dataArray = ref(['url', 'domain', 'ip', 'extstatus', 'victim', 'discoveryTime'])
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
  await getList()
}
// 右侧弹窗信息
const isDrawerInfo = ref(false)
const isDrawerTimeLine = ref(false)
// 右侧弹窗信息-弹窗标题
const titleDrawer = ref('')
// 查看网页信息-弹窗内容
const bodyInfo = ref([{}])
// 查看回溯信息-弹窗内容
const dataSourceInfo = ref([{}])
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

// 定义表格内操作函数，用于处理点击表格列时的操作
const addCounterfeitFn = async (id) => {
  await joinSampApi({ phishingID: id }).then((res) => {
    if (res.code == 0) {
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
    } else {
      ElMessageBox({
        title: '提示',
        message: '添加失败'
      })
    }
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
  selectData.value = ids.value
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

// 选择全部
const ids = ref([])
const isCheckedAll = ref(false)
const clearSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.clearSelection()
}
const getSelectedIds = async () => {
  const elTableRef = await getElTableExpose()
  ids.value = elTableRef?.getSelectionRows().map((i) => i.dataID)
}
watch(isCheckedAll, () => {
  clearSelection()
})

//导出数据
const fieldName = ref()
fieldName.value = Columns.map((i) => {
  return {
    label: i.label,
    value: i.field
  }
}).slice(1, -1)
const isExport = ref(false)
const exportFn = async () => {
  await getSelectedIds()
  if (ids.value.length || isCheckedAll.value) {
    isExport.value = true
  } else {
    ElMessage.warning('请选择需要导出的数据')
  }
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
        <ElTabs v-model="activeNameH" class="demo-tabs" @tab-change="setActiveNameH">
          <ElTabPane
            v-for="tabHead in tabHeadColumns"
            :key="tabHead.name"
            :label="tabHead.label"
            :name="tabHead.name"
          />
        </ElTabs>
      </template>
      <template #right>
        <ElButton type="default">
          <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
        </ElButton>
        <ElDropdown class="mx-12px">
          <ElButton type="default"> 批量设置 </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem @click="gatherAllFn()">{{ t('tableDemo.gather') }}</ElDropdownItem>
              <ElDropdownItem @click="extensionFn(ids)">{{
                t('tableDemo.extension')
              }}</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
        <ElButton type="primary" @click="exportFn">
          <Icon icon="tdesign:upload" /> 导出数据
        </ElButton>
      </template>
    </TableTop>
    <ElRow>
      <ElCol :span="3">
        <TableSide :data="tabSideColumns" @change="setActiveNameS" />
      </ElCol>
      <ElCol :span="21">
        <Table
          :max-height="446"
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          :image-preview="['webScreenshot']"
          row-key="dataID"
          :columns="Columns"
          :data="dataList"
          :loading="loading"
          :pagination="{
            total: total,
            layout: 'prev, pager, next, sizes,jumper,->, total'
          }"
          @register="tableRegister"
          :reserve-selection="true"
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
    v-if="isExport"
    v-model:isDrawer="isExport"
    title="仿冒数据管理"
    :fieldName="fieldName"
    :ids="ids"
    :conditions="{ ...searchData, tableName: activeNameH }"
    :total="total"
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
