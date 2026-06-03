<script setup lang="ts">
import {
  DateFormatter,
  getLocalTimeZone,
  CalendarDate,
  today,
} from '@internationalized/date'

const props = defineProps<{
  date?: Date | null
  disabled?: boolean
}>()

const emits = defineEmits<{
  'update:date': [value: Date | null]
}>()

const modelValue = computed({
  get: () => {
    if (!props.date) return null

    const y = props.date.getFullYear()
    const m = props.date.getMonth() + 1
    const d = props.date.getDate()

    return new CalendarDate(y, m, d)
  },
  set: (val) => {
    emits(
      'update:date',
      val?.toDate(getLocalTimeZone()) || null,
    )
    open.value = false
  },
})

const minDate = computed(() => today(getLocalTimeZone()).add({ days: 1 }))

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const displayValue = computed(() => {
  return modelValue.value
    ? df.format(modelValue.value?.toDate(getLocalTimeZone()))
    : 'Select a date'
})

const open = ref(false)

function clearDate() {
  modelValue.value = null
  open.value = false
}
</script>

<template>
  <UPopover v-model:open="open">
    <UButton
      color="neutral"
      variant="subtle"
      icon="i-lucide-calendar"
      block
      :disabled="disabled"
    >
      {{ displayValue }}
    </UButton>

    <template #content>
      <UCalendar
        v-model="modelValue"
        :min-value="minDate"
        class="p-2"
      />
      <UButton
        color="secondary"
        variant="subtle"
        block
        class="pt-1 px-1"
        @click="clearDate"
      >
        Clear
      </UButton>
    </template>
  </UPopover>
</template>
