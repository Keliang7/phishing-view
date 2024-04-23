import request from '@/axios'
export const getBwListApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/pendingURL/bw', params })
}
export const getDomainListApi = (params: any) => {
  return request.get({ url: '/api/v1/pendingURL/domain', params })
}
export const getURLListApi = (params: any) => {
  return request.get({ url: '/api/v1/pendingURL/URL', params })
}
export const getTLSListApi = (params: any) => {
  return request.get({ url: '/api/v1/pendingURL/TLS', params })
}
export const getExtListApi = (params: any) => {
  return request.get({ url: '/api/v1/pendingURL/Ext', params })
}
export const getBwDetailApi = (params: any) => {
  return request.get({ url: `/api/v1/sm/pendingURL/bw/details/${params}` })
}
export const backtrackApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/backtrack', params })
}
export const selectApi = (params: any) => {
  return request.post({ url: 'api/v1/ac/gather_task', data: params })
}
export const exportApi = (params: any) => {
  return request.post({ url: '/api/v1/sm/pendingURL/bw/export', data: params })
}
