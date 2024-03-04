<script setup lang="tsx">
import { ref, reactive, unref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import {
  ElTabs,
  ElTabPane,
  ElButton,
  ElCheckbox,
  ElMessageBox,
  ElMessage,
  ElInput
} from 'element-plus'
import { Table, TableColumn, TableSlotDefault } from '@/components/Table'
import { getUrlBWListApi, getUrlBWwebInfoApi, getUrlDomainListApi } from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import { useSystemConstantsWithOut } from '@/store/modules/systemConstant'
import DrawerInfo from '@/components/DrawerInfo/DrawerInfo.vue'
import DrawerOperate from '@/components/DrawerOperate/DrawerOperate.vue'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import { FormSchema } from '@/components/Form'
import { useValidator } from '@/hooks/web/useValidator'
import { BaseButton } from '@/components/Button'

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
// 获取tableState中的数据和方法
const { loading, total, dataList, currentPage, pageSize } = tableState
const { setProps, getElTableExpose } = tableMethods
// 查看网页信息
const isDrawerInfo = ref(false)
// 查看网页信息-弹窗标题
const titleDrawer = ref('')
// 查看网页信息-弹窗内容
const bodyInfo = ref([{}])
// 高级搜索的数据
const searchData = ref({})
// 表格是否全选
const checkedAll = ref(false)
// 定义canShowPagination变量，用于控制是否显示分页
const canShowPagination = ref(true)
// 该字段用来区别不同页面之间的高级搜索需要展示的内容
const dataArray = ref(['url', 'domain', 'ip', 'collectionStatus', 'discoveryTime', 'operate'])
const optionArray = ref({ collectionStatus: systemConstants.collectionStatus })
const tipTitle = ref('系统默认展示当天接入数据，最多可查看7天内数据，超出7天数据不会留存。')
// 操作任务弹窗
const isDrawerOperate = ref(false)

// 定义表格切换器内容
const tabColumns = [
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
// 表格切换器-默认高亮的tab选项
const activeName = ref(tabColumns[0].name)
// 定义分页器展示的内容
const layout = 'prev, pager, next, sizes,jumper,->, total'
// 定义columns变量，用于存储表格的列配置
let columns = reactive<TableColumn[]>([])
// BW监测子系统表头内容
const BWColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection',
    reserveSelection: true
  },
  {
    field: 'dataID',
    label: t('tableDemo.dataID'),
    width: 120
  },
  {
    field: 'ruleID',
    label: t('tableDemo.ruleID'),
    width: 120
  },
  {
    field: 'url',
    label: t('tableDemo.url'),
    width: 150
  },
  {
    field: 'domain',
    label: t('tableDemo.domain'),
    width: 130
  },
  {
    field: 'ipv4',
    label: t('tableDemo.ipv4'),
    width: 120
  },
  {
    field: 'ipv6',
    label: t('tableDemo.ipv6'),
    width: 180
  },
  {
    field: 'aimPort',
    label: t('tableDemo.aimPort'),
    width: 120
  },
  {
    field: 'discoveryTime',
    label: `${t('tableDemo.discoveryTime')}（进入系统时间）`,
    width: 200,
    formatter: (data) => formatTime(data.discoveryTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'featureMatchState',
    label: t('tableDemo.featureMatchState'),
    width: 120
  },
  {
    field: 'state',
    label: t('tableDemo.state'),
    width: 120
  },
  {
    field: 'gatherInfo',
    label: t('tableDemo.gatherInfo'),
    width: 120
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
    field: 'startTime',
    label: t('tableDemo.startTime'),
    width: 180,
    formatter: (data) => formatTime(data.startTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'endTime',
    label: t('tableDemo.endTime'),
    width: 180,
    formatter: (data) => formatTime(data.endTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    width: 120,
    slots: {
      default: (data) => {
        return (
          <ElButton type="text" size="small" onClick={() => gatherFn(data)}>
            {t('tableDemo.gather')}
          </ElButton>
        )
      }
    }
  }
]
// 域名监测子系统表头内容
const DomainColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'dataID',
    label: t('tableDemo.dataID'),
    width: 120
  },
  {
    field: 'domain',
    label: t('tableDemo.domain'),
    width: 130
  },
  {
    field: 'discoveryTime',
    label: `${t('tableDemo.discoveryTime')}（进入系统时间）`,
    width: 200,
    formatter: (data) => formatTime(data.discoveryTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'featureMatchState',
    label: t('tableDemo.featureMatchState'),
    width: 120
  },
  {
    field: 'state',
    label: t('tableDemo.state'),
    width: 120
  },
  {
    field: 'gatherInfo',
    label: t('tableDemo.gatherInfo'),
    width: 120
  },
  {
    field: 'startTime',
    label: t('tableDemo.startTime'),
    width: 180,
    formatter: (data) => formatTime(data.startTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'endTime',
    label: t('tableDemo.endTime'),
    width: 180,
    formatter: (data) => formatTime(data.startTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    width: 120,
    slots: {
      default: (data) => {
        return (
          <ElButton type="text" size="small" onClick={() => gatherFn(data)}>
            {t('tableDemo.gather')}
          </ElButton>
        )
      }
    }
  }
]
// URL日志子系统表头内容
const URLColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'dataID',
    label: t('tableDemo.dataID'),
    width: 120
  },
  {
    field: 'url',
    label: t('tableDemo.url'),
    width: 150
  },
  {
    field: 'domain',
    label: t('tableDemo.domain'),
    width: 130
  },
  {
    field: 'ipv4',
    label: t('tableDemo.ipv4'),
    width: 120
  },
  {
    field: 'ipv6',
    label: t('tableDemo.ipv6'),
    width: 180
  },
  {
    field: 'protocolType',
    label: t('tableDemo.protocolType'),
    width: 120
  },
  {
    field: 'aimPort',
    label: t('tableDemo.aimPort'),
    width: 120
  },
  {
    field: 'discoveryTime',
    label: `${t('tableDemo.discoveryTime')}（进入系统时间）`,
    width: 200,
    formatter: (data) => formatTime(data.discoveryTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'featureMatchState',
    label: t('tableDemo.featureMatchState'),
    width: 120
  },
  {
    field: 'state',
    label: t('tableDemo.state'),
    width: 120
  },
  {
    field: 'gatherInfo',
    label: t('tableDemo.gatherInfo'),
    width: 120
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
    field: 'startTime',
    label: t('tableDemo.startTime'),
    width: 180,
    formatter: (data) => formatTime(data.startTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'endTime',
    label: t('tableDemo.endTime'),
    width: 180,
    formatter: (data) => formatTime(data.endTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    width: 120,
    slots: {
      default: (data) => {
        return (
          <ElButton type="text" size="small" onClick={() => gatherFn(data)}>
            {t('tableDemo.gather')}
          </ElButton>
        )
      }
    }
  }
]
// TLS日志子系统表头内容
const TLSColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'dataID',
    label: t('tableDemo.dataID'),
    width: 120
  },
  {
    field: 'domain',
    label: t('tableDemo.domain'),
    width: 130
  },
  {
    field: 'ipv4',
    label: t('tableDemo.ipv4'),
    width: 120
  },
  {
    field: 'ipv6',
    label: t('tableDemo.ipv6'),
    width: 180
  },
  {
    field: 'protocolType',
    label: t('tableDemo.protocolType'),
    width: 120
  },
  {
    field: 'aimPort',
    label: t('tableDemo.aimPort'),
    width: 120
  },
  {
    field: 'discoveryTime',
    label: `${t('tableDemo.discoveryTime')}（进入系统时间）`,
    width: 200,
    formatter: (data) => formatTime(data.discoveryTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'featureMatchState',
    label: t('tableDemo.featureMatchState'),
    width: 120
  },
  {
    field: 'state',
    label: t('tableDemo.state'),
    width: 120
  },
  {
    field: 'gatherInfo',
    label: t('tableDemo.gatherInfo'),
    width: 120
  },
  {
    field: 'certInfo',
    label: t('tableDemo.certInfo'),
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
    field: 'startTime',
    label: t('tableDemo.startTime'),
    width: 180,
    formatter: (data) => formatTime(data.startTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'endTime',
    label: t('tableDemo.endTime'),
    width: 180,
    formatter: (data) => formatTime(data.endTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    width: 120,
    slots: {
      default: (data) => {
        return (
          <ElButton type="text" size="small" onClick={() => gatherFn(data)}>
            {t('tableDemo.gather')}
          </ElButton>
        )
      }
    }
  }
]

// 在页面加载完成后，设置columns的值
onMounted(() => {
  setTimeout(() => {
    // 设置页面初始表格为BW检测子系统列表
    setProps({
      columns: BWColumns
    })
  }, 0)
})

/**
 * 定义表格中的一些操作函数
 */
// 采集任务事件
const drawerData = ref<FormSchema[]>()
const { required } = useValidator()
let exploreAimBody = ref('')
let explorePlaceholder =
  '请输入IP、IP段，可支持多行，最多支持10000个目标\n支持格式如下：\n192.168.10.0-100\n192.168.1.2\n192.168.1.0/32'
const gatherFn = (data: TableSlotDefault) => {
  console.log('添加任务', data)
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
      field: 'explorePort',
      label: `${t('formDemo.explorePort')}：`,
      component: 'Input',
      componentProps: {
        type: 'textarea',
        placeholder: `请输入端口号\n支持输入多个端口进行探测“,”隔开\n最多输入300个端口`,
        rows: 8
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
// 表格查看信息事件
const openDrawerInfo = async (data: TableSlotDefault) => {
  console.log('查看网页信息', data.row.dataID)
  let res
  if (activeName.value == 'bw') {
    isDrawerInfo.value = true
    titleDrawer.value = '查看网页信息'
    res = await getUrlBWwebInfoApi(data.row.dataID)
    bodyInfo.value = [
      {
        value: res.data.webInfo.request,
        name: '请求体'
      },
      {
        value: res.data.webInfo.response,
        name: '响应体'
      }
    ]
  } else if (activeName.value == 'urlLog') {
    isDrawerInfo.value = true
    titleDrawer.value = '查看网页信息'
    res = await getUrlBWwebInfoApi(data.row.dataID)
    bodyInfo.value = [
      {
        value: res.data.webInfo.request,
        name: '请求体'
      },
      {
        value: res.data.webInfo.response,
        name: '响应体'
      }
    ]
  } else {
    isDrawerInfo.value = true
    titleDrawer.value = '查看证书信息'
    res = await getUrlBWwebInfoApi(data.row.dataID)
    bodyInfo.value = [
      {
        value: res.data.webInfo.request,
        name: '证书信息'
      }
    ]
  }
}
const getTableData = async (params) => {
  loading.value = true
  if (params === 'bw') {
    setProps({
      columns: BWColumns
    })
    const res = await getUrlBWListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...searchData.value
    })
    dataList.value = res.data.list
    total.value = res.data.total
  } else if (params === 'domainMonitor') {
    setProps({
      columns: DomainColumns
    })
    const res = await getUrlDomainListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...searchData.value
    })
    dataList.value = res.data.list
    total.value = res.data.total
  } else if (params === 'urlLog') {
    setProps({
      columns: URLColumns
    })
  } else if (params === 'tlsLog') {
    setProps({
      columns: TLSColumns
    })
  }
  loading.value = false
  return {
    list: dataList.value,
    total: total.value
  }
}
// 表格切换器的点击事件
const handleClick = async (tab) => {
  currentPage.value = 1
  pageSize.value = 10
  await getTableData(tab.props.name)
}
// 高级搜索功能，接收从AdvancedSearch组件中传过来的数据
const searchTable = async (value) => {
  searchData.value = value
  currentPage.value = 1
  pageSize.value = 10
  await getTableData(activeName.value)
}

// 选择全部
const toggleSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.toggleAllSelection()
  console.log(elTableRef)
  console.log(tableState.dataList)
}
// 导出多选数据
const getSelections = async () => {
  const elTableRef = await getElTableExpose()
  const selections = elTableRef?.getSelectionRows()
  console.log(selections)
}
const getRowKeys = (row: any) => {
  return row.id
}
// const handleSelectionChange = (data) => {
//   console.log(data)
// }
</script>
<template>
  <AdvancedSearch
    :dataArray="dataArray"
    :optionArray="optionArray"
    :tipTitle="tipTitle"
    @search-data="searchTable"
  />
  <ContentWrap class="table-box" :title="t('tableDemo.pendUrl')">
    <div class="table-btn">
      <ElButton type="default" @click="toggleSelection()">
        <ElCheckbox v-model="checkedAll" label="选择全部" size="large" />
      </ElButton>
      <ElButton type="default"> 批量采集 </ElButton>
      <ElButton type="primary" @click="getSelections()">
        <Icon icon="tdesign:upload" /> 导出数据
      </ElButton>
    </div>
    <ElTabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <ElTabPane
        v-for="item in tabColumns"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      />
      <Table
        v-model:pageSize="pageSize"
        v-model:currentPage="currentPage"
        ref="multipleTableRef"
        stripe
        :keys="getRowKeys"
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
      />
    </ElTabs>
  </ContentWrap>
  <DrawerInfo v-model:isDrawer="isDrawerInfo" :title="titleDrawer" :bodyInfo="bodyInfo" />
  <DrawerOperate
    v-if="true"
    :drawerData="drawerData"
    v-model:isDrawer="isDrawerOperate"
    :title="titleDrawer"
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
