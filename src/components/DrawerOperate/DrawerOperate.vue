<script setup lang="tsx">
import { ElDrawer, FormItemProp } from 'element-plus'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { BaseButton } from '@/components/Button'

defineProps({
  title: {
    type: String,
    default: ''
  },
  isDrawer: {
    type: Boolean,
    default: false
  },
  drawerData: {
    type: Object as () => FormSchema[],
    default: null
  },
  isTip: {
    type: Boolean,
    default: true
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
      console.log('验证未通过')
    }
  })
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
      :schema="drawerData"
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
  .el-upload__tip p {
    margin: 0;
  }
  p a {
    cursor: pointer;
    color: var(--el-color-primary);
  }
}

.attention {
  font-size: 13px;
  color: var(--el-color-error);
}
</style>
