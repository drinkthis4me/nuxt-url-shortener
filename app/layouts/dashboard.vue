<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const sidebarCollapsed = ref(false)

const { toggle: toggleColorMode } = useAppColorMode()

const links = [
  [
    {
      label: 'Overview',
      icon: 'i-lucide-chart-line',
      to: '/app/dashboard',
      onSelect: () => {
        sidebarCollapsed.value = true
      },
    },
    {
      label: 'New Link',
      icon: 'i-lucide-circle-plus',
      to: '/app/dashboard/new-link',
      onSelect: () => {
        sidebarCollapsed.value = true
      },
    },
    {
      label: 'Links',
      icon: 'i-lucide-link',
      to: '/app/dashboard/links',
      onSelect: () => {
        sidebarCollapsed.value = true
      },
    },
  ],
  [
    {
      label: 'Color Mode',
      icon: 'i-lucide-sun-moon',
      onSelect: () => {
        sidebarCollapsed.value = true
        toggleColorMode()
      },
    },
    {
      label: 'Home',
      icon: 'i-lucide-house',
      to: '/',
      onSelect: () => {
        sidebarCollapsed.value = true
      },
    },
  ],
] satisfies NavigationMenuItem[][]
</script>

<template>
  <UApp>
    <UDashboardGroup unit="rem">
      <UDashboardSidebar
        id="default"
        v-model:collapsed="sidebarCollapsed"
        collapsible
        resizable
        class="bg-elevated/25"
        :ui="{
          header: '',
          footer: 'lg:border-t lg:border-default',
        }"
      >
        <template #header="{ collapsed }">
          <UButton
            variant="ghost"
            size="lg"
            to="/"
            class="text-primary font-bold"
            :class="collapsed ? 'mx-auto' : 'text-start'"
          >
            {{ collapsed ? 'U' : 'URL Shortener' }}
          </UButton>
        </template>

        <template #default="{ collapsed }">
          <UNavigationMenu
            :collapsed="collapsed"
            :items="links[0]"
            orientation="vertical"
            tooltip
            popover
          />

          <UNavigationMenu
            :collapsed="collapsed"
            :items="links[1]"
            orientation="vertical"
            tooltip
            class="mt-auto"
          />
        </template>
      </UDashboardSidebar>

      <slot />
    </UDashboardGroup>
  </UApp>
</template>
