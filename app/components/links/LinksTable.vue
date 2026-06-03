<script lang="ts">
import type { Link, LinkWithShortUrl } from '~~/shared/types/response/link'
import type { TableColumn } from '@nuxt/ui'
import type { Column, RowSelectionState } from '@tanstack/vue-table'
</script>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import LinksDeleteModel from './LinksDeleteModel.vue'

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')

const formatDate = (date: string | null) => {
  return (date === null)
    ? 'N/A'
    : new Date(date).toLocaleString()
}

const columns: TableColumn<LinkWithShortUrl>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all',
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'aria-label': 'Select row',
      }),
  },
  {
    accessorKey: 'shortCode',
    header: 'Short Link',
  },
  {
    accessorKey: 'longUrl',
    header: 'Original URL',
    meta: {
      class: {
        td: 'max-w-[200px] truncate',
      },
    },
  },
  {
    accessorKey: 'passwordProtected',
    header: ({ column }) => getHeader(column, 'Password Protected'),
  },
  {
    accessorKey: 'hitCount',
    header: ({ column }) => getHeader(column, 'Total Clicks'),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => getHeader(column, 'Created At'),
  },
  {
    accessorKey: 'expiresAt',
    header: ({ column }) => getHeader(column, 'Expires At'),
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
  },
]

function getHeader(column: Column<LinkWithShortUrl>, label: string) {
  const isSorted = column.getIsSorted()

  return h(UButton, {
    color: 'neutral',
    variant: 'ghost',
    label,
    icon: isSorted
      ? isSorted === 'asc'
        ? 'i-lucide-arrow-up-narrow-wide'
        : 'i-lucide-arrow-down-wide-narrow'
      : 'i-lucide-arrow-up-down',
    class: '-mx-2.5',
    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
  })
}

const { copyToClipboard } = useAppClipboard()

const { data, refresh, pending } = await useFetch<Link[]>(
  '/api/links',
  {
    lazy: true,
  },
)

const { getShortUrl } = useShortUrl()
const links = computed<LinkWithShortUrl[]>(() => {
  return data.value
    ? data.value.map(link => ({
        ...link,
        shortUrl: getShortUrl(link.shortCode!),
      }))
    : []
})

const isLoading = ref(false)
const { deleteLink, deleteLinks } = useDeleteLink()
const { open: openDeleteModel } = useAppModel(LinksDeleteModel)
const onDelete = (linkId: number, shortUrl: string) => {
  const onConfirmDelete = async () => {
    isLoading.value = true
    await deleteLink(linkId)
    await refresh()
    isLoading.value = false
  }

  const props = {
    description: `Delete link "${shortUrl}"?`,
  }

  openDeleteModel(
    async () => onConfirmDelete(),
    props,
  )
}

const rowSelection = ref<RowSelectionState>({})
const selectedRowIds = computed<number[]>(() => {
  const ids: number[] = []
  for (const [id, selected] of Object.entries(rowSelection.value)) {
    if (selected) {
      ids.push(parseInt(id))
    }
  }
  return ids
})
const onBulkDelete = async () => {
  const onConfirmDelete = async () => {
    isLoading.value = true
    await deleteLinks(selectedRowIds.value)
    await refresh()
    isLoading.value = false
    rowSelection.value = {}
  }

  const props = {
    description: `Delete selected ${selectedRowIds.value.length} links?`,
  }

  openDeleteModel(
    async () => onConfirmDelete(),
    props,
  )
}
</script>

<template>
  <UCard class="flex flex-col w-full h-full ">
    <div class="flex items-center justify-between px-4 py-3.5 border-b border-accented">
      <div class="flex items-center">
        <UButton
          color="primary"
          :disabled="isLoading"
          @click="refresh()"
        >
          Refresh
        </UButton>

        <div class="mx-2">
          Total links: {{ links.length }}
        </div>
      </div>

      <div v-if="selectedRowIds.length > 0">
        <UButton
          :disabled="isLoading"
          class="capitalize"
          @click="onBulkDelete"
        >
          Bulk delete
        </UButton>
      </div>
    </div>

    <UTable
      v-model:row-selection="rowSelection"
      :data="links"
      :columns="columns"
      :loading="pending || isLoading"
      virtualize
      sticky
      :get-row-id="(row) => row.id.toString()"
      class="w-full h-100 flex-1"
    >
      <template #loading>
        Loading...
      </template>

      <template #empty>
        No Data.
      </template>

      <template #shortCode-cell="{ row }">
        <UButton
          color="neutral"
          variant="ghost"
          @click="copyToClipboard(row.original.shortUrl)"
        >
          {{ row.original.shortCode }}
        </UButton>
      </template>

      <template #longUrl-cell="{ row }">
        <NuxtLink
          :to="row.original.shortUrl"
          target="_blank"
        >
          {{ row.original.longUrl }}
        </NuxtLink>
      </template>

      <template #passwordProtected-cell="{ row }">
        <span v-if="row.original.passwordProtected">
          <UBadge
            icon="i-lucide-lock"
            color="info"
            variant="subtle"
          >
            Yes
          </UBadge>
        </span>
        <span v-else>
          <UBadge
            icon="i-lucide-lock-open"
            color="neutral"
            variant="subtle"
          >
            No
          </UBadge>
        </span>
      </template>

      <template #createdAt-cell="{ row }">
        <ClientOnly>
          <span>{{ formatDate(row.original.createdAt) }}</span>
          <template #fallback>
            <span class="text-gray-400">Loading...</span>
          </template>
        </ClientOnly>
      </template>

      <template #expiresAt-cell="{ row }">
        <ClientOnly>
          <span>{{ formatDate(row.original.expiresAt) }}</span>
          <template #fallback>
            <span class="text-gray-400">Loading...</span>
          </template>
        </ClientOnly>
      </template>

      <template #actions-cell="{ row }">
        <div class="flex gap-2">
          <UButton
            icon="i-lucide-copy"
            variant="ghost"
            size="sm"
            @click="copyToClipboard(row.original.shortCode!)"
          />
          <UButton
            icon="i-lucide-pencil"
            variant="ghost"
            size="sm"
            :disabled="pending || isLoading"
          />
          <UButton
            icon="i-lucide-trash"
            variant="ghost"
            color="error"
            size="sm"
            :disabled="pending || isLoading"
            @click="onDelete(row.original.id, row.original.shortUrl)"
          />
        </div>
      </template>
    </UTable>
  </UCard>
</template>
