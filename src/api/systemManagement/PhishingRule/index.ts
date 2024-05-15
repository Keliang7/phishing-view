import request from '@/axios'
export const getRuleApi = (params: any) => {
  return request.get({ url: '/api/v1/phishing_rule', params })
}
export const addApi = (params: any) => {
  return request.post({ url: '/api/v1/phishing_rule', data: params })
}
export const deleteApi = (params: any) => {
  console.log(params)
  return request.delete({ url: '/api/v1/phishing_rule', data: params })
}
export const editApi = (params: any) => {
  console.log(params)
  return request.put({ url: '/api/v1/phishing_rule', data: params })
}
export const exportApi = (params: any) => {
  return request.post({ url: '/api/v1/phishing_rule/export', data: params })
}
export const importApi = (params: any) => {
  return request.post({ url: '/api/v1/phishing_rule/import', data: params })
}
//视觉分析库管理
export const getVisualApi = (params: any) => {
  return request.get({ url: '/api/v1/visual_analysis', params })
}
//仿冒样本库管理
export const getSamplelApi = (params: any) => {
  return request.get({ url: '/api/v1/phishing_sample', params })
}
