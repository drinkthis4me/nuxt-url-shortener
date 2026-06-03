<script lang="ts">
import type { UserLoginSchema } from '~~/shared/schemas/user'
import type { FormSubmitEvent } from '@nuxt/ui'
</script>

<script setup lang="ts">
import { userLoginSchema } from '~~/shared/schemas/user'

const {
  formState: state,
  isLoading,
  login,
} = useUserLogin()

async function onSubmit(e: FormSubmitEvent<UserLoginSchema>) {
  await login(e.data)
}
</script>

<template>
  <div>
    <UForm
      :schema="userLoginSchema"
      :state="state"
      class=""
      @submit="onSubmit"
    >
      <div class="grid gap-4">
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
        Log in
      </UButton>
    </UForm>
  </div>
</template>
