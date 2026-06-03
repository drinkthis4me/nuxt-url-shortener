<script setup lang="ts">
defineProps<{
  description: string
}>()

const emit = defineEmits<{ close: [boolean] }>()
</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    title="Confirm deletion"
  >
    <template #body>
      <div>
        {{ description }}
      </div>
    </template>

    <template #footer>
      <div class="w-full flex justify-end gap-2">
        <UButton
          color="neutral"
          label="Cancel"
          @click="emit('close', false)"
        />
        <UButton
          color="error"
          label="Delete"
          @click="emit('close', true)"
        />
      </div>
    </template>
  </UModal>
</template>
