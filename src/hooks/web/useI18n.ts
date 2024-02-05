// 引入vueI18n插件的i18n对象
import { i18n } from '@/plugins/vueI18n'

// 定义全局翻译函数的类型
type I18nGlobalTranslation = {
  (key: string): string
  (key: string, locale: string): string
  (key: string, locale: string, list: unknown[]): string
  (key: string, locale: string, named: Record<string, unknown>): string
  (key: string, list: unknown[]): string
  (key: string, named: Record<string, unknown>): string
}

// 定义翻译函数的可变参数类型
type I18nTranslationRestParameters = [string, any]

// 获取键值的函数
const getKey = (namespace: string | undefined, key: string) => {
  // 如果namespace为空，直接返回key
  if (!namespace) {
    return key
  }
  // 如果key以namespace开头，直接返回key
  if (key.startsWith(namespace)) {
    return key
  }
  // 返回带有namespace的键值
  return `${namespace}.${key}`
}

// 使用i18n插件的t函数的类型声明
export const useI18n = (
  namespace?: string
): {
  t: I18nGlobalTranslation
} => {
  // 定义一个普通版本的t函数
  const normalFn = {
    t: (key: string) => {
      return getKey(namespace, key)
    }
  }

  // 如果i18n插件为空，直接返回普通版本的t函数
  if (!i18n) {
    return normalFn
  }

  // 获取i18n插件的t函数和其它方法
  const { t, ...methods } = i18n.global

  // 定义一个全局翻译函数
  const tFn: I18nGlobalTranslation = (key: string, ...arg: any[]) => {
    // 如果key为空，直接返回空字符串
    if (!key) return ''
    // 如果key不包含'.'且namespace为空，直接返回key
    if (!key.includes('.') && !namespace) return key
    // 调用i18n插件的t函数并返回结果
    return (t as any)(getKey(namespace, key), ...(arg as I18nTranslationRestParameters))
  }
  // 返回带有i18n插件方法的t函数
  return {
    ...methods,
    t: tFn
  }
}

// 定义一个全局的t函数，用于调用插件的t函数
export const t = (key: string) => key
