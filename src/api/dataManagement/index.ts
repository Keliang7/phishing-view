import request from '@/axios'
//回溯
export const backtrackApi = (params: any) => {
  return request.get({ url: '/api/v1/backtrack', params })
}
//数据来源个数
export const sourceApi = (params: any) => {
  return request.get({ url: '/api/v1/data_source', params })
}
//加入样本库
export const joinSampApi = (params: any) => {
  return request.post({ url: '/api/v1/phishing_sample', data: params })
}
//采集
export const selectApi = (params: any) => {
  return request.post({ url: 'api/v1/gather_task', data: params })
}
//拓线
export const extensionApi = (params: any) => {
  return request.post({ url: 'api/v1/extension', data: params })
}
