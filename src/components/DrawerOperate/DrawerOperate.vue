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
const { getElFormExpose, getFormData, getComponentExpose } = formMethods

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
    label: `${t('formDemo.exploreType')}：`,
    component: 'Select',
    value: '1',
    componentProps: {
      options: [
        {
          label: '资产探测（可探测title、FID、IP等信息）',
          value: '1'
        },
        {
          label: '网站探测（可探测网站截图）',
          value: '2'
        },
        {
          label: '域名探测（可探测WHOIS、网站备案信息）',
          value: '3'
        }
      ]
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'exploreContent',
    label: `${t('formDemo.exploreContent')}：`,
    component: 'CheckboxGroup',
    componentProps: {
      options: [
        {
          label: '完整资产探测',
          value: 'true'
        }
      ]
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
  },
  {
    field: 'exploreAimText',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      placeholder: `'请输入IP、IP段，可支持多行，最多支持10000个目标\n支持格式如下：\n192.168.10.0-100\n192.168.1.2\n192.168.1.0/32'`,
      rows: 8
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'explorePort',
    label: `${t('formDemo.explorePort')}：`,
    component: 'Input',
    componentProps: {
      type: 'textarea',
      placeholder: `请输入端口号\n支持输入多个端口进行探测“,”隔开\n最多输入300个端口`,
      rows: 8
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'priority',
    label: `${t('formDemo.priority')}：`,
    component: 'Select',
    value: '3',
    componentProps: {
      options: [
        {
          label: '紧急',
          value: '1'
        },
        {
          label: '高',
          value: '2'
        },
        {
          label: '中',
          value: '3'
        },
        {
          label: '低',
          value: '4'
        }
      ]
    },
    formItemProps: {
      rules: [required()]
    }
  }
])
const test = async () => {
  const inputEl = await getComponentExpose('priority')
  inputEl.focus()
  // console.log(inputEl)
}
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
    <button @click="test">123</button>
    <template #footer>
      <div style="margin-right: 20px">
        <BaseButton type="default" @click="resetClick">重 置</BaseButton>
        <BaseButton type="primary" @click="confirmClick">确 定</BaseButton>
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
