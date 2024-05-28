<script setup lang="tsx">
import { ElButton, ElDrawer, ElMessage } from 'element-plus'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { BaseButton } from '@/components/Button'
import { useValidator } from '@/hooks/web/useValidator'
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElUpload } from 'element-plus'
import { addApi } from '@/api/dataExtension/extensionTask'
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

// 重置
const resetClick = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
}
// 查询
const confirmClick = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.validate(async (isValid) => {
    if (isValid) {
      const formData = await getFormData()
      let res
      if (file.value) {
        res = await addApi({ ...formData, file: file.value[0].raw })
      } else {
        res = await addApi({ ...formData })
      }
      if (res.code === 0) {
        ElMessage.success('创建任务成功')
      }
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
  }
])
const file = ref()
</script>
<template>
  <ElDrawer :title="title" :modelValue="isDrawer" :before-close="close" @open="open">
    <Form :autoSetPlaceholder="false" :schema="schema" @register="formRegister" :isCol="false" />
    <ElUpload v-model:file-list="file" :auto-upload="false" :limit="1" class="float-right">
      <BaseButton type="primary">点击上传文件</BaseButton>
      <ElButton type="primary" @click.stop="console.log('todo')" link>下载模版</ElButton>
      <template #tip>
        <div class="el-upload__tip">上传txt/CSV文件</div>
      </template>
    </ElUpload>
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
</style>
