<script setup lang="tsx">
import { ref } from 'vue'
import { ElDrawer, ElMessage, ElButton } from 'element-plus'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { BaseButton } from '@/components/Button'
import { useValidator } from '@/hooks/web/useValidator'
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  isDrawer: {
    type: Boolean,
    default: false
  },
  axiosFn: {
    type: Function
  }
})
const { required } = useValidator()
const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData } = formMethods
const schema = ref<FormSchema[]>([
  {
    field: 'reviewer',
    label: `复核人员：`,
    component: 'Select',
    remove: props.title !== '仿冒检测规则导入数据',
    componentProps: {
      options: [
        {
          label: '张',
          value: '张'
        },
        {
          label: '肖',
          value: '肖'
        }
      ]
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'file',
    component: 'Upload',
    componentProps: {
      limit: 1,
      autoUpload: false,
      accept: '.xls,.xlsx',
      drag: true,
      slots: {
        trigger: () => (
          <div class="el-upload__text">
            拖放文件或 <em>点击上传</em>
            <div class="color-gray font-size-12px">只能上传xlsx文件,不能超过1MB</div>
          </div>
        ),
        tip: () => (
          <div class="el-upload__tip">
            <ElButton size="small" link type="primary" onClick={downloadFile}>
              模版下载
            </ElButton>
          </div>
        )
      },
      beforeUpload(file) {
        if (file.size / 1024 / 1024 > 1) {
          ElMessage.error(`${file.name}文件的大小超过 1MB!`)
          return false
        }
        return true
      }
    },
    formItemProps: {
      rules: [required()]
    }
  }
])
const emit = defineEmits(['update:isDrawer', 'get-data'])
const close = async () => {
  emit('update:isDrawer', false)
  emit('get-data')
}

const loading = ref(false)
const confirmClick = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const formData = await getFormData()
      console.log(formData)
      formData.file = formData.file[0].raw
      if (props.axiosFn) {
        const res = await props.axiosFn(formData)
        if (res.code == 0) {
          loading.value = false
          close().then(() => {
            ElMessage.success('导入文件成功')
          })
        }
      }
    }
  })
}
const downloadFile = () => {
  const link = document.createElement('a')
  link.href = `/${props.title}模板.xlsx`
  link.download = `${props.title}模板.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
<template>
  <ElDrawer :title="title" :modelValue="isDrawer" :before-close="close" custom-class="drawerWidth">
    <Form :autoSetPlaceholder="false" :schema="schema" @register="formRegister" :isCol="false" />
    <template #footer>
      <div style="margin-right: 20px">
        <BaseButton type="primary" @click="confirmClick">提 交</BaseButton>
      </div>
    </template>
  </ElDrawer>
</template>
<style lang="less" scope></style>
