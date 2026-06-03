<script setup lang="ts">
definePageMeta({
  layout: 'error',
})
const route = useRoute()

const shortCode = computed(() => {
  const slug = route.params.slug

  return slug && slug.length
    ? slug as string
    : ''
})

const config = useRuntimeConfig()

const redirect = async () => {
  await navigateTo(`${config.public.appUrl}/${shortCode.value}`, {
    external: true,
  })
}
</script>

<template>
  <div class="container flex flex-col items-center gap-2 min-h-[90vh]">
    <h1 class="text-xl font-bold">
      This link is protected.
    </h1>
    <p>Enter password to continue.</p>

    <div class="mt-4">
      <FormVerifyLink
        :short-code="shortCode"
        @verified="redirect"
      />
    </div>
  </div>
</template>
