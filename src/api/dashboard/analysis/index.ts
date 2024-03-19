import request from '@/axios'
import type {
  TotalNumberTypes,
  DataTransformationTypes,
  CounterfeitingIndustryTypes,
  CounterfeitIntentTypes,
  GeographicalDistributionTypes,
  CategoryOptions
} from './types'

export const getCountApi = (params: any): Promise<IResponse<TotalNumberTypes[]>> => {
  return request.get({ url: '/api/v1/dashboard/total', params })
}

export const getDataTransformationApi = (params: any): Promise<IResponse<any>> => {
  return request.get({ url: '/api/v1/dashboard/dataTransformation', params })
}
export const getCounterfeitingIndustryApi = (
  params: any
): Promise<IResponse<CounterfeitingIndustryTypes[]>> => {
  return request.get({ url: '/api/v1/dashboard/counterfeitingIndustry', params })
}
export const getCounterfeitIntentApi = (
  params: any
): Promise<IResponse<CounterfeitIntentTypes[]>> => {
  return request.get({ url: '/api/v1/dashboard/counterfeitIntent', params })
}

export const getGeographicalDistributionApi = (
  params: any
): Promise<IResponse<GeographicalDistributionTypes[]>> => {
  return request.get({ url: '/api/v1/dashboard/geographicalDistribution', params })
}
export const getTableDataCountApi = (params: any): Promise<IResponse<CategoryOptions[]>> => {
  return request.get({ url: '/api/v1/dashboard/tableDataCount', params })
}
export const getcategoryOptionsApi = (params: any): Promise<IResponse<CategoryOptions[]>> => {
  return request.get({ url: '/api/v1/dashboard/categoryOptionsData', params })
}

export const getTaskMessageApi = (params: any): Promise<IResponse<CategoryOptions[]>> => {
  return request.get({ url: '/api/v1/dashboard/taskMessage', params })
}
export const getExtensionApi = (params: any): Promise<IResponse<CategoryOptions[]>> => {
  return request.get({ url: '/api/v1/dashboard/extension', params })
}

//任务统计
export const getStatisticsApi = (params: any): Promise<IResponse<CategoryOptions[]>> => {
  console.log(params)
  return request.get({ url: '/api/v1/dashboard/statistics', params })
}
//下面选项卡的两个个tab
export const getDSContributionApi = (params): Promise<IResponse<CategoryOptions[]>> => {
  return request.get({ url: '/api/v1/dashboard/dataSourceContribution', params })
}
export const getDSReportApi = (params): Promise<IResponse<CategoryOptions[]>> => {
  return request.get({ url: '/api/v1/dashboard/dataSourceReport', params })
}

//最后一张表
export const getCharacteristicApi = (params: any): Promise<IResponse<CategoryOptions[]>> => {
  return request.get({ url: '/api/v1/dashboard/characteristic', params })
}
