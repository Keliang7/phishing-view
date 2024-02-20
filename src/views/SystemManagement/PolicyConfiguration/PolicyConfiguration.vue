<script setup lang="tsx">
import { ref, reactive, unref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElTabs, ElTabPane, ElButton, ElCheckbox } from 'element-plus'
import { Table, TableColumn, TableSlotDefault } from '@/components/Table'
import { getPolicyWhiteListApi } from '@/api/table'
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
    const { currentPage, pageSize } = tableState
    const res = await getPolicyWhiteListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...searchData.value
    })
    console.log('list:', res.data.list)

    return {
      list: res.data.list,
      total: res.data.total
    }
  }
})
const systemConstants = useSystemConstantsWithOut()
// 获取tableState中的数据和方法
let { loading, total, dataList, currentPage, pageSize } = tableState
const { setProps } = tableMethods
// 定义表格切换器内容
const tabColumns = [
  {
    label: t('tableDemo.whitelistManagement'),

    name: 'whitelistManagement'
  },
  {
    label: t('tableDemo.extensiveRuleManagement'),

    name: 'extensiveRuleManagement'
  },
  {
    label: t('tableDemo.policyConfiguration'),

    name: 'policyConfiguration'
  }
]
// 高级搜索的数据
const searchData = ref({})
const dataArray = ref(['ruleContent', 'addType', 'createdBy', 'createdTime', 'operate'])
const optionArray = ref({ systemAddType: systemConstants.whiteListFrom })

const activeName = ref(tabColumns[0].name)
// 定义分页器展示的内容
const layout = 'prev, pager, next, sizes,jumper,->, total'
// 定义columns变量，用于存储表格的列配置
let columns = reactive<TableColumn[]>([])
const whiteColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'ruleContent',
    label: t('tableDemo.ruleContent'),
    width: 250
  },
  {
    field: 'addType',
    label: t('tableDemo.addType'),
    width: 250
  },
  {
    field: 'createdBy',
    label: t('tableDemo.createdBy'),
    width: 250
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
    width: 150,
    slots: {
      default: (data) => {
        return (
          <div>
            <ElButton type="text" size="small" onClick={() => deleteFn(data)}>
              {t('tableDemo.delete')}
            </ElButton>
          </div>
        )
      }
    }
  }
]
const policyColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'dataSources',
    label: t('tableDemo.dataSources'),
    width: 240
  },
  {
    field: 'trustRank',
    label: t('tableDemo.trustRank'),
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
    width: 320,
    slots: {
      default: (data) => {
        return (
          <div>
            <ElButton type="text" size="small" onClick={() => viewFn(data)}>
              {t('tableDemo.view')}
            </ElButton>
            <ElButton type="text" size="small" onClick={() => editFn(data)}>
              {t('tableDemo.edit')}
            </ElButton>
            <ElButton type="text" size="small" onClick={() => stopFn(data)}>
              {t('tableDemo.stop')}
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
      columns: whiteColumns
    })
  }, 0)
})

// 定义表格内操作函数，用于处理点击表格列时的操作
const viewFn = (data: TableSlotDefault) => {
  console.log(data)
}
const editFn = (data: TableSlotDefault) => {
  console.log(data)
}
const stopFn = (data: TableSlotDefault) => {
  console.log(data)
}
const deleteFn = (data: TableSlotDefault) => {
  console.log(data)
}
const handleClick = async (tab) => {
  loading.value = true
  if (tab.props.name === 'whitelistManagement') {
    dataArray.value = ['ruleContent', 'addType', 'createdBy', 'createdTime', 'operate']
    setProps({
      columns: whiteColumns
    })
    const res = await getPolicyWhiteListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize)
    })
    dataList.value = res.data.list
    total.value = res.data.total
  } else if (tab.props.name === 'extensiveRuleManagement') {
    dataArray.value = ['ruleContent', 'addType', 'createdBy', 'createdTime', 'operate']
    setProps({
      columns: whiteColumns
    })
  } else if (tab.props.name === 'policyConfiguration') {
    dataArray.value = ['dataSources', 'createdBy', 'createdTime', 'operate']
    setProps({
      columns: policyColumns
    })
  }
  loading.value = false
}
const checkedAll = ref(false)
// 定义canShowPagination变量，用于控制是否显示分页
const canShowPagination = ref(true)
// 高级搜索功能，接收从AdvancedSearch组件中传过来的数据
const searchTable = async (value) => {
  searchData.value = value
  handleClick(activeName)
}
</script>
<template>
  <AdvancedSearch :dataArray="dataArray" :optionArray="optionArray" @search-data="searchTable" />
  <ContentWrap class="table-box">
    <div class="table-btn">
      <ElButton type="default">
        <ElCheckbox v-model="checkedAll" label="选择全部" size="large" />
      </ElButton>
      <ElButton type="default"> 批量删除 </ElButton>
      <ElButton type="primary"> 添加 </ElButton>

      <ElButton type="primary" v-show="activeName !== 'policyConfiguration'"> 导入数据 </ElButton>

      <ElButton type="primary" v-show="activeName !== 'policyConfiguration'">
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
  top: 20px;
  z-index: 999;
}
.el-pagination {
  float: right;
}
</style>
