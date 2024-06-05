import request from '@/axios'
export const getListApi = (params) => {
  return request.get({ url: '/api/v1/operation_log', params })
}
export const clearApi = () => {
  return request.delete({ url: '/api/v1/operation_log' })
}
export const exportApi = (data) => {
  return request.post({ url: '/api/v1/operation_log/export', data })
}
