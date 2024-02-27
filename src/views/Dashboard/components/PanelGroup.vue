<script setup lang="ts">
import { ElRow, ElCol, ElCard, ElSkeleton } from 'element-plus'
import { CountTo } from '@/components/CountTo'
import { useDesign } from '@/hooks/web/useDesign'
import { useI18n } from '@/hooks/web/useI18n'
import { ref } from 'vue'
import { getCountApi } from '@/api/dashboard/analysis'

const { t } = useI18n()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('panel')

const loading = ref(true)

let totalState = ref([{}])

const getCount = async () => {
  const res = await getCountApi()
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
  totalState.value = Object.entries(res?.data || {}).map(([value, label]) => ({
    value,
    label
  }))
  console.log(totalState, 123)
}

getCount()
</script>

<template>
  <ElRow :gutter="20" justify="start" :class="prefixCls">
    <ElCol
      :xl="6"
      :lg="6"
      :md="12"
      :sm="12"
      :xs="24"
      v-for="(item, index) in totalState"
      :key="index"
    >
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated :rows="2">
          <template #default>
            <div class="flex flex-col justify-between">
              <div :class="`${prefixCls}__item--text text-16px text-gray-500 text-center`">{{
                t(`analysis.${item.value}`)
              }}</div>
              <CountTo
                class="text-20px font-700 text-center"
                :start-val="0"
                :end-val="item.label"
                :duration="2600"
              />
            </div>
          </template>
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-panel';

.@{prefix-cls} {
  &__item {
    &--peoples {
      color: #40c9c6;
    }

    &--message {
      color: #36a3f7;
    }

    &--money {
      color: #f4516c;
    }

    &--shopping {
      color: #34bfa3;
    }

    &:hover {
      :deep(.@{namespace}-icon) {
        color: #fff !important;
      }
      .@{prefix-cls}__item--icon {
        transition: all 0.38s ease-out;
      }
      .@{prefix-cls}__item--peoples {
        background: #40c9c6;
      }
      .@{prefix-cls}__item--message {
        background: #36a3f7;
      }
      .@{prefix-cls}__item--money {
        background: #f4516c;
      }
      .@{prefix-cls}__item--shopping {
        background: #34bfa3;
      }
    }
  }
}
</style>
