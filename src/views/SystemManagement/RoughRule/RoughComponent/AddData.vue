<script setup lang="tsx">
import { ref } from 'vue'
import { ElDrawer, ElMessage } from 'element-plus'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { addApi } from '@/api/systemManagement/RoughRule'
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
  placeholder: {
    type: String,
    default: '暂无内容'
  }
})
const emit = defineEmits(['update:isDrawer', 'get-data'])
const close = async () => {
  emit('update:isDrawer', false)
}

const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData } = formMethods
const schema = ref<FormSchema[]>([
  {
    field: 'ruleName',
    label: `规则名称：`,
    component: 'Input',
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'ruleContent',
    label: `规则内容：`,
    component: 'Input',
    componentProps: {
      type: 'textarea',
      placeholder: `请输入确认非仿冒网站的域名，匹配成功将不会入库。一行一个域名，可输入多行，最多输入1000行。`,
      autosize: { minRows: 11, maxRows: 16 },
      resize: 'none'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'isEnable',
    label: `是否启用：`,
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '启用',
          value: true
        },
        {
          label: '禁用',
          value: false
        }
      ]
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'applyTable',
    label: `数据表：`,
    component: 'Input',
    formItemProps: {
      rules: [required()]
    }
  }
])
const resetClick = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
}
// 查询
const loading = ref(false)
const confirmClick = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const formData = await getFormData()
      const res = await addApi(formData)
      if (res.code == 0) {
        loading.value = false
        close().then(() => {
          ElMessage.success('添加规则成功')
          emit('get-data')
        })
      }
    }
  })
}
</script>
<template>
  <ElDrawer :title="title" :modelValue="isDrawer" :before-close="close" custom-class="drawerWidth">
    <Form :autoSetPlaceholder="false" :schema="schema" @register="formRegister" :isCol="false" />
    <template #footer>
      <div style="margin-right: 20px">
        <BaseButton type="default" @click="resetClick">重 置</BaseButton>
        <BaseButton type="primary" :loading="loading" @click="confirmClick">确 定</BaseButton>
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
