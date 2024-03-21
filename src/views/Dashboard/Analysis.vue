<script setup lang="ts">
import { watch } from 'vue'
import * as echarts from 'echarts'
import { CountTo } from '@/components/CountTo'
import { useDesign } from '@/hooks/web/useDesign'
import {
  ElRow,
  ElCol,
  ElCard,
  ElSkeleton,
  ElTabs,
  ElTabPane,
  ElDatePicker,
  ElAlert,
  ElTableColumn,
  ElTable,
  ElPopover
} from 'element-plus'
import { Echart } from '@/components/Echart'
import { ref } from 'vue'
import {
  getCountApi,
  getDataTransformationApi,
  getCounterfeitingIndustryApi,
  getCounterfeitIntentApi,
  getGeographicalDistributionApi,
  getTableDataCountApi,
  getcategoryOptionsApi,
  getDSContributionApi,
  getDSReportApi,
  getTaskMessageApi,
  getExtensionApi,
  getCharacteristicApi
} from '@/api/dashboard/analysis'
import { EChartsOption } from 'echarts'
import { useI18n } from '@/hooks/web/useI18n'
import { onMounted } from 'vue'
import { set } from 'lodash-es'

const { t } = useI18n()
const loading = ref(true)

//选择日期
const today = new Date()
const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(today.getDate() - 7)
const timeArray: any = ref([sevenDaysAgo.getTime(), today.getTime()])
let timeObj = { startTime: timeArray.value[0], endTime: timeArray.value[1] }
watch(timeArray, () => {
  timeObj = { startTime: timeArray.value[0].getTime(), endTime: timeArray.value[1].getTime() }
})
//头部三个
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('panel')
const totalState = ref<any[]>([])
const getCount = async () => {
  const res = await getCountApi(timeObj)
  totalState.value = res.data
}
// 数据转化统计
const funnelOptions: EChartsOption = {
  title: {
    text: '数据转化统计'
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      tooltip: {
        trigger: 'item',
        formatter: '{b}'
      },
      type: 'funnel',
      left: '75%',
      top: '25%',
      width: '0%',
      height: '50%',
      label: {
        formatter: '{b}'
      },
      labelLine: {
        show: true
      },
      itemStyle: {
        opacity: 0.7
      },
      data: [
        { value: 5, name: '转化量100%' },
        { value: 4, name: '转化量50%' },
        { value: 3, name: '转化量30%' },
        { value: 2, name: '转化量20%' },
        { value: 1, name: '误报率10%' }
      ]
    },
    {
      type: 'funnel',
      left: '5%',
      width: '70%',
      maxSize: '100%',
      minSize: '40%',
      label: {
        position: 'inside',
        formatter: '{b}:{c}',
        color: '#fff'
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 2
      },
      emphasis: {
        label: {
          position: 'inside',
          formatter: '{c}'
        }
      },
      data: [
        { value: 100000, name: '待处理URL集合数据总量' },
        { value: 50000, name: '仿冒数据总量' },
        { value: 20000, name: '推送数据总量' },
        { value: 10000, name: '确认仿冒数据总量' },
        { value: 9000, name: '漏报数据总量' },
        { value: 1000, name: '误报数据总量' }
      ],
      z: 100
    }
  ]
}
const getDataTransformation = async () => {
  const res = await getDataTransformationApi(timeObj)
  set(funnelOptions, 'series[0].data', res.data.Trans)
  set(funnelOptions, 'series[1].data', res.data.Total)
}
// 仿冒行业数据统计
const pieOptions: EChartsOption = {
  title: {
    text: '仿冒行业统计',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    bottom: 'bottom',
    type: 'scroll',
    itemWidth: 14,
    data: [
      '政府',
      '公检法部门',
      '税务部门',
      '金融',
      '证券',
      '国企',
      '高校',
      '电子商务',
      '虚假投资诈骗'
    ]
  },
  series: [
    {
      name: t('仿冒行业'),
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '60%'],
      bottom: 30,
      data: []
    }
  ]
}
const getCounterfeitingIndustry = async () => {
  const res = await getCounterfeitingIndustryApi(timeObj)
  set(
    pieOptions,
    'legend.data',
    res.data.map((item) => item.name)
  )
  set(pieOptions, 'series[0].data', res.data)
}
//仿冒意图统计
const pieOptions2: EChartsOption = {
  title: {
    text: '仿冒意图统计',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    bottom: 'bottom',
    type: 'scroll',
    itemWidth: 14,
    data: ['APT', '黑产', '诈骗', '博彩']
  },
  series: [
    {
      name: t('仿冒意图'),
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '60%'],
      bottom: 30,
      data: []
    }
  ]
}
const getCounterfeitIntent = async () => {
  const res = await getCounterfeitIntentApi(timeObj)
  pieOptions2.series![0].data = res.data
}
// 仿冒资产地域分布TOP10
const barOptions: EChartsOption = {
  title: {
    text: t('analysis.ArealDistribution'),
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: 50,
    right: 20,
    bottom: 20
  },
  xAxis: {
    type: 'category',
    data: [],
    axisTick: {
      alignWithLabel: true
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: t('analysis.activeQuantity'),
      data: [],
      type: 'bar'
    }
  ]
}
const getGeographicalDistribution = async () => {
  const res = await getGeographicalDistributionApi(timeObj)
  barOptions.xAxis = {
    type: 'category',
    data: res.data.map((item) => {
      return item.name
    }),
    axisTick: {
      alignWithLabel: true
    }
  }
  barOptions.series![0].data = res.data.map((item) => {
    return item.value
  })
}
// 数据统计category
const tabColumns: any = [
  {
    label: '数据统计',
    name: 'dataCount'
  },
  {
    label: '待处理数据趋势',
    name: 'pendUrlTrend'
  },
  {
    label: '仿冒数据趋势',
    name: 'counterfeitTrend'
  },
  {
    label: '推送数据趋势',
    name: 'pushTrend'
  },
  {
    label: '确认仿冒数据趋势',
    name: 'confirmTrend'
  },
  {
    label: '漏报数据趋势',
    name: 'underreportingTrend'
  },
  {
    label: '误报数据趋势',
    name: 'misreportTrend'
  }
]
const activeName = ref(tabColumns[0].name)
const tableData = ref<any[]>([])
const getTableDataCount = async () => {
  const res = await getTableDataCountApi(timeObj)
  tableData.value = res.data
}
const getCategoryOptions = async (type) => {
  const res = await getcategoryOptionsApi({ type, ...timeObj })
  if (res) {
    const categoryOptions: EChartsOption = {
      xAxis: {
        type: 'category',
        data: res.data.map((v) => {
          return new Date(Number(v.name)).toLocaleDateString()
        })
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'line',
          data: res.data.map((item) => {
            return item.value
          })
        }
      ]
    }
    let dom = document.getElementById(`${type}Div`)
    let echartRef = echarts.init(dom)
    echartRef?.setOption(categoryOptions)
  }
}
const handleClick = async (tab) => {
  if (tab === 'dataCount') {
    getTableDataCount()
  } else {
    getCategoryOptions(tab)
  }
}

