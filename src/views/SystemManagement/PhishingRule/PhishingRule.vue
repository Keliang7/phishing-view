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
const tabColumns = [
  {
    label: t('tableDemo.whitelistManagement'),
    num: 2000000,
    name: 'whitelistManagement'
  },
  {
    label: t('tableDemo.extensiveRuleManagement'),
    num: 2000000,
    name: 'extensiveRuleManagement'
  },
  {
    label: t('tableDemo.policyConfiguration'),
    num: 2000000,
    name: 'policyConfiguration'
  }
]
const activeName = ref(tabColumns[0].name)
// 定义分页器展示的内容
const layout = 'prev, pager, next, sizes, jumper'
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
    width: 240
  },
  {
    field: 'addType',
    label: t('tableDemo.addType'),
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
const handleClick = async (tab: TabsPaneContext) => {
  loading.value = true
  if (tab.props.name === 'whitelistManagement') {
    dataType.value = 8

    setProps({
      columns: whiteColumns
    })
    const res = await getUrlBWListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize)
    })
    dataList.value = res.data.list
    total.value = res.data.total
  } else if (tab.props.name === 'extensiveRuleManagement') {
    dataType.value = 8
    setProps({
      columns: whiteColumns
    })
    const res = await getUrlDomainListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize)
    })
    dataList.value = res.data.list
    total.value = res.data.total
  } else if (tab.props.name === 'policyConfiguration') {
    dataType.value = 9
    setProps({
      columns: policyColumns
    })
  }
  loading.value = false
}
const checkedAll = ref(false)
// 定义canShowPagination变量，用于控制是否显示分页
const canShowPagination = ref(true)
const dataType = ref(8)
</script>
<template>
  <AdvancedSearch :dataType="dataType" :isTip="false" />
  <ContentWrap>
    <div class="table-btn">
      <ElButton type="default">
        <ElCheckbox v-model="checkedAll" label="选择全部" size="large" />
      </ElButton>
      <ElButton type="default"> 批量删除 </ElButton>
      <ElButton type="primary"> 添加 </ElButton>

      <ElButton type="primary" v-show="dataType === 8"> 导入数据 </ElButton>

      <ElButton type="primary" v-show="dataType === 8">
        <Icon icon="tdesign:upload" /> 导出数据
      </ElButton>
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
