<template>
  <div class="bg-white rounded-xl shadow-card overflow-hidden">
    <UTable
      :rows="messages"
      :columns="columns"
      :loading="loading"
      :selected-keys="selectedIds"
      @select="handleSelect"
      class="w-full"
    >
      <template #status-data="{ row }">
        <UBadge
          :color="row.is_read ? 'gray' : 'green'"
          variant="soft"
        >
          {{ row.is_read ? $t('admin_contact_page.read') : $t('admin_contact_page.unread') }}
        </UBadge>
      </template>

      <template #created_at-data="{ row }">
        {{ row.created_at }}
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
  { key: 'message', label: 'Message', class: 'max-w-xs truncate' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Received' },
  { key: 'actions', label: 'Actions' },
]

function handleSelect(selection: any[]) {
  selectedIds.value = selection.map(item => item.contact_us_id)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>