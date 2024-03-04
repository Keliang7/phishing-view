<script setup lang="tsx">
import { ref, reactive, unref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElCheckbox } from 'element-plus'
import { Table, TableColumn, TableSlotDefault } from '@/components/Table'
import { getPolicyWhiteListApi } from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import DrawerInfo from '@/components/DrawerInfo/DrawerInfo.vue'
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
    return {
      list: res.data.list,
      total: res.data.total
    }
  }
})
const systemConstants = useSystemConstantsWithOut()
// 获取tableState中的数据和方法
let { loading, total, dataList, currentPage, pageSize } = tableState
const { setProps, getList, getElTableExpose } = tableMethods
// 页面主标题
const title = ref('白名单管理')

// 高级搜索的数据
const searchData = ref({})
const dataArray = ref(['ruleContent', 'addType', 'createdBy', 'createdTime', 'operate'])
const optionArray = ref({ systemAddType: systemConstants.whiteListFrom })

// 右侧弹窗信息
const isDrawerInfo = ref(false)
// 右侧弹窗信息-弹窗标题
const titleDrawer = ref('')
// 弹窗信息-弹窗内容
const bodyInfo = ref([{}])

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
    field: 'matchNum',
    label: t('tableDemo.matchNum'),
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
// 在页面加载完成后，设置columns的值
onMounted(() => {
  setTimeout(() => {
    // 设置columns的值为一个包含列配置的数组
    setProps({
      columns: whiteColumns
    })
  }, 0)
})

const deleteFn = (data: TableSlotDefault) => {
  console.log(data)
}
const checkedAll = ref(false)
const dataIDs = ref(new Set())
const placeholderInfo = ref('')
// 表格多选数据
const selectedData = ref<TableColumn[]>([])
// 定义canShowPagination变量，用于控制是否显示分页
const canShowPagination = ref(true)
// 高级搜索功能，接收从AdvancedSearch组件中传过来的数据
const searchTable = async (value) => {
  searchData.value = value
  await getList()
}
const getRowKeys = (row): string => {
  dataIDs.value.add(row)
  return row.dataID
}

// 选择全部
const toggleSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.toggleAllSelection()
  const res = await getPolicyWhiteListApi({
    ...searchData.value
  })
  selectedData.value = res.data.list.slice(unref(pageSize), res.data.total + 1)

  if (checkedAll.value) {
    // if (selectedData.value) {
    //   selectedData.value.forEach((item) => {
    //     elTableRef?.toggleRowSelection(item, true)
    //   })
    // }
  } else {
    elTableRef?.clearSelection()
  }
}

const handleSelectionChange = async (val) => {
  console.log('选项变化')
  selectedData.value = val
  console.log(selectedData.value, val, 'val')
}

// 导出多选数据
const getSelections = async () => {
  console.log('导出多选数据')
  const elTableRef = await getElTableExpose()
  const selections = elTableRef?.getSelectionRows()
  console.log(selections, selectedData.value)
}

// 添加
const addWhiteList = async () => {
  console.log('添加')
  isDrawerInfo.value = true
  placeholderInfo.value =
    '请输入确认非仿冒网站的域名，匹配成功将不会入库。\n一行一个域名，可输入多行，最多输入1000行。'
  titleDrawer.value = '添加白名单'
  bodyInfo.value = [
    {
      name: '输入规则内容'
    }
  ]
}
</script>
<template>
  <AdvancedSearch :dataArray="dataArray" :optionArray="optionArray" @search-data="searchTable" />
  <ContentWrap :title="title" class="table-box">
    <div class="table-btn">
      <ElButton type="default" @click="toggleSelection()">
        <ElCheckbox v-model="checkedAll" label="选择全部" size="large" />
      </ElButton>
      <ElButton type="default"> 批量删除 </ElButton>
      <ElButton type="primary" @click="addWhiteList()"> 添加 </ElButton>

      <ElButton type="primary"> 导入数据 </ElButton>

      <ElButton type="primary" @click="getSelections()">
        <Icon icon="tdesign:upload" /> 导出数据
      </ElButton>
    </div>
    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      stripe
      :rowKey="getRowKeys"
      :reserveSelection="true"
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
      @selection-change="handleSelectionChange"
    />
  </ContentWrap>
  <DrawerInfo
    v-model:isDrawer="isDrawerInfo"
    :title="titleDrawer"
    :bodyInfo="bodyInfo"
    :placeholder="placeholderInfo"
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
  top: 20px;
  z-index: 999;
}
.el-pagination {
  float: right;
}
</style>
