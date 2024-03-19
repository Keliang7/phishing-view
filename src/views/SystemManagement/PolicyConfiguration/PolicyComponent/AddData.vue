<script setup lang="tsx">
import { ref } from 'vue'
import { ElDrawer, ElInput, ElMessage } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { postWhiteListApi } from '@/api/systemManagement'
import { useUserStore } from '@/store/modules/user'
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
const { formMethods } = useForm()
const { getElFormExpose } = formMethods
const emit = defineEmits(['update:isDrawer', 'get-data'])
const close = () => {
  console.log('关闭弹窗')
  emit('update:isDrawer', false)
}
const AddDataValue = ref(``)
const open = () => {
  console.log('打开弹窗')
}
const resetClick = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
}
const confirmClick = async () => {
  const createdBy = useUserStore().getUserInfo?.username

  let res = await postWhiteListApi({
    createdBy,
    addType: 'user',
    ruleContents: AddDataValue.value
  })
  if (res.message == '插入成功') {
    close()
    ElMessage.success('添加数据成功')
    emit('get-data')
  }
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
    <ElInput
      v-model="AddDataValue"
      type="textarea"
      :autosize="{ minRows: 11, maxRows: 16 }"
      resize="none"
      :placeholder="placeholder"
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
.el-drawer__title {
  font-size: 18px;
}
.el-drawer__header {
  margin-bottom: 0px;
  padding-bottom: 20px;
  border-bottom: 2px solid #ebeef5;
}
</style>
