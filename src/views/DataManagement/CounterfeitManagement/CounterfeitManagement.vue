<script setup lang="tsx">
import { ref, reactive, unref, onMounted, watch, h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import {
  ElTabs,
  ElInput,
  ElTabPane,
  ElButton,
  ElCheckbox,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import { Icon } from '@/components/Icon'
import { FormSchema } from '@/components/Form'
import { BaseButton } from '@/components/Button'
import { useValidator } from '@/hooks/web/useValidator'
import { Table, TableColumn, TableSlotDefault } from '@/components/Table'
import { getSuspectCounterfeitApi, getInjuredPartyApi } from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import { TabSideColumns } from '../types/index'
import DrawerInfo from '@/components/DrawerInfo/DrawerInfo.vue'
import DrawerOperate from '@/components/DrawerOperate/DrawerOperate.vue'
import DrawerTimeLine from '@/components/DrawerTimeLine/DrawerTimeLine.vue'
import { useSystemConstantsWithOut } from '@/store/modules/systemConstant'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import router from '@/router'

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
            {`${data.row.dataSources?.length}个`}
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
    width: 250,
    slots: {
      default: (data) => {
        return (
          <div class="action-btn">
            <ElButton type="text" size="small" onClick={() => gatherFn(data)}>
              {t('tableDemo.gather')}
            </ElButton>
            <ElButton type="text" size="small" onClick={() => extensionFn(data)}>
              {t('tableDemo.extension')}
            </ElButton>
            <ElButton type="text" size="small" onClick={() => recallFn(data)}>
              {t('tableDemo.recall')}
            </ElButton>
            <ElButton type="text" size="small" onClick={() => addCounterfeitFn(data)}>
              {t('tableDemo.addCounterfeitSample')}
            </ElButton>
          </div>
        )
      }
    }
  }
]
const checkedAll = ref(false)
// 定义canShowPagination变量，用于控制是否显示分页
const canShowPagination = ref(true)
const dataArray = ref(['url', 'domain', 'ip', 'status', 'victim', 'victimType', 'discoveryTime'])
const tipTitle = ref('系统默认展示当天接入数据，最多可查看5年内数据，超出5年数据不会留存。')
const optionArray = ref({ expandStatus: systemConstants.expandStatus })

// 右侧弹窗信息
const isDrawerInfo = ref(false)
const isDrawerTimeLine = ref(false)
// 右侧弹窗信息-弹窗标题
const titleDrawer = ref('')
// 查看网页信息-弹窗内容
const bodyInfo = ref([{}])
// 查看回溯信息-弹窗内容
const dataSourceInfo = ref([{}])
// 表格多选数据
const selectedData = ref<TableColumn[]>([])

// 高级搜索功能，接收从AdvancedSearch组件中传过来的数据
const searchTable = async (value) => {
  searchData.value = value
  await getTableData([activeNameH.value, activeNameS.value])
}
// 任务弹窗
const isDrawerOperate = ref(false)
// 任务弹窗表单数据
const drawerData = ref<FormSchema[]>()
const { required } = useValidator()
let exploreAimBody = ref('')
let inputAimBody = ref('')
const explorePlaceholder =
  '请输入IP、IP段，可支持多行，最多支持10000个目标\n支持格式如下：\n192.168.10.0-100\n192.168.1.2\n192.168.1.0/32'
