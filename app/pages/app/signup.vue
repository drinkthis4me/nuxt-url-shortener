<script setup lang="ts">
definePageMeta({
  layout: 'login',
  middleware: 'guest',
})
</script>

<template>
  <div class="">
    <div class="text-primary font-bold text-4xl">
      URL Shortener
    </div>
    <UPageHeader>
      <template #title>
        <div class="capitalize">
          Sign up
        </div>
      </template>
      <template #description>
        <div class="flex items-center-safe">
          <p>Already have an account?</p>
          <UButton
            variant="link"
            label="Log in"
            to="/app/login"
          />
        </div>
      </template>
    </UPageHeader>

    <UPageBody>
      <div>
        <FormSignup />
      </div>
    </UPageBody>
  </div>
</template>
