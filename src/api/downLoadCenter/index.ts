import request from '@/axios'
export const getFileListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/api/v1/dashboard/total', params })
}
