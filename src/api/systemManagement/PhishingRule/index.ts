import request from '@/axios'
export const getListApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/phishing_rule', params })
}
export const addApi = (params: any) => {
  return request.post({ url: '/api/v1/sr/phishing_rule', data: params })
}
export const deleteApi = (params: any) => {
  console.log(params)
  return request.delete({ url: '/api/v1/sr/phishing_rule', data: params })
}
export const editApi = (params: any) => {
  console.log(params)
  return request.put({ url: '/api/v1/sr/phishing_rule', data: params })
}
export const exportApi = (params: any) => {
  return request.post({ url: '/api/v1/sm/phishing_rule/export', data: params })
}
export const importApi = (params: any) => {
  return request.post({ url: '/api/v1/sr/phishing_rule/import', data: params })
}
