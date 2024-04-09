<script setup lang="tsx">
import { ElDrawer, FormItemProp } from 'element-plus'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { BaseButton } from '@/components/Button'
import { useValidator } from '@/hooks/web/useValidator'
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElMessageBox, ElMessage } from 'element-plus'
import { onMounted } from 'vue'
const { t } = useI18n()
const { required } = useValidator()
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  isDrawer: {
    type: Boolean,
    default: false
  },
  isPort: {
    type: Boolean,
    default: false
  },
  drawerData: {
    type: Object as () => FormSchema[],
    default: null
  },
  isTip: {
    type: Boolean,
    default: true
  }
})

const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData } = formMethods

const emit = defineEmits(['update:isDrawer'])
const close = async () => {
  console.log('关闭弹窗')
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
  emit('update:isDrawer', false)
}
const open = () => {
  console.log('打开弹窗')
}
const formValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
  console.log(prop, isValid, message)
}

// 重置
const resetClick = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
}
// 查询
const confirmClick = async () => {
  const elFormExpose = await getElFormExpose()
  const formData = await getFormData()
  console.log(formData, 'formData')
  elFormExpose?.validate(async (isValid) => {
    if (isValid) {
      console.log('验证通过', formData)
    }
  })
}
//时间
const today = new Date()
const threeMonthsAgo = new Date()
threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
const timeArray = [threeMonthsAgo, today]
const schema = ref<FormSchema[]>([
  {
    field: 'taskName',
    label: `${t('formDemo.taskName')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入任务名称'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'exploreType',
    label: `任务类型：`,
    component: 'Select',
    componentProps: {
      multiple: true,
      options: [
        {
          label: 'FID',
          value: 'FID'
        },
        {
          label: 'title',
          value: 'title'
        },
        {
          label: '根域',
          value: 'rootDomain'
        },
        {
          label: 'C段扩展',
          value: 'CExpend'
        },
        {
          label: 'ICON',
          value: 'ICON'
        }
      ]
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'dataStatus',
    label: `数据状态：`,
    component: 'Select',
    componentProps: {
      multiple: true,
      options: [
        {
          label: '全部',
          value: 'all'
        },
        {
          label: '存活',
          value: 'live'
        },
        {
          label: '离线',
          value: 'offline'
        }
      ]
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'timeObject',
    label: '时间范围：',
    component: 'DatePicker',
    value: timeArray,
    componentProps: {
      type: 'daterange',
      size: 'default'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'inputAim',
    label: `输入目标：`,
    component: 'Input',
    componentProps: {
      type: 'textarea',
      placeholder: `请输入目标，1行1个目标，最多上传1万个目标，多余的将会被丢弃。`,
      rows: 3
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'exploreAimFile',
    label: `${t('formDemo.exploreAim')}：`,
    component: 'Upload',
    componentProps: {
      limit: 1,
      // action: 'http://172.16.20.30:32080',
      autoUpload: false,
      ref: 'uploadRef',
      onPreview: (uploadFile) => {
        console.log(uploadFile)
      },
      onRemove: (file) => {
        console.log(file)
      },
      beforeRemove: (uploadFile) => {
        return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
          () => true,
          () => false
        )
      },
      onExceed: (files, uploadFiles) => {
        ElMessage.warning(
          `The limit is 1, you selected ${files.length} files this time, add up to ${
            files.length + uploadFiles.length
          } totally`
        )
      },
      slots: {
        trigger: () => <BaseButton type="primary">点击上传</BaseButton>,
        default: () => (
          <div class="el-upload__tip">
            <p>
              支持上传.xlsx、.xls、.txt、.xml、.json、.csv文件，最大上传文件为1M <a>下载模板</a>
            </p>
            <p class="attention">注意：目标地址添加方式为文件上传时，系统调度策略默认按IP拆分。</p>
          </div>
        )
      }
    },
    formItemProps: {
      rules: [required()]
    }
  }
])
const schemaCopy = ref<FormSchema[]>()
onMounted(() => {
  if (props.isPort) {
    schemaCopy.value = schema.value
  } else {
    schemaCopy.value = schema.value.splice(5, 1)
  }
})
</script>
<template>
  <ElDrawer
    :title="title"
    :modelValue="isDrawer"
    :before-close="close"
    custom-class="drawerWidth"
    @open="open"
  >
    <Form
      :autoSetPlaceholder="false"
      :schema="schema"
      @register="formRegister"
      @validate="formValidate"
      :isCol="false"
    />
    <template #footer>
      <div style="margin-right: 20px">
        <BaseButton type="default" @click="resetClick">重 置</BaseButton>
        <BaseButton type="primary" @click="confirmClick" disabled>确 定</BaseButton>
      </div>
    </template>
  </ElDrawer>
</template>
<style lang="less" scope>
.el-drawer {
  width: 40% !important;
  .el-drawer__title {
    font-size: 18px;
    font-weight: 600;
    color: #000;
  }
  .el-drawer__header {
    margin-bottom: 0px;
    padding-bottom: 20px;
    border-bottom: 2px solid #ebeef5;
  }
  .el-upload__tip p {
    margin: 0;
  }
  p a {
    cursor: pointer;
    color: var(--el-color-primary);
  }
}

.attention {
  font-size: 13px;
  color: var(--el-color-error);
}
</style>
