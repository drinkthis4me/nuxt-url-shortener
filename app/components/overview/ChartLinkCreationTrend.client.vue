<script lang="ts">
import type { ComposeOption } from 'echarts/core'
import type { LineSeriesOption } from 'echarts/charts'
import type {
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption,
} from 'echarts/components'
import type { TrendDataPoint } from '#shared/types/response/dashboardOverview'
import type { AsyncDataRequestStatus } from '#app'
</script>

<script setup lang="ts">
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'

type EChartsOption = ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
  | LineSeriesOption
>

use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  LineChart,
  SVGRenderer,
])

// TODO: toggle theme
provide(THEME_KEY, 'dark')

const {
  data,
  status,
} = defineProps<{
  data?: TrendDataPoint[]
  status: AsyncDataRequestStatus
}>()

const option = computed<EChartsOption>(() => {
  const trend = (data || []) as Array<{ date: string, count: number }>

  return {
    title: {
      text: 'Link Creation Trend',
      subtext: 'Last 30 Days Activity',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '6%',
      bottom: '10%',
      right: '6%',
    },
    xAxis: {
      type: 'category',
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        interval: 5,
        rotate: 0,
        hideOverlap: true,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e2e8f0',
        },
      },
    },
    series: [
      {
        name: 'Links Created',
        type: 'line',
        encode: {
          x: 'date',
          y: 'count',
        },
        itemStyle: {
          color: '#f6339a', // pink-500
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            color: '#e60076', // pink-600 on hover
          },
        },
        smooth: true,
      },
    ],
    dataset: {
      source: trend,
    },
  }
})
</script>

<template>
  <div class="p-4">
    <div v-if="status === 'error'">
      Error Fetching Data
    </div>
    <div
      v-else
      class="w-full h-100"
    >
      <VChart
        class="w-full h-full"
        :init-options="{ renderer: 'svg' }"
        :option="option"
        :autoresize="{ throttle: 200 }"
        :loading="status === 'pending'"
      />
    </div>
  </div>
</template>
