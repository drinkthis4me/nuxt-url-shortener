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
          Log in
        </div>
      </template>
      <template #description>
        <div class="flex items-center-safe">
          <p>Don't have an account?</p>
          <UButton
            variant="link"
            label="sign up"
            to="/app/signup"
          />
        </div>
      </template>
    </UPageHeader>

    <UPageBody>
      <div>
        <FormLogin />
      </div>
    </UPageBody>
  </div>
</template>
