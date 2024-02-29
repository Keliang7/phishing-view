import { SUCCESS_CODE } from '@/constants'
import { MockMethod } from 'vite-plugin-mock'

const timeout = 1000

export default [
  // 分析页统计接口
  {
    url: '/mock/dashboard/total',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          pendUrlNum: 81212,
          CounterfeitNum: 9280,
          pushDataNum: 13600,
          affirmCounterfeitNum: 1045,
          understatementNum: 27,
          misinformationNum: 13
        }
      }
    }
  },
  // 用户来源
  {
    url: '/mock/dashboard/userAccessSource',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { value: 1000, name: '政府' },
          { value: 310, name: '公检法部门' },
          { value: 234, name: '税务部门' },
          { value: 135, name: '金融' },
          { value: 1548, name: '证券' },
          { value: 1200, name: '国企' },
          { value: 1022, name: '高校' },
          { value: 420, name: '电子商务' },
          { value: 325, name: '虚假投资诈骗' }
        ]
      }
    }
  },
  // 每周用户活跃量
  {
    url: '/mock/dashboard/weeklyUserActivity',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { value: 13253, name: 'analysis.monday' },
          { value: 34235, name: 'analysis.tuesday' },
          { value: 26321, name: 'analysis.wednesday' },
          { value: 12340, name: 'analysis.thursday' },
          { value: 24643, name: 'analysis.friday' },
          { value: 1322, name: 'analysis.saturday' },
          { value: 1324, name: 'analysis.sunday' }
        ]
      }
    }
  },
  // 每月销售额
  {
    url: '/mock/dashboard/monthlySales',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { estimate: 100, actual: 120, name: 'analysis.january' },
          { estimate: 120, actual: 82, name: 'analysis.february' },
          { estimate: 161, actual: 91, name: 'analysis.march' },
          { estimate: 134, actual: 154, name: 'analysis.april' },
          { estimate: 105, actual: 162, name: 'analysis.may' },
          { estimate: 160, actual: 140, name: 'analysis.june' },
          { estimate: 165, actual: 145, name: 'analysis.july' },
          { estimate: 114, actual: 250, name: 'analysis.august' },
          { estimate: 163, actual: 134, name: 'analysis.september' },
          { estimate: 185, actual: 56, name: 'analysis.october' },
          { estimate: 118, actual: 99, name: 'analysis.november' },
          { estimate: 123, actual: 123, name: 'analysis.december' }
        ]
      }
    }
  }
] as MockMethod[]
