<script setup lang="tsx">
import { ElDrawer, ElMessage } from 'element-plus'
import { Form, FormSchema } from '@/components/Form'
import { reactive, ref } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import { addDateApi } from '@/api/systemManagement/index'
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

const emit = defineEmits(['update:isDrawer', 'get-data'])
const close = () => {
  console.log('关闭弹窗')
  emit('update:isDrawer', false)
  emit('get-data')
}
const open = () => {
  console.log('打开弹窗')
}
const { formMethods, formRegister } = useForm()
const { getElFormExpose, getFormData } = formMethods
const resetClick = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
}
const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '特征名称',
    component: 'Input',
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      placeholder: '请输入特征名称'
    }
  },
  {
    field: 'company',
    label: '受害方',
    component: 'Input',
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      placeholder: '请输入受害方'
    }
  },
  {
    field: 'category',
    label: '受害方分类',
    component: 'Select',
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      options: [
        {
          value: '政府',
          label: '政府'
        },
        {
          value: '公检法部门',
          label: '公检法部门'
        },
        {
          value: '税务部门',
          label: '税务部门'
        },
        {
          value: '金融',
          label: '金融'
        },
        {
          value: '证券',
          label: '证券'
        },
        {
          value: '国企',
          label: '国企'
        },
        {
          value: '高校',
          label: '高校'
        },
        {
          value: '电子商务',
          label: '电子商务'
        }
      ]
    }
  },
  {
    field: 'rule',
    label: '特征内容',
    component: 'Input',
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      type: 'textarea',
      autosize: { minRows: 11, maxRows: 16 },
      resize: 'none',
      placeholder:
        '支持多种关键特征的组合：title、body、FID、ICON_hash、domain、SDK等，支持&、||的关联关系。'
    }
  },
  {
    field: 'reviewer',
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
  await elFormExpose?.validate((v) => {
    isValid.value = v
  })
  if (isValid.value) {
    //获取form数据
    let formData = await getFormData()
    console.log(formData)
    let res = await addDateApi({ ...formData, from: 'user', createBy: 'user' })
    console.log(res)
    //发起post请求
    if (res.code == 0) {
      isValid.value = false
      close()
      ElMessage.success('添加成功')
    }
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
    <Form :isCol="false" :schema="schema" @register="formRegister" />
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
