<script lang="ts">
import type { LinkVerifySchema } from '~~/shared/schemas/link'
import type { FormSubmitEvent } from '@nuxt/ui'
</script>

<script setup lang="ts">
import { linkVerifySchema } from '~~/shared/schemas/link'

const props = defineProps<{
  shortCode: string
}>()

const emits = defineEmits<{
  verified: []
}>()

const {
  formState,
  isLoading,
  verify,
} = useVerifyLink(props.shortCode)

async function onSubmit(event: FormSubmitEvent<LinkVerifySchema>) {
  const res = await verify(event.data.password)

  if (res) {
    emits('verified')
  }
}
</script>

<template>
  <div>
    <UCard>
      <UForm
        :schema="linkVerifySchema"
        :state="formState"
        @submit="onSubmit"
      >
        <div class="grid gap-4">
          <UFormField
            label="Password"
            name="password"
          >
            <UInput
              v-model="formState.password"
              type="password"
              :disabled="isLoading"
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
          Unlock
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>
