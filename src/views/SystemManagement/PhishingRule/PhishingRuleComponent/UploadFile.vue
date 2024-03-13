<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { reactive, ref } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { ElDrawer, ElUpload, ElMessage } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
// import type { UploadInstance } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
const { required } = useValidator()
defineProps({
  title: {
    type: String,
    default: ''
  },
  isDrawer: {
    type: Boolean,
    default: false
  },
  bodyInfo: {
    type: Object,
    default: null
  },
  placeholder: {
    type: String,
    default: '暂无内容'
  }
})
const emit = defineEmits(['update:isDrawer'])
const close = () => {
  console.log('关闭弹窗')
  emit('update:isDrawer', false)
}
const { formMethods, formRegister } = useForm()
const { getElFormExpose, getFormData } = formMethods
const schema = reactive<FormSchema[]>([
  {
    field: 'field5',
    label: '复核人员',
    component: 'Select',
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      options: [
        {
          value: '张',
          label: '张'
        },
        {
          value: '王',
          label: '王'
        }
      ]
    }
  }
])
const isValid = ref(false)
const confirmClick = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.validate((v) => {
    isValid.value = v
  })
  if (isValid.value) {
    //获取form数据
    let formData = await getFormData()
    console.log(formData)
    //发起post请求
    // if (res.message == '添加成功') {

    // }

    isValid.value = false
    close()
  }
}

const fileList = ref<UploadUserFile[]>([])
const handleChange: UploadProps['onChange'] = (uploadFile) => {
  fileList.value.push(uploadFile)
  console.log('已选中的文件列表', fileList.value)
}
const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning('最多选择五个文件上传')
}
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'xlsx') {
    ElMessage.error('只支持xlsx文件!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 1) {
    ElMessage.error('文件的大小超过 1MB!')
    return false
  }
  return true
}
</script>
<template>
  <ElDrawer :title="title" :modelValue="isDrawer" :before-close="close" custom-class="drawerWidth">
    <Form :isCol="false" :schema="schema" @register="formRegister" />
    <ElUpload
      class="upload-demo"
      drag
      multiple
      :auto-upload="false"
      :limit="5"
      show-file-list
      v-model:file-list="fileList"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
    >
      <div class="el-upload__text"> 拖放文件或 <em>点击上传</em> </div>
      <template #tip>
        <div class="el-upload__tip">
          只能上传xlsx文件,不能超过1MB,最多上传5个文件；文件模版
          <a href="#">下载</a>
        </div>
        已选中 {{ fileList.length }}个
      </template>
    </ElUpload>
    <template #footer>
      <div style="margin-right: 20px">
        <BaseButton type="primary" @click="confirmClick">提 交</BaseButton>
      </div>
    </template>
  </ElDrawer>
</template>
<style lang="less" scope>
.el-drawer__title {
  font-size: 18px;
}
.el-drawer__header {
  margin-bottom: 0px;
  padding-bottom: 20px;
  border-bottom: 2px solid #ebeef5;
}
</style>
