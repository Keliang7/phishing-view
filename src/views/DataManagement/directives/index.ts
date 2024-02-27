/**
 * 自定义指令
 */

// 防抖
export const debounceDirective = {
  // 指令对象，会在当前的dom元素插入到节点之后执行
  mounted(el, binding) {
    // 至少需要回调函数以及监听事件类型
    if (typeof binding.value.fn !== 'function' || !binding.value.event) return
    el.time = null
    const delay = 200
    el.handler = function (...args) {
      if (el.time !== null) {
        clearTimeout(el.time)
      }
      el.time = setTimeout(() => {
        binding.value.fn.apply(this, args)
      }, binding.value.delay || delay)
    }
    el.addEventListener(binding.value.event, el.handler)
  },
  // 元素卸载前,清理定时器并且移除监听事件
  beforeUnmount(el, binding) {
    if (el.timer) {
      clearTimeout(el.timer)
      el.timer = null
    }
    el.removeEventListener(binding.value.event, el.handler)
  }
}
// 节流
