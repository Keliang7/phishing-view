<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, ref, onMounted, watch, defineEmits } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { Form, FormSchema } from '@/components/Form'
import { ElAlert } from 'element-plus'
import { formatTime, Timestamp } from '@/utils'
// import { getSystemConstantApi } from '@/api/table/index'
import { BaseButton } from '@/components/Button'

const props = defineProps({
  dataArray: {
    type: Array,
    default: null
  },
  optionArray: {
    type: Object,
    default: null
  },
  tipTitle: {
    type: String,
    default: ''
  }
})

const { t } = useI18n()
const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData } = formMethods
const emit = defineEmits(['search-data'])
// 用来调整表单的布局样式
let operateClass = ref('')
// // 资产采集状态
// let collectionStatus = ref([{}])
// // 资产仿冒状态
// let phishingStatus = ref([{}])
// // 扩线状态
// let expandStatus = ref([{}])
// // 仿冒数据来源
// let phishingSource = ref([{}])
// // 向分析处置的推送状态
// let pusherStatus = ref([{}])
// // 白名单-添加方式
// let whiteListFrom = ref([{}])
// // 仿冒检测规则-添加方式
// let ruleFrom = ref([{}])
// // 受害方类型
// let victimType = ref([{}])
// // 仿冒检测规则-审核状态
// let ruleCheck = ref([{}])
// // 仿冒数据-更新状态(查询ZDTC)
// let updateStatus = ref([{}])
// // 添加方式-【说明】其他的高级搜索页面也有添加方式，为了方便管理，决定采用统一赋值。
// let systemAddType = ref([{}])
// 查询到的表格数据
let searchData = reactive({})

