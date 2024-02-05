import Mock from 'mockjs'
import { SUCCESS_CODE } from '@/constants'
import { toAnyString } from '@/utils'

const timeout = 1000

const adminList = [
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
  },
  {
    path: '/data_extension',
    component: '#',
    redirect: '/data_extension/extension_task',
    name: 'DataExtension',
    meta: {
      title: 'router.data_extension',
      icon: 'ant-design:node-index-outlined',
      alwaysShow: true
    },
    children: [
      {
        path: 'extension_task',
        component: 'views/DataExtension/ExtensionTask/ExtensionTask',
        name: 'ExtensionTask',
        meta: {
          title: 'router.extension_task'
        }
      },
      {
        path: 'extension_result',
        component: 'views/DataExtension/ExtensionResult/ExtensionResult',
        name: 'ExtensionResult',
        meta: {
          title: 'router.extension_result'
        }
      }
    ]
  },
  {
    path: '/data_gather',
    component: '#',
    redirect: '/data_gather/gather_task',
    name: 'DataGather',
    meta: {
      title: 'router.data_gather',
      icon: 'ant-design:hdd-filled',
      alwaysShow: true
    },
    children: [
      {
        path: 'gather_task',
        component: 'views/DataGather/GatherTask/GatherTask',
        name: 'GatherTask',
        meta: {
          title: 'router.gather_task'
        }
      },
      {
        path: 'gather_result',
        component: 'views/DataGather/GatherResult/GatherResult',
        name: 'GatherResult',
        meta: {
          title: 'router.gather_result'
        }
      }
    ]
  },
  {
    path: '/user_management',
    component: '#',
    redirect: '/user_management/role_management',
    name: 'UserManagement',
    meta: {
      title: 'router.user_management',
      icon: 'ep:avatar',
      alwaysShow: true
    },
    children: [
      {
        path: 'role_management',
        component: 'views/UserManagement/RoleManagement/RoleManagement',
        name: 'RoleManagement',
        meta: {
          title: 'router.role_management'
        }
      }
    ]
  },
  {
    path: '/log_management',
    component: '#',
    redirect: '/log_management/login_log',
    name: 'LogManagement',
    meta: {
      title: 'router.log_management',
      icon: 'ant-design:snippets-filled',
      alwaysShow: true
    },
    children: [
      {
        path: 'login_log',
        component: 'views/LogManagement/LoginLog/LoginLog',
        name: 'LoginLog',
        meta: {
          title: 'router.login_log'
        }
      },
      {
        path: 'operation_log',
        component: 'views/LogManagement/OperationLog/OperationLog',
        name: 'OperationLog',
        meta: {
          title: 'router.operation_log'
        }
      }
    ]
  },
  {
    path: '/system_management',
    component: '#',
    redirect: '/system_management/policy_configuration ',
    name: 'SystemManagement',
    meta: {
      title: 'router.system_management',
      icon: 'ep:setting',
      alwaysShow: true
    },
    children: [
      {
        path: 'policy_configuration',
        component: 'views/SystemManagement/PolicyConfiguration/PolicyConfiguration',
        name: 'PolicyConfiguration',
        meta: {
          title: 'router.policy_configuration'
        }
      },
      {
        path: 'phishing_rule',
        component: 'views/SystemManagement/PhishingRule/PhishingRule',
        name: 'PhishingRule',
        meta: {
          title: 'router.phishing_rule'
        }
      }
    ]
  }
]

const testList: string[] = ['external-link']

const List: any[] = []

const roleNames = ['超级管理员', '管理员', '普通用户', '游客']
const menus = [
  [
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
]

for (let i = 0; i < 4; i++) {
  List.push(
    Mock.mock({
      id: toAnyString(),
      // timestamp: +Mock.Random.date('T'),
      roleName: roleNames[i],
      role: '@first',
      status: Mock.Random.integer(0, 1),
      createTime: '@datetime',
      remark: '@cword(10, 15)',
      menu: menus[i]
    })
  )
}

export default [
  // 列表接口
  {
    url: '/mock/role/list',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: adminList
      }
    }
  },
  {
    url: '/mock/role/table',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          list: List,
          total: 4
        }
      }
    }
  },
  // 列表接口
  {
    url: '/mock/role/list2',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: testList
      }
    }
  },
  {
    url: '/mock/role/table',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          list: List,
          total: 4
        }
      }
    }
  }
]
