<script setup lang="tsx">
import { ref } from 'vue'
import { ElDrawer, ElUpload, ElMessage } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import type { UploadInstance } from 'element-plus'
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
const submitUpload = () => {
  const uploadRef = ref<UploadInstance>()
  uploadRef.value!.submit()
}
</script>
<template>
  <ElDrawer :title="title" :modelValue="isDrawer" :before-close="close" custom-class="drawerWidth">
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
