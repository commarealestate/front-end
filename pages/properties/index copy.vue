<template>
  <div class="min-h-screen bg-comma-neutral-50" :dir="direction">
    <!-- Hero Section -->
    <section class="relative min-h-[80vh] lg:min-h-screen flex items-center overflow-hidden">
      <div class="absolute inset-0">
        <img
          src="~/assets/images/props-hero.jpg"
          :alt="$t('properties_page.title')"
          class="w-full h-full object-cover scale-125 animate-fade-in"
        />
        <div class="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/30"></div>
      </div>
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <div class="animate-slide-up mb-6">
            <span class="inline-block px-3 py-1 lg:px-4 lg:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs lg:text-sm font-semibold mb-4">
              {{ $t('properties_page.hero_tag') }}
            </span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white mb-4 lg:mb-6 leading-tight font-display">
              {{ $t('properties_page.title') }}
            </h1>
          </div>
          <p class="text-base sm:text-lg lg:text-xl xl:text-2xl text-white/90 mb-6 lg:mb-10 leading-relaxed animate-slide-up animation-delay-200">
            {{ $t('properties_page.subtitle') }}
          </p>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-24 lg:h-32 bg-gradient-to-t from-comma-neutral-50 to-transparent"></div>
    </section>

    <!-- Main Content -->
    <section class="py-8 lg:py-12 xl:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <!-- Sidebar Filters (desktop) -->
          <aside class="hidden lg:block lg:w-1/4 xl:w-1/5">
            <div class="bg-white rounded-2xl shadow-card p-5 xl:p-6 sticky top-24 border border-comma-border-subtle">
              <div class="flex items-center justify-between mb-6 xl:mb-8">
                <div class="flex items-center gap-2 xl:gap-3">
                  <div class="w-8 h-8 xl:w-10 xl:h-10 rounded-lg bg-comma-primary/10 flex items-center justify-center">
                    <Icon name="mdi:filter" class="w-4 h-4 xl:w-5 xl:h-5 text-comma-primary" />
                  </div>
                  <h3 class="text-base xl:text-lg font-bold text-comma-neutral-900">{{ $t('properties_page.filters') }}</h3>
                </div>
                <button
                  @click="resetFilters"
                  class="text-xs xl:text-sm text-comma-primary hover:text-comma-primary-dark transition-colors duration-300 flex items-center gap-1"
                >
                  <Icon name="mdi:refresh" class="w-3 h-3 xl:w-4 xl:h-4" />
                  {{ $t('properties_page.reset') }}
                </button>
              </div>

              <FilterSections
                :filters="uiFilters"
                :service-areas="serviceAreas"
                :min-price="minPrice"
                :max-price="maxPrice"
                :format-price="formatPrice"
                @update:property-type="uiFilters.property_type = $event"
                @update:status="uiFilters.status = $event"
                @update:bedrooms="uiFilters.bedrooms = $event"
                @update:bathrooms="uiFilters.bathrooms = $event"
                @update:min-price="uiFilters.min_price = $event"
                @update:max-price="uiFilters.max_price = $event"
                @update:hot-deal="uiFilters.hot_deal = $event"
                @update:locations="uiFilters.locations = $event"
              />

              <button
                @click="applyFilters"
                class="w-full mt-6 xl:mt-8 py-3 xl:py-3.5 bg-comma-primary text-white font-semibold rounded-xl hover:bg-comma-primary-dark transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm xl:text-base"
                :disabled="store.loading"
              >
                <Icon name="mdi:check-circle" class="w-4 h-4 xl:w-5 xl:h-5" />
                {{ $t('properties_page.apply_filters') }}
                <span class="ltr:ml-auto rtl:mr-auto text-xs xl:text-sm bg-white/20 px-2 py-1 rounded">
                  {{ store.pagination?.total || 0 }}
                </span>
              </button>
            </div>
          </aside>

          <!-- Properties Grid -->
          <main class="lg:w-3/4 xl:w-4/5">
            <!-- Results Header with Mobile Filter Button -->
            <div class="bg-white rounded-2xl shadow-card p-4 sm:p-5 xl:p-6 mb-6 lg:mb-8 border border-comma-border-subtle">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <!-- Sort -->
                  <div class="relative flex-1 sm:flex-none">
                    <select
                      v-model="sortBy"
                      @change="applyFilters"
                      class="appearance-none w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 ltr:pl-8 sm:ltr:pl-10 rtl:pr-8 sm:rtl:pr-10 ltr:pr-6 sm:ltr:pr-8 rtl:pl-6 sm:rtl:pl-8 border border-comma-border-subtle rounded-lg bg-white text-sm sm:text-base text-comma-neutral-700 focus:outline-none focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 cursor-pointer"
                    >
                      <option value="newest">{{ $t('properties_page.sort.newest') }}</option>
                      <option value="price_low">{{ $t('properties_page.sort.price_low') }}</option>
                      <option value="price_high">{{ $t('properties_page.sort.price_high') }}</option>
                      <option value="featured">{{ $t('properties_page.sort.featured') }}</option>
                    </select>
                    <Icon name="mdi:sort" class="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-comma-neutral-400 ltr:left-2 sm:ltr:left-3 rtl:right-2 sm:rtl:right-3" />
                  </div>

                  <!-- Mobile Filter Button -->
                  <button
                    @click="showMobileFilters = true"
                    class="lg:hidden px-3 sm:px-4 py-2 sm:py-2.5 bg-comma-primary text-white rounded-lg flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                  >
                    <Icon name="mdi:filter" class="w-4 h-4 sm:w-5 sm:h-5" />
                    {{ $t('properties_page.filters') }}
                  </button>

                  <!-- View Toggle -->
                  <div class="hidden sm:flex items-center gap-1 p-1 bg-comma-surface-subtle rounded-lg">
                    <button
                      @click="gridView = 'grid'"
                      class="p-1.5 sm:p-2 rounded transition-colors"
                      :class="gridView === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'"
                    >
                      <Icon name="mdi:view-grid" class="w-4 h-4 sm:w-5 sm:h-5 text-comma-neutral-600" />
                    </button>
                    <button
                      @click="gridView = 'list'"
                      class="p-1.5 sm:p-2 rounded transition-colors"
                      :class="gridView === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/50'"
                    >
                      <Icon name="mdi:view-list" class="w-4 h-4 sm:w-5 sm:h-5 text-comma-neutral-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="store.loading" class="text-center py-12 lg:py-16">
              <Icon name="mdi:loading" class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-comma-primary animate-spin mx-auto" />
            </div>

            <!-- Properties Grid/List View -->
            <div v-else-if="properties.length > 0">
              <div v-if="gridView === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                <PropertyCard
                  v-for="property in properties"
                  :key="property.property_id"
                  :property="property"
                />
              </div>
              <div v-else class="space-y-3 sm:space-y-4">
                <!-- List view (adapted to new CRM field names) -->
                <div
                  v-for="property in properties"
                  :key="property.property_id"
                  class="bg-white rounded-2xl shadow-card border border-comma-border-subtle overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <NuxtLink :to="localePath(`/properties/${property.property_id}-${propertySlug(property)}`)" class="flex flex-col md:flex-row">
                    <!-- Image Column -->
                    <div class="md:w-1/3 relative h-40 sm:h-48 md:h-auto">
                      <img
                        :src="property.property_photos?.[0] || FALLBACK_IMAGE"
                        :alt="propertyTitle(property)"
                        class="w-full h-full object-cover"
                        @error="($event) => ($event.target.src = FALLBACK_IMAGE)"
                      />
                      <div class="absolute top-2 ltr:left-2 rtl:right-2">
                        <span class="px-2 py-1 bg-comma-primary text-white text-xs font-semibold rounded">
                          {{ property.property_type || property.sale_type }}
                        </span>
                      </div>
                    </div>

                    <!-- Content Column -->
                    <div class="md:w-2/3 p-4 sm:p-5 md:p-6">
                      <div class="flex justify-between items-start mb-2 sm:mb-3">
                        <h3 class="text-base sm:text-lg md:text-xl font-bold text-comma-neutral-900 line-clamp-1">
                          {{ propertyTitle(property) }}
                        </h3>
                        <span class="text-lg sm:text-xl md:text-2xl font-bold text-comma-primary">
                          {{ formatPrice(property.price) }}
                        </span>
                      </div>

                      <p class="text-xs sm:text-sm text-comma-neutral-600 mb-3 sm:mb-4 line-clamp-2">
                        {{ propertyDescription(property) }}
                      </p>

                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                        <!-- Bedrooms -->
                        <div class="flex items-center gap-1 sm:gap-2">
                          <Icon name="mdi:bed" class="w-3 h-3 sm:w-4 sm:h-4 text-comma-primary" />
                          <span class="text-xs sm:text-sm">{{ property.bedroom || 0 }} {{ $t('properties_page.beds') }}</span>
                        </div>
                        <!-- Bathrooms -->
                        <div class="flex items-center gap-1 sm:gap-2">
                          <Icon name="mdi:shower" class="w-3 h-3 sm:w-4 sm:h-4 text-comma-primary" />
                          <span class="text-xs sm:text-sm">{{ property.bathroom || 0 }} {{ $t('properties_page.baths') }}</span>
                        </div>
                        <!-- Size (build_up_area_sqft or total_area_sqft) -->
                        <div class="flex items-center gap-1 sm:gap-2">
                          <Icon name="mdi:square-foot" class="w-3 h-3 sm:w-4 sm:h-4 text-comma-primary" />
                          <span class="text-xs sm:text-sm">{{ propertySize(property) }} sqft</span>
                        </div>
                        <!-- Location -->
                        <div class="flex items-center gap-1 sm:gap-2">
                          <Icon name="mdi:map-marker" class="w-3 h-3 sm:w-4 sm:h-4 text-comma-primary" />
                          <span class="text-xs sm:text-sm truncate">{{ property.location || property.community || property.city }}</span>
                        </div>
                      </div>
                    </div>
                  </NuxtLink>
                </div>
              </div>

              <!-- Pagination -->
              <div class="mt-8 lg:mt-12" v-if="store.pagination && store.pagination.last_page > 1">
                <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div class="text-xs sm:text-sm text-comma-neutral-600 order-2 sm:order-1">
                    {{ $t('properties_page.showing', { from: store.pagination.from, to: store.pagination.to, total: store.pagination.total }) }}
                  </div>
                  <div class="flex items-center space-x-1 rtl:space-x-reverse order-1 sm:order-2">
                    <button
                      @click="goToPage(store.pagination.current_page - 1)"
                      :disabled="store.pagination.current_page === 1"
                      class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-lg border border-comma-border-subtle hover:border-comma-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                    >
                      <Icon :name="direction === 'ltr' ? 'mdi:chevron-left' : 'mdi:chevron-right'" class="w-4 h-4 sm:w-5 sm:h-5 text-comma-neutral-600" />
                    </button>
                    <button
                      v-for="page in visiblePages"
                      :key="page"
                      @click="goToPage(page)"
                      class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-lg transition-colors duration-300 text-xs sm:text-sm"
                      :class="store.pagination.current_page === page
                        ? 'bg-comma-primary text-white shadow-md'
                        : 'border border-comma-border-subtle text-comma-neutral-700 hover:border-comma-primary hover:shadow-sm'"
                    >
                      {{ page }}
                    </button>
                    <button
                      @click="goToPage(store.pagination.current_page + 1)"
                      :disabled="store.pagination.current_page === store.pagination.last_page"
                      class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-lg border border-comma-border-subtle hover:border-comma-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                    >
                      <Icon :name="direction === 'ltr' ? 'mdi:chevron-right' : 'mdi:chevron-left'" class="w-4 h-4 sm:w-5 sm:h-5 text-comma-neutral-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12 lg:py-16 bg-white rounded-2xl shadow-card border border-comma-border-subtle">
              <div class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-comma-primary/10 flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <Icon name="mdi:magnify" class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-comma-primary" />
              </div>
              <h3 class="text-lg sm:text-xl lg:text-2xl font-bold text-comma-neutral-800 mb-2 lg:mb-4">{{ $t('properties_page.no_results') }}</h3>
              <p class="text-sm sm:text-base text-comma-neutral-600 mb-6 lg:mb-8 max-w-md mx-auto px-4">{{ $t('properties_page.try_again') }}</p>
              <button
                @click="resetFilters"
                class="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-comma-primary text-white font-semibold rounded-lg hover:bg-comma-primary-dark transition-colors duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <Icon name="mdi:refresh" class="w-4 h-4 sm:w-5 sm:h-5" />
                {{ $t('properties_page.reset_filters') }}
              </button>
            </div>
          </main>
        </div>
      </div>
    </section>

    <!-- Mobile Filter Drawer -->
    <Teleport to="body">
      <div v-if="showMobileFilters" class="fixed inset-0 z-50 lg:hidden" @click.self="showMobileFilters = false">
        <div class="absolute inset-0 bg-black/25 transition-opacity" @click="showMobileFilters = false"></div>
        <div
          class="absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
          :class="showMobileFilters ? 'translate-x-0' : 'translate-x-full'"
        >
          <div class="h-full flex flex-col">
            <div class="flex items-center justify-between p-4 border-b border-comma-border-subtle">
              <h3 class="text-lg font-bold text-comma-neutral-900">{{ $t('properties_page.filters') }}</h3>
              <button @click="showMobileFilters = false" class="p-2 rounded-lg hover:bg-comma-surface-subtle">
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-6">
              <FilterSections
                :filters="uiFilters"
                :service-areas="serviceAreas"
                :min-price="minPrice"
                :max-price="maxPrice"
                :format-price="formatPrice"
                @update:property-type="uiFilters.property_type = $event"
                @update:status="uiFilters.status = $event"
                @update:bedrooms="uiFilters.bedrooms = $event"
                @update:bathrooms="uiFilters.bathrooms = $event"
                @update:min-price="uiFilters.min_price = $event"
                @update:max-price="uiFilters.max_price = $event"
                @update:hot-deal="uiFilters.hot_deal = $event"
                @update:locations="uiFilters.locations = $event"
              />
            </div>
            <div class="p-4 border-t border-comma-border-subtle">
              <button
                @click="applyMobileFilters"
                class="w-full py-3.5 bg-comma-primary text-white font-semibold rounded-xl hover:bg-comma-primary-dark transition-all duration-300 flex items-center justify-center gap-2"
                :disabled="store.loading"
              >
                <Icon name="mdi:check-circle" class="w-5 h-5" />
                {{ $t('properties_page.apply_filters') }}
                <span class="ml-2 text-sm bg-white/20 px-2 py-1 rounded">{{ store.pagination?.total || 0 }}</span>
              </button>
            </div>
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
import { debounce } from 'lodash-es'
import type { Property } from '~/types/property'

