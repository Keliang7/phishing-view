<script setup lang="tsx">
import { ref } from 'vue'

const data = [
  {
    count: 200,
    victimKey: '科学研究和技术服务业',
    victimName: '科学研究和技术服务业'
  },
  {
    count: 2200,
    victimKey: '北京',
    victimName: '北京'
  },
  {
    count: 3000,
    victimKey: '上海',
    victimName: '上海'
  },
  {
    count: 8000,
    victimKey: '武汉',
    victimName: '武汉'
  }
]

const temp = ref(1)
const action = (num) => {
  temp.value = num
}
</script>
<template>
  <div class="h-full">
    <div class="p-4px">
      <div
        :style="temp === index ? 'color:#3595FB;background:#F0F2F3;' : ''"
        class="py-4px px-10px flex justify-between border-rd-4px cursor-pointer item-card"
        @click="action(index)"
        v-for="({ count, victimName }, index) in data"
        :key="victimName"
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
