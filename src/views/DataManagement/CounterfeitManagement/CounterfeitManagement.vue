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
  ElMessage,
  ElTooltip,
  ElPopover
} from 'element-plus'
import { Icon } from '@/components/Icon'
import { Table, TableColumn } from '@/components/Table'
import { getListApi, statisticsApi, exportApi } from '@/api/dataManagement/counterfeitManagement'
import { backtrackApi, joinSampApi } from '@/api/dataManagement'
import { getDetailByIdApi } from '@/api/systemManagement/PhishingRule'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import DrawerInfo from '@/components/DrawerInfo/DrawerInfo.vue'
import DataExtension from '@/components/DataExtension/DataExtension.vue'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import TableTop from '@/components/TableTop/TableTop.vue'
import TableSide from '@/components/TableSide/TableSide.vue'
import router from '@/router'
import ExportFile from '@/components/ExportFile/ExportFile.vue'
import Backtrack from '@/components/Backtrack/Backtrack.vue'
import SelectData from '@/components/SelectData/SelectData.vue'
import DataSource from '@/components/DataSource/DataSource.vue'
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
    formatter(data) {
      return (
        <ElButton type="primary" link onClick={() => dataSource(data)}>
          {data.dataSources.length}个
        </ElButton>
      )
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
    label: '特征ID',
    align: 'center',
    slots: {
      default(data) {
        return (
          <ElPopover placement="left" width={'fitContent'}>
            {{
              default: () => {
                if (featureContentObj.value[data.row.featureNumber]) {
                  return (
                    <div>
                      {featureContentObj.value[data.row.featureNumber].map((item) => (
                        <div key={item.id}>
                          <div>
                            <b>特征ID：</b>
                            {item.id}
                          </div>
                          <div>
                            <b>特征名称：</b>
                            {item.name}
                          </div>
                          <div class="mb-12px max-w-400px">
                            <b>特征内容：</b>
                            {item.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                }
              },
              reference: () => {
                return (
                  <div onMouseenter={() => featureMouseEnter(data.row.featureNumber)}>
                    <ElButton
                      link
                      type="primary"
                      onClick={() => featureDetail(data.row.featureNumber)}
                    >
                      {data.row.featureNumber}
                    </ElButton>
                  </div>
                )
              }
            }}
          </ElPopover>
        )
      }
    },
    width: 90
  },
  {
    field: 'featureMatch',
    label: '特征名称',
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
    width: 60
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
    formatter: (data) =>
      data.analyseAffirmTime
        ? formatTime(data.analyseAffirmTime, 'yyyy-MM-dd HH:mm:ss')
        : '暂无时间信息'
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
    width: '150',
    slots: {
      default: (data) => {
        return (
          <>
            <ElButton link type="primary" onClick={() => gatherFn(data.row)}>
              <ElTooltip content="采集" placement="top" enterable={false}>
                <Icon icon="svg-icon:data" />
              </ElTooltip>
            </ElButton>
            <ElButton link type="primary" onClick={() => extensionFn(data.row)}>
              <ElTooltip content="拓线" placement="top" enterable={false}>
                <Icon icon="svg-icon:link" />
              </ElTooltip>
            </ElButton>
            <ElButton link type="primary" onClick={() => backtrackFn(data)}>
              <ElTooltip content="回溯" placement="top" enterable={false}>
                <Icon icon="svg-icon:backTrack" />
              </ElTooltip>
            </ElButton>
            <ElButton type="primary" link onClick={() => addCounterfeitFn(data.row.dataID)}>
              <ElTooltip content="加入仿冒样本库" placement="top" enterable={false}>
                <Icon icon="svg-icon:add" />
              </ElTooltip>
            </ElButton>
          </>
        )
      }
    }
  }
]
//高级查询
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
}
//tableTop
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
}
//tableSide
const tabSideColumns = ref()
const activeNameS = ref()
const setTableSide = async (params) => {
  const res = await statisticsApi(params)
  if (res.data.list.length) {
    tabSideColumns.value = res.data.list.sort((a, b) => b.count - a.count)
    setActiveNameS(tabSideColumns.value[0].name)
  } else {
    tabSideColumns.value = []
    getList()
  }
}
watch([searchData, activeNameH], ([newSearchData, newActiveNameH]) =>
  setTableSide({ ...newSearchData, tableName: newActiveNameH })
)
const setActiveNameS = (name) => {
  activeNameS.value = name
  getList()
}
onMounted(async () => {
  await setTableSide({ tableName: unref(activeNameH) })
})
//特征ID鼠标进入
const featureContentObj = ref({})
const featureMouseEnter = async (featureNumber) => {
  if (!featureContentObj.value[featureNumber]) {
    //查询，并存一下
    let res = await getDetailByIdApi({ ids: featureNumber })
    featureContentObj.value[featureNumber] = res.data.list
  }
}
//特征ID跳转
const featureDetail = (featureNumber) => {
  router.push({
    name: 'PhishingRule',
    query: {
      featureNumber
    }
  })
}
//数据源
const isDataSource = ref(false)
const dataSourceData = ref()
const dataSource = (data) => {
  isDataSource.value = true
  dataSourceData.value = data.dataSources
}

//加入仿冒样本库
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
// 采集任务事件
const isSelectData = ref(false)
const selectData = ref()
const gatherFn = async (data) => {
  if (!data) {
    const elTableRef = await getElTableExpose()
    const res = elTableRef?.getSelectionRows()
    selectData.value = res
  } else {
    selectData.value = [data]
  }
  isSelectData.value = true
}
//回溯
const isBacktrack = ref(false)
const backtrackData = ref()
const backtrackFn = async (data) => {
  let temp = data.row.dataID
  const res = await backtrackApi({ id: temp })
  backtrackData.value = res
  isBacktrack.value = true
}
//拓线
const isDataExtension = ref(false)
const extensionData = ref()
const extensionFn = async (data: any) => {
  if (!data) {
    const elTableRef = await getElTableExpose()
    const res = await elTableRef?.getSelectionRows()
    extensionData.value = res
  } else {
    extensionData.value = [data]
  }
  isDataExtension.value = true
}
//查看网页信息
const isDrawerInfo = ref(false)
const bodyInfo = ref()
const openDrawerInfo = (data) => {
  isDrawerInfo.value = true
  bodyInfo.value = [{ name: '网页信息', value: data.row.webInfo }]
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
fieldName.value = Columns.slice(1, -1).map((i) => {
  return {
    label: i.label,
    value: i.field
  }
})
const isExport = ref(false)
const exportFn = async () => {
  await getSelectedIds()
  if (ids.value.length || isCheckedAll.value) {
    isExport.value = true
  } else {
    ElMessage.warning('请选择需要导出的数据')
  }
}

//table-left-width
const tableLeftSpan = ref(3)
const changeSpan = (collapse: boolean) => {
  tableLeftSpan.value = collapse ? 1 : 3
}
</script>
<template>
  <AdvancedSearch
    :title="t('tableDemo.CounterfeitManagement')"
    :dataArray="[
      'url',
      'domain',
      'ip',
      'extstatus',
      'victim',
      'discoveryTime',
      'featureNumber',
      'featureMatch'
    ]"
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
        <ElDropdown class="mx-12px" trigger="click">
          <ElButton type="default" :disabled="isCheckedAll"> 批量设置 </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem @click="gatherFn(null)">{{ t('tableDemo.gather') }}</ElDropdownItem>
              <ElDropdownItem @click="extensionFn(null)">{{
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
      <ElCol :span="tableLeftSpan">
        <TableSide :data="tabSideColumns" @change="setActiveNameS" @collapse="changeSpan" />
      </ElCol>
      <ElCol :span="24 - tableLeftSpan">
        <Table
          :class="{ 'is-checked-all': isCheckedAll }"
          :max-height="446"
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          :image-preview="['webScreenshot', 'ICON']"
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
  <DrawerInfo v-model:isDrawer="isDrawerInfo" :bodyInfo="bodyInfo" />
  <DataExtension v-model:isDrawer="isDataExtension" :title="'数据拓线'" :data="extensionData" />
  <DataSource v-model:isDrawer="isDataSource" :dataSourceData="dataSourceData" />
  <ExportFile
    v-if="isExport"
    v-model:isDrawer="isExport"
    title="仿冒数据管理"
    :fieldName="fieldName"
    :ids="ids"
    :conditions="{ ...searchData, tableName: activeNameH, victimType: activeNameS }"
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
    v-if="isSelectData"
    v-model:isDrawer="isSelectData"
    :title="'采集任务'"
    :data="selectData"
  />
</template>
<style lang="less" scoped></style>
