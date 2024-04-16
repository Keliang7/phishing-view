<script setup lang="tsx">
import { ref, reactive, unref, onMounted, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElCheckbox, ElMessageBox, ElMessage } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { getListApi, deleteApi, exportApi } from '@/api/systemManagement/PhishingConfiguration'
import { getStaticFileApi } from '@/api/downLoadCenter'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
import TableTop from '@/components/TableTop/TableTop.vue'
import AddData from './PolicyComponent/AddData.vue'
import UploadFile from './PolicyComponent/UploadFile.vue'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import ExportFile from '@/components/ExportFile/ExportFile.vue'

// 使用useI18n钩子函数获取国际化相关数据和方法
const { t } = useI18n()
// 使用useTable钩子函数获取table相关数据和方法
const { tableRegister, tableMethods, tableState } = useTable({
  // fetchDataApi方法用于异步获取表格数据
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getListApi({
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
    const res = await deleteApi({ rules: unref(ids) })
    return !!res
  }
})
// 获取tableState中的数据和方法
let { loading, total, dataList, currentPage, pageSize } = tableState
const { setProps, getList, getElTableExpose, delList } = tableMethods

// 高级搜索的数据
const searchData = ref({})
const dataArray = ref(['ruleContent', 'addType', 'createdBy', 'createdTime'])

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
    label: t('tableDemo.ruleContent'),
    width: 300
  },
  {
    field: 'matchNum',
    label: t('tableDemo.matchNum'),
    width: 150
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
    width: 250,
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
            <ElButton type="danger" link onClick={() => delData(data)}>
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
      const res = await deleteApi({ isCheckedAll: true, temp })
      if (res) {
        ElMessage.success(t('common.delSuccess'))
        isCheckedAll.value = false
        toggleSelection()
        getList()
        clearSelection()
      }
    })
  } else {
    delData(null)
    clearSelection()
  }
}

const placeholderInfo = ref('')
/**
 * 选择全部
 * selectedData 选中的id
 * temp 翻页的时候记录
 * cancelData 全选状态下，取消的id
 */
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
    cancelData.value = []
    selectedData.value = []
    temp.value = []
  }
})

// 高级搜索功能，接收从AdvancedSearch组件中传过来的数据
const searchTable = async (value) => {
  searchData.value = value
  await getList()
}
// 添加
const isDrawerAddData = ref(false)
const isDrawerUploadFile = ref(false)
const addWhiteList = async () => {
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
  isDrawerExportFile.value = true
}
//上传文件
const uploadFile = () => {
  isDrawerUploadFile.value = true
}
// 定义canShowPagination变量，用于控制是否显示分页
const canShowPagination = ref(true)

const isDrawerExportFile = ref(false)
</script>
<template>
  <AdvancedSearch
    :title="`白名单管理`"
    :total="total"
    :dataArray="dataArray"
    :tip-title="'系统默认展示当天接入数据，最多可查看7天内数据，超出7天数据不会留存'"
    @search-data="searchTable"
  />
  <ContentWrap>
    <TableTop>
      <template #right>
        <ElButton type="default">
          <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
        </ElButton>
        <ElButton type="danger" @click="deleteAllFn"> 批量删除 </ElButton>
        <ElButton type="primary" @click="addWhiteList"> 添加 </ElButton>

        <ElButton type="primary" @click="uploadFile"> 导入数据 </ElButton>

        <ElButton type="primary" @click="getSelections">
          <Icon icon="tdesign:upload" /> 导出数据
        </ElButton>
      </template>
    </TableTop>
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
    :title="'添加白名单'"
    :placeholder="`请输入确认非仿冒网站的域名，匹配成功将不会入库。
一行一个域名，可输入多行，最多输入1000行。`"
    @get-data="getList"
  />
  <UploadFile
    v-model:isDrawer="isDrawerUploadFile"
    :title="'上传文件'"
    :axiosFn="getStaticFileApi"
    @get-data="getList"
  />
  <ExportFile
    v-model:isDrawer="isDrawerExportFile"
    title="白名单管理"
    :data="initExportDate"
    :axiosFn="exportApi"
    @clear-selection="clearSelection"
    @is-checked-all="
      (temp) => {
        isCheckedAll = temp
      }
    "
  />
</template>
<style scoped></style>
