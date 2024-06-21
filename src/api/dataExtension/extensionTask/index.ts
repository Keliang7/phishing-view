import request from '@/axios'
// 任务
export const getListApi = (params: any) => {
  return request.get({ url: '/api/v1/data_extension/extension_task', params })
}
export const exportApi = (data: any) => {
  return request.post({ url: '/api/v1/data_extension/extension_task/export', data })
}
export const addApi = (data: any) => {
  return request.post({
    url: '/api/v1/data_extension/extension_task',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export const delApi = (data: any) => {
  return request.delete({
    url: '/api/v1/data_extension/extension_task',
    data
  })
}
export const statisticsApi = (params: any) => {
  return request.get({
    url: '/api/v1/data_extension/extension_task/statistics',
    params
  })
}
