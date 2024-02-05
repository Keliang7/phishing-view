<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, ref, onMounted, watch } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { Form, FormSchema } from '@/components/Form'
import { FormItemProp, ElAlert } from 'element-plus'
import { formatTime } from '@/utils'
import { BaseButton } from '@/components/Button'

const props = defineProps({
  dataType: {
    type: Number,
    default: 1
  },
  isTip: {
    type: Boolean,
    default: true
  }
})

const { t } = useI18n()
const { formRegister } = useForm()
let operateClass = ref('')
let schema = reactive<FormSchema[]>([
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
    field: 'state',
    label: `${t('formDemo.state')}：`,
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '未采集到',
          value: '1'
        },
        {
          label: '采集中',
          value: '2'
        },
        {
          label: '待采集',
          value: '3'
        },
        {
          label: '采集完成',
          value: '4'
        }
      ],
      placeholder: '请选择状态'
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
    field: 'victim',
    label: `${t('formDemo.victim')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入受害方'
    }
  },
  {
    field: 'victimType',
    label: `${t('formDemo.victimType')}：`,
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '政府',
          value: '1'
        },
        {
          label: '公检法部门',
          value: '2'
        },
        {
          label: '税务部门',
          value: '3'
        },
        {
          label: '金融',
          value: '4'
        },
        {
          label: '证券',
          value: '5'
        },
        {
          label: '国企',
          value: '6'
        },
        {
          label: '高校',
          value: '7'
        },
        {
          label: '电子商务',
          value: '8'
        }
      ],
      placeholder: '请选择受害方类型'
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
    field: 'addType',
    label: `${t('formDemo.addType')}：`,
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '全部',
          value: '1'
        },
        {
          label: '系统预置',
          value: '2'
        },
        {
          label: '自定义',
          value: '3'
        }
      ],
      placeholder: '请选择添加方式'
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
    field: 'operate',
    component: 'RadioButton',
    componentProps: {
      slots: {
        default: () => (
          <div class={operateClass.value}>
            <BaseButton type="default">重置</BaseButton>
            <BaseButton type="primary">查询</BaseButton>
          </div>
        )
      }
    }
  }
])
let schemaCopy = reactive<FormSchema[]>([])
onMounted(() => {
  console.log(222, props.dataType)
  let fieldsToRemove = ['']
  if (props.dataType == 1) {
    fieldsToRemove = ['url', 'domain', 'ip', 'state', 'discoveryTime', 'operate']
    tipTitle.value = '系统默认展示当天接入数据，最多可查看7天内数据，超出7天数据不会留存。'
  } else if (props.dataType == 2) {
    fieldsToRemove = [
      'url',
      'domain',
      'ip',
      'state',
      'discoveryTime',
      'victim',
      'victimType',
      'operate'
    ]
    tipTitle.value = '系统默认展示当天接入数据，最多可查看5年内数据，超出5年数据不会留存。'
  } else if (props.dataType == 8) {
    fieldsToRemove = ['ruleContent', 'addType', 'createdBy', 'createdTime', 'operate']
    tipTitle.value = '白名单数据存储提示'
  }
  operateClass.value = fieldsToRemove.length % 2 === 1 ? 'advance-btn' : 'search-btn'
  schemaCopy = schema.filter((field) => fieldsToRemove.includes(field.field))
})
const formValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
  console.log(prop, isValid, message)
}
const tipTitle = ref('')
watch(
  () => props.dataType,
  () => {
    let fieldsToRemove = ['']
    if (props.dataType == 8) {
      fieldsToRemove = ['ruleContent', 'addType', 'createdBy', 'createdTime', 'operate']
      tipTitle.value = '白名单数据存储提示'
    } else if (props.dataType == 9) {
      fieldsToRemove = ['dataSources', 'createdBy', 'createdTime', 'operate']
      tipTitle.value = '策略配置数据存储提示'
    }
    operateClass.value = fieldsToRemove.length % 2 === 1 ? 'advance-btn' : 'search-btn'
    schemaCopy = schema.filter((field) => fieldsToRemove.includes(field.field))
  }
)
</script>
<template>
  <ContentWrap style="margin-bottom: 20px">
    <ElAlert
      v-show="isTip"
      title="温馨提示："
      type="success"
      :description="tipTitle"
      :closable="false" />
    <Form
      :autoSetPlaceholder="false"
      :schema="schemaCopy"
      @register="formRegister"
      @validate="formValidate"
  /></ContentWrap>
</template>
<style lang="less">
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
