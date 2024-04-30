<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, ref, onMounted, watch, defineEmits } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { Form, FormSchema } from '@/components/Form'
import { formatTime, Timestamp } from '@/utils'
import { BaseButton } from '@/components/Button'
import { ElRow, ElCol } from 'element-plus'
const props = defineProps({
  dataArray: {
    type: Array,
    default: null
  },
  title: {
    type: String
  },
  total: {
    type: Number
  },
  tipTitle: {
    type: String,
    default: ''
  }
})
const { t } = useI18n()
const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData } = formMethods
const emit = defineEmits(['search-data'])
// 查询到的表格数据
let searchData = reactive({})
let schema = ref<FormSchema[]>([
  //数据管理
  {
    field: 'url',
    label: `${t('formDemo.url')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入URL'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'domain',
    label: `${t('formDemo.domain')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入域名'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'ip',
    label: `${t('formDemo.ip')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入IP'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'collectStatus',
    label: '采集状态：',
    component: 'Select',
    componentProps: {
      options: [
        {
          value: '未采集到',
          label: '未采集到'
        },
        {
          value: '采集中',
          label: '采集中'
        },
        {
          value: '采集完成',
          label: '采集完成'
        }
      ]
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'extstatus',
    label: '拓线状态：',
    component: 'Select',
    componentProps: {
      options: [
        {
          value: '拓线完成',
          label: '拓线完成'
        },
        {
          value: '拓线中',
          label: '拓线中'
        },
        {
          value: '拓线失败',
          label: '拓线失败'
        }
      ]
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'status',
    label: '状态：',
    component: 'Select',
    componentProps: {
      options: [
        {
          value: '拓线中',
          label: '拓线中'
        },
        {
          value: '拓线完成',
          label: '拓线完成'
        },
        {
          value: '拓线失败',
          label: '拓线失败'
        },
        {
          value: '更新中',
          label: '更新中'
        },
        {
          value: '更新完成',
          label: '更新完成'
        },
        {
          value: '更新失败',
          label: '更新失败'
        },
        {
          value: '采集中',
          label: '采集中'
        },
        {
          value: '采集完成',
          label: '采集完成'
        },
        {
          value: '采集失败',
          label: '采集失败'
        }
      ]
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'discoveryTime',
    component: 'DatePicker',
    label: `${t('formDemo.discoveryTime')}：`,
    componentProps: {
      type: 'date',
      placeholder: formatTime(new Date(), 'yyyy-MM-dd')
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'victim',
    label: `${t('formDemo.victim')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入受害方'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'victimType',
    label: `${t('formDemo.victimType')}：`,
    component: 'Select',
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
      ],
      placeholder: '请选择受害方类型'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'misReason',
    label: `${t('formDemo.omissionReason')}：`,
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '推送策略过滤，数据未推送',
          value: 1
        },
        {
          label: '仿冒特征规则匹配失败，判定为非仿冒数据',
          value: 2
        },
        {
          label: '白名单过滤成功，数据未入库',
          value: 3
        },
        {
          label: '粗放规则过滤失败，未入库',
          value: 4
        },
        {
          label: '数据源未推送数据，系统未获取到数据',
          value: 5
        }
      ],
      placeholder: '请选择漏报原因'
    },
    colProps: {
      span: 6
    }
  },
  //数据拓线管理
  {
    field: 'taskID',
    label: '任务ID：',
    component: 'Input',
    componentProps: {
      placeholder: '请输入任务ID'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'taskName',
    label: '任务名称：',
    component: 'Input',
    componentProps: {
      placeholder: '请输入任务名称'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'distributeTypeExt',
    label: '下发方式',
    component: 'Select',
    componentProps: {
      placeholder: '请选下发方式',
      options: [
        {
          label: '系统自动拓线',
          value: '系统自动拓线'
        },
        {
          label: '人工触发',
          value: '人工触发'
        }
      ]
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'createdBy',
    label: `${t('formDemo.createdBy')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入创建人'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'createdTime',
    component: 'DatePicker',
    label: `${t('formDemo.createdTime')}：`,
    componentProps: {
      type: 'daterange'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'title',
    label: `title：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入title'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'FID',
    label: `FID：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入FID'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'netStatusCode',
    label: `网络状态码：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入网络状态码'
    },
    colProps: {
      span: 6
    }
  },
  //数据采集管理
  {
    field: 'distributeType',
    label: '下发方式：',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '自动化采集',
          value: '自动下发'
        },
        {
          label: '人工触发',
          value: '人工下发'
        }
      ]
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'probeType',
    label: '探测类型：',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '网站探测任务',
          value: 'webAsset'
        },
        {
          label: '域名探测任务',
          value: 'domainResolve'
        },
        {
          label: '资产探测任务',
          value: 'ipAsset'
        }
      ]
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'taskStatus',
    label: '任务状态：',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '已下发',
          value: '已下发'
        },
        {
          label: '扫描中',
          value: '执行中'
        },
        {
          label: '扫描完成',
          value: '完成'
        },
        {
          label: '扫描失败',
          value: '执行错误'
        },
        {
          label: '停止中',
          value: '停止中'
        },
        {
          label: '停止完成',
          value: '已停止'
        }
      ]
    },
    colProps: {
      span: 6
    }
  },
  //icon我们用插槽
  //用户管理
  {
    field: 'loginName',
    label: `登录名`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入登录名'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'email',
    label: `邮箱`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入邮箱'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'telephone',
    label: `手机号`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入手机号'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'roleName',
    label: `角色名称：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入角色名称'
    },
    colProps: {
      span: 6
    }
  },
  //日志管理
  {
    field: 'loginIP',
    label: `登录IP：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入登录IP'
    },
    colProps: {
      span: 6
    }
  },
  //系统管理
  {
    field: 'ruleContent',
    label: `${t('formDemo.ruleContent')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入规则内容'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'addType',
    label: `${t('formDemo.addType')}：`,
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '系统预置',
          value: 'system'
        },
        {
          label: '自定义',
          value: 'user'
        }
      ]
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'featureContent',
    label: `${t('formDemo.featureContent')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入特征内容'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'featureID',
    label: `${t('formDemo.featureID')}：`,
    component: 'Input',
    componentProps: {
      placeholder: '请输入特征ID'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'checkStatus',
    label: '复核状态：',
    component: 'Select',
    componentProps: {
      options: [
        {
          value: '未复核',
          label: '未复核'
        },
        {
          value: 'submitCheck',
          label: '提交复核'
        },
        {
          value: '复核通过',
          label: '复核通过'
        }
      ]
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'operationType',
    label: '操作类型',
    component: 'Select',
    componentProps: {
      options: [
        {
          value: 'add',
          label: '新增'
        },
        {
          value: 'edit',
          label: '编辑'
        },
        {
          value: 'delete',
          label: '删除'
        }
      ]
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'websiteName',
    label: '网站名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入网站名称'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'ICON_hash',
    label: 'ICON_hash',
    component: 'Input',
    componentProps: {
      placeholder: '请输入ICON_hash'
    },
    colProps: {
      span: 6
    }
  }
])
let schemaCopy = ref<FormSchema[]>([])
const getShowData = () => {
  let temp = schema.value.filter((i) => props.dataArray.includes(i.field))
  temp.sort((a, b) => props.dataArray.indexOf(a.field) - props.dataArray.indexOf(b.field))
  schemaCopy.value = temp
}
onMounted(async () => {
  await getShowData()
})
// 当同一个页面，不同的高级搜索组件进行切换时，需要用watch来监听变化。
watch(() => props.dataArray, getShowData)
// 重置
const verifyReset = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
}
// 查询
const searchFn = async () => {
  const formData = await getFormData()
  if (formData.discoveryTime) formData.discoveryTime = Timestamp(formData.discoveryTime)
  let temp = formData.createdTime
  let startTime = Timestamp(temp?.[0])
  let endTime = Timestamp(temp?.[1])
  delete formData.createdTime
  if (temp) {
    searchData = { ...formData, startTime, endTime }
  } else {
    searchData = formData
  }
  console.log('advanceSearch-searchData', searchData)
  emit('search-data', searchData)
}
</script>
<template>
  <ContentWrap class="advance-search" style="margin-bottom: 20px">
    <ElRow class="mb-1rem">
      <ElCol :span="8">
        <div class="title flex">
          <h3 class="m-0">{{ title }}</h3>
          <span
            v-if="total"
            class="bg-#0B56FA text-white font-size-12px ml-8px px-6px border-rounded-2px flex items-center"
            >{{ total }}</span
          >
        </div>
      </ElCol>
      <ElCol :span="8" v-if="tipTitle">
        <div class="flex justify-center items-center h-100%">
          <div class="bg-#D3DEFE font-size-12px p-8px flex items-center border-rounded-4px">
            <div
              class="border-rounded-2 bg-#0B56FA w-16px h-16px flex justify-center items-center text-white ml-4px mr-4px"
              >i</div
            >
            温馨提示：{{ tipTitle }}
          </div>
        </div>
      </ElCol>
    </ElRow>
    <Form :autoSetPlaceholder="false" :schema="schemaCopy" @register="formRegister" />
    <div class="height-32px float-right p-10px">
      <BaseButton type="default" @click="verifyReset"> 重置 </BaseButton>
      <BaseButton type="primary" @click="searchFn"> 查询 </BaseButton>
    </div>
  </ContentWrap>
</template>
<style lang="less" scoped></style>