const inputPlaceholder = '请输入目标，1行1个目标，最多上传1万个目标，多余将会被丢弃。'
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
// 获取侧边栏数据
const getInjuredParty = async (params: any) => {
  const res = await getInjuredPartyApi(params)
  tabSideColumns.value = res.data.list
  activeNameS.value = tabSideColumns.value[0].victimName
  console.log(tabSideColumns, 111)
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
  // ElMessageBox.confirm('特征提取成功', '提示', {
  //   type: 'warning',
  //   icon: markRaw(ep:success-filled)
  // })
}
const gatherFn = (data: any) => {
  console.log('采集任务', data)
  titleDrawer.value = '添加任务'
  isDrawerOperate.value = true
  drawerData.value = [
    {
      field: 'taskName',
      label: `${t('formDemo.taskName')}：`,
      component: 'Input',
      componentProps: {
        placeholder: '请输入任务名称'
      },
      formItemProps: {
        rules: [required()]
      }
    },
    {
      field: 'exploreType',
      label: `${t('formDemo.exploreType')}：`,
      component: 'Select',
      value: '1',
      componentProps: {
        options: [
          {
            label: '资产探测（可探测title、FID、IP等信息）',
            value: '1'
          },
          {
            label: '网站探测（可探测网站截图）',
            value: '2'
          },
          {
            label: '域名探测（可探测WHOIS、网站备案信息）',
            value: '3'
          }
        ]
      },
      formItemProps: {
        rules: [required()]
      }
    },
    {
      field: 'exploreContent',
      label: `${t('formDemo.exploreContent')}：`,
      component: 'CheckboxGroup',
      componentProps: {
        options: [
          {
            label: '完整资产探测',
            value: '1',
            checked: true
          }
        ]
      },
      formItemProps: {
        rules: [required()]
      }
    },
    {
      field: 'exploreAim',
      label: `${t('formDemo.exploreAim')}：`,
      component: 'Upload',
      componentProps: {
        limit: 1,
        // action: 'http://172.16.20.30:32080',
        multiple: true,
        onPreview: (uploadFile) => {
          console.log(uploadFile)
        },
        onRemove: (file) => {
          console.log(file)
        },
        beforeRemove: (uploadFile) => {
          return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
            () => true,
            () => false
          )
        },
        onExceed: (files, uploadFiles) => {
          ElMessage.warning(
            `The limit is 1, you selected ${files.length} files this time, add up to ${
              files.length + uploadFiles.length
            } totally`
          )
        },
        slots: {
          trigger: () => <BaseButton type="primary">点击上传</BaseButton>,
          default: () => (
            <div class="el-upload__tip">
              <p>
                支持上传.xlsx、.xls、.txt、.xml、.json、.csv文件，最大上传文件为1M <a>下载模板</a>
              </p>
              <p class="attention">
                注意：目标地址添加方式为文件上传时，系统调度策略默认按IP拆分。
              </p>
              <ElInput
                v-model={exploreAimBody.value}
                type="textarea"
                autosize={{ minRows: 8, maxRows: 16 }}
                resize="none"
                placeholder={explorePlaceholder}
              />
            </div>
          )
        }
      },
      formItemProps: {
        rules: [required()]
      }
    },
    {
      field: 'priority',
      label: `${t('formDemo.priority')}：`,
      component: 'Select',
      value: '3',
      componentProps: {
        options: [
          {
            label: '紧急',
            value: '1'
          },
          {
            label: '高',
            value: '2'
          },
          {
            label: '中',
            value: '3'
          },
          {
            label: '低',
            value: '4'
          }
        ]
      },
      formItemProps: {
        rules: [required()]
      }
    }
  ]
}
const recallFn = (data: TableSlotDefault) => {
  console.log(data)
  isDrawerTimeLine.value = true
  titleDrawer.value = '数据源'
  console.log(data.column.property)
  bodyInfo.value = []
  dataSourceInfo.value = data.row.dataSources.map((item) => ({
    source: sourceMap[item.source],
    timestamp: formatTime(item.timestamp, 'yyyy-MM-dd HH:mm:ss')
  }))
}
const extensionFn = (data: any) => {
  console.log('创建任务', data)
  titleDrawer.value = '创建任务'
  isDrawerOperate.value = true
  drawerData.value = [
    {
      field: 'taskName',
      label: `${t('formDemo.taskName')}：`,
      component: 'Input',
      componentProps: {
        placeholder: '请输入任务名称'
      },
      formItemProps: {
        rules: [required()]
      }
    },
    {
      field: 'exploreType',
      label: `${t('formDemo.exploreType')}：`,
      component: 'CheckboxGroup',
      componentProps: {
        options: [
          {
            label: 'FID',
            value: '1',
            checked: true
          },
          {
            label: 'title',
            value: '2'
          },
          {
            label: '根域',
            value: '3'
          },
          {
            label: 'C段扩展',
            value: '4'
          },
          {
            label: 'ICON',
            value: '5'
          }
        ]
      },
      formItemProps: {
        rules: [required()]
      }
    },
    {
      field: 'extensionResultStatus',
      label: `${t('formDemo.extensionResultStatus')}：`,
      component: 'Select',
      value: '2',
      componentProps: {
        options: [
          {
            label: '全部',
            value: '1'
          },
          {
            label: '存活',
            value: '2'
          },
          {
            label: '离线',
            value: '3'
          }
        ]
      },
      formItemProps: {
        rules: [required()]
      }
    },
    {
      field: 'extensionResultTime',
      label: `${t('formDemo.extensionResultTime')}：`,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        startPlaceholder: t('common.startTimeText'),
        endPlaceholder: t('common.endTimeText')
      }
    },
    {
      field: 'inputAim',
      label: `${t('formDemo.inputAim')}：`,
      component: 'Upload',
      componentProps: {
        limit: 1,
        // action: 'http://172.16.20.30:32080',
        multiple: true,
        onPreview: (uploadFile) => {
          console.log('onPreview出问题了？')
          console.log(uploadFile)
        },
        onRemove: (file) => {
          console.log('onRemove出问题了？')
          console.log(file)
        },
        beforeRemove: (uploadFile) => {
          console.log('beforeRemove出问题了？')
          return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
            () => true,
            () => false
          )
        },
        onExceed: (files, uploadFiles) => {
          console.log('onExceed出问题了？')
          ElMessage.warning(
            `The limit is 1, you selected ${files.length} files this time, add up to ${
              files.length + uploadFiles.length
            } totally`
          )
        },
        slots: {
          trigger: () => <BaseButton type="primary">点击上传</BaseButton>,
          default: () => (
            <div class="el-upload__tip">
              <p class="attention">
                支持上传.txt、.csv文件，最大上传文件为1M <a>下载模板</a>
              </p>
              <ElInput
                v-model={inputAimBody.value}
                type="textarea"
                autosize={{ minRows: 8, maxRows: 16 }}
                resize="none"
                placeholder={inputPlaceholder}
              />
            </div>
          )
        }
      },
      formItemProps: {
        rules: [required()]
      }
    }
  ]
}

