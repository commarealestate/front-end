<template>

    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
          {{ $t('admin_blogs_page.title') }}
        </h1>
        <UButton
          color="primary"
          variant="solid"
          icon="i-heroicons-plus"
          :to="localePath('/admin/blogs/create')"
        >
          {{ $t('admin_blogs_page.add_new') }}
        </UButton>
      </div>

      <!-- Filters (auto‑imported) -->
      <AdminBlogsFilters @filter="applyFilters" @reset="resetFilters" />

      <!-- Loading -->
      <div v-if="store.loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
      </div>

      <!-- Grid -->
      <div v-else-if="store.blogs.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminBlogsCard
          v-for="blog in store.blogs"
          :key="blog.blog_id"
          :blog="blog"
          @toggle-active="handleToggleActive"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-16 bg-comma-surface-elevated rounded-xl">
        <UIcon name="i-heroicons-document-text" class="w-16 h-16 mx-auto text-comma-neutral-400" />
        <h3 class="mt-4 text-lg font-medium text-comma-neutral-700">
          {{ $t('admin_blogs_page.no_blogs') }}
        </h3>
        <p class="text-comma-neutral-500">
          {{ $t('admin_blogs_page.no_blogs_desc') }}
        </p>
        <UButton
          color="primary"
          variant="solid"
          class="mt-4"
          :to="localePath('/admin/blogs/create')"
        >
          {{ $t('admin_blogs_page.add_first') }}
        </UButton>
      </div>

      <!-- Pagination -->
      <div v-if="store.pagination" class="mt-8 flex justify-center">
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
import { useBlogsStore } from '~/store/blogs'

const store = useBlogsStore()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()

const page = ref(1)
const filters = ref<Record<string, any>>({})

onMounted(async () => {
  await store.fetchTags() // preload for filters
  const query = { ...route.query }
  page.value = Number(query.page) || 1
  delete query.page
  filters.value = query
  fetchBlogs()
})

function applyFilters(newFilters: Record<string, any>) {
  filters.value = newFilters
  page.value = 1
  fetchBlogs()
}

function resetFilters() {
  filters.value = {}
  page.value = 1
  fetchBlogs()
}

function fetchPage(newPage: number) {
  page.value = newPage
  fetchBlogs()
}

async function fetchBlogs() {
  const params: Record<string, any> = {
    ...filters.value,
    page: page.value,
  }
  await store.fetchBlogs(params)
  router.replace({ query: params })
}

async function handleToggleActive(blog: any) {
  await store.toggleActive(blog.blog_id, !blog.is_active)
}
</script>