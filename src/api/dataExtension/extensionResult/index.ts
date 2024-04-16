import request from '@/axios'
//结果
export const getListApi = (params: any) => {
  return request.get({ url: '/api/v1/data_extention/extention_result', params })
}
export const exportApi = (params: any) => {
  return request.post({ url: '/api/v1/data_extention/extention_result/export', data: params })
}
