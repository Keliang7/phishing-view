import request from '@/axios'
export const getListApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/suspectCounterfeit/bw', params })
}
export const statisticsApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/suspectCounterfeit/victimType/statistics', params })
}
export const exportApi = (params: any) => {
  return request.post({
    url: '/api/v1/sm/suspectCounterfeit/bw/export',
    data: params
  })
}
export const backtrackApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/backtrack', params })
}