//业务贡献量
const contributionTab = [
  {
    label: '数据源贡献值',
    name: 'dataSourceContribution'
  },
  {
    label: '数据源通报贡献值',
    name: 'dataSourceReport'
  }
]
const loading_contribution = ref()
const activeName_contribution = ref(contributionTab[0].name)
const tableData_contribution = ref()
const getTableData_contribution = async () => {
  let result
  loading_contribution.value = true
  if (activeName_contribution.value == 'dataSourceContribution') {
    result = await getDSContributionApi(timeObj)
  }
  if (activeName_contribution.value == 'dataSourceReport') {
    result = await getDSReportApi(timeObj)
  }
  loading_contribution.value = false
  tableData_contribution.value = result.data
}
const handleClick2 = async () => {
  getTableData_contribution()
}
//任务统计
const taskMessageData = ref<any>({})
const getTaskMessageData = async () => {
  let res = await getTaskMessageApi(timeObj)
  taskMessageData.value = res.data
}
const extensionData = ref<any>({})
const getExtensionData = async () => {
  let res = await getExtensionApi(timeObj)
  extensionData.value = res.data
}
//仿冒检测特征统计
const tabColumns3 = [
  {
    label: '仿冒检测特征',
    name: 'rule'
  },
  {
    label: '视觉分析',
    name: 'vision'
  }
]
const activeName3 = ref(tabColumns3[0].name)
const tableData3 = ref()
const getCharacteristicData = async () => {
  let res = await getCharacteristicApi({ type: activeName3.value, ...timeObj })
  tableData3.value = res.data
}
const handleClick3 = (tab) => {
  activeName3.value = tab
  getCharacteristicData()
}
//初识化
const init = async () => {
  loading.value = true
  await Promise.all([
    getCount(),
    getDataTransformation(),
    getCounterfeitingIndustry(),
    getCounterfeitIntent(),
    getGeographicalDistribution(),
    getTableDataCount(),
    getTableData_contribution(),
    getTaskMessageData(),
    getExtensionData(),
    getCharacteristicData()
  ]).then(() => {
    loading.value = false
  })
}
watch(timeArray, () => {
  console.log('timeArray: ' + timeArray.value)
  init()
})
onMounted(() => {
  init()
})
</script>
<template>
  {{ timeObj }}
  <div class="flex">
    <ElDatePicker
      style="max-width: 500px"
      v-model="timeArray"
      type="daterange"
      range-separator="-"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      :size="'default'"
    />
    <ElAlert
      class="el-alert-custom"
      :description="'温馨提示：自定义时间范围仅对总览页面统计生效，时间跨度越大，需统计数据量越大，统计响应时间越慢，最多可查询5年。'"
    />
  </div>
  <ElRow :gutter="10" justify="start" :class="prefixCls">
    <ElCol
      class="mt-5"
      :xl="8"
      :lg="8"
      :md="8"
      :sm="8"
      :xs="8"
      v-for="(item, index) in totalState"
      :key="index"
    >
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated :rows="2">
          <template #default>
            <div class="flex flex-col justify-between">
              <div :class="`${prefixCls}__item--text text-16px text-gray-500 text-center`">{{
                t(`analysis.${item.name}`)
              }}</div>
              <CountTo
                class="text-20px font-700 text-center"
                :start-val="0"
                :end-val="item.value"
                :duration="2600"
              />
            </div>
          </template>
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
  <ElRow :gutter="20" justify="space-between">
    <ElCol :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="funnelOptions" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="pieOptions" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="pieOptions2" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
  <ElRow :gutter="20" justify="space-between">
    <ElCol :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="barOptions" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <ElTabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
            <ElTabPane :key="'dataCount'" :label="'数据统计'" :name="'dataCount'">
              <el-table :data="tableData" border style="width: 100%" height="245">
                <el-table-column width="120" prop="data" label="时间戳">
                  <template #default="{ row }">
                    {{ new Date(row.date).toLocaleDateString() }}
                  </template>
                </el-table-column>
                <el-table-column width="130" prop="access" label="接入数据源总量" />
                <el-table-column width="130" prop="pending" label="待处理数据总量" />
                <el-table-column width="140" prop="suspect" label="疑似仿冒数据总量" />
                <el-table-column width="140" prop="pushed" label="推送数据总量" />
                <el-table-column width="140" prop="confirm" label="确认仿冒数据总量" />
                <el-table-column width="120" prop="underreporting" label="漏报数据总量" />
                <el-table-column width="120" prop="misreport" label="误报数据总量" />
                <!-- <el-table-column width="130" prop="pandingReview" label="待复核规则数量" /> -->
                <!-- <el-table-column width="120" prop="compositeRule" label="复核规则数量" /> -->
              </el-table>
            </ElTabPane>
            <ElTabPane
              v-for="item in tabColumns.filter((item) => item.name !== 'dataCount')"
              :key="item.name"
              :label="item.label"
              :name="item.name"
            >
              <div :id="item.name + 'Div'" style="height: 245px"></div>
            </ElTabPane>
          </ElTabs>
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
  <ElRow :gutter="20" justify="space-between">
    <ElCol :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <div class="flex justify-between mb-20px">
          <ElCard style="width: 22%" shadow="hover">
            <div class="flex flex-col justify-center items-center">
              <p class="m-0">采集完成</p>
              <p class="m-0">{{ taskMessageData.completed }}</p>
            </div>
          </ElCard>
          <ElCard style="width: 22%" shadow="hover">
            <div class="flex flex-col justify-center items-center">
              <p class="m-0">采集中</p>
              <p class="m-0">{{ taskMessageData.tracing }}</p>
            </div>
          </ElCard>
          <ElCard style="width: 22%" shadow="hover">
            <div class="flex flex-col justify-center items-center">
              <p class="m-0">采集失败</p>
              <p class="m-0">{{ taskMessageData.failed }}</p>
            </div>
          </ElCard>
          <ElCard style="width: 22%" shadow="hover">
            <div class="flex flex-col justify-center items-center">
              <p class="m-0">人工采集</p>
              <p class="m-0">{{ taskMessageData.manual }}</p>
            </div>
          </ElCard>
        </div>
        <ElCard shadow="hover" class="mb-20px">
          <div class="flex justify-around item-center font-700 font-size-8">
            <p>采集数据</p>
            <CountTo
              class="flex flex-col justify-center"
              :start-val="0"
              :end-val="taskMessageData.traceTarget"
              :duration="2600"
            />
          </div>
        </ElCard>
        <div class="flex justify-between mb-20px">
          <p>最近一个人工采集完成任务：{{ taskMessageData.lastTime }}</p>
          <p class="text-blue">去添加任务</p>
        </div>
        <el-table :data="[taskMessageData]" border style="width: 100%">
          <el-table-column prop="taskName" label="任务名称" />
          <el-table-column prop="taskType" label="探测类型" />
          <el-table-column prop="traceResult" label="探测内容">
            <template #default="{ row }">
              <el-popover
                placement="top-start"
                title="探测内容"
                :width="200"
                trigger="hover"
                :content="row.traceResult"
              >
                <template #reference>
                  <div class="overflow">
                    {{ row.traceResult }}
                  </div>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="issuanceMethod" label="下发方式" />
          <el-table-column width="90" label="操作">
            <div class="text-blue">查看数据</div>
          </el-table-column>
        </el-table>
      </ElCard>
    </ElCol>
    <ElCol :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <div class="flex justify-between mb-20px">
          <ElCard style="width: 22%" shadow="hover">
            <div class="flex flex-col justify-center items-center">
              <p class="m-0">拓线完成</p>
              <p class="m-0">{{ extensionData.completed }}</p>
            </div>
          </ElCard>
          <ElCard style="width: 22%" shadow="hover">
            <div class="flex flex-col justify-center items-center">
              <p class="m-0">拓线中</p>
              <p class="m-0">{{ extensionData.tracing }}</p>
            </div>
          </ElCard>
          <ElCard style="width: 22%" shadow="hover">
            <div class="flex flex-col justify-center items-center">
              <p class="m-0">拓线失败</p>
              <p class="m-0">{{ extensionData.failed }}</p>
            </div>
          </ElCard>
          <ElCard style="width: 22%" shadow="hover">
            <div class="flex flex-col justify-center items-center">
              <p class="m-0">人工拓线</p>
              <p class="m-0">{{ extensionData.manual }}</p>
            </div>
          </ElCard>
        </div>
        <ElCard shadow="hover" class="mb-20px">
          <div class="flex justify-around item-center font-700 font-size-8">
            <div class="w-50% flex justify-around">
              <p>拓线目标</p>
              <CountTo
                class="flex flex-col justify-center"
                :start-val="0"
                :end-val="extensionData.traceTarget"
                :duration="2600"
              />
            </div>
            <div class="w-50% flex justify-around">
              <p>拓线结果</p>
              <CountTo
                class="flex flex-col justify-center"
                :start-val="0"
                :end-val="extensionData.traceResult"
                :duration="2600"
              />
            </div>
          </div>
        </ElCard>
        <div class="flex justify-between mb-20px">
          <p>最近一个人工采集完成任务：{{ extensionData.lastTime }}</p>
          <p class="text-blue">去添加任务</p>
        </div>
        <el-table :data="[taskMessageData]" border style="width: 100%">
          <el-table-column prop="taskName" label="任务名称" />
          <el-table-column prop="taskType" label="探测类型" />
          <el-table-column prop="traceResult" label="探测内容">
            <template #default="{ row }">
              <el-popover
                placement="top-start"
                title="探测内容"
                :width="200"
                trigger="hover"
                :content="row.traceResult"
              >
                <template #reference>
                  <div class="overflow">
                    {{ row.traceResult }}
                  </div>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="issuanceMethod" label="下发方式" />
          <el-table-column width="90" label="操作">
            <div class="text-blue">查看数据</div>
          </el-table-column>
        </el-table>
      </ElCard>
    </ElCol>
  </ElRow>
  <ElRow :gutter="20" justify="space-between">
    <ElCol :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          业务贡献量
          <ElTabs v-model="activeName_contribution" class="demo-tabs" @tab-change="handleClick2">
            <ElTabPane
              v-for="item in contributionTab"
              :key="item.name"
              :label="item.label"
              :name="item.name"
            >
              <ElTable
                v-loading="loading_contribution"
                :data="tableData_contribution"
                border
                style="width: 100%"
              >
                <ElTableColumn type="index" label="排名" />
                <!-- 第一组 -->
                <ElTableColumn
                  v-if="activeName_contribution == 'dataSourceContribution'"
                  prop="ds_name"
                  label="数据源"
                />
                <ElTableColumn
                  v-if="activeName_contribution == 'dataSourceContribution'"
                  prop="ds_access"
                  label="仿冒系统接入数据总量"
                />
                <ElTableColumn
                  v-if="activeName_contribution == 'dataSourceContribution'"
                  prop="ds_found"
                  label="发现疑似仿冒数据总量"
                />
                <ElTableColumn
                  v-if="activeName_contribution == 'dataSourceContribution'"
                  prop="ds_percent"
                  label="数据源贡献值百分比"
                />
                <!-- 第二组 -->
                <ElTableColumn
                  v-if="activeName_contribution == 'dataSourceReport'"
                  prop="dr_name"
                  label="数据源"
                />
                <ElTableColumn
                  v-if="activeName_contribution == 'dataSourceReport'"
                  prop="dr_access"
                  label="经分析处置平台确认通报为仿冒数据"
                />
                <ElTableColumn
                  v-if="activeName_contribution == 'dataSourceReport'"
                  prop="dr_found"
                  label="发现疑似仿冒数据总量"
                />
                <ElTableColumn
                  v-if="activeName_contribution == 'dataSourceReport'"
                  prop="dr_percent"
                  label="数据源通报贡献百分比"
                />
              </ElTable>
            </ElTabPane>
          </ElTabs>
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
  <ElRow :gutter="20" justify="space-between">
    <ElCol :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          仿冒检测特征统计
          <ElTabs v-model="activeName3" class="demo-tabs" @tab-change="handleClick3">
            <ElTabPane
              v-for="item in tabColumns3"
              :key="item.name"
              :label="item.label"
              :name="item.name"
            >
              <ElTable :data="tableData3" border style="width: 100%">
                <ElTableColumn type="index" label="排名" />
                <!-- 第一组 -->
                <ElTableColumn v-if="activeName3 == 'rule'" prop="rule" label="仿冒检测特征规则" />
                <!-- 第二组 -->
                <ElTableColumn
                  v-if="activeName3 == 'vision'"
                  prop="rule"
                  label="视觉检测规则名称"
                />
                <ElTableColumn prop="suspect" label="疑似仿冒数据量" />
                <ElTableColumn prop="confirmed" label="确认仿冒数据量" />
                <ElTableColumn prop="misReport" label="误报数据量" />
              </ElTable>
            </ElTabPane>
          </ElTabs>
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
</template>
<style lang="less" scoped>
.demo-tabs > .el-tabs__content {
  padding: 0px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 500;
}
.el-alert-custom {
  background-color: #e9f6fe; /* Change background color */
  border: 1px solid #a0d3fb;
  padding: 6px 12px;
  margin-left: 2px;
  width: fit-content;
}
.overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<style>
.el-alert .el-alert__content p.el-alert__description {
  margin-top: 0;
}
</style>
