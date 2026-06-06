<template>
  <div class="min-h-screen bg-comma-neutral-50" :dir="direction">
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-comma-primary to-comma-primary-dark">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern"></div>
      </div>

      <div class="container relative z-10 px-4 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight font-display">
            {{ $t('blogs_page.title') }}
          </h1>
          <p class="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
            {{ $t('blogs_page.subtitle') }}
          </p>

          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto">
            <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-luxury p-2 flex items-center">
              <div class="flex-1 flex items-center px-4">
                <Icon name="mdi:magnify" class="w-5 h-5 text-comma-neutral-400 ltr:mr-3 rtl:ml-3" />
                <input
                  type="text"
                  v-model="searchQuery"
                  :placeholder="$t('blogs_page.search_placeholder')"
                  class="w-full py-3 outline-none text-comma-neutral-700 placeholder-comma-neutral-400 bg-transparent"
                  @keyup.enter="searchBlogs"
                />
              </div>
              <button
                @click="searchBlogs"
                class="px-6 py-3 bg-comma-primary text-white font-semibold rounded-xl hover:bg-comma-primary-dark transition-all duration-300 flex items-center gap-2"
              >
                {{ $t('blogs_page.search') }}
                <Icon name="mdi:arrow-right" class="w-4 h-4" :class="{ 'rotate-180': direction === 'rtl' }" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-12 lg:py-20">
      <div class="container px-4 lg:px-8">
        <!-- Loading State -->
        <div v-if="store.loading" class="text-center py-16">
          <Icon name="mdi:loading" class="w-12 h-12 text-comma-primary animate-spin mx-auto" />
        </div>

        <div v-else-if="store.blogs.length">
          <!-- Featured Blog -->
          <div v-if="featuredBlog" class="mb-16">
            <div class="bg-white rounded-3xl shadow-luxury overflow-hidden group hover:shadow-hover transition-all duration-500">
              <div class="grid lg:grid-cols-2 gap-0">
                <!-- Image -->
                <div class="relative h-96 lg:h-auto overflow-hidden">
                  <img
                    :src="featuredBlog.image || '/images/blog-details.jpg'"
                    :alt="featuredBlog.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    @error="(e) => handleImageError(e, 'card')"
                  />
                  <div class="absolute top-4 ltr:left-4 rtl:right-4">
                    <span class="px-3 py-1 bg-comma-primary text-white text-sm font-semibold rounded-full">
                      {{ $t('blogs_page.featured') }}
                    </span>
                  </div>
                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <span class="text-white/80 text-sm">{{ formatDate(featuredBlog.created_at) }}</span>
                  </div>
                </div>

                <!-- Content -->
                <div class="p-8 lg:p-10 flex flex-col justify-center">
                  <div class="flex items-center gap-3 mb-4">
                    <span class="px-3 py-1 bg-comma-primary/10 text-comma-primary text-sm font-semibold rounded-full">
                      {{ $t(`blogs_page.categories.main`) }}
                    </span>
                    <span class="text-comma-neutral-500 text-sm">• {{ formatDate(featuredBlog.created_at) }}</span>
                  </div>

                  <h2 class="text-2xl lg:text-3xl font-bold text-comma-neutral-900 mb-4 leading-tight font-display">
                    {{ featuredBlog.title }}
                  </h2>

                  <p class="text-comma-neutral-600 mb-6 leading-relaxed line-clamp-3">
                    {{ featuredBlog.description }}
                  </p>

                  <div class="mt-auto">
                    <NuxtLink
                      :to="localePath(`/blogs/${featuredBlog.blog_id}-${featuredBlog.slug}`)"
                      class="inline-flex items-center gap-2 text-comma-primary font-semibold group/link hover:text-comma-primary-dark transition-colors duration-300"
                    >
                      {{ $t('blogs_page.read_more') }}
                      <Icon
                        name="mdi:arrow-right"
                        class="w-4 h-4 transform group-hover/link:ltr:translate-x-1 rtl:group-hover/link:-translate-x-1 transition-transform duration-300"
                      />
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Blog Grid -->
          <div class="mb-12">
            <div class="flex justify-between items-center mb-8">
              <h2 class="text-2xl lg:text-3xl font-bold text-comma-neutral-900 font-display">
                {{ $t('blogs_page.all_articles') }}
              </h2>

              <!-- Tag Filter -->
              <div class="flex gap-2 overflow-x-auto pb-2" v-if="uniqueTags.length > 0">
                <button
                  v-for="tag in uniqueTags"
                  :key="tag"
                  @click="toggleTag(tag)"
                  class="px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300"
                  :class="selectedTags.includes(tag)
                    ? 'bg-comma-primary text-white shadow-md'
                    : 'bg-comma-neutral-100 text-comma-neutral-700 hover:bg-comma-neutral-200'"
                >
                  {{ tag }}
                </button>
                <button
                  v-if="selectedTags.length > 0"
                  @click="clearTags"
                  class="px-4 py-2 rounded-full bg-comma-neutral-100 text-comma-neutral-700 hover:bg-comma-neutral-200"
                >
                  {{ $t('blogs_page.clear_filters') }}
                </button>
              </div>
            </div>

            <!-- Blog Cards -->
            <div v-if="paginatedBlogs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div
                v-for="blog in paginatedBlogs"
                :key="blog.blog_id"
                class="bg-white rounded-2xl shadow-card overflow-hidden group hover:shadow-hover transition-all duration-500 hover:-translate-y-1"
              >
                <!-- Image -->
                <div class="relative h-56 overflow-hidden">
                  <img
                    :src="blog.image || '/images/blogs-card.jpg'"
                    :alt="blog.title"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    @error="(e) => handleImageError(e, 'card')"
                  />
                  <div class="absolute top-4 ltr:left-4 rtl:right-4">
                    <span class="px-3 py-1 bg-white/95 backdrop-blur-sm text-comma-primary text-sm font-semibold rounded-full">
                      {{ $t(`blogs_page.categories.main`) }}
                    </span>
                  </div>
                </div>

                <!-- Content -->
                <div class="p-6">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-comma-neutral-500 text-sm">{{ formatDate(blog.created_at) }}</span>
                    <span class="text-comma-neutral-500 text-sm">{{ $t('blogs_page.read_time', { minutes: blog.read_time }) }}</span>
                  </div>

                  <h3 class="text-xl font-bold text-comma-neutral-900 mb-3 leading-tight font-display group-hover:text-comma-primary transition-colors duration-300">
                    {{ blog.title }}
                  </h3>

                  <p class="text-comma-neutral-600 mb-4 text-sm leading-relaxed line-clamp-3">
                    {{ blog.description }}
                  </p>

                  <!-- Tags -->
                  <div class="flex flex-wrap gap-1 mb-4">
                    <span
                      v-for="tag in blog.tags.slice(0, 2)"
                      :key="tag.tag_id"
                      class="px-2 py-0.5 bg-comma-neutral-100 text-comma-neutral-600 text-xs rounded-full"
                    >
                      {{ tag.title }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between pt-4 border-t border-comma-border-subtle">
                    <span class="text-comma-neutral-500 text-sm">{{ $t('blogs_page.by_comma') }}</span>
                    <NuxtLink
                      :to="localePath(`/blogs/${blog.blog_id}-${blog.slug}`)"
                      class="inline-flex items-center gap-1 text-comma-primary font-semibold text-sm group/link hover:text-comma-primary-dark transition-colors duration-300"
                    >
                      {{ $t('blogs_page.read_article') }}
                      <Icon
                        name="mdi:arrow-right"
                        class="w-4 h-4 transform group-hover/link:ltr:translate-x-1 rtl:group-hover/link:-translate-x-1 transition-transform duration-300"
                      />
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-16 bg-white rounded-2xl shadow-card">
              <Icon name="mdi:newspaper-variant-outline" class="w-16 h-16 text-comma-neutral-300 mx-auto mb-4" />
              <h3 class="text-xl font-semibold text-comma-neutral-800 mb-2">{{ $t('blogs_page.no_results') }}</h3>
              <p class="text-comma-neutral-600 mb-6">{{ $t('blogs_page.try_again') }}</p>
              <button
                @click="resetFilters"
                class="px-6 py-2 bg-comma-primary text-white font-semibold rounded-lg hover:bg-comma-primary-dark transition-colors duration-300"
              >
                {{ $t('blogs_page.reset_filters') }}
              </button>
            </div>

            <!-- Pagination -->
            <div class="mt-16 flex justify-center" v-if="filteredBlogs.length > itemsPerPage">
              <div class="flex items-center space-x-2" :class="{ 'space-x-reverse': direction === 'rtl' }">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="w-10 h-10 flex items-center justify-center rounded-lg border border-comma-border-subtle hover:border-comma-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  <Icon name="mdi:chevron-left" class="w-5 h-5 text-comma-neutral-600" :class="{ 'rotate-180': direction === 'rtl' }" />
                </button>

                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="goToPage(page)"
                  class="w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-300"
                  :class="currentPage === page
                    ? 'bg-comma-primary text-white'
                    : 'border border-comma-border-subtle text-comma-neutral-700 hover:border-comma-primary'"
                >
                  {{ page }}
                </button>

                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="w-10 h-10 flex items-center justify-center rounded-lg border border-comma-border-subtle hover:border-comma-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  <Icon name="mdi:chevron-right" class="w-5 h-5 text-comma-neutral-600" :class="{ 'rotate-180': direction === 'rtl' }" />
                </button>
              </div>
            </div>
          </div>

          <!-- CTA Section -->
          <div class="bg-gradient-to-br from-comma-primary to-comma-primary-dark rounded-3xl p-8 lg:p-12 text-center">
            <h2 class="text-2xl lg:text-3xl font-bold text-white mb-4 font-display">
              {{ $t('blogs_page.cta_title') }}
            </h2>
            <p class="text-white/90 mb-6 max-w-2xl mx-auto">
              {{ $t('blogs_page.cta_subtitle') }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink
                :to="localePath('/contact')"
                class="px-8 py-3 bg-white text-comma-primary font-semibold rounded-xl hover:bg-comma-neutral-100 transition-all duration-300 hover:scale-105"
              >
                {{ $t('blogs_page.cta_button') }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/properties')"
                class="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                {{ $t('blogs_page.view_properties') }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="store.error" class="text-center py-16">
          <p class="text-red-600">{{ store.error }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useBlogsStore } from '~/store/blogs'
import type { Blog } from '~/types/blog'

const { locale } = useI18n()
const localePath = useLocalePath()
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')

const store = useBlogsStore()

// Fetch blogs on mount
onMounted(async () => {
  await store.fetchBlogs({ per_page: 100 }) // fetch all for client-side filtering
})

// State
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 6
const selectedTags = ref<string[]>([])

// Helper to get localized field
function getLocalizedField(blog: Blog, field: 'title' | 'description' | 'content') {
  const lang = locale.value === 'ar' ? 'ar' : 'en'
  return blog[`${field}_${lang}`] || blog[field] || ''
}

// Computed filtered blogs
const filteredBlogs = computed(() => {
  let filtered = store.blogs.map(blog => ({
    ...blog,
    title: getLocalizedField(blog, 'title'),
    description: getLocalizedField(blog, 'description'),
    content: getLocalizedField(blog, 'content')
  }))

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(blog =>
      blog.title.toLowerCase().includes(query) ||
      blog.description.toLowerCase().includes(query)
    )
  }

  // Tag filter
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(blog =>
      blog.tags.some(tag => selectedTags.value.includes(tag.title))
    )
  }

  return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

const featuredBlog = computed(() => filteredBlogs.value.length > 0 ? filteredBlogs.value[0] : null)

const totalPages = computed(() => Math.ceil(filteredBlogs.value.length / itemsPerPage))
const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredBlogs.value.slice(start, end)
})

// Unique tags for filter
const uniqueTags = computed(() => {
  const tagsSet = new Set<string>()
  store.blogs.forEach(blog => {
    blog.tags.forEach(tag => tagsSet.add(tag.title))
  })
  return Array.from(tagsSet).sort()
})

// Methods
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function searchBlogs() {
  currentPage.value = 1
}

function toggleTag(tag: string) {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
  currentPage.value = 1
}

function clearTags() {
  selectedTags.value = []
  currentPage.value = 1
}

function resetFilters() {
  searchQuery.value = ''
  selectedTags.value = []
  currentPage.value = 1
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function handleImageError(event: Event, type: 'card' | 'hero') {
  const target = event.target as HTMLImageElement
  target.src = type === 'card' ? '/images/blogs-card.jpg' : '/images/blog-details.jpg'
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.bg-grid-pattern {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white' stroke-opacity='0.1'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}
</style>