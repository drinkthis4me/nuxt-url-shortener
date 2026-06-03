<script lang="ts">
import type { NuxtError } from '#app'

interface AppError extends NuxtError {
  data?: {
    invalidShortUrl: boolean
  }
}
</script>

<script setup lang="ts">
const props = defineProps<{
  error: AppError
}>()

const isLinkError = computed(() => props.error.status === 404 && props.error.data?.invalidShortUrl)

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout name="error">
    <div class="min-h-[90vh] flex flex-col items-center justify-center">
      <div
        v-if="isLinkError"
        class="my-auto"
      >
        <div class="text-center">
          <Icon
            name="lucide:triangle-alert"
            size="10rem"
            class="bg-error"
          />
          <h1 class="text-xl font-extrabold">
            404 Not Found
          </h1>
          <p class="my-2">
            This link dose not exist.
          </p>
          <UButton
            class="mt-4 capitalize"
            @click="handleError"
          >
            Create a new link
          </UButton>
        </div>

        <div class="mt-12 max-w-[80vw] grid gap-4 sm:grid-cols-2">
          <div class="flex items-start gap-4">
            <Icon
              name="lucide:search-check"
              size="2.5em"
              class="bg-info shrink-0"
            />
            <div>
              <h3 class="font-bold">
                Check the link
              </h3>
              <p>Review the link if it has any typo.</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <Icon
              name="lucide:message-square-reply"
              size="2.5em"
              class="bg-info shrink-0"
            />
            <div>
              <h3 class="font-bold">
                Ask for the correct link
              </h3>
              <p>Reach out to sender of this link to resend the correct one.</p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="text-center"
      >
        <Icon
          name="lucide:triangle-alert"
          size="10rem"
          class="bg-error"
        />
        <h1 class="text-xl font-extrabold">
          Page Not Found
        </h1>
        <p class="my-2">
          The page you are looking for does not exist.
        </p>
        <UButton
          class="mt-4 capitalize"
          @click="handleError"
        >
          Go home
        </UButton>
      </div>
    </div>
  </NuxtLayout>
</template>
