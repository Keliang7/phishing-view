import request from '@/axios'
export const getListApi = (params: any): Promise<IResponse> => {
  console.log(params, 11)
  return request.get({ url: '/api/v1/download_center', params })
}
export const getFileApi = (params: any) => {
  console.log(params)
  return request.get({ url: '/api/v1/download_center/download', params, responseType: 'blob' })
}
export const getStaticFileApi = (params: any) => {
  return request.get({ url: '/api/v1/download_center/static', params })
}
