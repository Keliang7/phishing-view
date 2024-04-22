import request from '@/axios'
export const getListApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/understatement/bw', params })
}
export const statisticsApi = () => {
  return request.get({
    url: '/api/v1/sm/understatement/statistics/bw'
  })
}
export const backtrackApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/understatement/backtrack/bw', params })
}
export const sourceApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/understatement/data_source/bw', params })
}
export const joinSampApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/understatement/join_samp_lab/bw', params })
}
export const addApi = (params: any) => {
  return request.post({ url: '/api/v1/sm/understatement/gather_task/bw', data: params })
}
export const exportApi = (params: any) => {
  return request.post({ url: '/api/v1/sm/understatement/bw/export', data: params })
}
