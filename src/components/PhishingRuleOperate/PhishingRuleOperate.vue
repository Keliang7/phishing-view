<script setup lang="tsx">
import { ElDrawer, ElMessage } from 'element-plus'
import { Form, FormSchema } from '@/components/Form'
import { reactive, ref } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import { addApi, editApi, deleteApi } from '@/api/systemManagement/PhishingRule'
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
    type: Object
  },
  operateType: {
    type: String
  },
  recheckType: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '暂无内容'
  }
})
const emit = defineEmits(['update:isDrawer', 'get-data'])
const close = () => {
  resetForm()
  emit('update:isDrawer', false)
}
const open = () => {
  if (props.operateType === 'Edit') {
    setValues({
      featureName: props.data?.featureName,
      victim: props.data?.victim,
      victimType: props.data?.victimType,
      featureContent: props.data?.featureContent,
      reviewer: props.data?.reviewer
    })
    addSchema(
      {
        field: 'editFeatureContent',
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
      4
    )
    setSchema([
      {
        field: 'featureContent',
        path: 'componentProps.disabled',
        value: true
      }
    ])
  }
  if (props.operateType === 'Delete') {
    setValues({
      featureName: props.data?.featureName,
      victim: props.data?.victim,
      victimType: props.data?.victimType,
      featureContent: props.data?.featureContent,
      reviewer: props.data?.reviewer
    })
    addSchema(
      {
        field: 'deleteReason',
        label: '删除原因',
        component: 'Input',
        formItemProps: {
          rules: [required()]
        },
        componentProps: {
          type: 'textarea',
          autosize: { minRows: 11, maxRows: 16 },
          resize: 'none'
        }
      },
      4
    )
    setSchema([
      {
        field: 'featureContent',
        path: 'componentProps.disabled',
        value: true
      }
    ])
  }
}
const { formMethods, formRegister } = useForm()
const { getElFormExpose, getFormData, setValues, addSchema, setSchema, delSchema } = formMethods
const resetClick = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
}
const schema = reactive<FormSchema[]>([
  {
    field: 'featureName',
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
    field: 'victim',
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
    field: 'victimType',
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
    field: 'featureContent',
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
    value: '',
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
const resetForm = () => {
  resetClick()
  delSchema('editFeatureContent')
  delSchema('deleteReason')
  delSchema('operationType')
  setSchema([
    {
      field: 'featureContent',
      path: 'componentProps.disabled',
      value: false
    }
  ])
}
const isValid = ref(false)
const confirmClick = async () => {
  const elFormExpose = await getElFormExpose()
  await elFormExpose?.validate((v) => {
    isValid.value = v
  })
  if (isValid.value) {
    //获取form数据
    let formData = await getFormData()
    if (props.operateType === 'Add') {
      console.log('zheli')
      let res = await addApi({ ...formData, createBy: 'user' })
      if (res.code == 0) {
        isValid.value = false
        resetClick()
        close()
        emit('get-data')
        ElMessage.success('添加成功')
      }
    }
    if (props.operateType === 'Edit') {
      let temp = props.data?.featureID
      let res = await editApi({ ...formData, featureID: +temp })
      if (res.code == 0) {
        isValid.value = false
        resetClick()
        close()
        emit('get-data')
        ElMessage.success('修改成功')
      }
    }
    if (props.operateType === 'Delete') {
      let featureID = +props.data?.featureID
      let deleteReason = formData.deleteReason
      let reviewer = formData.reviewer
      let res = await deleteApi({ featureID, deleteReason, reviewer })
      if (res.code == 0) {
        isValid.value = false
        resetClick()
        close()
        emit('get-data')
        ElMessage.success('删除成功')
      }
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
