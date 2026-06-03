<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const { status: overviewStatus, data: overviewData } = useDashboardOverview()

const { status: trendStatus, data: trendData } = useDashboardLinkCreationTrend()
</script>

<template>
  <UDashboardPanel id="overview">
    <template #header>
      <UDashboardNavbar title="Overview">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="pb-8">
        <OverviewStats
          :data="overviewData"
          :status="overviewStatus"
        />

        <div>
          <ClientOnly>
            <OverviewChartLinkCreationTrend
              :data="trendData"
              :status="trendStatus"
            />
          </ClientOnly>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
