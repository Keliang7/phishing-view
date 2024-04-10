import request from '@/axios'
export const getBwListApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/pendingURL/bw', params })
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
