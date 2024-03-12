import { SUCCESS_CODE } from '@/constants'
import { MockMethod } from 'vite-plugin-mock'
const timeout = 1000

export default [
  // 统计接口
  {
    url: '/mock/dashboard/total',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { name: 'pendUrlNum', value: 81212 },
          { name: 'CounterfeitNum', value: 9280 },
          { name: 'pushDataNum', value: 13600 },
          { name: 'affirmCounterfeitNum', value: 1045 },
          { name: 'understatementNum', value: 27 },
          { name: 'misinformationNum', value: 13 }
        ]
      }
    }
  },
  //数据转化统计
  {
    url: '/mock/dashboard/dataTransformation',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { value: 100000, name: '待处理URL集合数据总量' },
          { value: 50000, name: '仿冒数据总量' },
          { value: 30000, name: '推送数据总量' },
          { value: 10000, name: '确认仿冒数据量' },
          { value: 6000, name: '漏报数据量' },
          { value: 5000, name: '误报数据量' }
        ]
      }
    }
  },
  //仿冒行业统计
  {
    url: '/mock/dashboard/counterfeitingIndustry',
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
  //仿冒意图统计
  {
    url: '/mock/dashboard/counterfeitIntent',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { value: 1000, name: 'APT' },
          { value: 310, name: '黑产' },
          { value: 234, name: '诈骗' },
          { value: 135, name: '博彩' }
        ]
      }
    }
  },
  //地域分布统计
  {
    url: '/mock/dashboard/geographicalDistribution',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { value: 10000, name: '香港' },
          { value: 9000, name: '澳门' },
          { value: 8000, name: '美国' },
          { value: 7000, name: '韩国' },
          { value: 6000, name: '英国' },
          { value: 5000, name: '新加坡' },
          { value: 4000, name: '泰国' },
          { value: 3000, name: '柬埔寨' },
          { value: 2000, name: '印度' },
          { value: 1000, name: '菲律宾' }
        ]
      }
    }
  },
  // category
  {
    url: '/mock/dashboard/categoryOptionsData',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { value: 123000, name: 'analysis.january' },
          { value: 98000, name: 'analysis.february' },
          { value: 56000, name: 'analysis.march' },
          { value: 84000, name: 'analysis.april' },
          { value: 53000, name: 'analysis.may' },
          { value: 52000, name: 'analysis.june' },
          { value: 64000, name: 'analysis.july' },
          { value: 85000, name: 'analysis.august' },
          { value: 16000, name: 'analysis.september' },
          { value: 71000, name: 'analysis.october' },
          { value: 75000, name: 'analysis.november' },
          { value: 9000, name: 'analysis.december' }
        ]
      }
    }
  },
  //数据源精准度
  {
    url: '/mock/dashboard/dataSourceAccuracy',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          {
            range: 1,
            dataSource: 'BW检测子系统',
            confirmed: 2000,
            found: 6000,
            accuracy: '33%'
          },
          {
            range: 2,
            dataSource: '短信来源',
            confirmed: 1800,
            found: 6000,
            accuracy: '30%'
          },
          {
            range: 3,
            dataSource: '域名检测子系统',
            confirmed: 1500,
            found: 5500,
            accuracy: '27%'
          },
          {
            range: 4,
            dataSource: 'URL日志系统',
            confirmed: 1000,
            found: 5000,
            accuracy: '20%'
          },
          {
            range: 5,
            dataSource: 'TLS系统',
            confirmed: 1000,
            found: 5000,
            accuracy: '20%'
          },
          {
            range: 6,
            dataSource: '主动拓线',
            confirmed: 1000,
            found: 5000,
            accuracy: '20%'
          }
        ]
      }
    }
  },
  //数据源贡献值
  {
    url: '/mock/dashboard/dataSourceContribution',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          {
            range: 1,
            dataSource: 'BW检测子系统',
            access: 2000,
            found: 6000,
            contribution: '33%'
          },
          {
            range: 2,
            dataSource: '短信来源',
            access: 1800,
            found: 6000,
            contribution: '30%'
          },
          {
            range: 3,
            dataSource: '域名检测子系统',
            access: 1500,
            found: 5500,
            contribution: '27%'
          },
          {
            range: 4,
            dataSource: 'URL日志系统',
            access: 1000,
            found: 5000,
            contribution: '20%'
          },
          {
            range: 5,
            dataSource: 'TLS系统',
            access: 1000,
            found: 5000,
            contribution: '20%'
          },
          {
            range: 6,
            dataSource: '主动拓线',
            access: 1000,
            found: 5000,
            contribution: '20%'
          }
        ]
      }
    }
  },
  //数据源通报贡献值
  {
    url: '/mock/dashboard/dataSourceReport',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          {
            range: 1,
            dataSource: 'BW检测子系统',
            report: 2000,
            found: 6000,
            contribution: '33%'
          },
          {
            range: 2,
            dataSource: '短信来源',
            report: 1800,
            found: 6000,
            contribution: '30%'
          },
          {
            range: 3,
            dataSource: '域名检测子系统',
            report: 1500,
            found: 5500,
            contribution: '27%'
          },
          {
            range: 4,
            dataSource: 'URL日志系统',
            report: 1000,
            found: 5000,
            contribution: '20%'
          },
          {
            range: 5,
            dataSource: 'TLS系统',
            report: 1000,
            found: 5000,
            contribution: '20%'
          },
          {
            range: 6,
            dataSource: '主动拓线',
            report: 1000,
            found: 5000,
            contribution: '20%'
          }
        ]
      }
    }
  },

  //仿冒检测特征统计
  {
    url: '/mock/dashboard/characteristic',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        total: 20000,
        data: [
          {
            rule: 'BW检测子系统',
            suspected: 2000,
            access: 6000,
            mistake: 20
          },
          {
            rule: '短信来源',
            suspected: 1800,
            access: 6000,
            mistake: 30
          },
          {
            rule: '域名检测子系统',
            suspected: 1800,
            access: 6000,
            mistake: 30
          },
          {
            rule: 'URL日志系统',
            suspected: 1800,
            access: 6000,
            mistake: 30
          },
          {
            rule: 'TLS系统',
            suspected: 1800,
            access: 6000,
            mistake: 30
          },
          {
            rule: 'URL日志系统',
            suspected: 1800,
            access: 6000,
            mistake: 30
          }
        ]
      }
    }
  }
  //统计任务1

  //统计任务2
] as MockMethod[]
