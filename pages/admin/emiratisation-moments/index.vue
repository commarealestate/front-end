<template>

    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
          {{ $t('admin_moments_page.title') }}
        </h1>
        <UButton
          color="primary"
          variant="solid"
          icon="i-heroicons-plus"
          :to="localePath('/admin/emiratisation-moments/new')"
        >
          {{ $t('admin_moments_page.add_new') }}
        </UButton>
      </div>

      <!-- Filters (optional) -->
      <AdminMomentsFilters v-if="false" @filter="applyFilters" @reset="resetFilters" />

      <!-- Loading -->
      <div v-if="store.loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
      </div>

      <!-- Grid -->
      <div v-else-if="store.moments.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AdminMomentsCard
          v-for="moment in store.moments"
          :key="moment.emiratisation_moments_id"
          :moment="moment"
          @delete="handleDelete"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-16 bg-comma-surface-elevated rounded-xl">
        <UIcon name="i-heroicons-photo" class="w-16 h-16 mx-auto text-comma-neutral-400" />
        <h3 class="mt-4 text-lg font-medium text-comma-neutral-700">
          {{ $t('admin_moments_page.no_moments') }}
        </h3>
        <p class="text-comma-neutral-500">
          {{ $t('admin_moments_page.no_moments_desc') }}
        </p>
        <UButton
          color="primary"
          variant="solid"
          class="mt-4"
          :to="localePath('/admin/emiratisation-moments/new')"
        >
          {{ $t('admin_moments_page.add_first') }}
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
import { useMomentsStore } from '~/store/moments'

const store = useMomentsStore()
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
  fetchMoments()
})

function applyFilters(newFilters: Record<string, any>) {
  filters.value = newFilters
  page.value = 1
  fetchMoments()
}

function resetFilters() {
  filters.value = {}
  page.value = 1
  fetchMoments()
}

function fetchPage(newPage: number) {
  page.value = newPage
  fetchMoments()
}

async function fetchMoments() {
  const params: Record<string, any> = {
    ...filters.value,
    page: page.value,
  }
  await store.fetchMoments(params)
  router.replace({ query: params })
}

async function handleDelete(moment: any) {
  if (confirm('Are you sure you want to delete this moment?')) {
    await store.deleteMoment(moment.emiratisation_moments_id)
  }
}
</script>