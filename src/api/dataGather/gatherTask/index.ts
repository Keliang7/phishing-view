import request from '@/axios'
export const getListApi = (params: any) => {
  return request.get({ url: '/api/v1/ac/gather_task', params })
}
export const deleteApi = (params: any) => {
  return request.delete({ url: '/api/v1/ac/gather_task', data: params })
}
export const addApi = (params: any) => {
  return request.post({
    url: '/api/v1/ac/gather_task',
    data: params,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export const exportApi = (params: any) => {
  return request.post({
    url: '/api/v1/ac/gather_task/export',
    data: params
  })
}
export const stopApi = (params: any) => {
  console.log(params)
  return request.post({
    url: '/api/v1/ac/gather_task/stop',
    data: { taskID: [params] }
  })
}
