import request from '@/axios'
export const getListApi = (params: any) => {
  return request.get({ url: '/api/v1/white_list', params })
}
export const addApi = (params: any) => {
  return request.post({ url: '/api/v1/white_list', data: params })
}
export const deleteApi = (params: any) => {
  return request.delete({ url: '/api/v1/white_list', data: params })
}
export const exportApi = (params: any) => {
  return request.post({ url: '/api/v1/white_list/export', data: params })
}
export const importApi = (params: any) => {
  return request.post({ url: '/api/v1/white_list/import', data: params })
}