let schema = ref<FormSchema[]>([
  {
    field: 'url',
    label: `${t('formDemo.url')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入URL'
    }
  },
  {
    field: 'domain',
    label: `${t('formDemo.domain')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入域名'
    }
  },
  {
    field: 'ip',
    label: `${t('formDemo.ip')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入IP'
    }
  },
  {
    field: 'dataSource',
    label: `${t('formDemo.dataSource')}：`,
    component: 'Select',
    componentProps: {
      options: props.optionArray?.dataSource,
      placeholder: '请选择数据来源'
    }
  },
  {
    field: 'discoveryTime',
    component: 'DatePicker',
    label: `${t('formDemo.discoveryTime')}：`,
    componentProps: {
      type: 'date',
      placeholder: formatTime(new Date(), 'yyyy-MM-dd')
    }
  },
  {
    field: 'ruleContent',
    label: `${t('formDemo.ruleContent')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入规则内容'
    }
  },
  {
    field: 'ruleID',
    label: `${t('formDemo.ruleID')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入规则ID'
    }
  },
  {
    field: 'featureContent',
    label: `${t('formDemo.featureContent')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入特征内容'
    }
  },
  {
    field: 'featureID',
    label: `${t('formDemo.featureID')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入特征ID'
    }
  },
  // 添加方式用key值
  {
    field: 'addType',
    label: `${t('formDemo.addType')}：`,
    component: 'Select',
    componentProps: {
      options: props.optionArray?.systemAddType,
      placeholder: '请选择添加方式'
    }
  },
  {
    field: 'victim',
    label: `${t('formDemo.victim')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入受害者'
    }
  },
  {
    field: 'victimType',
    label: `${t('formDemo.victimType')}：`,
    component: 'Select',
    componentProps: {
      options: props.optionArray?.victimType,
      placeholder: '请选择受害方类型'
    }
  },
  {
    field: 'dataSources',
    label: `${t('formDemo.dataSources')}：`,
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '全部',
          value: '1'
        },
        {
          label: 'BW监测系统',
          value: '2'
        },
        {
          label: '域名监测系统',
          value: '3'
        },
        {
          label: '日志系统',
          value: '2'
        },
        {
          label: 'TLS系统',
          value: '3'
        }
      ],
      placeholder: '请选择数据源'
    }
  },
  {
    field: 'createdBy',
    label: `${t('formDemo.createdBy')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入创建人'
    }
  },
  {
    field: 'createdTime',
    component: 'DatePicker',
    label: `${t('formDemo.createdTime')}：`,
    componentProps: {
      type: 'date',
      placeholder: formatTime(new Date(), 'yyyy-MM-dd')
    }
  },
  {
    field: 'collectionStatus',
    label: `${t('formDemo.collectionStatus')}：`,
    component: 'Select',
    componentProps: {
      options: props.optionArray?.collectionStatus,
      placeholder: '请选择状态'
    }
  },
  {
    field: 'phishingStatus',
    label: `${t('formDemo.phishingStatus')}：`,
    component: 'Select',
    componentProps: {
      options: props.optionArray?.phishingStatus,
      placeholder: '请选择状态'
    }
  },
  {
    field: 'expandStatus',
    label: `${t('formDemo.expandStatus')}：`,
    component: 'Select',
    componentProps: {
      options: props.optionArray?.expandStatus,
      placeholder: '请选择状态'
    }
  },
  {
    field: 'pusherStatus',
    label: `${t('formDemo.pusherStatus')}：`,
    component: 'Select',
    componentProps: {
      options: props.optionArray?.pusherStatus,
      placeholder: '请选择状态'
    }
  },
  {
    field: 'ruleCheck',
    label: `${t('formDemo.ruleCheck')}：`,
    component: 'Select',
    componentProps: {
      options: props.optionArray?.ruleCheck,
      placeholder: '请选择状态'
    }
  },
  {
    field: 'updateStatus',
    label: `${t('formDemo.updateStatus')}：`,
    component: 'Select',
    componentProps: {
      options: props.optionArray?.updateStatus,
      placeholder: '请选择状态'
    }
  },
  {
    field: 'omissionReason',
    label: `${t('formDemo.omissionReason')}：`,
    component: 'Select',
    componentProps: {
      options: props.optionArray?.omissionReason,
      placeholder: '请选择漏报原因'
    }
  },
  {
    field: 'operate',
    component: 'RadioButton',
    componentProps: {
      slots: {
        default: () => (
          <div class={operateClass.value}>
            <BaseButton type="default" onClick={verifyReset}>
              重置
            </BaseButton>
            <BaseButton type="primary" onClick={searchFn}>
              查询
            </BaseButton>
          </div>
        )
      }
    }
  }
])

let schemaCopy = ref<FormSchema[]>([])
const tipCont = ref('')
onMounted(async () => {
  // await getSystemConstant()
  await getShowData()
})
const getShowData = () => {
  tipCont.value = props.tipTitle
  operateClass.value = props.dataArray.length % 2 === 1 ? 'advance-btn' : 'search-btn'
  schemaCopy.value = schema.value.filter((field) => props.dataArray.includes(field.field))
}

// 当同一个页面，不同的高级搜索组件进行切换时，需要用watch来监听变化。
watch(
  () => props.dataArray,
  () => {
    tipCont.value = props.tipTitle
    operateClass.value = props.dataArray.length % 2 === 1 ? 'advance-btn' : 'search-btn'
    schemaCopy.value = schema.value.filter((field) => props.dataArray.includes(field.field))
  }
)
// // 获取系统全局静态变量-下拉选框内容：状态、受害方分类、添加方式...
// const getSystemConstant = async () => {
//   const res = await getSystemConstantApi()
//   // 资产采集状态
//   collectionStatus.value = Object.entries(res.data.collectionStatus).map(([value, label]) => ({
//     value,
//     label
//   }))
//   // 资产仿冒状态
//   phishingStatus.value = Object.entries(res.data.phishingStatus).map(([value, label]) => ({
//     value,
//     label
//   }))
//   // 扩线状态
//   expandStatus.value = Object.entries(res.data.expandStatus).map(([value, label]) => ({
//     value,
//     label
//   }))
//   // 向分析处置的推送状态
//   pusherStatus.value = Object.entries(res.data.pusherStatus).map(([value, label]) => ({
//     value,
//     label
//   }))
//   // 仿冒数据来源
//   phishingSource.value = Object.entries(res.data.phishingSource).map(([value, label]) => ({
//     value,
//     label
//   }))
//   // 白名单-添加方式
//   whiteListFrom.value = Object.entries(res.data.whiteListFrom).map(([value, label]) => ({
//     value,
//     label
//   }))
//   // 仿冒检测规则-添加方式
//   ruleFrom.value = Object.entries(res.data.ruleFrom).map(([value, label]) => ({
//     value,
//     label
//   }))
//   // 受害方类型
//   victimType.value = Object.entries(res.data.victimType).map(([value, label]) => ({
//     value,
//     label
//   }))
//   // 仿冒数据-更新状态(查询ZDTC)
//   ruleCheck.value = Object.entries(res.data.ruleCheck).map(([value, label]) => ({
//     value,
//     label
//   }))
//   // 仿冒数据-更新状态(查询ZDTC)
//   updateStatus.value = Object.entries(res.data.updateStatus).map(([value, label]) => ({
//     value,
//     label
//   }))
// }
// 重置
const verifyReset = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
}
// 查询
const searchFn = async () => {
  const formData = await getFormData()
  formData.discoveryTime = Timestamp(formData.discoveryTime)
  formData.createdTime = Timestamp(formData.createdTime)
  searchData = formData
  emit('search-data', searchData)
}
</script>
<template>
  <ContentWrap class="advance-search" style="margin-bottom: 20px">
    <ElAlert
      v-show="tipTitle"
      title="温馨提示："
      type="success"
      :description="tipCont"
      :closable="false" />
    <Form :autoSetPlaceholder="false" :schema="schemaCopy" @register="formRegister"
  /></ContentWrap>
</template>
<style lang="less">
.advance-search {
  max-height: 250px;
  overflow-y: auto;
}
.advance-search::-webkit-scrollbar {
  height: 25px;
  width: 5px;
  cursor: pointer;
}
.advance-search::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: var(--el-color-info-light-7);
}
.search-btn {
  position: absolute;
  right: 0;
  top: 20px;
}
.advance-btn {
  position: relative;
  right: -183%;
  top: 0px;
}
.el-alert.el-alert--success.is-light {
  width: 540px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  margin-bottom: 15px;
  color: #000;
}
.el-alert__title {
  line-height: 24px;
}
.el-alert--success.is-light .el-alert__description {
  display: inline;
  line-height: 18px;
  color: #999999;
}
</style>
