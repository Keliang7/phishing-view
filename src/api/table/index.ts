import request from '@/axios'
import type { TableData } from './types'

export const getTableListApi = (params: any) => {
  return request.get({ url: '/mock/example/list', params })
}

export const getCardTableListApi = (params: any) => {
  return request.get({ url: '/mock/card/list', params })
}

export const getTreeTableListApi = (params: any) => {
  return request.get({ url: '/mock/example/treeList', params })
}

export const saveTableApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.post({ url: '/mock/example/save', data })
}

export const getTableDetApi = (id: string): Promise<IResponse<TableData>> => {
  return request.get({ url: '/mock/example/detail', params: { id } })
}

export const delTableListApi = (ids: string[] | number[]): Promise<IResponse> => {
  return request.post({ url: '/mock/example/delete', data: { ids } })
}
// 获取系统全局静态变量
export const getSystemConstantApi = () => {
  return request.get({ url: '/api/v1/system/constant' })
}
// 获取BW检测子系统列表接口
export const getUrlBWListApi = (params: any) => {
  return request.get({ url: '/api/v1/pendingURL/bw/list', params })
}
// 获取待处理URL-BW数据详情
export const getUrlBWwebInfoApi = (params: any) => {
  return request.get({ url: `/api/v1/pendingURL/bw/details/${params}` })
}
// 获取疑似仿冒数据列表接口
export const getSuspectCounterfeitApi = (params: any) => {
  return request.get({ url: '/api/v1/suspectCounterfeit/list', params })
}
// 获取受害方数据统计(左侧边栏)
export const getInjuredPartyApi = (params: any) => {
  return request.get({ url: '/api/v1/suspectCounterfeit/victimType/statistics', params })
}
// 获取白名单管理列表接口
export const getPolicyWhiteListApi = (params: any) => {
  return request.get({ url: '/api/v1/policyConfiguration/whiteList/list', params })
}
// 获取仿冒检测规则列表接口
export const getPhishingDetectionApi = (params: any) => {
  return request.get({ url: '/api/v1/phishingRule/phishingDetection/list', params })
}
export const getUrlDomainListApi = (params: any) => {
  return request.get({ url: '/mock/example/getUrlDomainList', params })
}
