import Mock from 'mockjs'
import { SUCCESS_CODE } from '@/constants'

const timeout = 1000

export default [
  // 列表接口
  {
    url: '/mock/menu/list',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          list: [
            {
              path: '/data_management',
              component: '#',
              redirect: '/data_management/pend_url',
              name: 'DataManagement',
              meta: {
                title: 'router.data_management',
                icon: 'bx:bxs-component',
                alwaysShow: true
              },
              children: [
                {
                  path: 'pend_url',
                  component: 'views/DataManagement/PendUrl/PendUrl',
                  name: 'PendUrl',
                  meta: {
                    title: 'router.pend_url'
                  }
                },
                {
                  path: 'suspect_counterfeit',
                  component: 'views/DataManagement/SuspectCounterfeit/SuspectCounterfeit',
                  name: 'SuspectCounterfeit',
                  meta: {
                    title: 'router.suspect_counterfeit'
                  }
                },
                {
                  path: 'counterfeit_management',
                  component: 'views/DataManagement/CounterfeitManagement/CounterfeitManagement',
                  name: 'CounterfeitManagement',
                  meta: {
                    title: 'router.counterfeit_management'
                  }
                },
                {
                  path: 'understatement',
                  component: 'views/DataManagement/Understatement/Understatement',
                  name: 'Understatement',
                  meta: {
                    title: 'router.understatement'
                  }
                },
                {
                  path: 'misinformation',
                  component: 'views/DataManagement/Misinformation/Misinformation',
                  name: 'Misinformation',
                  meta: {
                    title: 'router.misinformation'
                  }
                }
              ]
            }
          ]
        }
      }
    }
  }
]
