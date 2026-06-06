<template>
  <div class="min-h-screen bg-comma-neutral-50" :dir="direction">
    <!-- Hero Section (unchanged) -->
    <section class="relative min-h-[80vh] lg:min-h-screen flex items-center overflow-hidden">
      <div class="absolute inset-0">
        <img src="~/assets/images/props-hero.jpg" :alt="$t('properties_page.title')"
          class="w-full h-full object-cover scale-125 animate-fade-in" />
        <div class="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/30"></div>
      </div>
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <div class="animate-slide-up mb-6">
            <span
              class="inline-block px-3 py-1 lg:px-4 lg:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs lg:text-sm font-semibold mb-4">
              {{ $t('properties_page.hero_tag') }}
            </span>
            <h1
              class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white mb-4 lg:mb-6 leading-tight font-display">
              {{ $t('properties_page.title') }}
            </h1>
          </div>
          <p
            class="text-base sm:text-lg lg:text-xl xl:text-2xl text-white/90 mb-6 lg:mb-10 leading-relaxed animate-slide-up animation-delay-200">
            {{ $t('properties_page.subtitle') }}
          </p>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-24 lg:h-32 bg-gradient-to-t from-comma-neutral-50 to-transparent">
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-8 lg:py-12 xl:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Top bar: results count, sort, filter button -->
        <div
          class="bg-white rounded-2xl shadow-card p-4 sm:p-5 xl:p-6 mb-6 lg:mb-8 border border-comma-border-subtle flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-2 text-comma-neutral-600">
            <Icon name="mdi:home-outline" class="w-5 h-5" />
            <span class="text-sm lg:text-base">
              {{ $t('properties_page.results_count', { count: totalProperties, total: totalProperties }) }}
            </span>
          </div>
          <div class="flex items-center gap-3">
            <!-- Sort dropdown -->
            <div class="relative">
              <select v-model="sortBy" @change="updateSort"
                class="appearance-none bg-comma-surface-subtle border border-comma-border-subtle rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:border-comma-primary">
                <option value="newest">{{ $t('properties_page.sort.newest') }}</option>
                <option value="price_low">{{ $t('properties_page.sort.price_low') }}</option>
                <option value="price_high">{{ $t('properties_page.sort.price_high') }}</option>
              </select>
              <Icon name="mdi:chevron-down"
                class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-comma-neutral-500 pointer-events-none" />
            </div>
            <!-- Filter button (opens drawer) -->
            <button @click="openFilterDrawer"
              class="inline-flex items-center gap-2 bg-comma-primary text-white px-4 py-2 rounded-lg hover:bg-comma-primary-dark transition shadow-md">
              <Icon name="mdi:filter-variant" class="w-5 h-5" />
              <span class="hidden sm:inline">{{ $t('properties_page.filters') }}</span>
              <span v-if="activeFiltersCount > 0"
                class="bg-white text-comma-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {{ activeFiltersCount }}
              </span>
            </button>
          </div>
        </div>

        <!-- Properties Grid -->
        <div v-if="!store.livePropertiesLoading || displayedProperties.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PropertyCard v-for="property in displayedProperties" :key="property.id" :property="property" />
        </div>

        <!-- Loading state (initial) -->
        <div v-if="store.livePropertiesLoading && displayedProperties.length === 0" class="text-center py-12">
          <Icon name="mdi:loading" class="w-12 h-12 text-comma-primary animate-spin mx-auto" />
        </div>

        <!-- Empty state -->
        <div v-else-if="!store.livePropertiesLoading && displayedProperties.length === 0"
          class="text-center py-16 bg-white rounded-2xl shadow-card border border-comma-border-subtle">
          <Icon name="mdi:home-remove" class="w-16 h-16 text-comma-neutral-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-comma-neutral-800">{{ $t('properties_page.no_results') }}</h3>
          <p class="text-comma-neutral-600 mt-2">{{ $t('properties_page.try_again') }}</p>
          <button @click="resetFilters"
            class="mt-4 inline-flex items-center gap-2 bg-comma-primary text-white px-6 py-2 rounded-lg hover:bg-comma-primary-dark transition">
            <Icon name="mdi:refresh" class="w-4 h-4" />
            {{ $t('properties_page.reset_filters') }}
          </button>
        </div>

        <!-- Load More Button (server-side pagination) -->
        <div v-if="hasNextPage && !store.livePropertiesLoading" class="text-center mt-12">
          <button @click="loadMore"
            class="px-8 py-3 bg-white border border-comma-border-subtle rounded-full text-comma-primary font-semibold hover:shadow-md transition">
            {{ $t('properties_page.load_more') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Filter Drawer (right side) -->
    <Teleport to="body">
      <div v-if="filterDrawerOpen" class="fixed inset-0 z-50 flex justify-end" @click.self="closeFilterDrawer">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" @click="closeFilterDrawer"></div>
        <div
          class="relative w-full max-w-md bg-white h-full shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto"
          :class="filterDrawerOpen ? 'translate-x-0' : 'translate-x-full'">
          <div
            class="sticky top-0 bg-white border-b border-comma-border-subtle px-6 py-4 flex justify-between items-center">
            <h3 class="text-xl font-display font-bold text-comma-neutral-900">{{ $t('properties_page.filters') }}</h3>
            <button @click="closeFilterDrawer" class="p-2 rounded-full hover:bg-comma-surface-subtle">
              <Icon name="mdi:close" class="w-6 h-6" />
            </button>
          </div>
          <div class="p-6">
            <FilterSections :filters="filterState" :service-areas="serviceAreas" :min-price="minPrice"
              :max-price="maxPrice" :format-price="formatPrice"
              @update:property-type="updateFilter('property_type', $event)"
              @update:status="updateFilter('status', $event)" @update:bedrooms="updateFilter('bedrooms', $event)"
              @update:bathrooms="updateFilter('bathrooms', $event)"
              @update:min-price="updateFilter('min_price', $event)"
              @update:max-price="updateFilter('max_price', $event)" @update:hot-deal="updateFilter('hot_deal', $event)"
              @update:service-area-id="updateFilter('service_area_id', $event)" />
          </div>
          <div class="sticky bottom-0 bg-white border-t border-comma-border-subtle p-4 flex gap-3">
            <button @click="resetFilters"
              class="flex-1 py-3 border border-comma-border-subtle rounded-lg text-comma-neutral-700 hover:bg-comma-surface-subtle">
              {{ $t('properties_page.reset') }}
            </button>
            <button @click="applyFilters"
              class="flex-1 py-3 bg-comma-primary text-white rounded-lg hover:bg-comma-primary-dark">
              {{ $t('properties_page.apply_filters') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { usePropertiesStore } from '~/store/properties'
import PropertyCard from '~/components/PropertyCard.vue'
import FilterSections from '~/components/FilterSections.vue'
import type { NormalizedProperty } from '~/types/property'

const { locale } = useI18n()
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const route = useRoute()
const router = useRouter()
const store = usePropertiesStore()

// Constants
const minPrice = 500000
const maxPrice = 50000000
const itemsPerPage = 12

// UI State
const filterDrawerOpen = ref(false)
const displayedProperties = ref<NormalizedProperty[]>([])
const currentPage = ref(1)
const totalProperties = ref(0)
const hasNextPage = computed(() => currentPage.value < (store.propertiesPagination?.lastPage || 1))

// Filter state (synced with URL query)
const filterState = reactive({
  property_type: null as string | null,
  status: null as string | null,
  bedrooms: null as number | null,
  bathrooms: null as number | null,
  min_price: null as number | null,
  max_price: null as number | null,
  hot_deal: false,
  service_area_id: null as number | null,
})

const sortBy = ref<'newest' | 'price_low' | 'price_high'>('newest')
const serviceAreas = ref<{ service_area_id: number; name: string }[]>([])

// Computed: number of active filters (for badge)
const activeFiltersCount = computed(() => {
  let count = 0
  if (filterState.property_type) count++
  if (filterState.status) count++
  if (filterState.bedrooms) count++
  if (filterState.bathrooms) count++
  if (filterState.min_price) count++
  if (filterState.max_price) count++
  if (filterState.hot_deal) count++
  if (filterState.service_area_id) count++
  return count
})

// Helper: format price for display in range slider
function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(price)
}

// Update a single filter and optionally apply immediately (if not using apply button)
function updateFilter(key: keyof typeof filterState, value: any) {
  (filterState as any)[key] = value
}

// Load properties from API based on current filters & pagination
async function loadProperties(resetPage = true) {
  if (resetPage) {
    currentPage.value = 1
    displayedProperties.value = []
  }
  store.livePropertiesLoading = true
  try {
    const params: Record<string, any> = {
      per_page: itemsPerPage,
      page: currentPage.value,
    }
    // Add filters if present
    if (filterState.property_type) params.property_type = filterState.property_type
    if (filterState.status) {
      if (['Sale', 'Rent'].includes(filterState.status)) {
        params.sale_type = filterState.status
      } else {
        params.status = filterState.status
      }
    }
    if (filterState.bedrooms) params.bedrooms = filterState.bedrooms
    if (filterState.bathrooms) params.bathrooms = filterState.bathrooms
    if (filterState.min_price) params.min_price = filterState.min_price
    if (filterState.max_price) params.max_price = filterState.max_price
    if (filterState.hot_deal) params.hot_deal = 1
    if (filterState.service_area_id) params.service_area_id = filterState.service_area_id

    // Sorting
    switch (sortBy.value) {
      case 'price_low':
        params.sort_by = 'price'
        params.sort_direction = 'asc'
        break
      case 'price_high':
        params.sort_by = 'price'
        params.sort_direction = 'desc'
        break
      default:
        params.sort_by = 'created_at'
        params.sort_direction = 'desc'
    }

    const { properties, pagination } = await store.fetchPropertiesFromApi(params)
    if (resetPage) {
      displayedProperties.value = properties
    } else {
      displayedProperties.value = [...displayedProperties.value, ...properties]
    }
    totalProperties.value = pagination?.total || 0
  } catch (error) {
    console.error('Failed to load properties', error)
  } finally {
    store.livePropertiesLoading = false
  }
}

// Load more (next page)
async function loadMore() {
  if (!hasNextPage.value || store.livePropertiesLoading) return
  currentPage.value++
  await loadProperties(false)
}

// Apply filters (close drawer, reset page, update URL)
function applyFilters() {
  // Update URL query params
  const query: any = {}
  if (filterState.property_type) query.property_type = filterState.property_type
  if (filterState.status) query.status = filterState.status
  if (filterState.bedrooms) query.bedrooms = filterState.bedrooms
  if (filterState.bathrooms) query.bathrooms = filterState.bathrooms
  if (filterState.min_price) query.min_price = filterState.min_price
  if (filterState.max_price) query.max_price = filterState.max_price
  if (filterState.hot_deal) query.hot_deal = 1
  if (filterState.service_area_id) query.service_area_id = filterState.service_area_id
  if (sortBy.value !== 'newest') {
    query.sort = sortBy.value
  }
  router.replace({ query })
  filterDrawerOpen.value = false
  loadProperties(true)
}

// Reset all filters
function resetFilters() {
  filterState.property_type = null
  filterState.status = null
  filterState.bedrooms = null
  filterState.bathrooms = null
  filterState.min_price = null
  filterState.max_price = null
  filterState.hot_deal = false
  filterState.service_area_id = null
  sortBy.value = 'newest'
  router.replace({ query: {} })
  loadProperties(true)
}

// Update sort and reload
function updateSort() {
  applyFilters()
}

// Open/close drawer
function openFilterDrawer() {
  filterDrawerOpen.value = true
}
function closeFilterDrawer() {
  filterDrawerOpen.value = false
}

// Sync filter state from URL on mount
function syncFiltersFromQuery() {
  const query = route.query
  if (query.property_type) filterState.property_type = query.property_type as string
  if (query.status) filterState.status = query.status as string
  if (query.bedrooms) filterState.bedrooms = Number(query.bedrooms)
  if (query.bathrooms) filterState.bathrooms = Number(query.bathrooms)
  if (query.min_price) filterState.min_price = Number(query.min_price)
  if (query.max_price) filterState.max_price = Number(query.max_price)
  if (query.hot_deal === '1') filterState.hot_deal = true
  if (query.service_area_id) filterState.service_area_id = Number(query.service_area_id)
  if (query.sort === 'price_low') sortBy.value = 'price_low'
  if (query.sort === 'price_high') sortBy.value = 'price_high'
}

// Fetch service areas for location filter (if needed)
async function fetchServiceAreas() {
  try {
    // You may have an endpoint to fetch service areas. For now we'll assume they come from somewhere else.
    // If not, we can skip locations filter or use a static list.
    // This is a placeholder; adjust as needed.
    const { data } = await useApiFetch({ apiType: 'common', url: 'service-areas', method: 'GET' })
    if (data.value?.status === 1) {
      serviceAreas.value = data.value.data
    }
  } catch (e) {
    console.warn('Service areas not loaded', e)
  }
}

onMounted(async () => {
  syncFiltersFromQuery()
  await fetchServiceAreas()
  await loadProperties(true)
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
