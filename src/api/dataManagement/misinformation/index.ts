import request from '@/axios'
// 任务
export const getListApi = (params: any) => {
  return request.get({ url: '/api/v1/misinformation', params })
}
export const statisticsApi = (params: any) => {
  return request.get({
    url: '/api/v1/misinformation/statistics',
    params
  })
}
export const exportApi = (params: any) => {
  return request.post({ url: 'api/v1/misinformation/export', data: params })
}
