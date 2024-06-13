import request from '@/axios'
export const getListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/api/v1/download_center', params })
}
export const getFileApi = (params: any) => {
  return request.get({ url: '/api/v1/download_center/download', params, responseType: 'blob' })
}
