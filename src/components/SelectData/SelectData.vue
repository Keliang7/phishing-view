<script setup lang="tsx">
import { ElDrawer } from 'element-plus'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { BaseButton } from '@/components/Button'
import { useValidator } from '@/hooks/web/useValidator'
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElMessageBox, ElMessage } from 'element-plus'
import { addApi } from '@/api/dataGather/gatherTask'
const { t } = useI18n()
const { required, notSpace } = useValidator()
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  isDrawer: {
    type: Boolean,
    default: false
  },
  isPort: {
    type: Boolean,
    default: false
  },
  isFile: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array as () => Array<{ ipv4: string; url: string; domain: string; [key: string]: any }>
  }
})

const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData, setValues, addSchema, delSchema } = formMethods
const schema = ref<FormSchema[]>([
  {
    field: 'taskName',
    label: `${t('formDemo.taskName')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入任务名称'
    },
    formItemProps: {
      rules: [required(), notSpace()]
    }
  },
  {
    field: 'exploreType',
    label: `${t('formDemo.exploreType')}：`,
    component: 'Select',
    componentProps: {
      on: {
        change(v) {
          delSchema('explorePort')
          if (v == 'ipAsset') {
            //设置text里的值
            setValues({
              exploreAimText: [...new Set(props.data?.map((i) => i.ipv4))]
                .filter((i) => i !== '')
                .join(`\n`)
            })
            setValues({
              explorePort: [...new Set(props.data?.map((i) => i.aimPort))]
                .filter((i) => i !== '')
                .join(`\n`)
            })
            addSchema(
              {
                field: 'explorePort',
                label: `${t('formDemo.explorePort')}：`,
                component: 'Input',
                componentProps: {
                  class: 'test',
                  type: 'textarea',
                  rows: 4
                }
              },
              -2
            )
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
      },
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
      ]
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
      rules: [required()]
    }
  },
  {
    field: 'intention',
    label: `意图：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入意图'
    },
    formItemProps: {
      rules: [required()]
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
  console.log('关闭弹窗')
  delSchema(`inputType`)
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
  emit('update:isDrawer', false)
}
const open = () => {
  if (props.isFile) {
    addSchema(
      {
        field: `inputType`,
        label: `输入方式：`,
        component: 'Select',
        componentProps: {
          options: [
            { label: '文本输入', value: 'text' },
            { label: '文件上传', value: 'file' }
          ],
          on: {
            change: (v) => {
              delSchema('exploreAimFile')
              delSchema('exploreAimText')
              if (v == 'text') {
                addSchema(
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
                      rules: [required()]
                    }
                  },
                  3
                )
              } else {
                addSchema(
                  {
                    field: 'exploreAimFile',
                    label: `${t('formDemo.exploreAim')}：`,
                    component: 'Upload',
                    componentProps: {
                      limit: 1,
                      // action: '',
                      autoUpload: false,
                      ref: 'uploadRef',
                      onPreview: (uploadFile) => {
                        console.log(uploadFile)
                      },
                      onRemove: (file) => {
                        console.log(file)
                      },
                      beforeRemove: (uploadFile) => {
                        return ElMessageBox.confirm(
                          `Cancel the transfer of ${uploadFile.name} ?`
                        ).then(
                          () => true,
                          () => false
                        )
                      },
                      onExceed: (files, uploadFiles) => {
                        ElMessage.warning(
                          `The limit is 1, you selected ${files.length} files this time, add up to ${
                            files.length + uploadFiles.length
                          } totally`
                        )
                      },
                      slots: {
                        trigger: () => <BaseButton type="primary">点击上传</BaseButton>,
                        default: () => (
                          <div class="el-upload__tip">
                            <p>
                              支持上传.xlsx、.xls、.txt、.xml、.json、.csv文件，最大上传文件为1M{' '}
                              <a>下载模板</a>
                            </p>
                            <p class="attention">
                              注意：目标地址添加方式为文件上传时，系统调度策略默认按IP拆分。
                            </p>
                          </div>
                        )
                      }
                    },
                    formItemProps: {
                      rules: [required()]
                    }
                  },
                  3
                )
              }
            }
          }
        },
        formItemProps: {
          rules: [required()]
        }
      },
      2
    )
  }
  console.log('打开')
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
  delete formData.inputType
  elFormExpose?.validate(async (isValid) => {
    if (isValid) {
      if (formData.exploreAimFile) {
        formData.exploreAimFile = formData.exploreAimFile[0].raw
      } else {
        delete formData.exploreAimFile
      }
      const res = await addApi(formData)
      if (res.code == 0) {
        close()
        ElMessage.success('添加任务成功')
      }
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
    <Form :autoSetPlaceholder="false" :schema="schema" @register="formRegister" :isCol="false" />
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
.test::after {
  content: '请输入IP、IP段，可支持多行，最多支持10000个目标,一行一个';
  color: grey;
  font-size: 12px;
}
</style>
