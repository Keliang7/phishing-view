<script setup lang="tsx">
import { ElDrawer, ElInput, FormItemProp } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { formatTime } from '@/utils'
import { useValidator } from '@/hooks/web/useValidator'
import { BaseButton } from '@/components/Button'
import { reactive, PropType, ref, onMounted, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  isDrawer: {
    type: Boolean,
    default: false
  },
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
const { required } = useValidator()
const exploreAimBody = ref('')
const explorePlaceholder =
  '请输入IP、IP段，可支持多行，最多支持10000个目标\n支持格式如下：\n192.168.10.0-100\n192.168.1.2\n192.168.1.0/32'
const { formRegister, formMethods } = useForm()
const {
  setProps,
  delSchema,
  addSchema,
  setValues,
  setSchema,
  getComponentExpose,
  getFormItemExpose,
  getElFormExpose,
  getFormData
} = formMethods
const schema = reactive<FormSchema[]>([
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
          value: '1',
          checked: true
        }
      ]
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'exploreAim',
    label: `${t('formDemo.exploreAim')}：`,
    component: 'Upload',
    componentProps: {
      limit: 1,
      multiple: true,
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
        default: () => <BaseButton type="primary">点击上传</BaseButton>,
        tip: () => (
          <div class="el-upload__tip">
            <p>
              支持上传.xlsx、.xls、.txt、.xml、.json、.csv文件，最大上传文件为1M <a>下载模板</a>
            </p>
            <p class="attention">注意：目标地址添加方式为文件上传时，系统调度策略默认按IP拆分。</p>
            <ElInput
              v-mode={exploreAimBody}
              type="textarea"
              rows="11"
              resize="none"
              placeholder={explorePlaceholder}
            />
          </div>
        )
      }
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
let schemaCopy = reactive<FormSchema[]>([])
onMounted(async () => {
  let fieldsToRemove = ['']
  if (props.dataType == 1) {
    fieldsToRemove = ['taskName', 'exploreType', 'exploreContent', 'exploreAim', 'priority']
  }
  schemaCopy = schema.filter((field) => fieldsToRemove.includes(field.field))
})
const emit = defineEmits(['update:isDrawer'])
const close = () => {
  console.log('关闭弹窗')
  emit('update:isDrawer', false)
}
const open = () => {
  console.log('打开弹窗')
}
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
      :schema="schemaCopy"
      @register="formRegister"
      @validate="formValidate"
      :isCol="false"
    />
    <template #footer>
      <div style="margin-right: 20px">
        <BaseButton type="default" @click="cancelClick">重 置</BaseButton>
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
  .el-form-item:nth-child(4) {
    display: block;
  }
  .el-upload__tip p {
    margin: 0;
  }
}

.attention {
  font-size: 13px;
  color: var(--el-color-error);
}
</style>
