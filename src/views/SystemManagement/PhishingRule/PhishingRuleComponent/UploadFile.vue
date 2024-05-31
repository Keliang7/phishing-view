<script setup lang="tsx">
import { ref } from 'vue'
import { ElDrawer, ElUpload, ElMessage } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import type { UploadInstance } from 'element-plus'
import { getStaticFileApi } from '@/api/downLoadCenter'
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
const emit = defineEmits(['update:isDrawer', 'get-data'])
const close = () => {
  console.log('关闭弹窗')
  emit('update:isDrawer', false)
  emit('get-data')
}
const uploadRef = ref<UploadInstance>()
const submitUpload = () => {
  uploadRef.value?.submit()
}

const fileList = ref<UploadUserFile[]>([])
const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning('最多选择五个文件上传')
}
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 1) {
    ElMessage.error('文件的大小超过 1MB!')
    return false
  }
  return true
}
const onSuccess: UploadProps['onSuccess'] = (response: any) => {
  if (response.code == 0) {
    ElMessage.success('文件上传成功')
  }
}
const getStaticFile = async () => {
  let res = await getStaticFileApi({ fileName: 'phishingRule' })
  const blob = new Blob([res.data])
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `仿冒数据检测规则模版.xlsx`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
</script>
<template>
  <ElDrawer :title="title" :modelValue="isDrawer" :before-close="close" custom-class="drawerWidth">
    <!-- <Form :isCol="false" :schema="schema" @register="formRegister" /> -->
    <ElUpload
      ref="uploadRef"
      class="upload-demo"
      action="/api/v1/sr/phishing_rule/import"
      accept=".xls,.xlsx"
      drag
      multiple
      :auto-upload="false"
      :limit="5"
      show-file-list
      v-model:file-list="fileList"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
    >
      <div class="el-upload__text">
        拖放文件或 <em>点击上传</em>
        <div class="color-gray font-size-12px">只能上传xlsx文件,不能超过1MB,最多上传5个文件</div>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          <ElButton size="small" link type="primary" @click="getStaticFile">模版下载</ElButton>
        </div>
      </template>
    </ElUpload>
    <template #footer>
      <div style="margin-right: 20px">
        <BaseButton type="primary" @click="submitUpload">提 交</BaseButton>
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
