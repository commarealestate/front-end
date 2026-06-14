<template>
    <div class="min-h-screen bg-comma-neutral-50" :dir="direction">
        <!-- Hero Section with Fixed Background -->
       <section class="relative flex h-[80vh] min-h-[650px] items-center justify-center overflow-hidden">
            <div class="absolute inset-0">
              <img
                src="/images/projects.jpg"
                alt=""
                class="h-full w-full object-cover object-center"
                :class="mediaBoostClass"
              />
              <HeroOverlay variant="bright" align="center" :direction="direction" />
            </div>

            <!-- Content -->
            <div class="relative z-10 mx-auto max-w-5xl px-6 text-center" :class="contentPanelClass">
                <h1 class="animate-slide-up mb-6 font-display text-4xl font-bold md:text-6xl lg:text-7xl" :class="headingClass">
                    {{ $t('projects_page.hero_title') || 'Our Projects' }}
                </h1>

                <p
                    class="animate-slide-up animation-delay-200 mx-auto max-w-3xl text-lg leading-relaxed md:text-xl lg:text-2xl"
                    :class="bodyClass">
                    {{ $t('projects_page.hero_subtitle') || 'Discover our exclusive developments designed for modern living' }}
                </p>
            </div>
        </section>

        <!-- Main Content -->
        <section class="py-12 lg:py-16">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Filters Bar -->
                <div class="bg-white rounded-2xl shadow-card p-4 sm:p-5 mb-8 border border-comma-border-subtle">
                    <div class="flex flex-col sm:flex-row gap-4">
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-comma-neutral-700 mb-1">{{
                                $t('projects_page.search') || 'Search' }}</label>
                            <div class="relative">
                                <Icon name="mdi:magnify"
                                    class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-comma-neutral-400" />
                                <input v-model="searchTitle" type="text"
                                    :placeholder="$t('projects_page.search_placeholder') || 'Search by project name...'"
                                    class="w-full pl-10 pr-4 py-2.5 border border-comma-border-subtle rounded-xl focus:border-comma-primary focus:ring-1 focus:ring-comma-primary transition" />
                            </div>
                        </div>
                        <div class="sm:w-64">
                            <label class="block text-sm font-medium text-comma-neutral-700 mb-1">{{
                                $t('projects_page.badge_filter') || 'Badge' }}</label>
                            <select v-model="badgeFilter"
                                class="w-full px-4 py-2.5 border border-comma-border-subtle rounded-xl focus:border-comma-primary">
                                <option value="">{{ $t('projects_page.all_badges') || 'All Badges' }}</option>
                                <option value="new">New</option>
                                <option value="featured">Featured</option>
                                <option value="hot">Hot</option>
                            </select>
                        </div>
                        <div class="flex items-end">
                            <button @click="resetFilters"
                                class="px-5 py-2.5 text-comma-primary hover:bg-comma-primary/10 rounded-xl transition">
                                {{ $t('projects_page.reset') || 'Reset' }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="store.loading && projects.length === 0" class="flex justify-center py-20">
                    <div
                        class="w-12 h-12 border-4 border-comma-primary/20 rounded-full animate-spin border-t-comma-primary">
                    </div>
                </div>

                <!-- Projects Grid -->
                <div v-else-if="projects.length > 0"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    <ProjectCard v-for="project in projects" :key="project.project_id" :project="project" />
                </div>

                <!-- Empty State -->
                <div v-else
                    class="text-center py-16 bg-white rounded-2xl shadow-card border border-comma-border-subtle">
                    <Icon name="mdi:office-building-remove" class="w-16 h-16 text-comma-neutral-400 mx-auto mb-4" />
                    <h3 class="text-xl font-semibold text-comma-neutral-800">{{ $t('projects_page.no_projects') || 'No projects found' }}</h3>
                    <p class="text-comma-neutral-600 mt-2">{{ $t('projects_page.try_again') || 'Try adjusting your filters' }}</p>
                    <button @click="resetFilters"
                        class="mt-4 inline-flex items-center gap-2 text-comma-primary hover:underline">
                        <Icon name="mdi:refresh" class="w-4 h-4" />
                        {{ $t('projects_page.reset_filters') || 'Reset filters' }}
                    </button>
                </div>

                <!-- Load More Button -->
                <div v-if="hasNextPage && !store.loading" class="text-center mt-12">
                    <button @click="loadMore" :disabled="loadingMore"
                        class="px-8 py-3 bg-white border border-comma-border-subtle rounded-full text-comma-primary font-semibold hover:shadow-md transition disabled:opacity-50">
                        <Icon v-if="loadingMore" name="mdi:loading" class="w-4 h-4 animate-spin inline mr-2" />
                        {{ loadingMore ? $t('projects_page.loading') : $t('projects_page.load_more') || 'Load More' }}
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useProjectsStore } from '~/store/projects'
import type { Project } from '~/types/project'
import { useDebounceFn } from '@vueuse/core'

