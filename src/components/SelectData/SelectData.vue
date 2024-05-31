<script setup lang="tsx">
import { ElDrawer, ElButton } from 'element-plus'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { BaseButton } from '@/components/Button'
import { useValidator } from '@/hooks/web/useValidator'
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElMessage } from 'element-plus'
import { addApi } from '@/api/dataGather/gatherTask'
import { getStaticFileApi } from '@/api/downLoadCenter'
const { t } = useI18n()
const { required, notSpecialCharacters, notSpace } = useValidator()
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  isDrawer: {
    type: Boolean,
    default: false
  },
  isFile: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array as () => Array<{
      ipv4: string | null
      ipv6: string | null
      ip: string | null
      url: string | null
      domain: string | null
      [key: string]: any
    }>
  }
})

const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData, setValues, setSchema } = formMethods
const schema = ref<FormSchema[]>([
  {
    field: 'taskName',
    label: `${t('formDemo.taskName')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入任务名称'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'exploreType',
    label: `${t('formDemo.exploreType')}：`,
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '资产探测（可探测title、FID、IP等信息）',
          value: 'ipAsset'
        },
        {
          label: '网站探测（可探测网站截图）',
          value: 'webAsset'
        },
        {
          label: '域名探测（可探测WHOIS、网站备案信息）',
          value: 'domainResolve'
        }
      ],
      on: {
        change(v) {
          setSchema([
            {
              field: 'explorePort',
              path: 'remove',
              value: true
            }
          ])
          if (v == 'ipAsset') {
            setValues({
              exploreAimText: [...new Set(props.data?.map((i) => i.ipv4 || i.ipv6 || i.ip))]
                .filter((i) => i !== '')
                .join(`\n`)
            })
            setValues({
              explorePort:
                [...new Set(props.data?.map((i) => i.aimPort || i.port))]
                  .filter((i) => i !== '')
                  .join(`\n`) || '80\n443'
            })
            setSchema([
              {
                field: 'explorePort',
                path: 'remove',
                value: false
              }
            ])
          }
          if (v == 'webAsset') {
            setValues({
              exploreAimText: [...new Set(props.data?.map((i) => i.url))]
                .filter((i) => i !== '')
                .join(`\n`)
            })
          }
          if (v == 'domainResolve') {
            setValues({
              exploreAimText: [...new Set(props.data?.map((i) => i.domain))]
                .filter((i) => i !== '')
                .join(`\n`)
            })
          }
        }
      }
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'exploreAimText',
    component: 'Input',
    label: `${t('formDemo.exploreAim')}：`,
    componentProps: {
      labelWidth: '20px',
      type: 'textarea',
      placeholder: `'请输入IP、IP段，可支持多行，最多支持10000个目标\n支持格式如下：\n192.168.10.0-100\n192.168.1.2\n192.168.1.0/32'`,
      rows: 8
    },
    formItemProps: {
      rules: [required(), notSpecialCharacters(), notSpace()]
    }
  },
  {
    field: 'exploreAimFile',
    component: 'Upload',
    hidden: !props.isFile,
    componentProps: {
      className: 'ml-90px',
      limit: 1,
      autoUpload: false,
      ref: 'uploadRef',
      slots: {
        trigger: () => <BaseButton type="primary">点击上传</BaseButton>,
        default: () => (
          <div class="el-upload__tip">
            <div class="font-size-12px">
              支持上传.xlsx、.xls、.txt、.xml、.json、.csv文件，最大上传文件为1M
              <ElButton link type="primary" size="small" onClick={getStaticFile}>
                下载模板
              </ElButton>
            </div>
            <div class="color-red">
              注意：目标地址添加方式为文件上传时，系统调度策略默认按IP拆分。
            </div>
          </div>
        )
      }
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'explorePort',
    label: `${t('formDemo.explorePort')}：`,
    remove: true,
    component: 'Input',
    componentProps: {
      class: 'test',
      type: 'textarea',
      rows: 4
    },
    formItemProps: {
      rules: [required(), notSpecialCharacters(), notSpace()]
    }
  },
  {
    field: 'priority',
    label: `${t('formDemo.priority')}：`,
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '紧急',
          value: '紧急'
        },
        {
          label: '高',
          value: '高'
        },
        {
          label: '中',
          value: '中'
        },
        {
          label: '低',
          value: '低'
        }
      ]
    },
    formItemProps: {
      rules: [required()]
    }
  }
])
//抽屉打开关闭
const emit = defineEmits(['update:isDrawer'])
const close = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
  emit('update:isDrawer', false)
}
// 重置
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
      if (formData.exploreAimFile) {
        formData.exploreAimFile = formData.exploreAimFile[0].raw
      }
      const res = await addApi(formData)
      if (res.code == 0) {
        loading.value = false
        close().then(() => {
          ElMessage.success('添加任务成功')
        })
      }
    }
  })
}
//模版
const getStaticFile = async () => {
  let res = await getStaticFileApi({ fileName: 'gather' })
  const blob = new Blob([res.data])
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `采集任务模版.xlsx`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
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
.test::after {
  content: '请输入IP、IP段，可支持多行，最多支持10000个目标,一行一个';
  color: grey;
  font-size: 12px;
}
</style>