// 表格查看信息事件
const openDrawerInfo = async (data: TableSlotDefault) => {
  if (data.column.property == 'dataSourcesNum') {
    isDrawerTimeLine.value = true
    titleDrawer.value = '数据源'
    console.log(data.column.property)
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
  dataArray.value = ['url', 'domain', 'ip', 'expandStatus', 'victim', 'discoveryTime', 'operate']
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
const toggleSelection = async () => {
  console.log('选择全部')
  const elTableRef = await getElTableExpose()
  elTableRef?.toggleAllSelection()
  const res = await getSuspectCounterfeitApi({
    originType: activeNameH.value,
    victimType: activeNameS.value,
    ...searchData.value
  })
  selectedData.value = res.data.list.slice(unref(pageSize), res.data.total + 1)
  console.log(selectedData.value, dataList.value, 123455)

  if (checkedAll.value) {
    if (selectedData.value) {
      selectedData.value.forEach((item) => {
        elTableRef?.toggleRowSelection(item, true)
      })
    }
  } else {
    elTableRef?.clearSelection()
  }
}
// 导出多选数据
const getSelections = async () => {
  console.log('导出多选数据')
  const elTableRef = await getElTableExpose()
  const selections = elTableRef?.getSelectionRows()
  console.log(selections, selectedData.value)
}

const dataIDs = ref(new Set())
const getRowKeys = (row): string => {
  // console.log(row, 'row2222222')
  dataIDs.value.add(row)
  return row.dataID
}
const handleSelectionChange = async (val) => {
  console.log('选项变化')
  selectedData.value = val
  console.log(selectedData.value, val, 'val')
}
</script>
<template>
  <AdvancedSearch
    :dataArray="dataArray"
    :optionArray="optionArray"
    :tipTitle="tipTitle"
    @search-data="searchTable"
  />
  <ContentWrap class="table-box" :title="t('tableDemo.CounterfeitManagement')">
    <div class="table-btn">
      <ElButton type="default" @click="toggleSelection()">
        <ElCheckbox v-model="checkedAll" label="选择全部" size="large" />
      </ElButton>
      <ElDropdown>
        <ElButton type="default"> 批量设置 </ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem @click="gatherFn(selectedData)">{{
              t('tableDemo.gather')
            }}</ElDropdownItem>
            <ElDropdownItem @click="extensionFn(selectedData)">{{
              t('tableDemo.extension')
            }}</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <ElButton type="primary" @click="getSelections()">
        <Icon icon="tdesign:upload" /> 导出数据
      </ElButton>
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
          :rowKey="getRowKeys"
          :reserveSelection="true"
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
          @selection-change="handleSelectionChange"
        />
      </ElTabs>
    </ElTabs>
  </ContentWrap>
  <DrawerInfo v-model:isDrawer="isDrawerInfo" :title="titleDrawer" :bodyInfo="bodyInfo" />
  <DrawerTimeLine
    v-model:isDrawer="isDrawerTimeLine"
    :title="titleDrawer"
    :dataSourceInfo="dataSourceInfo"
  />
  <!-- 添加v-if的原因是：为了确保每次打开弹窗都重新渲染了一遍，不受上次打开弹窗的影响 -->
  <DrawerOperate
    v-if="isDrawerOperate"
    v-model:isDrawer="isDrawerOperate"
    :title="titleDrawer"
    :drawerData="drawerData"
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
  button {
    margin: 0 5px;
  }
  .example-showcase .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
}
.el-pagination {
  float: right;
}
/deep/.action-btn .el-button--small {
  padding: 0;
}
</style>