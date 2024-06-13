<script setup lang="tsx">
import { ref } from 'vue'
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
  <div class="h-full w-full position-relative">
    <div class="p-4px">
      <div
        class="position-absolute right-0 top-50% collapse-btn"
        @click="
          () => {
            collapse = !collapse
            emit('collapse', collapse)
          }
        "
        >{{ collapse ? '>>' : '<<' }}</div
      >
      <div
        v-for="({ count, name, key }, index) in data"
        :style="temp === index ? 'color:#3595FB;background:#F0F2F3;' : ''"
        class="py-4px px-10px flex justify-between border-rd-4px cursor-pointer item-card h-20px overflow-hidden"
        @click="action(index, name)"
        :key="key"
      >
        <div class="title text-ellipsis">{{ name }}</div>
        <div v-show="!collapse" class="count">{{ count }}</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.collapse-btn {
  border: 1px solid rgb(217, 214, 214);
  padding: 0px 2px;
  border-radius: 4px;
  cursor: pointer;
  color: rgb(164, 163, 163);
}
.collapse-btn:hover {
  background-color: rgb(248, 247, 247);
}
</style>
