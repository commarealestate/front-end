<template>
  <UCard class="border border-comma-border-subtle shadow-lg hover:shadow-xl transition-shadow" :ui="{ body: 'p-5', header: 'px-5 py-4 border-b border-comma-border-subtle bg-comma-surface-elevated', footer: 'px-5 py-3 border-t border-comma-border-subtle' }">
    <template #header>
      <div class="flex items-center justify-between p-5">
        <h3 class="text-lg font-display font-semibold text-comma-neutral-900">{{ $t('admin_dashboard_page.recent.properties') }}</h3>
        <UButton color="primary" variant="ghost" :to="localePath('/admin/properties')" size="sm" icon="i-heroicons-arrow-right" trailing>
          {{ $t('admin_dashboard_page.recent.view_all') }}
        </UButton>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-12">
      <Icon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
    </div>

    <div v-else-if="validProperties.length" class="space-y-4 p-5">
      <div v-for="prop in validProperties" :key="prop.property_id" class="group">
        <NuxtLink :to="localePath(`/admin/properties/${prop.property_id}`)" class="block">
          <div class="flex gap-4">
            <!-- Image -->
            <div class="w-24 h-24 rounded-lg bg-comma-neutral-100 overflow-hidden flex-shrink-0 group-hover:shadow-md transition">
              <img :src="prop.images?.[0] || '/images/placeholder.jpg'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-comma-neutral-900 truncate group-hover:text-comma-primary transition">{{ localizedTitle(prop) }}</h4>
              <p class="text-sm text-comma-neutral-600 truncate mt-0.5">{{ localizedLocation(prop) }}</p>
              <div class="flex items-center gap-3 mt-2 text-xs">
                <span class="font-bold text-comma-primary">{{ formatPrice(prop.original_price) }}</span>
                <span class="text-comma-neutral-500">{{ prop.bedrooms }} beds</span>
                <span class="text-comma-neutral-500">{{ prop.bathrooms }} baths</span>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <UBadge :color="prop.status?.toLowerCase().includes('sale') ? 'green' : 'blue'" variant="soft" size="xs">
                  {{ prop.status || '—' }}
                </UBadge>
                <span class="text-xs text-comma-neutral-400">{{ formatDate(prop.created_at) }}</span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div v-else class="py-12 text-center text-comma-neutral-500 bg-comma-surface-elevated/50 rounded-lg">
      <Icon name="i-heroicons-home" class="w-10 h-10 mx-auto text-comma-neutral-300 mb-2" />
      <p>{{ $t('admin.no_data') }}</p>
    </div>

    <template #footer>
      <div class="text-sm text-comma-neutral-500 flex items-center justify-between p-5">
        <span>{{ $t('admin_dashboard_page.recent.view_all') }} ({{ filteredTotal }})</span>
        <span class="text-xs text-comma-neutral-400">Last updated: {{ now }}</span>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { Property } from '~/types/property'

const props = defineProps<{
  properties: Property[]
  loading: boolean
  total: number
}>()

const { locale } = useI18n()
const localePath = useLocalePath()

// Helper to check if property is valid
function isValidProperty(prop: Property) {
  // Check title exists in either language
  const hasTitle = prop.title_en || prop.title_ar || prop.title
  // Check description exists
  const hasDescription = prop.description_en || prop.description_ar || prop.description
  // Check price exists
  const hasPrice = prop.original_price !== null && prop.original_price !== undefined
  return hasTitle && hasDescription && hasPrice
}

// Filtered list of valid properties
const validProperties = computed(() => props.properties.filter(isValidProperty))

// Total of valid properties (for footer)
const filteredTotal = computed(() => validProperties.value.length)

// Localized helpers
function localizedTitle(prop: Property) {
  return locale.value === 'ar' ? (prop.title_ar || prop.title) : (prop.title_en || prop.title)
}

function localizedLocation(prop: Property) {
  return locale.value === 'ar' ? (prop.location_ar || prop.community) : (prop.location_en || prop.community)
}

function formatPrice(price: string | number) {
  const num = Number(price)
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(num)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short', day: 'numeric'
  })
}

const now = new Date().toLocaleTimeString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
  hour: '2-digit', minute: '2-digit'
})
</script>