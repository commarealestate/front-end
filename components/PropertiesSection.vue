<template>
  <section class="relative py-24 overflow-hidden bg-comma-neutral-50">
    <!-- Subtle decorative accents -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-comma-secondary/5 rounded-full blur-3xl pointer-events-none -z-0">
    </div>
    <div
      class="absolute bottom-20 right-0 w-72 h-72 bg-comma-primary/5 rounded-full blur-3xl pointer-events-none -z-0">
    </div>

    <div class="container mx-auto px-4 lg:px-8 relative z-10">
      <!-- Header Section -->
      <div class="mb-16 lg:mb-24 text-center">
        <div class="inline-flex items-center gap-3 mb-6 justify-center">
          <div class="w-10 h-0.5 bg-comma-primary"></div>
          <span class="text-xs font-semibold text-comma-primary uppercase tracking-[0.15em]">
            {{ $t('home.properties_section.label') }}
          </span>
          <div class="w-10 h-0.5 bg-comma-primary"></div>
        </div>
        <h2 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-comma-neutral-800 leading-tight mb-6">
          {{ $t('home.properties_section.title') }}
        </h2>
        <p class="text-lg text-comma-neutral-600 max-w-2xl leading-relaxed mx-auto">
          {{ $t('home.properties_section.description') }}
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-16">
        <Icon name="mdi:loading" class="w-12 h-12 text-comma-primary animate-spin mx-auto" />
      </div>

      <!-- Grid -->
      <div v-else-if="latestProperties.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PropertyCard v-for="property in latestProperties" :key="property.id" :property="property" />
      </div>

      <!-- Empty -->
      <div v-else class="text-center py-16 bg-white rounded-2xl shadow-card">
        <Icon name="mdi:home-off" class="w-16 h-16 text-comma-neutral-300 mx-auto mb-4" />
        <p class="text-comma-neutral-600">{{ $t('home.properties_section.no_properties') }}</p>
      </div>

      <!-- CTA -->
      <div class="text-center mt-16">
        <NuxtLink :to="localePath('/properties')"
          class="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-comma-primary text-white font-semibold hover:bg-comma-primary-dark transition-all duration-300 hover:shadow-lg group">
          <span>{{ $t('home.properties_section.view_all') }}</span>
          <Icon name="heroicons:arrow-right"
            class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePropertiesStore } from '~/store/properties'
import { storeToRefs } from 'pinia'
import PropertyCard from '~/components/PropertyCard.vue'
import type { NormalizedProperty } from '~/types/property'

const { locale } = useI18n()
const localePath = useLocalePath()
const store = usePropertiesStore()

// Use the normalized properties and loading state from the store
const { normalizedProperties, livePropertiesLoading } = storeToRefs(store)

// Local loading state while we fetch if needed
const loading = ref(true)
const latestProperties = ref<NormalizedProperty[]>([])

// Fetch live properties and get the 6 most recent (by id descending)
async function fetchLatestProperties() {
  loading.value = true
  try {
    if (normalizedProperties.value.length === 0) {
      await store.fetchPropertiesFromApi({
        inventory_status: 'Live',
        per_page: 6,
        sort_by: 'created_at',
        sort_direction: 'desc',
      })
    }
    // Filter only Live properties (already filtered in store, but double-check)
    const liveProps = normalizedProperties.value.filter(p => p.inventoryStatus === 'Live')
    // Sort by id descending (newest first) and take first 6
    const sorted = [...liveProps].sort((a, b) => b.id - a.id)
    latestProperties.value = sorted.slice(0, 6)
  } catch (error) {
    console.error('Failed to fetch properties for home section:', error)
    latestProperties.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLatestProperties()
})
</script>

<style scoped>
/* Custom scrolling for smaller screens */
@media (max-width: 768px) {
  .grid {
    overflow-x: auto;
  }
}
</style>
