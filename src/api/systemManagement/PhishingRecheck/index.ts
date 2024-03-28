import request from '@/axios'
export const getListApi = (params: any) => {
  return request.get({ url: '/api/v1/sm/phishing_recheck', params })
}
export const recheckApi = (params: any) => {
  console.log(params)
  return request.post({ url: '/api/v1/sr/phishing_recheck', data: params })
}
export const formApi = (params: any) => {
  return request.get({ url: '/api/v1/sr/phishing_recheck/form', params })
}
