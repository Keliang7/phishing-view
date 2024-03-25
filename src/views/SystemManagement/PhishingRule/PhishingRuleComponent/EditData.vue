<script setup lang="tsx">
import { ElDrawer, ElMessage } from 'element-plus'
import { Form, FormSchema } from '@/components/Form'
import { reactive, ref } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import { editDateApi } from '@/api/systemManagement/index'
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
  data: {
    type: Object,
    default: null
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

const { formMethods, formRegister } = useForm()
const { getElFormExpose, getFormData, setValues } = formMethods
const resetClick = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields(['name', 'company', 'categoty', 'rule', 'reviewer'])
}

console.log('我在这能打印吗', props.data)
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
    field: 'categoty',
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
    field: 'content',
    label: '特征内容',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      autosize: { minRows: 11, maxRows: 16 },
      resize: 'none',
      disabled: true
    }
  },
  {
    field: 'rule',
    label: '编辑特征内容',
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

const emit = defineEmits(['update:isDrawer', 'get-data'])
const close = () => {
  console.log('关闭弹窗')
  emit('update:isDrawer', false)
  emit('get-data')
}
const open = () => {
  console.log('打印在这里', props.data)
  setValues({
    name: props.data.featureName,
    company: props.data.victim,
    categoty: props.data.victimType,
    rule: props.data.featureContent,
    content: props.data.featureContent,
    reviewer: props.data.reviewer
  })
  console.log('打开弹窗')
}
const isValid = ref(false)
const confirmClick = async () => {
  console.log(123)
  const elFormExpose = await getElFormExpose()
  await elFormExpose?.validate((v) => {
    isValid.value = v
  })
  if (isValid.value) {
    //获取form数据
    let formData = await getFormData()
    let temp = props.data.featureID
    let res = await editDateApi({
      ...formData,
      from: 'user',
      createBy: 'user',
      id: Number(temp)
    })
    //发起post请求
    if (res.code == 0) {
      isValid.value = false
      close()
      ElMessage.success('修改成功')
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
