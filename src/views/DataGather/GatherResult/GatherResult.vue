<script setup lang="tsx">
import { ref, reactive, unref, onMounted, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElCheckbox, ElMessageBox, ElMessage } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { getPolicyWhiteListApi, deleteWhiteListApi } from '@/api/systemManagement'
import { useTable } from '@/hooks/web/useTable'
import { formatTime } from '@/utils/index'
// import AddData from './PolicyComponent/AddData.vue'
// import GetData from './PolicyComponent/GetData.vue'
// import UploadFile from './PolicyComponent/UploadFile.vue'
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
  },
  fetchDelApi: async () => {
    const res = await deleteWhiteListApi(unref(ids))
    return !!res
  }
})
const systemConstants = useSystemConstantsWithOut()
// 获取tableState中的数据和方法
let { loading, total, dataList, currentPage, pageSize } = tableState
const { setProps, getList, getElTableExpose, delList } = tableMethods
// 高级搜索的数据
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
  await getList()
}
const dataArray = ref([
  'taskID',
  'taskName',
  'createdBy',
  'title',
  'discoveryTime',
  'domain',
  'IP',
  'FID',
  'netStatusCode',
  'icon'
])
const optionArray = ref({ systemAddType: systemConstants.whiteListFrom })

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
    field: 'dataID',
    label: '数据ID'
  },
  {
    field: 'domain',
    label: '域名'
  },
  {
    field: 'IP',
    label: 'IP'
  },
  {
    field: 'website',
    label: '网站地址'
  },
  {
    field: 'screenshot',
    label: '网站截图'
  },
  {
    field: 'protocol',
    label: '协议'
  },
  {
    field: 'port',
    label: '端口'
  },
  {
    field: 'title',
    label: '端口'
  },
  {
    field: 'info',
    label: '网页信息'
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
    field: 'SDK',
    label: 'SDK'
  },
  {
    field: 'netStatusCode',
    label: '网页状态码'
  },
  {
    field: 'domainHolder',
    label: '域名所有者'
  },
  {
    field: 'email',
    label: '注册邮箱'
  },
  {
    field: 'ICP',
    label: 'ICP备案'
  },
  {
    field: 'registerMan',
    label: '注册商'
  },
  {
    field: 'tel',
    label: '电话'
  },
  {
    field: 'registerTime',
    label: '注册时间'
  },
  {
    field: 'domainServerMan',
    label: '域名服务商'
  },
  {
    field: 'address',
    label: '地址'
  },
  {
    field: 'expirationTime',
    label: '到期时间'
  },
  {
    field: 'domainServer',
    label: '域名服务器'
  },
  {
    field: 'organizer',
    label: '主办单位'
  },
  {
    field: 'taskID',
    label: '任务ID'
  },
  {
    field: 'tackName',
    label: '任务名称'
  },
  {
    field: 'updateTime',
    label: '更新时间',
    formatter: (data) => formatTime(data.taskStartTime, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'createBy',
    label: '任务创建人'
  },

  {
    field: 'createBy',
    label: '创建人'
  },
  {
    field: 'createTime',
    label: '创建时间'
  }
]
//操作

// 在页面加载完成后，设置columns的值
onMounted(() => {
  setTimeout(() => {
    // 设置columns的值为一个包含列配置的数组
    setProps({
      columns: whiteColumns
    })
  }, 0)
})
//是否全选
const isCheckedAll = ref(false)
const selectedData = ref<TableColumn[]>([])
const temp = ref<any[]>([])
const cancelData = ref<any[]>([])
const toggleSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.toggleAllSelection()
}
const handleSelectionChange = (selected: any[]) => {
  selectedData.value = selected.map((i) => i.taskID)
  if (temp.value.length > selectedData.value.length) {
    cancelData.value = temp.value.filter((i) => !selectedData.value.includes(i))
    console.log(cancelData.value)
  }
}
watch(dataList, (newV) => {
  temp.value.push(...newV.map((i) => i.taskID))
  temp.value = [...new Set(temp.value)]
  if (isCheckedAll.value && !newV.some((i) => selectedData.value.includes(i.taskID))) {
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

// 添加
const placeholderInfo = ref('')
const titleDrawer = ref('')
const isDrawerAddData = ref(false)
const isDrawerGetData = ref(false)
const isDrawerUploadFile = ref(false)
const addWhiteList = async () => {
  titleDrawer.value = '添加白名单'
  isDrawerAddData.value = true
  placeholderInfo.value =
    '请输入确认非仿冒网站的域名，匹配成功将不会入库。\n一行一个域名，可输入多行，最多输入1000行。'
}
//导出数据
const initData = ref({})
const getSelections = () => {
  if (isCheckedAll.value) {
    initData.value = {
      isCheckedAll: isCheckedAll.value,
      total,
      cancelData: cancelData.value.length
    }
  } else {
    initData.value = { pickCount: selectedData.value.length }
  }
  titleDrawer.value = '导出数据'
  isDrawerGetData.value = true
}
//上传文件
const uploadFile = () => {
  titleDrawer.value = '上传文件'
  isDrawerUploadFile.value = true
}
// 定义canShowPagination变量，用于控制是否显示分页
const canShowPagination = ref(true)
</script>
<template>
  <AdvancedSearch
    :tipTitle="'系统默认展示当天拓线数据，最多可查看30天内数据，超出30天数据不会留存。'"
    :dataArray="dataArray"
    :optionArray="optionArray"
    @search-data="searchTable"
  />
  <ContentWrap :title="`采集结果查看(${total})`" class="table-box">
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
      row-key="taskID"
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
      @selection-change="handleSelectionChange"
    />
  </ContentWrap>
  <AddData
    v-model:isDrawer="isDrawerAddData"
    :title="titleDrawer"
    :placeholder="`请输入确认非仿冒网站的域名，匹配成功将不会入库。
一行一个域名，可输入多行，最多输入1000行。`"
  />
  <GetData v-model:isDrawer="isDrawerGetData" :title="titleDrawer" :data="initData" />
  <UploadFile v-model:isDrawer="isDrawerUploadFile" :title="'上传'" />
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
