<script setup lang="tsx">
import { reactive, ref, watch, onMounted, unref, onBeforeMount } from 'vue'
import { Form, FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCheckbox } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { loginApi, getMenuApi, getAdminRoleApi } from '@/api/login'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter, useRoute } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { UserType } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { useUserStore } from '@/store/modules/user'
import { BaseButton } from '@/components/Button'

const { required } = useValidator()

const emit = defineEmits(['to-register'])

const appStore = useAppStore()

const userStore = useUserStore()

const permissionStore = usePermissionStore()

const { currentRoute, addRoute, push } = useRouter()

const { t } = useI18n()

const rules = {
  username: [required()],
  password: [required()]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <h2 class="text-2xl font-bold text-center w-[100%]">{'仿冒网页监测系统'}</h2>
        }
      }
    }
  },
  {
    field: 'username',
    label: t('账号'),
    // value: 'admin',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: '请输入账号'
    }
  },
  {
    field: 'password',
    label: t('login.password'),
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: '请输入密码'
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between items-center w-[100%]">
                <ElCheckbox v-model={remember.value} label={t('login.remember')} size="small" />
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]">
                <BaseButton
                  loading={loading.value}
                  type="primary"
                  class="w-[100%]"
                  onClick={signIn}
                >
                  {t('login.login')}
                </BaseButton>
              </div>
            </>
          )
        }
      }
    }
  }
])

const remember = ref(userStore.getRememberMe)

const initLoginInfo = () => {
  const loginInfo = userStore.getLoginInfo
  if (loginInfo) {
    const { username, password } = loginInfo
    setValues({ username, password })
  }
}

onMounted(() => {
  initLoginInfo()
})

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose, setValues } = formMethods

const loading = ref(false)

const redirect = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

//中心sessionToken登录
onBeforeMount(async () => {
  if (useRoute().query.SESSION_DATA) {
    const res = await loginApi({ sessionData: useRoute().query.SESSION_DATA })
    userStore.setUserInfo(res.data)
    if (res) {
      userStore.setToken('Bearer ' + res.data.token)
      if (appStore.getDynamicRouter) {
        getRole({ roleName: 'admin' })
      } else {
        await permissionStore.generateRoutes('static').catch(() => {})
        permissionStore.getAddRouters.forEach((route) => {
          addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
        })
        permissionStore.setIsAddRouters(true)
      }
      push({ path: '/dashboard' })
    }
  }
})
// 登录
const signIn = async () => {
  const formRef = await getElFormExpose()
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const formData = await getFormData<UserType>()
      try {
        const res = await loginApi(formData)
        if (res) {
          // 是否记住我
          if (unref(remember)) {
            userStore.setLoginInfo({
              username: formData.username,
              password: formData.password
            })
            userStore.setToken('Bearer ' + res.data.token)
          } else {
            userStore.setLoginInfo(undefined)
          }
          userStore.setRememberMe(unref(remember))
          userStore.setUserInfo(res.data)
          // 是否使用动态路由
          if (appStore.getDynamicRouter) {
            getRole({ roleName: 'admin' })
          } else {
            await permissionStore.generateRoutes('static').catch(() => {})
            permissionStore.getAddRouters.forEach((route) => {
              addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
            })
            permissionStore.setIsAddRouters(true)
          }
          push({ path: redirect.value || permissionStore.addRouters[0].path })
        }
      } finally {
        loading.value = false
      }
    }
  })
}

// 获取角色信息
const getRole = async (params) => {
  // const formData = await getFormData<UserType>()
  // const params = {
  //   roleName: formData.username
  // }
  console.log('这里获取你输入的用户名', params)

  // const res =
  //   appStore.getDynamicRouter && appStore.getServerDynamicRouter
  //     ? await getAdminRoleApi(params)
  //     : await getTestRoleApi(params)
  const res =
    appStore.getDynamicRouter && appStore.getServerDynamicRouter
      ? await getAdminRoleApi(params)
      : await getMenuApi()

  //这里的if做的事：拿到了res就去分析路由。上面代码只负责拿res，结果怎么样他不管
  if (res) {
    //如果identity ===admin && !memu 就拿前端的所有路由 我要做所有的路由
    //否则就去分析menu
    const routers = res.data || []

    //他这里是记录router，下一次就直接去取
    userStore.setRoleRouters(routers)

    appStore.getDynamicRouter && appStore.getServerDynamicRouter
      ? await permissionStore.generateRoutes('server', routers).catch(() => {})
      : await permissionStore.generateRoutes('frontEnd', routers).catch(() => {})

    permissionStore.getAddRouters.forEach((route) => {
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })
    permissionStore.setIsAddRouters(true)
  }
}
</script>

<template>
  <div class="formBack">
    <Form
      :schema="schema"
      :rules="rules"
      label-position="top"
      hide-required-asterisk
      size="large"
      class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
      @register="formRegister"
    />
  </div>
</template>
<style scoped>
.formBack {
  background-color: rgba(255, 255, 255, 0.4);
  border: 1px solid white;
  border-radius: 20px;
  /* background-image: url('@/assets/img/formBack.png'); */
}
</style>
