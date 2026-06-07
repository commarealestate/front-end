<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
          {{ $t('admin_contact_page.title') }}
        </h1>
      </div>

      <!-- Filters -->
      <AdminContactFilters :initial-filters="filters" @filter="applyFilters" @reset="resetFilters" />

      <!-- Table -->
      <AdminContactTable
        :messages="store.messages"
        :loading="store.loading"
        @delete="handleDelete"
        @mark-read="handleMarkRead"
      />

      <!-- Pagination -->
      <div v-if="store.pagination" class="flex justify-center">
        <UPagination
          v-model="page"
          :page-count="store.pagination.perPage"
          :total="store.pagination.total"
          @update:model-value="fetchPage"
        />
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useContactStore } from '~/store/contact'

const store = useContactStore()
const route = useRoute()
const router = useRouter()

const page = ref(1)
const filters = ref<Record<string, any>>({})

onMounted(() => {
  syncFromQuery()
  fetchMessages()
})

watch(
  () => route.query,
  () => {
    syncFromQuery()
    fetchMessages(false)
  },
)

function syncFromQuery() {
  const query = { ...route.query }
  page.value = Number(query.page) || 1
  delete query.page
  filters.value = Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== '' && value !== undefined && value !== null),
  )
}

function applyFilters(newFilters: Record<string, any>) {
  filters.value = newFilters
  page.value = 1
  fetchMessages()
}

function resetFilters() {
  filters.value = {}
  page.value = 1
  fetchMessages()
}

function fetchPage(newPage: number) {
  page.value = newPage
  fetchMessages()
}

async function fetchMessages(updateQuery = true) {
  const params = routeQueryParams()
  await store.fetchMessages(params)
  if (updateQuery) {
    router.replace({ query: params })
  }
}

function routeQueryParams() {
  const params: Record<string, any> = {
    ...filters.value,
    page: page.value,
  }

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== undefined && value !== null),
  )
}

async function handleDelete(message: any) {
  if (confirm('Are you sure you want to delete this message?')) {
    await store.deleteMessage(message.contact_us_id)
  }
}

async function handleMarkRead(ids: number[]) {
  await store.markAsRead(ids)
}
</script>
