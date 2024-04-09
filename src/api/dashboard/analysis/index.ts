import request from '@/axios'
import type {
  TotalNumberTypes,
  CounterfeitingIndustryTypes,
  CounterfeitIntentTypes,
  GeographicalDistributionTypes,
  CategoryOptions
} from './types'

export const getCountApi = (params: any): Promise<IResponse<TotalNumberTypes[]>> => {
  return request.get({ url: '/api/v1/sm/dashboard/total', params })
}

export const getDataTransformationApi = (params: any): Promise<IResponse<any>> => {
  return request.get({ url: '/api/v1/sm/dashboard/dataTransformation', params })
}
export const getCounterfeitingIndustryApi = (
  params: any
): Promise<IResponse<CounterfeitingIndustryTypes[]>> => {
  return request.get({ url: '/api/v1/sm/dashboard/counterfeitingIndustry', params })
}
export const getCounterfeitIntentApi = (
  params: any
): Promise<IResponse<CounterfeitIntentTypes[]>> => {
  return request.get({ url: '/api/v1/sm/dashboard/counterfeitIntent', params })
}

export const getGeographicalDistributionApi = (
  params: any
): Promise<IResponse<GeographicalDistributionTypes[]>> => {
  return request.get({ url: '/api/v1/sm/dashboard/geographicalDistribution', params })
}
export const getTableDataCountApi = (params: any): Promise<IResponse<CategoryOptions[]>> => {
  return request.get({ url: '/api/v1/sm/dashboard/tableDataCount', params })
}
export const getcategoryOptionsApi = (params: any): Promise<IResponse<CategoryOptions[]>> => {
  return request.get({ url: '/api/v1/sm/dashboard/categoryOptionsData', params })
}

export const getTaskMessageApi = (params: any): Promise<IResponse<CategoryOptions[]>> => {
  return request.get({ url: '/api/v1/sm/dashboard/taskMessage', params })
}
export const getExtensionApi = (params: any): Promise<IResponse<CategoryOptions[]>> => {
  return request.get({ url: '/api/v1/sm/dashboard/extension', params })
}

//任务统计
export const getStatisticsApi = (params: any): Promise<IResponse<CategoryOptions[]>> => {
  return request.get({ url: '/api/v1/sm/dashboard/statistics', params })
}
//下面选项卡的两个个tab
export const getDSContributionApi = (params): Promise<IResponse<CategoryOptions[]>> => {
  return request.get({ url: '/api/v1/sm/dashboard/dataSourceReport', params })
}
export const getDSReportApi = (params): Promise<IResponse<CategoryOptions[]>> => {
  return request.get({ url: '/api/v1/sm/dashboard/dataSourceContribution', params })
}

//最后一张表
export const getCharacteristicApi = (params: any): Promise<IResponse<CategoryOptions[]>> => {
  return request.get({ url: '/api/v1/sm/dashboard/characteristic', params })
}
