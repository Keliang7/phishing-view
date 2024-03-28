import request from '@/axios'
// 获取仿冒检测规则列表接口
export const getPhishingDetectionApi = (params: any) => {
  return request.get({ url: '/api/v1/phishingRule/phishingDetection/list', params })
}
export const deletePhishingDetectionApi = (params: any) => {
  return request.delete({ url: '/mock/systemManagement/deleteData', data: params })
}
export const getUrlDomainListApi = (params: any) => {
  return request.get({ url: '/mock/example/getUrlDomainList', params })
}
export const getPhishingDataApi = (params: any) => {
  return request.post({ url: '/api/v1/phishingRule/phishingDetection/export', data: params })
}
//仿冒规则检测添加
export const addDateApi = (params: any) => {
  return request.post({ url: '/api/v3/phishing_rule', data: params })
}
export const editDateApi = (params: any) => {
  console.log('你的params', params)
  return request.put({ url: '/api/v3/phishing_rule', data: params })
}
export const deleteDateApi = (params: any) => {
  return request.delete({ url: '/api/v3/phishing_rule', data: params })
}
