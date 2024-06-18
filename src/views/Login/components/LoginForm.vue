<script setup lang="tsx">
import { reactive, ref, watch, onMounted, unref } from 'vue'
import { Form, FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCheckbox } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { loginApi, getMenuApi } from '@/api/login'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { UserType } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { useUserStore } from '@/store/modules/user'
import { BaseButton } from '@/components/Button'

const { required } = useValidator()

const emit = defineEmits(['to-register'])

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
          getRole()
        }
      } finally {
        loading.value = false
      }
    }
  })
}
// 获取角色信息
const adminRouter = [
  '/data_management',
  '/data_management',
  '/data_management/pend_url',
  '/data_management/counterfeit_management',
  '/data_management/understatement',
  '/data_management/misinformation',
  '/data_extension',
  '/data_extension/extension_task',
  '/data_extension/extension_result',
  '/data_gather',
  '/data_gather/gather_task',
  '/data_gather/gather_result',
  '/log_management',
  '/log_management/login_log',
  '/log_management/operation_log',
  '/system_management',
  '/system_management/policy_configuration',
  '/system_management/phishing_rule',
  '/system_management/phishing_recheck',
  '/system_management/rough_rule'
]
const getRole = async () => {
  const res = await getMenuApi()
  if (res) {
    userStore.setRoleRouters(adminRouter)
    await permissionStore.generateRoutes('frontEnd', adminRouter).catch(() => {})
    permissionStore.getAddRouters.forEach((route) => {
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })
    permissionStore.setIsAddRouters(true)
    push({ path: '/dashboard' })
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
