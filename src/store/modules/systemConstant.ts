import { defineStore } from 'pinia'
import { store } from '../index'
import { getSystemConstantApi } from '@/api/table/index'

export const useSystemConstantsStore = defineStore({
  id: 'systemConstants',
  state: () => ({
    // 资产采集状态
    collectionStatus: [{}],
    // 资产仿冒状态
    phishingStatus: [{}],
    // 扩线状态
    expandStatus: [{}],
    // 仿冒数据来源
    phishingSource: [{}],
    // 向分析处置的推送状态
    pusherStatus: [{}],
    // 白名单-添加方式
    whiteListFrom: [{}],
    // 仿冒检测规则-添加方式
    ruleFrom: [{}],
    // 受害方类型
    victimType: [{}],
    // 仿冒检测规则-审核状态
    ruleCheck: [{}],
    // 仿冒数据-更新状态(查询ZDTC)
    updateStatus: [{}],
    // 漏报原因
    omissionReason: [{}],
    //粗放规则
    applyTable: [{}],
    applyTableSelect: [{}]
  }),
  actions: {
    async fetchSystemConstants() {
      const res = await getSystemConstantApi()
      // 资产采集状态
      this.collectionStatus = Object.entries(res.data.collectionStatus).map(([value, label]) => ({
        value,
        label
      }))
      // 资产仿冒状态
      this.phishingStatus = Object.entries(res.data.phishingStatus).map(([value, label]) => ({
        value,
        label
      }))
      // 扩线状态
      this.expandStatus = Object.entries(res.data.expandStatus).map(([value, label]) => ({
        value,
        label
      }))
      // 向分析处置的推送状态
      this.pusherStatus = Object.entries(res.data.pusherStatus).map(([value, label]) => ({
        value,
        label
      }))
      // 仿冒数据来源
      this.phishingSource = Object.entries(res.data.phishingSource).map(([value, label]) => ({
        value,
        label
      }))
      // 白名单-添加方式
      this.whiteListFrom = Object.entries(res.data.whiteListFrom).map(([value, label]) => ({
        value,
        label
      }))
      // 仿冒检测规则-添加方式
      this.ruleFrom = Object.entries(res.data.ruleFrom).map(([value, label]) => ({
        value,
        label
      }))
      // 受害方类型
      this.victimType = Object.entries(res.data.victimType).map(([value, label]) => ({
        value,
        label
      }))
      // 仿冒数据-更新状态(查询ZDTC)
      this.ruleCheck = Object.entries(res.data.ruleCheck).map(([value, label]) => ({
        value,
        label
      }))
      // 仿冒数据-更新状态(查询ZDTC)
      this.updateStatus = Object.entries(res.data.updateStatus).map(([value, label]) => ({
        value,
        label
      }))
      // 漏报原因【接口暂无此字段】
      // this.omissionReason = Object.entries(res.data.omissionReason).map(([value, label]) => ({
      //   value,
      //   label
      // }))
      //粗放规则
      this.applyTable = res.data.applyTable
      this.applyTableSelect = Object.entries(res.data.applyTable).map(([value, label]) => ({
        value,
        label
      }))
    }
  }
})
export const useSystemConstantsWithOut = () => {
  return useSystemConstantsStore(store)
}
