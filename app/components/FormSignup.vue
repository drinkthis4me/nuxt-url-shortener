<script lang="ts">
import type { UserCreateSchema } from '~~/shared/schemas/user'
import type { FormSubmitEvent } from '@nuxt/ui'
</script>

<script setup lang="ts">
import { userCreateSchema } from '~~/shared/schemas/user'

const {
  formState: state,
  signup,
  isLoading,
} = useUserSignup()

async function onSubmit(e: FormSubmitEvent<UserCreateSchema>) {
  await signup(e.data)
}
</script>

<template>
  <div>
    <UForm
      :schema="userCreateSchema"
      :state="state"
      class=""
      @submit="onSubmit"
    >
      <div class="grid gap-4">
        <UFormField
          label="Name"
          name="name"
        >
          <UInput
            v-model="state.name"
            :disabled="isLoading"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Email"
          name="email"
        >
          <UInput
            v-model="state.email"
            :disabled="isLoading"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
        >
          <UInput
            v-model="state.password"
            type="password"
            :disabled="isLoading"
            class="w-full"
          />
        </UFormField>
      </div>

      <UButton
        block
        type="submit"
        :loading="isLoading"
        class="mt-4 capitalize"
      >
        Sign up
      </UButton>
    </UForm>
  </div>
</template>
