<script setup lang="tsx">
import { ref } from 'vue'
import { ElTooltip } from 'element-plus'
defineProps({
  data: {
    type: Array as () => Array<{
      name: string
      key: string
      count: number
    }>,
    default: () => [{}, {}]
  }
})
const emit = defineEmits(['change', 'collapse'])
const temp = ref(0)
const action = (num, name) => {
  emit('change', name)
  temp.value = num
}
const collapse = ref(false)
</script>
<template>
  <div class="h-full w-full">
    <div class="p-4px">
      <div
        v-for="({ count, name, key }, index) in data"
        :style="temp === index ? 'color:#3595FB;background:#F0F2F3;' : ''"
        class="py-4px px-10px flex justify-between border-rd-4px cursor-pointer item-card h-20px"
        @click="action(index, name)"
        :key="key"
      >
        <ElTooltip :content="name + '-' + count" placement="right">
          <div class="text-ellipsis">{{ name }}</div>
        </ElTooltip>
        <div v-show="!collapse">{{ count }}</div>
      </div>
    </div>
    <div class="h-20px">
      <Icon
        :icon="!collapse ? 'ep:d-arrow-left' : 'ep:d-arrow-right'"
        class="collapse-btn float-right"
        @click="
          () => {
            collapse = !collapse
            emit('collapse', collapse)
          }
        "
        :size="16"
      />
    </div>
  </div>
</template>
<style scoped>
.collapse-btn {
  border: 1px solid rgb(217, 214, 214);
  padding: 0px 2px;
  border-radius: 4px;
  cursor: pointer;
}
.collapse-btn:hover {
  background-color: rgb(248, 247, 247);
}
.text-ellipsis {
  white-space: nowrap; /* 指定文本不换行 */
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 显示省略号 */
  width: 200px; /* 可根据需要设置固定宽度或使用 max-width */
  display: inline-block;
}
</style>
