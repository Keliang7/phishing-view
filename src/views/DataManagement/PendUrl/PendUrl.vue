<script setup lang="tsx">
import { ref, reactive, unref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import type { TabsPaneContext } from 'element-plus'
import { ElTabs, ElTabPane, ElButton, ElCheckbox } from 'element-plus'
import { Table, TableColumn, TableSlotDefault } from '@/components/Table'
import { getUrlBWListApi, getUrlDomainListApi } from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import DrawerInfo from '@/components/DrawerInfo/DrawerInfo.vue'
import DrawerOperate from '@/components/DrawerOperate/DrawerOperate.vue'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'

// 使用useI18n钩子函数获取国际化相关数据和方法
const { t } = useI18n()
// 使用useTable钩子函数获取table相关数据和方法
const { tableRegister, tableMethods, tableState } = useTable({
  // fetchDataApi方法用于异步获取表格数据
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getUrlBWListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize)
    })

    return {
      list: res.data.list,
      total: res.data.total
    }
  }
})
// 查看网页信息
const isDrawerInfo = ref(false)
const titleDrawer = ref('')
const requestBody = ref('')
const responseBody = ref('')

// 采集任务弹窗
const isDrawerOperate = ref(false)

// 获取tableState中的数据和方法
let { loading, total, dataList, currentPage, pageSize } = tableState
const { setProps } = tableMethods
// 定义表格切换器内容
const tabColumns = [
  {
    label: t('tableDemo.bwMonitor'),
    num: 2000000,
    name: 'bwMonitor'
  },
  {
    label: t('tableDemo.domainMonitor'),
    num: 2000000,
    name: 'domainMonitor'
  },
  {
    label: t('tableDemo.urlMonitor'),
    num: 2000000,
    name: 'urlMonitor'
  },
  {
    label: t('tableDemo.tlsMonitor'),
    num: 2000000,
    name: 'tlsMonitor'
  }
]
const activeName = ref(tabColumns[0].name)
// 定义分页器展示的内容
const layout = 'prev, pager, next, sizes, jumper'
// 定义columns变量，用于存储表格的列配置
let columns = reactive<TableColumn[]>([])
const BWColumns: TableColumn[] = [
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
    // 设置columns的值为一个包含列配置的数组
    setProps({
      columns: BWColumns
    })
  }, 0)
})

// 定义actionFn函数，用于处理点击action列时的操作
const gatherFn = (data: TableSlotDefault) => {
  console.log('添加任务', data)
  titleDrawer.value = '添加任务'
  isDrawerOperate.value = true
}
const openDrawerInfo = (data: TableSlotDefault) => {
  isDrawerInfo.value = true
  titleDrawer.value = '查看网页信息'
  requestBody.value = data.webInfo.request
  responseBody.value = data.webInfo.response
  console.log('查看网页信息', data.webInfo)
}
const handleClick = async (tab: TabsPaneContext) => {
  loading.value = true
  if (tab.props.name === 'bwMonitor') {
    setProps({
      columns: BWColumns
    })
    const res = await getUrlBWListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize)
    })
    dataList.value = res.data.list
    total.value = res.data.total
  } else if (tab.props.name === 'domainMonitor') {
    setProps({
      columns: DomainColumns
    })
    const res = await getUrlDomainListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize)
    })
    dataList.value = res.data.list
    total.value = res.data.total
  } else if (tab.props.name === 'urlMonitor') {
    setProps({
      columns: URLColumns
    })
  } else if (tab.props.name === 'tlsMonitor') {
    setProps({
      columns: TLSColumns
    })
  }
  loading.value = false
}
const checkedAll = ref(false)
// 定义canShowPagination变量，用于控制是否显示分页
const canShowPagination = ref(true)
const dataType = ref(1)
</script>
<template>
  <AdvancedSearch :dataType="dataType" />
  <ContentWrap :title="`${t('tableDemo.pendUrl')}(${total})`">
    <div class="table-btn">
      <ElButton type="default" click="">
        <ElCheckbox v-model="checkedAll" label="选择全部" size="large" />
      </ElButton>
      <ElButton type="default"> 批量采集 </ElButton>
      <ElButton type="primary"> <Icon icon="tdesign:upload" /> 导出数据 </ElButton>
    </div>
    <ElTabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <ElTabPane
        v-for="item in tabColumns"
        :key="item.name"
        :label="`${item.label}（${total}）`"
        :name="item.name"
      />
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
    </ElTabs>
  </ContentWrap>
  <DrawerInfo
    v-model:isDrawer="isDrawerInfo"
    :title="titleDrawer"
    :requestBody="requestBody"
    :responseBody="responseBody"
  />
  <DrawerOperate v-model:isDrawer="isDrawerOperate" :title="titleDrawer" />
</template>
<style lang="less">
.demo-tabs > .el-tabs__content {
  padding: 0px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 500;
}
.el-tabs__item {
  margin-bottom: 15px;
}
.el-tabs__nav-wrap {
  position: static;
}
.table-btn {
  float: right;
}
.el-pagination {
  float: right;
}
</style>
