import request from '@/axios'
export const getListApi = (params) => {
  return request.get({ url: '/api/v1/operation_log', params })
}
export const clearApi = (data) => {
  return request.delete({ url: '/api/v1/operation_log', data })
}
