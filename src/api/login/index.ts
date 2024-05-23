import request from '@/axios'
import type { UserType } from './types'

interface RoleParams {
  roleName: string
}

export const loginApi = (data: UserType) => {
  return request.post({ url: '/api/v1/system/login', data })
}

export const loginOutApi = () => {
  return request.get({ url: '/api/v1/system/logout' })
}
//这个方法没用上，不知道用在哪里，模版自带的
// export const getUserListApi = ({ params }: AxiosConfig) => {
//   return request.get<{
//     code: string
//     data: {
//       list: UserType[]
//       total: number
//     }
//   }>({ url: '/mock/user/list', params })
// }

export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/mock/role/list', params })
}
export const getMenuApi = () => {
  return request.get({ url: '/mock/role/list' })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/mock/role/list2', params })
}
