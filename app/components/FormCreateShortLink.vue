<script lang="ts">
import type { LinkSchema } from '~~/shared/schemas/link'
import type { LinkWithShortUrl } from '~~/shared/types/response/link'
import type { FormSubmitEvent } from '@nuxt/ui'
</script>

<script setup lang="ts">
import { linkSchema } from '~~/shared/schemas/link'
import DatePicker from './ui/DatePicker.vue'

// Form state
const {
  formState: state,
  isLoading,
  createLink,
} = useCreateLink()
const result = ref<LinkWithShortUrl | null>()

async function onSubmit(event: FormSubmitEvent<LinkSchema>) {
  const res = await createLink(event.data)
  if (res) {
    result.value = res
    openAndScrollToResultCard()
  }
}

// Submit success: Open/Show result card
const resultCardOpen = ref(false)
const resultCard = useTemplateRef('resultCard')
function openAndScrollToResultCard(openState: boolean = true) {
  resultCardOpen.value = openState

  if (resultCardOpen.value) {
    setTimeout(() => {
      resultCard.value?.$el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 200)
  }
}

// Copy link from result card w/ Clipboard API
const { copy, copied, isSupported } = useClipboard({ source: result.value?.shortUrl || '' })
function handleCopy() {
  if (!isSupported) return

  copy(result.value!.shortUrl)
}
</script>

<template>
  <div>
    <UCard>
      <UForm
        :schema="linkSchema"
        :state="state"
        class=""
        @submit="onSubmit"
      >
        <div class="grid gap-4">
          <UFormField
            label="Long URL"
            name="longUrl"
            size="xl"
          >
            <UInput
              v-model="state.longUrl"
              icon="i-lucide-globe"
              placeholder="https://example.org"
              :disabled="isLoading"
              :ui="{
                base: 'h-20 text-2xl px-6',
              }"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Expiration Date (Optional)"
            name="expiresAt"
          >
            <DatePicker
              v-model:date="state.expiresAt"
              :disabled="isLoading"
            />
          </UFormField>

          <UFormField
            label="Password (Optional)"
            name="password"
          >
            <UInput
              v-model="state.password"
              :disabled="isLoading"
              type="password"
              class="w-full"
            />
          </UFormField>
        </div>

        <UButton
          block
          type="submit"
          :disabled="isLoading"
          :loading="isLoading"
          class="mt-4"
        >
          Shorten URL
        </UButton>
      </UForm>
    </UCard>

    <UCollapsible
      v-model:open="resultCardOpen"
      :unmount-on-hide="false"
      class="mt-2"
    >
      <template #content>
        <UCard
          ref="resultCard"
          class=""
        >
          <div
            v-if="result"
            class="flex justify-between items-center"
          >
            <div>
              <h2 class="text-lg">
                Short Link:
              </h2>
              <NuxtLink
                :to="result.shortUrl"
                class="text-primary"
              >
                {{ result.shortUrl }}
              </NuxtLink>
            </div>
            <div>
              <UButton
                square
                :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                @click="handleCopy"
              />
            </div>
          </div>
          <div v-else>
            Something went wrong.
          </div>
        </UCard>

        <div class="h-50" />
      </template>
    </UCollapsible>
  </div>
</template>
