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
  },
  axiosFn: {
    type: Function
  }
})
const emit = defineEmits(['update:isDrawer', 'get-data'])
const close = () => {
  console.log('关闭弹窗')
  uploadRef.value?.clearFiles()
  emit('update:isDrawer', false)
  emit('get-data')
}
const fileList = ref<UploadUserFile[]>([])
const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning('最多选择五个文件上传')
}
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  if (file.size / 1024 / 1024 > 1) {
    ElMessage.error(`${file.name}文件的大小超过 1MB!`)
    return false
  }
  return true
}
const onSuccess: UploadProps['onSuccess'] = (response: any) => {
  if (response.code == 0) {
    ElMessage.success('文件上传成功')
  }
}
const uploadRef = ref<UploadInstance>()
const submitUpload = () => {
  uploadRef.value?.submit()
}
const getStaticFile = async () => {
  let res = await getStaticFileApi('whiteList')
  console.log(res)
}
</script>
<template>
  <ElDrawer :title="title" :modelValue="isDrawer" :before-close="close" custom-class="drawerWidth">
    <ElUpload
      ref="uploadRef"
      class="upload-demo"
      action="/api/v1/wl/white_list/import"
      drag
      :auto-upload="false"
      accept=".xls,.xlsx"
      show-file-list
      v-model:file-list="fileList"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
    >
      <div class="el-upload__text"> 拖放文件或 <em>点击上传</em> </div>
      <template #tip>
        <div class="el-upload__tip">
          只能上传xlsx文件,不能超过1MB,最多上传5个文件；文件模版
          <p @click="getStaticFile">下载</p>
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
