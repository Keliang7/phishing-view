<script setup lang="tsx">
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import { ref, unref, watch, onMounted, h } from 'vue'
import {
  ElButton,
  ElCheckbox,
  ElRow,
  ElCol,
  ElMessage,
  ElMessageBox,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElTooltip
} from 'element-plus'
import { Icon } from '@/components/Icon'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getListApi, statisticsApi, exportApi } from '@/api/dataManagement/understatement'
import { backtrackApi, joinSampApi } from '@/api/dataManagement'
import { formatTime } from '@/utils/index'
import TableTop from '@/components/TableTop/TableTop.vue'
import TableSide from '@/components/TableSide/TableSide.vue'
import DrawerInfo from '@/components/DrawerInfo/DrawerInfo.vue'
import SelectData from '@/components/SelectData/SelectData.vue'
import DataSource from '@/components/DataSource/DataSource.vue'
import ExportFile from '@/components/ExportFile/ExportFile.vue'
import Backtrack from '@/components/Backtrack/Backtrack.vue'
import { useRouter } from 'vue-router'
const { tableRegister, tableMethods, tableState } = useTable({
  immediate: false,
  fetchDataApi: async () => {
    const res = await getListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
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
const { getList, getElTableExpose } = tableMethods
const columns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection',
    selectable: () => {
      return !isCheckedAll.value
    }
  },
  {
    field: 'dataCount',
    label: '数据来源个数',
    width: 120,
    align: 'center',
    formatter(data) {
      return (
        <ElButton type="primary" link onClick={() => dataSource(data)}>
          {data.dataSources.length}个
        </ElButton>
      )
    }
  },
  {
    field: 'misReason',
    label: '漏报原因',
    width: 300,
    formatter(data) {
      return (
        <ElButton type="primary" link onClick={() => backtrackFn(data)}>
          {data.misReason}
        </ElButton>
      )
    }
  },
  {
    field: 'dataID',
    label: '数据ID',
    width: 320
  },
  {
    field: 'screenshot',
    label: '网站截图',
    width: 300
  },
  {
    field: 'url',
    label: 'URL',
    width: 240
  },
  {
    field: 'domain',
    label: '域名',
    width: 200
  },
  {
    field: 'ip',
    label: 'IP',
    width: 200
  },
  {
    field: 'victim',
    label: '受害方',
    width: 180
  },
  {
    field: 'victimType',
    width: 120,
    label: '受害方分类'
  },
  {
    field: 'intention',
    label: '意图'
  },
  {
    field: 'featureID',
    width: 100,
    label: '特征编号'
  },
  {
    field: 'feature',
    width: 100,
    label: '匹配特征'
  },
  {
    field: 'webInfo',
    label: '网页信息',
    headerAlign: 'center',
    align: 'center',
    width: 100,
    slots: {
      default: (data) => {
        return (
          <ElButton onClick={() => openDrawerInfo(data.row)} type="primary" link>
            查看
          </ElButton>
        )
      }
    }
  },
  {
    field: 'title',
    label: 'title',
    width: 200
  },
  {
    field: 'netStatusCode',
    label: '网页状态码',
    width: 120,
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'FID',
    label: 'FID'
  },
  {
    field: 'ICON',
    label: 'ICON'
  },
  {
    field: 'domainHolder',
    width: 120,
    headerAlign: 'center',
    align: 'center',
    label: '域名所有者'
  },
  {
    field: 'tele',
    label: '电话',
    width: 120
  },
  {
    field: 'email',
    width: 120,
    headerAlign: 'center',
    align: 'center',
    label: '域名注册邮箱'
  },
  {
    field: 'discoveryTime',
    width: 180,
    headerAlign: 'center',
    label: '发现时间',
    formatter: (data) => formatTime(data.discoveryTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'selectTime',
    width: 180,
    headerAlign: 'center',
    label: '采集时间',
    formatter: (data) => formatTime(data.selectTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'selectStatus',
    width: 180,
    headerAlign: 'center',
    label: '采集状态'
  },
  {
    field: 'extensionTime',
    width: 180,
    headerAlign: 'center',
    label: '拓线时间',
    formatter: (data) => formatTime(data.extensionTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'extensionStatus',
    label: '拓线状态',
    width: 180,
    headerAlign: 'center'
  },
  {
    field: 'pushTime',
    label: '推送时间',
    width: 180,
    formatter: (data) => formatTime(data.pushTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'pushStatus',
    label: '推送状态',
    width: 180,
    headerAlign: 'center'
  },
  {
    field: 'fxczGetTime',
    label: '分析处置系统获取时间',
    width: 180,
    headerAlign: 'center',
    formatter: (data) => formatTime(data.fxczGetTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: 100,
    headerAlign: 'center',
    align: 'center',
    slots: {
      default: (data) => {
        return (
          <>
            <ElButton type="primary" link onClick={() => gatherFn(data.row)}>
              <ElTooltip content="采集" placement="top" enterable={false}>
                <Icon icon="svg-icon:data" />
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
// 高级搜索功能，接收从AdvancedSearch组件中传过来的数据
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
  await setTableSide(value)
}
//tableSide
const tabSideColumns = ref()
const activeNameS = ref()
const setTableSide = async (searchParams) => {
  const res = await statisticsApi(searchParams)
  if (res.data.list.length) {
    tabSideColumns.value = res.data.list.sort((a, b) => b.count - a.count)
    setActiveNameS(tabSideColumns.value[0].name)
  } else {
    tabSideColumns.value = []
    getList()
  }
}
const setActiveNameS = (name) => {
  activeNameS.value = name
  getList()
}
onMounted(async () => {
  await setTableSide(null)
})
//是否全选
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
const isExport = ref(false)
const fieldName = columns
  .map((i) => {
    return {
      label: i.label,
      value: i.field
    }
  })
  .slice(2, -1)
const exportFn = async () => {
  await getSelectedIds()
  if (ids.value.length || isCheckedAll.value) {
    isExport.value = true
  } else {
    ElMessage.warning('请选择需要导出的数据')
  }
}
//回溯
const isBacktrack = ref(false)
const backtrackData = ref()
const backtrackFn = async (data) => {
  const res = await backtrackApi({ id: data.dataID })
  backtrackData.value = res
  isBacktrack.value = true
}
// 查看网页信息
const isDrawerInfo = ref(false)
const titleDrawer = ref('')
const bodyInfo = ref([{}])
const openDrawerInfo = async (data) => {
  isDrawerInfo.value = true
  titleDrawer.value = '查看网页信息'
  bodyInfo.value = [
    {
      value: data.webInfo.request,
      name: '请求体'
    },
    {
      value: data.webInfo.response,
      name: '响应体'
    }
  ]
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
//数据源
const isDataSource = ref(false)
const dataSourceData = ref()
const dataSource = (data) => {
  isDataSource.value = true
  dataSourceData.value = data.dataSources
}
// 加入仿冒样本库
const router = useRouter()
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
//table-left-width
const tableLeftSpan = ref(3)
const changeSpan = (collapse: boolean) => {
  tableLeftSpan.value = collapse ? 1 : 3
}
</script>
<template>
  <AdvancedSearch
    :dataArray="['url', 'domain', 'ip', 'status', 'discoveryTime', 'victim', 'misReason']"
    :total="total"
    :title="'漏报数据管理'"
    tip-title="系统默认展示当天接入数据，最多可查看5年内数据，超出5年数据不会留存。"
    @search-data="searchTable"
  />
  <ContentWrap>
    <TableTop>
      <template #right>
        <ElButton type="default">
          <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
        </ElButton>
        <ElDropdown class="mx-12px" trigger="click">
          <ElButton type="default" :disabled="isCheckedAll"> 批量设置 </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem @click="gatherFn(null)">批量采集</ElDropdownItem>
              <ElDropdownItem @click="addCounterfeitFn(null)">加入仿冒样本库</ElDropdownItem>
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
          stripe
          row-key="dataID"
          :image-preview="['screenshot']"
          :reserve-selection="true"
          :columns="columns"
          :data="dataList"
          :loading="loading"
          :pagination="{
            total: total
          }"
          @register="tableRegister"
        />
      </ElCol>
    </ElRow>
  </ContentWrap>
  <DrawerInfo v-model:isDrawer="isDrawerInfo" :title="titleDrawer" :bodyInfo="bodyInfo" />
  <DataSource v-model:isDrawer="isDataSource" :dataSourceData="dataSourceData" />
  <ExportFile
    v-if="isExport"
    v-model:isDrawer="isExport"
    title="漏报数据管理"
    :fieldName="fieldName"
    :ids="ids"
    :conditions="{ ...searchData, victimType: activeNameS }"
    :total="total"
    :axiosFn="exportApi"
    @clear-selection="clearSelection"
    @is-checked-all="
      (temp) => {
        isCheckedAll = temp
      }
    "
  />
  <Backtrack v-model:isDrawer="isBacktrack" :title="'数据回溯'" :backtrackData="backtrackData" />
  <SelectData
    v-if="isSelectData"
    v-model:isDrawer="isSelectData"
    :title="'采集任务'"
    :data="selectData"
  />
</template>
<style scoped></style>