const { locale, t } = useI18n()
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()

const store = usePropertiesStore()

// Constants
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&fit=crop'
const minPrice = 500000
const maxPrice = 50000000

// UI state
const searchQuery = ref('')
const sortBy = ref('newest')
const gridView = ref('grid')
const activeQuickFilter = ref(null)
const showMobileFilters = ref(false)

// UI filters (mirror of API params)
const uiFilters = reactive({
  property_type: null as string | null,
  status: null as string | null,    // will map to sale_type
  bedrooms: null as number | null,  // maps to bedroom
  bathrooms: null as number | null, // maps to bathroom
  min_price: null as number | null,
  max_price: null as number | null,
  hot_deal: false,
  locations: [] as number[],
})

// Service areas (to be fetched from store or API)
const serviceAreas = ref<any[]>([])

// Helper: get localized property title
function propertyTitle(property: Property): string {
  if (!property.title) return ''
  return locale.value === 'ar' ? property.title.arabic : property.title.english
}

// Helper: get localized property description
function propertyDescription(property: Property): string {
  if (!property.description) return ''
  return locale.value === 'ar' ? property.description.arabic : property.description.english
}

// Helper: get property slug for URL (object or fallback to ID)
function propertySlug(property: Property): string {
  if (property.slug) {
    return locale.value === 'ar' ? property.slug.ar : property.slug.en
  }
  return String(property.property_id)
}

