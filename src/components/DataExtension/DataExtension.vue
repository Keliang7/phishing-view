<script setup lang="tsx">
import { ElDrawer, FormItemProp } from 'element-plus'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { BaseButton } from '@/components/Button'
import { useValidator } from '@/hooks/web/useValidator'
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElMessageBox, ElMessage } from 'element-plus'
const { t } = useI18n()
const { required } = useValidator()
defineProps({
  title: {
    type: String,
    default: ''
  },
  isDrawer: {
    type: Boolean,
    default: false
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
  /**
   * 这里的代码暂时隐藏
   */
  // {
  //   field: 'taskType',
  //   label: `任务类型：`,
  //   component: 'Select',
  //   value: ['FID', 'title', 'rootDomain', 'CExpend', 'ICON'],
  //   componentProps: {
  //     multiple: true,
  //     options: [
  //       {
  //         label: 'FID',
  //         value: 'FID'
  //       },
  //       {
  //         label: 'title',
  //         value: 'title'
  //       },
  //       {
  //         label: '根域',
  //         value: 'rootDomain'
  //       },
  //       {
  //         label: 'C段扩展',
  //         value: 'CExpend'
  //       },
  //       {
  //         label: 'ICON',
  //         value: 'ICON'
  //       }
  //     ]
  //   },
  //   formItemProps: {
  //     rules: [required()]
  //   }
  // },
  // {
  //   field: 'extensionStatus',
  //   label: `拓线结果数据状态：`,
  //   component: 'Select',
  //   value: '全部',
  //   componentProps: {
  //     options: [
  //       {
  //         label: '全部',
  //         value: '全部'
  //       },
  //       {
  //         label: '存活',
  //         value: '存活'
  //       },
  //       {
  //         label: '离线',
  //         value: '离线'
  //       }
  //     ],
  //     class: 'extension-status'
  //   },
  //   formItemProps: {
  //     rules: [required()]
  //   }
  // },
  // {
  //   field: 'timeArray',
  //   label: '拓线结果时间范围：',
  //   component: 'DatePicker',
  //   value: timeArray,
  //   componentProps: {
  //     type: 'daterange',
  //     size: 'default',
  //     class: 'time-array'
  //   },
  //   formItemProps: {
  //     rules: [required()]
  //   }
  // },
  {
    field: 'inputAim',
    label: `输入目标：`,
    component: 'Input',
    componentProps: {
      class: 'input-aim',
      type: 'textarea',
      placeholder: `请输入目标，1行1个目标，最多上传1万个目标，多余的将会被丢弃。`,
      rows: 3
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'file',
    component: 'Upload',
    label: '',
    componentProps: {
      class: 'explore-aim-file',
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
            <p class="attention">支持上传txt,.csv文件，最大上传文件为1M</p>
          </div>
        )
      }
    }
  }
])
</script>
<template>
  <ElDrawer :title="title" :modelValue="isDrawer" :before-close="close" @open="open">
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
        <BaseButton type="primary" @click="confirmClick">确 定</BaseButton>
      </div>
    </template>
  </ElDrawer>
</template>
<style lang="less" scope>
.extension-status::after {
  content: '拓线结果仅返回相应数据状态的数据，如仅返回存活的数据';
  color: grey;
  font-size: 12px;
}
.explore-aim-file div,
.explore-aim-file ul {
  margin-left: 65%;
}
</style>
