<template>
  <div class="bg-white rounded-xl shadow-card overflow-hidden">
    <UTable
      :rows="messages"
      :columns="columns"
      :loading="loading"
      :selected-keys="selectedIds"
      @select="handleSelect"
      class="contact-table w-full"
    >
      <template #name-data="{ row }">
        <p class="truncate text-sm text-comma-neutral-700" :title="row.name">
          {{ row.name || '-' }}
        </p>
      </template>

      <template #email-data="{ row }">
        <p class="truncate text-sm text-comma-neutral-700" :title="row.email">
          {{ row.email || '-' }}
        </p>
      </template>

      <template #phone-data="{ row }">
        <p class="truncate text-sm text-comma-neutral-700" :title="row.phone">
          {{ row.phone || '-' }}
        </p>
      </template>

      <template #status-data="{ row }">
        <UBadge
          :color="row.is_read ? 'gray' : 'green'"
          variant="soft"
        >
          {{ row.is_read ? $t('admin_contact_page.read') : $t('admin_contact_page.unread') }}
        </UBadge>
      </template>

      <template #created_at-data="{ row }">
        {{ formatDate(row.created_at) }}
      </template>

      <template #project-data="{ row }">
        <div v-if="row.project_title || row.project_id" class="text-sm">
          <div class="truncate font-medium text-comma-neutral-900" :title="row.project_title || `Project #${row.project_id}`">
            {{ row.project_title || `Project #${row.project_id}` }}
          </div>
          <div v-if="row.project_id" class="text-xs text-comma-neutral-500">#{{ row.project_id }}</div>
        </div>
        <span v-else class="text-sm text-comma-neutral-400">-</span>
      </template>

      <template #actions-data="{ row }">
        <div class="flex items-center gap-2">
          <UButton
            color="primary"
            variant="ghost"
            icon="i-heroicons-eye"
            size="sm"
            :to="localePath(`/admin/contact/${row.contact_us_id}`)"
          />
          <UButton
            color="red"
            variant="ghost"
            icon="i-heroicons-trash"
            size="sm"
            @click="$emit('delete', row)"
          />
        </div>
      </template>
    </UTable>

    <!-- Bulk actions -->
    <div v-if="selectedIds.length > 0" class="p-4 border-t border-comma-border-subtle flex items-center gap-3">
      <span class="text-sm text-comma-neutral-600">{{ selectedIds.length }} selected</span>
      <UButton
        color="primary"
        variant="soft"
        size="sm"
        @click="$emit('mark-read', selectedIds)"
      >
        {{ $t('admin_contact_page.mark_selected_read') }}
      </UButton>
      <UButton
        color="gray"
        variant="soft"
        size="sm"
        @click="selectedIds = []"
      >
        {{ $t('admin_contact_page.clear_selection') }}
      </UButton>
    </div>

    <div v-if="!loading && messages.length === 0" class="border-t border-comma-border-subtle p-8 text-center">
      <p class="font-medium text-comma-neutral-800">No messages found</p>
      <p class="mt-1 text-sm text-comma-neutral-500">Try changing the search or clearing filters.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContactMessage } from '~/types/contact'

const props = defineProps<{
  messages: ContactMessage[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'delete', message: ContactMessage): void
  (e: 'mark-read', ids: number[]): void
}>()

const localePath = useLocalePath()
const { locale } = useI18n()

const selectedIds = ref<number[]>([])

const columns = [
  { key: 'select', type: 'selection' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'project', label: 'Project' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Received' },
  { key: 'actions', label: 'Actions' },
]

function handleSelect(selection: any[]) {
  selectedIds.value = selection.map(item => item.contact_us_id)
}

function formatDate(date: string) {
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) {
    return date || '-'
  }

  return parsedDate.toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
:deep(.contact-table > div) {
  overflow-x: visible;
}

:deep(.contact-table table) {
  table-layout: fixed;
  width: 100%;
  min-width: 0;
}

:deep(.contact-table th),
:deep(.contact-table td) {
  overflow: hidden;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  white-space: nowrap;
}

:deep(.contact-table th:nth-child(1)),
:deep(.contact-table td:nth-child(1)) {
  width: 44px;
}

:deep(.contact-table th:nth-child(2)),
:deep(.contact-table td:nth-child(2)) {
  width: 18%;
}

:deep(.contact-table th:nth-child(3)),
:deep(.contact-table td:nth-child(3)) {
  width: 24%;
}

:deep(.contact-table th:nth-child(4)),
:deep(.contact-table td:nth-child(4)) {
  width: 14%;
}

:deep(.contact-table th:nth-child(5)),
:deep(.contact-table td:nth-child(5)) {
  width: 20%;
}

:deep(.contact-table th:nth-child(6)),
:deep(.contact-table td:nth-child(6)) {
  width: 9%;
}

:deep(.contact-table th:nth-child(7)),
:deep(.contact-table td:nth-child(7)) {
  width: 13%;
}

:deep(.contact-table th:nth-child(8)),
:deep(.contact-table td:nth-child(8)) {
  width: 84px;
}
</style>
