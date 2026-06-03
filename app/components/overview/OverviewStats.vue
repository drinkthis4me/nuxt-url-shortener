<script lang="ts">
import type { DashboardOverview } from '#shared/types/response/dashboardOverview'
import type { AsyncDataRequestStatus } from '#app'

interface Stat {
  title: string
  icon: string
  value: null | string | number
  isLink?: boolean
}
</script>

<script setup lang="ts">
const {
  data,
  status,
} = defineProps<{
  data?: DashboardOverview
  status: AsyncDataRequestStatus
}>()

function formatCount(value: number): string {
  return value.toLocaleString('en-US')
}

const stats = computed<Stat[]>(() => {
  const overviewData = data

  return [
    {
      title: 'Total active links',
      icon: 'i-lucide-link',
      value: overviewData ? formatCount(overviewData.totalLinks) : '-',
    },
    {
      title: 'Total clicks',
      icon: 'i-lucide-mouse-pointer-click',
      value: overviewData ? formatCount(overviewData.totalClicks) : '-',
    },
    {
      title: 'Top link',
      icon: 'i-lucide-rocket',
      value: overviewData?.topLink ?? '-',
      isLink: true,
    },
    {
      title: 'Expiration warning',
      icon: 'i-lucide-circle-alert',
      value: overviewData ? formatCount(overviewData.expiringCount) : '-',
    },
  ] satisfies Stat[]
})
</script>

<template>
  <div>
    <UPageGrid
      v-if="status === 'pending'"
      class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px"
    >
      <UPageCard
        v-for="n in 4"
        :key="n"
        variant="subtle"
        :ui="{
          container: 'gap-y-1.5',
          wrapper: 'items-start',
          leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
          title: 'font-normal text-sm capitalize',
        }"
        class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
      >
        <div class="flex items-center gap-4">
          <USkeleton class="size-12 rounded-full" />

          <div class="grid gap-2">
            <USkeleton class="h-4 w-40" />
            <USkeleton class="h-4 w-40" />
          </div>
        </div>
      </UPageCard>
    </UPageGrid>

    <div
      v-else-if="status === 'error'"
      class="mx-auto"
    >
      Error loading stats
    </div>

    <UPageGrid
      v-else
      class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px"
    >
      <UPageCard
        v-for="(stat, index) in stats"
        :key="index"
        :icon="stat.icon"
        :title="stat.title"
        variant="subtle"
        :ui="{
          container: 'gap-y-1.5',
          wrapper: 'max-w-full items-start',
          leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
          title: 'font-normal text-sm capitalize',
        }"
        class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
      >
        <div class="flex gap-2 max-h-25 min-w-0 overflow-auto">
          <NuxtLink
            v-if="stat.isLink && stat.value && typeof stat.value === 'string'"
            :title="stat.value"
            :to="stat.value"
            target="_blank"
          >
            <p class="text-2xl font-semibold text-highlighted">
              {{ stat.value }}
            </p>
          </NuxtLink>
          <span
            v-else
            class="text-2xl font-semibold text-highlighted"
          >
            {{ stat.value || '-' }}
          </span>
        </div>
      </UPageCard>
    </UPageGrid>
  </div>
</template>