const { locale } = useI18n()
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const { headingClass, bodyClass, contentPanelClass, mediaBoostClass } = useSiteHero()
const route = useRoute()
const router = useRouter()
const store = useProjectsStore()

const projects = ref<Project[]>([])
const currentPage = ref(1)
const hasNextPage = ref(false)
const loadingMore = ref(false)

// Filter state (synced with URL query)
const searchTitle = ref('')
const badgeFilter = ref('')

// Debounced search to avoid too many API calls
const debouncedSearch = useDebounceFn(() => {
    updateUrlAndFetch(true)
}, 500)

watch(searchTitle, () => {
    debouncedSearch()
})

watch(badgeFilter, () => {
    updateUrlAndFetch(true)
})

// Update URL query params and fetch projects
function updateUrlAndFetch(resetPage = true) {
    const query: any = {}
    if (searchTitle.value) query.title = searchTitle.value
    if (badgeFilter.value) query.badge = badgeFilter.value

    // Only update URL if different from current
    const currentQuery = route.query
    const hasChanges =
        (query.title !== currentQuery.title) ||
        (query.badge !== currentQuery.badge)

    if (hasChanges) {
        router.replace({ query })
    }

    fetchProjects(resetPage)
}

async function fetchProjects(resetPage = true) {
    if (resetPage) {
        currentPage.value = 1
        projects.value = []
    }

    store.loading = true
    try {
        const params: any = {
            per_page: 9,
            page: currentPage.value,
            status: 'Published'
        }
        if (searchTitle.value) params.title = searchTitle.value
        if (badgeFilter.value) params.badge = badgeFilter.value

        const result = await store.fetchProjects(params)
        const visibleProjects = result.projects.filter((project) => {
            if (!project.status) return true
            return String(project.status).toLowerCase() === 'published'
        })
        if (resetPage) {
            projects.value = visibleProjects
        } else {
            projects.value = [...projects.value, ...visibleProjects]
        }
        hasNextPage.value = currentPage.value < (result.pagination?.lastPage || 1)
    } catch (error) {
        console.error('Failed to fetch projects:', error)
    } finally {
        store.loading = false
    }
}

async function loadMore() {
    if (!hasNextPage.value || loadingMore.value) return
    loadingMore.value = true
    currentPage.value++
    await fetchProjects(false)
    loadingMore.value = false
}

function resetFilters() {
    searchTitle.value = ''
    badgeFilter.value = ''
    router.replace({ query: {} })
    fetchProjects(true)
}

// Sync filters from URL on mount
function syncFiltersFromUrl() {
    const query = route.query
    if (query.title) searchTitle.value = query.title as string
    if (query.badge) badgeFilter.value = query.badge as string
}

onMounted(() => {
    syncFiltersFromUrl()
    fetchProjects(true)
})
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 1s ease-out;
}

.animate-slide-up {
    animation: slideUp 0.8s ease-out;
}

.animation-delay-200 {
    animation-delay: 200ms;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
