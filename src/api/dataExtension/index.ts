import request from '@/axios'
// 任务
export const addTaskApi = (params: any) => {
  return request.post({ url: '/api/v1/extensionTask', params })
}
export const deleteTaskApi = (params: any) => {
  return request.delete({ url: '/api/v1/extensionTask', params })
}
export const putTaskApi = (params: any) => {
  return request.put({ url: '/api/v1/extensionTask', params })
}
export const getTaskApi = (params: any) => {
  return request.get({ url: '/api/v1/extensionTask', params })
}
//结果
export const addResultApi = (params: any) => {
  return request.post({ url: '/api/v1/extensionResult', params })
}
export const deleteResultApi = (params: any) => {
  return request.delete({ url: '/api/v1/extensionResult', params })
}
export const putResultApi = (params: any) => {
  return request.put({ url: '/api/v1/extensionResult', params })
}
export const getResultApi = (params: any) => {
  return request.get({ url: '/api/v1/extensionResult', params })
}
