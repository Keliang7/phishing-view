import request from '@/axios'
export const getListApi = (params) => {
  return request.get({ url: '/api/v1/opration_log/bw', params })
}
export const getDomainListApi = () => {
  return request.delete({ url: '/api/v1/opration_log' })
}
export const exportApi = (data) => {
  return request.post({ url: '/api/v1/opration_log/export', data })
}
