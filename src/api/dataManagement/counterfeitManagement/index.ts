import request from '@/axios'
export const getListApi = (params: any) => {
  return request.get({ url: '/api/v1/counterfeit', params })
}
export const statisticsApi = (params: any) => {
  return request.get({ url: '/api/v1/counterfeit/statistics', params })
}
export const exportApi = (params: any) => {
  return request.post({ url: 'api/v1/counterfeit/export', data: params })
}
