import request from '@/axios'
export const getListApi = (params: any) => {
  return request.get({ url: '/api/v1/understatement', params })
}
export const statisticsApi = () => {
  return request.get({
    url: '/api/v1/understatement/statistics'
  })
}
