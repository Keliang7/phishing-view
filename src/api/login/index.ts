import request from '@/axios'

export const loginApi = (data) => {
  return request.post({ url: '/api/v1/system/login', data })
}
export const loginOutApi = () => {
  return request.get({ url: '/api/v1/system/logout' })
}
export const getMenuApi = () => {
  return request.get({ url: '/api/v1/system/menu' })
}
