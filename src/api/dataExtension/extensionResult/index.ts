import request from '@/axios'
//结果
export const getListApi = (params: any) => {
  return request.get({ url: '/api/v1/data_extension/extension_result', params })
}
export const exportApi = (params: any) => {
  return request.post({ url: '/api/v1/data_extension/extension_result/export', data: params })
}
