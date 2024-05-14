<script setup lang="tsx">
import { ElDrawer, ElAlert, ElMessage } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { Form, FormSchema } from '@/components/Form'
import { reactive } from 'vue'
import { formatToDateTimeSimple } from '@/utils/dateUtil'
import { h } from 'vue'

const { formRegister, formMethods } = useForm()
const { getFormData, setValues, delSchema } = formMethods

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
  },
  fieldName: {
    type: Array
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
          value: 'Excel'
        },
        {
          label: 'CSV',
          value: 'CSV'
        }
      ],
      slots: {
        footer: () => (
          <div class="text-size-12px text-gray">
            <span class="text-red">提示</span>:CSV导出不支持导出图片
          </div>
        )
      }
    }
  },
  {
    field: 'fieldName',
    label: '导出数据字段名',
    component: 'Select',
    componentProps: {
      multiple: true,
      options: props.fieldName
    }
  }
])
const emit = defineEmits(['update:isDrawer', 'clear-selection', 'is-checked-all'])
const close = () => {
  emit('update:isDrawer', false)
}

const open = () => {
  console.log('fieldName', props.fieldName)
  if (!props.fieldName) {
    delSchema('fieldName')
  }
  setValues({
    fileName: `${props.title}_${formatToDateTimeSimple(Date.now())}`
  })
}
//确认
const confirmClick = async () => {
  let formData = await getFormData()
  let temp = props.data.exportDate
  if (props.axiosFn) {
    let res = await props.axiosFn({ ...formData, ...temp })
    if (res.code == 0) {
      close()
      emit('clear-selection')
      emit('is-checked-all', false)
      // ElMessage.success(`导出数据成功，请前往下载中心`)
      ElMessage.success({
        message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
          h('span', null, '导出数据成功，请前往 '),
          h(
            'i',
            {
              style: 'color: #409EFF;cursor: pointer',
              onClick: () => {
                window.location.hash = '/downloadCenter'
              }
            },
            '下载中心'
          )
        ])
      })
    }
  }
}
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
        <BaseButton type="default" @click="close">取 消</BaseButton>
        <BaseButton type="primary" :disabled="data.count == 0" @click="confirmClick"
          >确 定</BaseButton
        >
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
