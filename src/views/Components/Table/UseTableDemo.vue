<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn, TableSlotDefault } from '@/components/Table'
import { getTableListApi } from '@/api/table'
import { ref, reactive, unref, onMounted } from 'vue'
import { ElTag } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { BaseButton } from '@/components/Button'

// 使用useTable钩子函数获取table相关数据和方法
const { tableRegister, tableMethods, tableState } = useTable({
  // fetchDataApi方法用于异步获取表格数据
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getTableListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize)
    })
    return {
      list: res.data.list,
      total: res.data.total
    }
  }
})
// 获取tableState中的数据和方法
const { loading, dataList, total, currentPage, pageSize } = tableState
const { setProps, setColumn, getElTableExpose, addColumn, delColumn, refresh } = tableMethods

// 使用useI18n钩子函数获取国际化相关数据和方法
const { t } = useI18n()

// 定义columns变量，用于存储表格的列配置
const columns = reactive<TableColumn[]>([])

// 在页面加载完成后，设置columns的值
onMounted(() => {
  setTimeout(() => {
    // 设置columns的值为一个包含列配置的数组
    setProps({
      columns: [
        {
          field: 'expand',
          type: 'expand',
          slots: {
            default: (data: TableSlotDefault) => {
              // 根据data中的row数据生成一个div元素
              const { row } = data
              return (
                <div class="ml-30px">
                  <div>
                    {t('tableDemo.title')}：{row.title}
                  </div>
                  <div>
                    {t('tableDemo.author')}：{row.author}
                  </div>
                  <div>
                    {t('tableDemo.displayTime')}：{row.display_time}
                  </div>
                </div>
              )
            }
          }
        },
        {
          field: 'selection',
          type: 'selection'
        },
        {
          field: 'index',
          label: t('tableDemo.index'),
          type: 'index'
        },
        {
          field: 'title',
          label: t('tableDemo.title')
        },
        {
          field: 'author',
          label: t('tableDemo.author')
        },
        {
          field: 'display_time',
          label: t('tableDemo.displayTime')
        },
        {
          field: 'importance',
          label: t('tableDemo.importance'),
          formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
            return (
              <ElTag type={cellValue === 1 ? 'success' : cellValue === 2 ? 'warning' : 'danger'}>
                {cellValue === 1
                  ? t('tableDemo.important')
                  : cellValue === 2
                    ? t('tableDemo.good')
                    : t('tableDemo.commonly')}
              </ElTag>
            )
          }
        },
        {
          field: 'pageviews',
          label: t('tableDemo.pageviews')
        },
        {
          field: 'action',
          label: t('tableDemo.action'),
          slots: {
            default: (data) => {
              return (
                <BaseButton type="primary" onClick={() => actionFn(data)}>
                  {t('tableDemo.action')}
                </BaseButton>
              )
            }
          }
        }
      ]
    })
  }, 2000)
})

// 定义actionFn函数，用于处理点击action列时的操作
const actionFn = (data: TableSlotDefault) => {
  console.log(data)
}

// 定义canShowPagination变量，用于控制是否显示分页
const canShowPagination = ref(true)
// 定义showPagination函数，用于显示或隐藏分页
const showPagination = (show: boolean) => {
  canShowPagination.value = show
}

// 定义reserveIndex函数，用于设置是否保留索引列
const reserveIndex = (custom: boolean) => {
  setProps({
    reserveIndex: custom
  })
}

// 定义showSelections函数，用于显示或隐藏选择框
const showSelections = (show: boolean) => {
  setColumn([
    {
      field: 'selection',
      path: 'hidden',
      value: !show
    }
  ])
}

// 定义index变量，用于记录当前页码
const index = ref(1)

// 定义changeTitle函数，用于改变标题
const changeTitle = () => {
  setColumn([
    {
      field: 'title',
      path: 'label',
      value: `${t('tableDemo.title')}${unref(index)}`
    }
  ])
  index.value++
}

// 定义showExpandedRows函数，用于显示或隐藏展开行
const showExpandedRows = (show: boolean) => {
  setColumn([
    {
      field: 'expand',
      path: 'hidden',
      value: !show
    }
  ])
}

