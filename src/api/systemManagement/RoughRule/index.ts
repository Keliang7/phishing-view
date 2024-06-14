import request from '@/axios'
export const getListApi = (params: any) => {
  return request.get({ url: '/api/v1/extensive_rules', params })
}
export const addApi = (data: any) => {
  return request.post({ url: '/api/v1/extensive_rules', data })
}
export const deleteApi = (data: any) => {
  return request.delete({ url: '/api/v1/extensive_rules', data })
}
export const enableApi = (data: any) => {
  return request.put({ url: '/api/v1/extensive_rules/enable', data })
}
export const disableApi = (data: any) => {
  return request.put({ url: '/api/v1/extensive_rules/disable', data })
}
export const exportApi = (data: any) => {
  return request.post({ url: '/api/v1/extensive_rules/export', data })
}
export const importApi = (data: any) => {
  return request.post({
    url: '/api/v1/extensive_rules/import',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
