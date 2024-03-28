import request from '@/axios'
// 获取疑似仿冒数据列表接口
export const getSuspectCounterfeitApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/suspectCounterfeit/bw', params })
}
// 获取受害方数据统计(左侧边栏)
export const getInjuredPartyApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/suspectCounterfeit/victimType/statistics', params })
}
export const exportApi = (params: any) => {
  return request.post({
    url: '/api/v1/sm/suspectCounterfeit/bw/export',
    data: params
  })
}
export const backtrackApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/backtrack', params })
}
