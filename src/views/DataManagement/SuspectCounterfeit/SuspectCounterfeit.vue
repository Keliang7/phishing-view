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
    console.log('list:', res.data.list)

    return {
      list: res.data.list,
      total: res.data.total
    }
  }
})
// 获取tableState中的数据和方法
let { loading, total, dataList, currentPage, pageSize } = tableState
const { setProps } = tableMethods
// 定义表格切换器内容
const tabHeadColumns = [
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
const tabSideColumns = [
  {
    label: t('tableDemo.pubSecurityDepart'),
    num: 2000000,
    name: 'pubSecurityDepart'
  },
  {
    label: t('tableDemo.taxDepart'),
    num: 2000000,
    name: 'taxDepart'
  },
  {
    label: t('tableDemo.finance'),
    num: 2000000,
    name: 'finance'
  },
  {
    label: t('tableDemo.security'),
    num: 2000000,
    name: 'security'
  },
  {
    label: t('tableDemo.stateOwnEnterprise'),
    num: 2000000,
    name: 'stateOwnEnterprise'
  },
  {
    label: t('tableDemo.university'),
    num: 2000000,
    name: 'university'
  },
  {
    label: t('tableDemo.eCommerce'),
    num: 2000000,
    name: 'eCommerce'
  }
]
const activeNameH = ref(tabHeadColumns[0].name)
const activeNameS = ref(tabSideColumns[0].name)

// 定义分页器展示的内容
const layout = 'prev, pager, next, sizes, jumper'
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
    width: 120
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
    field: 'intention',
    label: t('tableDemo.intention'),
    width: 130
  },
  {
    field: 'victimType',
    label: t('tableDemo.victimType'),
    width: 130
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
    field: 'featureMatch',
    label: t('tableDemo.featureMatch'),
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
    field: 'webInfo',
    label: t('tableDemo.webInfo'),
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
    field: 'updateTime',
    label: t('tableDemo.updateTime'),
    width: 180,
    formatter: (data) => formatTime(data.updateTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'updateState',
    label: t('tableDemo.updateState'),
    width: 120
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
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    width: 250,
    slots: {
      default: (data) => {
        return (
          <div>
            <ElButton type="text" size="small" onClick={() => updateFn(data)}>
              {t('tableDemo.update')}
            </ElButton>
            <ElButton type="text" size="small" onClick={() => gatherFn(data)}>
              {t('tableDemo.gather')}
            </ElButton>
            <ElButton type="text" size="small" onClick={() => pushFn(data)}>
              {t('tableDemo.push')}
            </ElButton>
            <ElButton type="text" size="small" onClick={() => extensionFn(data)}>
              {t('tableDemo.extension')}
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
      columns: Columns
    })
  }, 0)
})

// 定义表格内操作函数，用于处理点击表格列时的操作
const updateFn = (data: TableSlotDefault) => {
  console.log(data)
}
const gatherFn = (data: TableSlotDefault) => {
  console.log(data)
}
const pushFn = (data: TableSlotDefault) => {
  console.log(data)
}
const extensionFn = (data: TableSlotDefault) => {
  console.log(data)
}
const handleClick = async (tab: TabsPaneContext) => {
  loading.value = true
  if (tab.props.name === 'bwMonitor') {
    const res = await getUrlBWListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize)
    })
    dataList.value = res.data.list
    total.value = res.data.total
  } else if (tab.props.name === 'domainMonitor') {
    const res = await getUrlDomainListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize)
    })
    dataList.value = res.data.list
    total.value = res.data.total
  } else if (tab.props.name === 'urlMonitor') {
  } else if (tab.props.name === 'tlsMonitor') {
  }
  loading.value = false
}
const checkedAll = ref(false)
// 定义canShowPagination变量，用于控制是否显示分页
const canShowPagination = ref(true)
const dataType = ref(2)
</script>
<template>
  <AdvancedSearch :dataType="dataType" />
  <ContentWrap :title="`${t('tableDemo.pendUrl')}(${total})`">
    <div class="table-btn">
      <ElButton type="default">
        <ElCheckbox v-model="checkedAll" label="选择全部" size="large" />
      </ElButton>
      <ElButton type="default"> 批量设置 </ElButton>
      <ElButton type="primary"> 推送参数配置 </ElButton>
      <ElButton type="primary"> <Icon icon="tdesign:upload" /> 导出数据 </ElButton>
    </div>
    <ElTabs v-model="activeNameH" class="demo-tabs" @tab-click="handleClick">
      <ElTabPane
        v-for="tabHead in tabHeadColumns"
        :key="tabHead.name"
        :label="`${tabHead.label}（${total}）`"
        :name="tabHead.name"
      />
      <ElTabs
        v-model="activeNameS"
        type="card"
        tab-position="left"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <ElTabPane
          v-for="tabSide in tabSideColumns"
          :key="tabSide.name"
          :label="`${tabSide.label}（${total}）`"
          :name="tabSide.name"
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
