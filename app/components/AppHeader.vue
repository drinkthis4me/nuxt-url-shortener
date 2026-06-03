<script setup lang="ts">
const { y } = useWindowScroll()
const lastScroll = ref(0)
const isHidden = ref(false)

watch(y, (currentScroll) => {
  // Only hide if we've scrolled down at least 100px
  if (currentScroll > 100) {
    isHidden.value = currentScroll > lastScroll.value
  }
  else {
    // Always show if near the top
    isHidden.value = false
  }
  lastScroll.value = currentScroll
})
</script>

<template>
  <UHeader
    title="URL shortener"
    :toggle="false"
    :ui="{
      root: 'bg-default/75 backdrop-blur border-b border-default h-(--ui-header-height) z-50 transition-transform duration-300',
    }"
    :class="{ '-translate-y-full': isHidden }"
    class="bg-transparent border-none backdrop-blur-none"
  >
    <template #title>
      <div class="text-primary">
        URL Shortener
      </div>
    </template>

    <template #right>
      <UColorModeButton />

      <AuthState v-slot="{ loggedIn }">
        <DropdownAvatar v-if="loggedIn" />
      </AuthState>

      <UButton
        color="primary"
        aria-label="Dashboard"
        to="/app/dashboard"
      >
        Dashboard
      </UButton>
    </template>
  </UHeader>
</template>
