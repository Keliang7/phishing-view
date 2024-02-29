import request from '@/axios'
import type { TotalNumberTypes, UserAccessSource, WeeklyUserActivity, MonthlySales } from './types'

export const getCountApi = (): Promise<IResponse<TotalNumberTypes[]>> => {
  return request.get({ url: '/mock/dashboard/total' })
}

export const getUserAccessSourceApi = (): Promise<IResponse<UserAccessSource[]>> => {
  return request.get({ url: '/mock/dashboard/userAccessSource' })
}

export const getWeeklyUserActivityApi = (): Promise<IResponse<WeeklyUserActivity[]>> => {
  return request.get({ url: '/mock/dashboard/weeklyUserActivity' })
}

export const getMonthlySalesApi = (): Promise<IResponse<MonthlySales[]>> => {
  return request.get({ url: '/mock/dashboard/monthlySales' })
}
