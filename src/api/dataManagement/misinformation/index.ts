import request from '@/axios'
// 任务
export const getListApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/misinformation/bw', params })
}
export const statisticsApi = (params: any) => {
  return request.get({
    url: '/api/v1/sm/misinformation/statistics/bw',
    params
  })
}
export const backtrackApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/misinformation/backtrack/bw', params })
}
export const sourceApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/misinformation/data_source/bw', params })
}
export const exportApi = (params: any) => {
  return request.post({ url: '/api/v1/sm/misinformation/bw/export', data: params })
}
