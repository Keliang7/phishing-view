import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
import { NO_RESET_WHITE_LIST } from '@/constants'

const { t } = useI18n()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Root',
    meta: {},
    children: [
      {
        path: 'dashboard',
        name: 'RootDemo',
        component: () => import('@/views/Dashboard/Analysis.vue'),
        meta: {
          title: t('router.dashboard'),
          icon: 'svg-icon:board',
          affix: true
        }
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/downloadCenter',
    component: () => import('@/views/DownloadCenter/DownloadCenter.vue'),
    name: 'DownloadCenter',
    meta: {
      hidden: true,
      title: '下载中心'
    }
  },
  {
    path: '/viewDetails',
    name: 'ViewDetails',
    component: () => import('@/views/ViewDetails/ViewDetails.vue'),
    meta: {
      hidden: true,
      title: '查看详情'
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/data_management',
    component: Layout,
    redirect: '/data_management/pend_url',
    name: 'DataManagement',
    meta: {
      title: 'router.data_management',
      icon: 'svg-icon:home',
      alwaysShow: true
    },
    children: [
      {
        path: 'pend_url',
        component: () => import('@/views/DataManagement/PendUrl/PendUrl.vue'),
        name: 'PendUrl',
        meta: {
          title: 'router.pend_url'
        }
      },
      {
        path: 'counterfeit_management',
        component: () =>
          import('@/views/DataManagement/CounterfeitManagement/CounterfeitManagement.vue'),
        name: 'CounterfeitManagement',
        meta: {
          title: 'router.counterfeit_management'
        }
      },
      {
        path: 'understatement',
        component: () => import('@/views/DataManagement/Understatement/Understatement.vue'),
        name: 'Understatement',
        meta: {
          title: 'router.understatement'
        }
      },
      {
        path: 'misinformation',
        component: () => import('@/views/DataManagement/Misinformation/Misinformation.vue'),
        name: 'Misinformation',
        meta: {
          title: 'router.misinformation'
        }
      }
    ]
  },
  {
    path: '/data_extension',
    component: Layout,
    redirect: '/data_extension/extension_task',
    name: 'DataExtension',
    meta: {
      title: 'router.data_extension',
      icon: 'svg-icon:link',
      alwaysShow: true
    },
    children: [
      {
        path: 'extension_task',
        component: () => import('@/views/DataExtension/ExtensionTask/ExtensionTask.vue'),
        name: 'ExtensionTask',
        meta: {
          title: 'router.extension_task'
        }
      },
      {
        path: 'extension_result',
        component: () => import('@/views/DataExtension/ExtensionResult/ExtensionResult.vue'),
        name: 'ExtensionResult',
        meta: {
          title: 'router.extension_result'
        }
      }
    ]
  },
  {
    path: '/data_gather',
    component: Layout,
    redirect: '/data_gather/gather_task',
    name: 'DataGather',
    meta: {
      title: 'router.data_gather',
      icon: 'svg-icon:data',
      alwaysShow: true
    },
    children: [
      {
        path: 'gather_task',
        component: () => import('@/views/DataGather/GatherTask/GatherTask.vue'),
        name: 'GatherTask',
        meta: {
          title: 'router.gather_task'
        }
      },
      {
        path: 'gather_result',
        component: () => import('@/views/DataGather/GatherResult/GatherResult.vue'),
        name: 'GatherResult',
        meta: {
          title: 'router.gather_result'
        }
      }
    ]
  },
  {
    path: '/user_management',
    component: Layout,
    redirect: '/user_management/role_management',
    name: 'UserManagement',
    meta: {
      title: 'router.user_management',
      icon: 'svg-icon:user',
      alwaysShow: true
    },
    children: [
      {
        path: 'userInfo_management',
        component: () => import('@/views/UserManagement/UserInfoManagement/UserInfoManagement.vue'),
        name: 'UserInfoManagement',
        meta: {
          title: 'router.role_management'
        }
      },
      {
        path: 'role_management',
        component: () => import('@/views/UserManagement/RoleManagement/RoleManagement.vue'),
        name: 'RoleManagement',
        meta: {
          title: 'router.role_management'
        }
      }
    ]
  },
  {
    path: '/log_management',
    component: Layout,
    redirect: '/log_management/login_log',
    name: 'LogManagement',
    meta: {
      title: 'router.log_management',
      icon: 'svg-icon:log',
      alwaysShow: true
    },
    children: [
      {
        path: 'login_log',
        component: () => import('@/views/LogManagement/LoginLog/LoginLog.vue'),
        name: 'LoginLog',
        meta: {
          title: 'router.login_log'
        }
      },
      {
        path: 'operation_log',
        component: () => import('@/views/LogManagement/OperationLog/OperationLog.vue'),
        name: 'OperationLog',
        meta: {
          title: 'router.operation_log'
        }
      }
    ]
  },
  {
    path: '/system_management',
    component: Layout,
    redirect: '/system_management/policy_configuration ',
    name: 'SystemManagement',
    meta: {
      title: 'router.system_management',
      icon: 'svg-icon:setting',
      alwaysShow: true
    },
    children: [
      {
        path: 'policy_configuration',
        component: () =>
          import('@/views/SystemManagement/PolicyConfiguration/PolicyConfiguration.vue'),
        name: 'PolicyConfiguration',
        meta: {
          title: 'router.policy_configuration'
        }
      },
      {
        path: 'phishing_rule',
        component: () => import('@/views/SystemManagement/PhishingRule/PhishingRule.vue'),
        name: 'PhishingRule',
        meta: {
          title: 'router.phishing_rule'
        }
      },
      {
        path: 'phishing_recheck',
        component: () => import('@/views/SystemManagement/PhishingRule/PhishingRecheck.vue'),
        name: 'PhishingRecheck',
        meta: {
          title: 'router.phishing_recheck'
        }
      },
      {
        path: 'rough_rule',
        component: () => import('@/views/SystemManagement/RoughRule/RoughRule.vue'),
        name: 'RoughRule',
        meta: {
          title: 'router.rough_rule'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !NO_RESET_WHITE_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}
export default router
