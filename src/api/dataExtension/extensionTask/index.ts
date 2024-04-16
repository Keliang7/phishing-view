import request from '@/axios'
// 任务
export const getListApi = (params: any) => {
  return request.get({ url: '/api/v1/data_extention/extention_task', params })
}
export const exportApi = (params: any) => {
  return request.post({ url: '/api/v1/data_extention/extention_task/export', data: params })
}
export const addApi = (params: any) => {
  return request.post({ url: '/api/v1/data_extention/extention_task', data: params })
}
export const statisticsApi = () => {
  return request.get({ url: '/api/v1/data_extention/extention_task/statistics' })
}
