<script setup lang="tsx">
import { ElDrawer, ElAlert, ElMessage } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { Form, FormSchema } from '@/components/Form'
import { reactive } from 'vue'
import { formatToDateTimeSimple } from '@/utils/dateUtil'

const { formRegister, formMethods } = useForm()
const { getFormData, setValues } = formMethods

const props = defineProps({
  isDrawer: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '未命名'
  },
  data: {
    type: Object,
    default: null
  },
  axiosFn: {
    type: Function
  }
})
const schema = reactive<FormSchema[]>([
  {
    field: 'fileName',
    label: '导出文件的名称',
    component: 'Input',
    value: `${props.title}_${formatToDateTimeSimple(Date.now())}`
  },
  {
    field: 'type',
    label: '导出文件的格式',
    component: 'Select',
    value: 'Excel',
    componentProps: {
      options: [
        {
          label: 'Excel',
          value: '1'
        },
        {
          label: 'CSV',
          value: '2'
        }
      ]
    }
  }
])
const emit = defineEmits(['update:isDrawer'])
const close = () => {
  console.log('关闭弹窗')
  emit('update:isDrawer', false)
}

const open = () => {
  setValues({
    fileName: `${props.title}_${formatToDateTimeSimple(Date.now())}`
  })
  console.log('打开弹窗')
}
//确认
const confirmClick = async () => {
  let formData = await getFormData()
  let temp = props.data.exportDate
  if (props.axiosFn) {
    let res = await props.axiosFn({ ...formData, ...temp })
    console.log('res', res)
    if (res.code == 0) {
      close()
      ElMessage.success('导出数据成功，请前往下载中心')
    }
  }
}
//取消
</script>
<template>
  <ElDrawer :title="title" :model-value="isDrawer" @open="open" :before-close="close">
    <ElAlert
      class="el-alert-custom"
      :description="'导出数据，一次最多导出5万条数据，多余数据不会导出。导出成功后请前往系统设置—下载中心，下载文件。 如需导出大批量数据，请您使用API导出结果。'"
      :closable="false"
    />
    <p style="font-size: 12px; color: gray">已选中数据：{{ data.count }}条</p>
    <Form :schema="schema" label-width="fitcontent" :isCol="false" @register="formRegister" />
    <template #footer>
      <div style="margin-right: 20px">
        <BaseButton type="default" @click="confirmClick">取 消</BaseButton>
        <BaseButton type="primary" @click="confirmClick">确 定</BaseButton>
      </div>
    </template>
  </ElDrawer>
</template>
<style scoped>
.el-alert-custom {
  background-color: #e9f6fe; /* Change background color */
  border: 1px solid #a0d3fb;
  padding: 6px 12px;
  margin-left: 2px;
  width: fit-content;
}
</style>
