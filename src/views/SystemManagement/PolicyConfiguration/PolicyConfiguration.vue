<script setup lang="tsx">
import { ref, reactive, unref, onMounted, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElCheckbox, ElMessageBox, ElMessage } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { getPolicyWhiteListApi, deleteWhiteListApi, getDataApi } from '@/api/systemManagement'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import AddData from './PolicyComponent/AddData.vue'
import UploadFile from './PolicyComponent/UploadFile.vue'
import { useSystemConstantsWithOut } from '@/store/modules/systemConstant'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import ExportFile from '@/components/ExportFile/ExportFile.vue'

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
  },
  fetchDelApi: async () => {
    const res = await deleteWhiteListApi({ rules: unref(ids) })
    return !!res
  }
})
const systemConstants = useSystemConstantsWithOut()
// 获取tableState中的数据和方法
let { loading, total, dataList, currentPage, pageSize } = tableState
const { setProps, getList, getElTableExpose, delList } = tableMethods
// 页面主标题
const title = ref('白名单管理')

// 高级搜索的数据
const searchData = ref({})
const dataArray = ref(['ruleContent', 'addType', 'createdBy', 'createdTime'])
const optionArray = ref({ systemAddType: systemConstants.whiteListFrom })

// 定义columns变量，用于存储表格的列配置
let columns = reactive<TableColumn[]>([])
//是否全选
const isCheckedAll = ref(false)
const whiteColumns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'ruleContent',
    label: t('tableDemo.ruleContent')
  },
  {
    field: 'matchNum',
    label: t('tableDemo.matchNum')
  },
  {
    field: 'addType',
    label: t('tableDemo.addType')
  },
  {
    field: 'createdBy',
    label: t('tableDemo.createdBy')
  },
  {
    field: 'createdTime',
    label: t('tableDemo.createdTime'),
    formatter: (data) => formatTime(data.createdTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    slots: {
      default: (data) => {
        return (
          <div>
            <ElButton type="danger" size="small" onClick={() => delData(data)}>
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
  // 设置columns的值为一个包含列配置的数组
  setProps({
    columns: whiteColumns
  })
})

//删除
const ids = ref<string[]>([])
const delLoading = ref(false)
const delData = async (data) => {
  const elTableExpose = await getElTableExpose()
  ids.value = data
    ? [data.row.ruleContent]
    : elTableExpose?.getSelectionRows().map((v) => v.ruleContent) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}
//批量删除
const deleteAllFn = async () => {
  const temp = cancelData.value
  if (isCheckedAll.value) {
    ElMessageBox.confirm(t('common.delMessage'), t('common.delWarning'), {
      confirmButtonText: t('common.delOk'),
      cancelButtonText: t('common.delCancel'),
      type: 'warning'
    }).then(async () => {
      const res = await deleteWhiteListApi({ isCheckedAll: true, temp })
      if (res) {
        ElMessage.success(t('common.delSuccess'))
        isCheckedAll.value = false
        toggleSelection()
        getList()
      }
    })
  } else {
    delData(null)
  }
}

const placeholderInfo = ref('')
// 选择全部
const selectedData = ref<TableColumn[]>([])
const temp = ref<any[]>([])
const cancelData = ref<any[]>([])
const toggleSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.toggleAllSelection()
}
const handleSelectionChange = (selected: any[]) => {
  selectedData.value = selected.map((i) => i.ruleContent)
  if (temp.value.length > selectedData.value.length) {
    cancelData.value = temp.value.filter((i) => !selectedData.value.includes(i))
    console.log(cancelData.value)
  }
}
watch(dataList, (newV) => {
  temp.value.push(...newV.map((i) => i.ruleContent))
  temp.value = [...new Set(temp.value)]
  if (isCheckedAll.value && !newV.some((i) => selectedData.value.includes(i.ruleContent))) {
    toggleSelection()
  }
})
const clearSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.clearSelection()
}
watch(isCheckedAll, () => {
  if (isCheckedAll.value) {
    toggleSelection()
  } else {
    clearSelection()
  }
})

// 高级搜索功能，接收从AdvancedSearch组件中传过来的数据
const searchTable = async (value) => {
  searchData.value = value
  await getList()
}
// 添加

const titleDrawer = ref('')
const isDrawerAddData = ref(false)
// const isDrawerGetData = ref(false)
const isDrawerUploadFile = ref(false)
const addWhiteList = async () => {
  titleDrawer.value = '添加白名单'
  isDrawerAddData.value = true
  placeholderInfo.value =
    '请输入确认非仿冒网站的域名，匹配成功将不会入库。\n一行一个域名，可输入多行，最多输入1000行。'
}
//导出数据
const initExportDate = ref({})
const getSelections = () => {
  if (isCheckedAll.value) {
    initExportDate.value = {
      count: unref(total) - cancelData.value.length,
      exportDate: {
        exportAll: isCheckedAll.value,
        arrayNot: cancelData.value
      }
    }
  } else {
    initExportDate.value = {
      count: selectedData.value.length,
      exportDate: {
        exportAll: isCheckedAll.value,
        ruleContents: selectedData.value
      }
    }
  }
  titleDrawer.value = '导出数据'
  isDrawerExportFile.value = true
}
//上传文件
const uploadFile = () => {
  titleDrawer.value = '上传文件'
  isDrawerUploadFile.value = true
}
// 定义canShowPagination变量，用于控制是否显示分页
const canShowPagination = ref(true)

const isDrawerExportFile = ref(false)
</script>
<template>
  <AdvancedSearch :dataArray="dataArray" :optionArray="optionArray" @search-data="searchTable" />
  <ContentWrap :title="title" class="table-box">
    <div class="table-btn">
      <ElButton type="default">
        <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
      </ElButton>
      <ElButton type="default" @click="deleteAllFn"> 批量删除 </ElButton>
      <ElButton type="primary" @click="addWhiteList"> 添加 </ElButton>

      <ElButton type="primary" @click="uploadFile"> 导入数据 </ElButton>

      <ElButton type="primary" @click="getSelections">
        <Icon icon="tdesign:upload" /> 导出数据
      </ElButton>
    </div>
    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      stripe
      row-key="ruleContent"
      :reserve-selection="true"
      :columns="columns"
      :data="dataList"
      :loading="loading"
      :pagination="
        canShowPagination
          ? {
              total: total
            }
          : undefined
      "
      @register="tableRegister"
      @selection-change="handleSelectionChange"
    />
  </ContentWrap>
  <AddData
    v-model:isDrawer="isDrawerAddData"
    :title="titleDrawer"
    :placeholder="`请输入确认非仿冒网站的域名，匹配成功将不会入库。
一行一个域名，可输入多行，最多输入1000行。`"
  />
  <UploadFile v-model:isDrawer="isDrawerUploadFile" :title="'上传'" />
  <ExportFile
    v-model:isDrawer="isDrawerExportFile"
    title="白名单管理"
    :data="initExportDate"
    :axiosFn="getDataApi"
  />
</template>
<style scoped>
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
  z-index: 9;
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
  z-index: 10;
}
.el-pagination {
  float: right;
}
</style>
