<template>
  
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
          {{ $t('admin_talents_page.title') }}
        </h1>
        <UButton
          color="primary"
          variant="solid"
          icon="i-heroicons-plus"
          :to="localePath('/admin/talents/new')"
        >
          {{ $t('admin_talents_page.add_new') }}
        </UButton>
      </div>

      <!-- Filters -->
      <AdminTalentsFilters @filter="applyFilters" @reset="resetFilters" />

      <!-- Loading -->
      <div v-if="store.loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
      </div>

      <!-- Grid -->
      <div v-else-if="store.talents.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AdminTalentsCard
          v-for="talent in store.talents"
          :key="talent.talent_id"
          :talent="talent"
          @delete="handleDelete"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-16 bg-comma-surface-elevated rounded-xl">
        <UIcon name="i-heroicons-user-group" class="w-16 h-16 mx-auto text-comma-neutral-400" />
        <h3 class="mt-4 text-lg font-medium text-comma-neutral-700">
          {{ $t('admin_talents_page.no_talents') }}
        </h3>
        <p class="text-comma-neutral-500">
          {{ $t('admin_talents_page.no_talents_desc') }}
        </p>
        <UButton
          color="primary"
          variant="solid"
          class="mt-4"
          :to="localePath('/admin/talents/new')"
        >
          {{ $t('admin_talents_page.add_first') }}
        </UButton>
      </div>

      <!-- Pagination -->
      <div v-if="store.pagination && store.pagination.last_page > 1" class="mt-8 flex justify-center">
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
import { ref, onMounted } from 'vue'
import { useTalentsStore } from '~/store/talents'

const store = useTalentsStore()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()

const page = ref(1)
const filters = ref<Record<string, any>>({})

onMounted(() => {
  const query = { ...route.query }
  page.value = Number(query.page) || 1
  delete query.page
  filters.value = query
  fetchTalents()
})

function applyFilters(newFilters: Record<string, any>) {
  filters.value = newFilters
  page.value = 1
  fetchTalents()
}

function resetFilters() {
  filters.value = {}
  page.value = 1
  fetchTalents()
}

function fetchPage(newPage: number) {
  page.value = newPage
  fetchTalents()
}

async function fetchTalents() {
  const params: Record<string, any> = {
    ...filters.value,
    page: page.value,
  }
  await store.fetchTalents(params)
  router.replace({ query: params })
}

async function handleDelete(talent: any) {
  if (confirm('Are you sure you want to delete this talent?')) {
    await store.deleteTalent(talent.talent_id)
  }
}
</script>