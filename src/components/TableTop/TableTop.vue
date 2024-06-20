<script setup lang="tsx">
import { ElRow, ElCol } from 'element-plus'
</script>
<template>
  <ElRow>
    <ElCol :span="12" :xs="24">
      <div style="max-width: fit-content">
        <slot name="left"></slot>
      </div>
    </ElCol>
    <ElCol :span="12" :xs="24">
      <div class="mb-15px float-right">
        <slot name="right"> </slot>
      </div>
    </ElCol>
  </ElRow>
</template>
<style scoped></style>