// 定义selectAllNone函数，用于全选或取消全选
const selectAllNone = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.toggleAllSelection()
}

// 定义showAction函数，用于显示或隐藏操作列
const showAction = ref(true)
// 定义delOrAddAction函数，用于删除或添加操作列
const delOrAddAction = () => {
  if (unref(showAction)) {
    delColumn('action')
    showAction.value = false
  } else {
    addColumn({
      field: 'action',
      label: t('tableDemo.action'),
      slots: {
        default: (data) => {
          return (
            <BaseButton type="primary" onClick={() => actionFn(data)}>
              {t('tableDemo.action')}
            </BaseButton>
          )
        }
      }
    })
    showAction.value = true
  }
}

// 定义showStripe变量，用于控制表格是否显示交替行
const showStripe = ref(false)
// 定义showOrHiddenStripe函数，用于显示或隐藏交替行
const showOrHiddenStripe = () => {
  setProps({
    stripe: !unref(showStripe)
  })
  showStripe.value = !unref(showStripe)
}

// 定义height变量，用于设置表格的高度
const height = ref<string | number>('auto')
// 定义fixedHeaderOrAuto函数，用于显示或隐藏固定表头
const fixedHeaderOrAuto = () => {
  if (unref(height) === 'auto') {
    setProps({
      height: 300
    })
    height.value = 300
  } else {
    setProps({
      height: 'auto'
    })
    height.value = 'auto'
  }
}

// 定义getSelections函数，用于获取选中的行数据
const getSelections = async () => {
  const elTableRef = await getElTableExpose()
  const selections = elTableRef?.getSelectionRows()
  console.log(selections)
}
</script>

<template>
  <ContentWrap :title="`UseTable ${t('tableDemo.operate')}`" style="margin-bottom: 20px">
    <BaseButton @click="showPagination(true)">
      {{ t('tableDemo.show') }} {{ t('tableDemo.pagination') }}
    </BaseButton>
    <BaseButton @click="showPagination(false)">
      {{ t('tableDemo.hidden') }} {{ t('tableDemo.pagination') }}
    </BaseButton>

    <BaseButton @click="reserveIndex(true)">{{ t('tableDemo.reserveIndex') }}</BaseButton>
    <BaseButton @click="reserveIndex(false)">{{ t('tableDemo.restoreIndex') }}</BaseButton>

    <BaseButton @click="showSelections(true)">{{ t('tableDemo.showSelections') }}</BaseButton>
    <BaseButton @click="showSelections(false)">{{ t('tableDemo.hiddenSelections') }}</BaseButton>

    <BaseButton @click="changeTitle">{{ t('tableDemo.changeTitle') }}</BaseButton>

    <BaseButton @click="showExpandedRows(true)">{{ t('tableDemo.showExpandedRows') }}</BaseButton>
    <BaseButton @click="showExpandedRows(false)">{{
      t('tableDemo.hiddenExpandedRows')
    }}</BaseButton>

    <BaseButton @click="selectAllNone">{{ t('tableDemo.selectAllNone') }}</BaseButton>

    <BaseButton @click="delOrAddAction">{{ t('tableDemo.delOrAddAction') }}</BaseButton>

    <BaseButton @click="showOrHiddenStripe">{{ t('tableDemo.showOrHiddenStripe') }}</BaseButton>

    <BaseButton @click="fixedHeaderOrAuto">{{ t('tableDemo.fixedHeaderOrAuto') }}</BaseButton>

    <BaseButton @click="getSelections">{{ t('tableDemo.getSelections') }}</BaseButton>

    <!-- <BaseButton @click="showOrHiddenSortable">{{ t('tableDemo.showOrHiddenSortable') }}</BaseButton> -->
  </ContentWrap>
  <ContentWrap :title="`UseTable ${t('tableDemo.example')}`">
    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      showAction
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
      @refresh="refresh"
    />
  </ContentWrap>
</template>

<style lang="less" scoped>
.el-button {
  margin-top: 10px;
}
</style>