// Helper: get property size (prefer build_up_area_sqft, fallback to total_area_sqft)
function propertySize(property: Property): string {
  const size = property.build_up_area_sqft || property.total_area_sqft
  return size ? Math.round(Number(size)).toLocaleString() : 'N/A'
}

// Map raw properties to localized display
const properties = computed(() => {
  return store.properties.map(p => ({
    ...p,
    // Override title, description for easy access in template (optional)
    // But we'll use helper functions directly in template to avoid duplication
  }))
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(price)
}

// Build API params from UI filters (using correct backend field names)
const buildApiParams = (page = 1) => {
  const params: Record<string, any> = {
    page,
    per_page: 100,
  }
  if (searchQuery.value) params.title = searchQuery.value
  if (uiFilters.property_type) params.property_type = uiFilters.property_type
  if (uiFilters.status) params.sale_type = uiFilters.status   // "Sale" or "Rent"
  if (uiFilters.bedrooms) params.bedroom = uiFilters.bedrooms
  if (uiFilters.bathrooms) params.bathroom = uiFilters.bathrooms
  if (uiFilters.min_price) params.min_price = uiFilters.min_price
  if (uiFilters.max_price) params.max_price = uiFilters.max_price
  if (uiFilters.hot_deal) params.hot_deal = 1
  if (uiFilters.locations.length) params.service_area_id = uiFilters.locations.join(',')

  // Sorting
  const { sort_by, sort_direction } = mapSort(sortBy.value)
  if (sort_by) params.sort_by = sort_by
  if (sort_direction) params.sort_direction = sort_direction

  return params
}

const mapSort = (sort: string) => {
  switch (sort) {
    case 'price_low': return { sort_by: 'price', sort_direction: 'asc' }
    case 'price_high': return { sort_by: 'price', sort_direction: 'desc' }
    case 'featured': return { sort_by: 'featured', sort_direction: 'desc' }
    default: return { sort_by: 'created_at', sort_direction: 'desc' }
  }
}

// Apply filters and fetch
const applyFilters = async (page = 1) => {
  const params = buildApiParams(page)
  await store.fetchProperties(params)
  // Update URL query (exclude page and per_page)
  const query = { ...params }
  delete query.page
  delete query.per_page
  router.push({ query })
  showMobileFilters.value = false
}

const debouncedApply = debounce(applyFilters, 500)

// Reset filters
const resetFilters = () => {
  uiFilters.property_type = null
  uiFilters.status = null
  uiFilters.bedrooms = null
  uiFilters.bathrooms = null
  uiFilters.min_price = null
  uiFilters.max_price = null
  uiFilters.hot_deal = false
  uiFilters.locations = []
  searchQuery.value = ''
  sortBy.value = 'newest'
  applyFilters(1)
}

const applyMobileFilters = () => {
  applyFilters(1)
}

// Pagination helpers
const visiblePages = computed(() => {
  if (!store.pagination) return []
  const current = store.pagination.current_page
  const last = store.pagination.last_page
  const delta = 2
  const range = []
  const rangeWithDots: (number | string)[] = []
  let l: number | undefined

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots
})

const goToPage = (page: number | string) => {
  if (typeof page === 'number') {
    applyFilters(page)
  }
}

// Sync UI filters from URL on mount
const syncFromQuery = () => {
  const q = route.query
  searchQuery.value = q.title as string || ''
  uiFilters.property_type = q.property_type as string || null
  uiFilters.status = q.sale_type as string || null
  uiFilters.bedrooms = q.bedroom ? Number(q.bedroom) : null
  uiFilters.bathrooms = q.bathroom ? Number(q.bathroom) : null
  uiFilters.min_price = q.min_price ? Number(q.min_price) : null
  uiFilters.max_price = q.max_price ? Number(q.max_price) : null
  uiFilters.hot_deal = q.hot_deal === '1'
  uiFilters.locations = q.service_area_id ? (q.service_area_id as string).split(',').map(Number) : []
  sortBy.value = (() => {
    if (q.sort_by === 'price') return q.sort_direction === 'asc' ? 'price_low' : 'price_high'
    if (q.sort_by === 'featured') return 'featured'
    return 'newest'
  })()
}

// Watch URL changes (back/forward)
watch(() => route.query, () => {
  syncFromQuery()
  applyFilters()
}, { deep: true })

// Watch UI changes
watch(
  () => [searchQuery.value, sortBy.value, uiFilters],
  () => debouncedApply(),
  { deep: true }
)

// Initial load
onMounted(() => {
  syncFromQuery()
  applyFilters()
})
</script>

<style scoped>
.bg-grid-slate-100 { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23e2e8f0'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e"); }
.animate-fade-in { animation: fadeIn 1s ease-out; }
.animate-slide-up { animation: slideUp 0.8s ease-out; }
.animation-delay-200 { animation-delay: 200ms; }
.animation-delay-400 { animation-delay: 400ms; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>