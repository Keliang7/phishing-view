<script setup lang="ts">
import { LoginForm, RegisterForm } from './components'
import { ref, onBeforeMount } from 'vue'
import { loginApi, getMenuApi } from '@/api/login'
import { ElScrollbar } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import type { RouteRecordRaw } from 'vue-router'
//中心sessionToken登录
const userStore = useUserStore()
const permissionStore = usePermissionStore()
const { addRoute, push } = useRouter()
onBeforeMount(async () => {
  if (useRoute().query.SESSION_DATA) {
    const res = await loginApi({ sessionData: useRoute().query.SESSION_DATA })
    userStore.setUserInfo(res.data)
    if (res) {
      userStore.setToken('Bearer ' + res.data.token)
      getRole()
      push({ path: '/dashboard' })
    }
  }
})
const getRole = async () => {
  let res
  let temp = await getMenuApi()
  if (temp.identity === 'user') {
    const map = {
      'APP.FM.P.Total': '/data_management',
      'APP.FM.P.Manger': '/data_management',
      'APP.FM.P.Manger.Process': '/data_management/pend_url',
      'APP.FM.P.Manger.Counterfeiting': '/data_management/counterfeit_management',
      'APP.FM.P.Manger.Mission': '/data_management/understatement',
      'APP.FM.P.Manger.Error': '/data_management/misinformation',
      'APP.FM.P.Extension': '/data_extension',
      'APP.FM.P.Extension.Manger': '/data_extension/extension_task',
      'APP.FM.P.Results': '/data_extension/extension_result',
      'APP.FM.P.Collecting': '/data_gather',
      'APP.FM.P.Collecting.Manger': '/data_gather/gather_task',
      'APP.FM.P.Collecting.Results': '/data_gather/gather_result',
      'APP.FM.P.System': '/system_management',
      'APP.FM.P.System.WhiteList': '/system_management/policy_configuration',
      'APP.FM.P.System.RuleManger': '/system_management/phishing_rule',
      'APP.FM.P.System.RuleReview': '/system_management/phishing_recheck'
    }
    const data = temp.data.menu.map((i) => (i.privilegeKey = map[i.privilegeKey]))
    res = { ...temp, data }
  } else {
    res = {
      data: [
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
        '/system_management',
        '/system_management/policy_configuration',
        '/system_management/phishing_rule',
        '/system_management/phishing_recheck'
      ]
    }
    res.identity = 'admin'
  }
  if (res) {
    const routers = res.data || []
    userStore.setRoleRouters(routers)
    await permissionStore.generateRoutes('frontEnd', routers).catch(() => {})
    permissionStore.getAddRouters.forEach((route) => {
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })
    permissionStore.setIsAddRouters(true)
    push({ path: '/dashboard' })
  }
}

const isLogin = ref(true)

const toRegister = () => {
  isLogin.value = false
}

const toLogin = () => {
  isLogin.value = true
}
</script>

<template>
  <div class="h-[100%] relative lt-sm:px-10px lt-xl:px-10px lt-md:px-10px login-page-box">
    <ElScrollbar class="h-full">
      <div class="relative flex mx-auto min-h-100vh">
        <div :class="`flex-1 relative p-30px lt-xl:hidden`">
          <div class="flex justify-center items-center h-full">
            <Transition appear enter-active-class="animate__animated animate__bounceInLeft">
              <img width="80%" src="../../assets/imgs/login-left-img.png" />
            </Transition>
          </div>
        </div>
        <div class="flex-1 p-30px lt-sm:p-10px relative">
          <div
            class="flex justify-between items-center text-white at-2xl:justify-end at-xl:justify-end"
          >
          </div>
          <Transition appear enter-active-class="animate__animated animate__bounceInRight">
            <div
              class="h-full flex items-center m-auto w-[100%] at-2xl:max-w-500px at-xl:max-w-500px at-md:max-w-500px at-lg:max-w-500px"
            >
              <LoginForm
                v-if="isLogin"
                class="p-20px h-auto m-auto lt-xl:rounded-3xl lt-xl:light:bg-white"
                @to-register="toRegister"
              />
              <RegisterForm
                v-else
                class="p-20px h-auto m-auto lt-xl:rounded-3xl lt-xl:light:bg-white"
                @to-login="toLogin"
              />
            </div>
          </Transition>
        </div>
      </div>
    </ElScrollbar>
  </div>
</template>

<style lang="less" scoped>
.login-page-box {
  background-image: url('@/assets/imgs/login-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
