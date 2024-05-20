import request from '@/axios'
export const getListApi = (params: any) => {
  return request.get({ url: '/api/v1/understatement', params })
}
export const statisticsApi = () => {
  return request.get({
    url: '/api/v1/understatement/statistics'
  })
}
export const exportApi = (params: any) => {
  return request.post({ url: 'api/v1/understatement/export', data: params })
}
