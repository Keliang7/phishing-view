<script setup lang="tsx">
import { ElButton, ElDrawer, ElMessage } from 'element-plus'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { BaseButton } from '@/components/Button'
import { useValidator } from '@/hooks/web/useValidator'
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { addApi } from '@/api/dataExtension/extensionTask'
import { getStaticFileApi } from '@/api/downLoadCenter'
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
  isFile: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array as () => Array<{
      ipv4: string | null
      ipv6: string | null
      ip: string | null
      url: string | null
      domain: string | null
      [key: string]: any
    }>
  }
})

const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData, setValues } = formMethods
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
    field: 'inputAim',
    label: `输入目标：`,
    component: 'Input',
    componentProps: {
      class: 'input-aim',
      type: 'textarea',
      placeholder: `请输入目标，1行1个目标，最多上传1万个目标，多余的将会被丢弃。`,
      rows: 8
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'file',
    label: `${t('formDemo.exploreAim')}：`,
    component: 'Upload',
    remove: !props.isFile,
    componentProps: {
      limit: 1,
      class: 'ml-50%',
      autoUpload: false,
      slots: {
        trigger: () => (
          <div>
            <BaseButton type="primary">点击上传文件</BaseButton>
            <ElButton type="primary" onClick={getStaticFile} link size="small">
              下载模版
            </ElButton>
          </div>
        ),
        tip: () => <div class="el-upload__tip">支持上传上传txt/CSV文件最大上传文件为1M</div>
      }
    }
  }
])

const emit = defineEmits(['update:isDrawer'])
const close = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
  emit('update:isDrawer', false)
}
const open = async () => {
  setValues({
    inputAim: [...new Set(props.data?.map((i) => i.ip))].filter((i) => i !== '').join('\n')
  })
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
      if (formData.file) {
        formData.file = formData.file[0].raw
      } else {
        delete formData.file
      }
      await addApi({ ...formData }).then(() => {
        ElMessage.success('创建任务成功')
        close()
      })
    }
  })
}
//模版
const getStaticFile = async () => {
  let res = await getStaticFileApi({ fileName: 'extension' })
  const blob = new Blob([res.data])
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `拓线任务模版.xlsx`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
</script>
<template>
  <ElDrawer :title="title" :modelValue="isDrawer" :before-close="close" @open="open">
    <Form :autoSetPlaceholder="false" :schema="schema" @register="formRegister" :isCol="false" />
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
