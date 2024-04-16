<script setup lang="tsx">
import { onMounted } from 'vue'
import { ref } from 'vue'
defineProps({
  data: {
    type: Array as () => Array<{
      // name: string
      // key: string
      count: number
      victimName: string
      victimKey: string
    }>
  }
})
const emit = defineEmits(['change'])
const temp = ref(0)
const action = (num) => {
  emit('change', num)
  temp.value = num
}
onMounted(() => {
  console.log(temp.value)
})
</script>
<template>
  <div class="h-full">
    <div class="p-4px">
      <div
        v-for="({ count, victimName, victimKey }, index) in data"
        :style="temp === index ? 'color:#3595FB;background:#F0F2F3;' : ''"
        class="py-4px px-10px flex justify-between border-rd-4px cursor-pointer item-card"
        @click="action(index)"
        :key="victimKey"
      >
        <div class="title">{{ victimName }}</div>
        <div class="count">{{ count }}</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.item-card:hover {
  color: #3595fb;
}
</style>
