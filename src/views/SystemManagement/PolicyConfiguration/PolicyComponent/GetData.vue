<script setup lang="tsx">
import { ElDrawer, ElAlert } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { Form, FormSchema } from '@/components/Form'
import { reactive } from 'vue'
import { getDataApi } from '@/api/systemManagement/index'
import { formatToDateTimeSimple } from '@/utils/dateUtil'
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    default: null
  },
  isDrawer: {
    type: Boolean,
    default: false
  },
  exportAll: {
    type: Boolean,
    default: false
  },
  arrayNot: {
    type: Object,
    default: null
  }
})
const { formRegister, formMethods } = useForm()
const { getFormData } = formMethods
const schema = reactive<FormSchema[]>([
  {
    field: 'fileName',
    label: '导出文件的名称',
    component: 'Input',
    value: `白名单_${formatToDateTimeSimple(Date.now())}`
  },
  {
    field: 'type',
    label: '导出文件的格式',
    component: 'Select',
    value: 'excel',
    componentProps: {
      options: [
        {
          label: 'excel',
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
  console.log('打开弹窗')
}
const confirmClick = async () => {
  let formData = await getFormData()
  let res = await getDataApi({
    ruleContents: props.data.ruleContents,
    exportAll: props.exportAll,
    arrayNot: props.arrayNot,
    ...formData
  })
  if (res.code == 0) {
    close()
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
    <ElAlert
      style="width: fit-content"
      title="温馨提示："
      type="success"
      :description="'导出数据，一次最多导出5万条数据，多余数据不会导出。导出成功后请前往系统设置—下载中心，下载文件。 如需导出大批量数据，请您使用API导出结果。'"
      :closable="false"
    />
    <p style="font-size: 12px; color: gray"
      >已选中
      {{ data.isCheckedAll ? data.total - data.cancelData : data.ruleContents.length }} 数据</p
    >
    <Form :schema="schema" label-width="fitcontent" :isCol="false" @register="formRegister" />
    <template #footer>
      <div style="margin-right: 20px">
        <BaseButton type="default" @click="close">取 消</BaseButton>
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
