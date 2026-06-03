<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})
</script>

<template>
  <UDashboardPanel id="new-link">
    <template #header>
      <UDashboardNavbar title="New Link">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div>
        <FormCreateShortLink />
      </div>
    </template>
  </UDashboardPanel>
</template>
