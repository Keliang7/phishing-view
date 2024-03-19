import request from '@/axios'
// 获取白名单管理列表接口
export const getPolicyWhiteListApi = (params: any) => {
  return request.get({ url: '/api/v1/policyConfiguration/whiteList/list', params })
}
export const postWhiteListApi = (params: any) => {
  return request.post({ url: '/api/v1/policyConfiguration/whiteList/list', data: params })
}
export const deleteWhiteListApi = (params: any) => {
  console.log(params)
  return request.delete({ url: '/api/v1/whiteList/list', data: params })
}
export const getDataApi = (params: any) => {
  console.log(params)
  return request.post({ url: '/api/v1/policyConfiguration/whiteList/export', data: params })
}
export const upLoadFileApi = (params: any) => {
  return request.get({ url: '/api/v1/policyConfiguration/whiteList/anycn_import_file', params })
}
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
