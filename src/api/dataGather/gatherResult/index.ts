import request from '@/axios'
//列表
export const getListApi = (params: any) => {
  return request.get({
    url: '/api/v1/gather_result',
    params
  })
}
//导出数据
export const exportApi = (params: any) => {
  return request.post({
    url: '/api/v1/gather_result/export',
    data: params
  })
}
export const getDataApi = (params: any) => {
  return request.get({
    url: '/api/v1/gather_result/dataID',
    params
  })
}
