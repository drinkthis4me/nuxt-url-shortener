<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { user, isLoading, logout } = useUserLogout()

const items = computed<DropdownMenuItem[]>(() => [
  {
    type: 'label',
    label: user.value?.name || 'User',
    avatar: {
      src: 'https://i.pravatar.cc/300',
      loading: 'lazy',
    },
  },
  {
    type: 'separator',
  },
  {
    label: 'Log out',
    icon: 'i-lucide-log-out',
    onSelect: async () => await logout(),
  },
])
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{
      align: 'end',
      side: 'bottom',
      sideOffset: 8,
    }"
    :ui="{
      content: 'w-48',
    }"
  >
    <UButton
      size="xl"
      icon="i-lucide-cat"
      variant="outline"
      :loading="isLoading"
    />
  </UDropdownMenu>
</template>
