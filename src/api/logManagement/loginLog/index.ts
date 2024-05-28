import request from '@/axios'
export const getListApi = (params) => {
  return request.get({ url: '/api/v1/login_log/bw', params })
}
export const clearApi = () => {
  return request.delete({ url: '/api/v1/login_log' })
}
export const exportApi = (data) => {
  return request.post({ url: '/api/v1/login_log/export', data })
}
