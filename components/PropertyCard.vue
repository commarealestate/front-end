<template>
  <div v-if="hasValidData"
    class="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-comma-border-subtle flex flex-col h-full">
    <NuxtLink :to="localePath(`/properties/${property.id}-${propertySlug}`)"
      class="block relative h-52 overflow-hidden bg-comma-neutral-200 flex-shrink-0">
      <img :src="imageSrc" :alt="displayTitle"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        @error="handleImageError" />
      <!-- Badges -->
      <div class="absolute top-2 left-2 flex gap-1">
        <span v-if="property.saleType"
          class="px-2 py-0.5 bg-comma-primary text-white text-xs font-semibold rounded shadow">
          {{ property.saleType }}
        </span>
        <span v-if="property.offeringType === 'Offplan'"
          class="px-2 py-0.5 bg-comma-secondary text-white text-xs font-semibold rounded shadow">
          Off Plan
        </span>
      </div>
      <!-- Hot Deal ribbon -->
      <div v-if="property.hot_deal" class="absolute top-2 right-2">
        <span class="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
          🔥 Hot Deal
        </span>
      </div>
    </NuxtLink>

    <div class="p-4 flex-1 flex flex-col">
      <div class="flex justify-between items-start gap-2 mb-2">
        <h3 class="text-lg font-bold text-comma-neutral-900 line-clamp-1 flex-1">
          {{ displayTitle }}
        </h3>
        <span class="text-lg font-bold text-comma-primary whitespace-nowrap">
          {{ formatPrice(property.price) }}
        </span>
      </div>

      <div class="flex items-center text-comma-neutral-500 text-sm mb-3">
        <Icon name="mdi:map-marker" class="w-3.5 h-3.5 mr-1 flex-shrink-0" />
        <span class="truncate">{{ displayLocation }}</span>
      </div>

      <!-- Key specs in a compact row -->
      <div class="grid grid-cols-3 gap-2 text-xs text-comma-neutral-700 mb-4">
        <div class="flex items-center gap-1">
          <Icon name="mdi:bed" class="w-4 h-4 text-comma-primary" />
          <span>{{ property.bedroom ?? 0 }} {{ $t('properties_page.beds') }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Icon name="mdi:shower" class="w-4 h-4 text-comma-primary" />
          <span>{{ property.bathroom ?? 0 }} {{ $t('properties_page.baths') }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Icon name="mdi:arrow-expand" class="w-4 h-4 text-comma-primary" />
          <span>{{ propertySize }}</span>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-2 pt-3 mt-auto border-t border-comma-border-subtle">
        <a :href="`tel:${DEFAULT_PHONE}`"
          class="flex-1 flex items-center justify-center gap-1 py-2 bg-comma-neutral-100 hover:bg-comma-primary hover:text-white rounded-lg text-sm transition-colors">
          <Icon name="heroicons:phone" class="w-4 h-4" />
          <span class="hidden sm:inline">{{ $t('properties_page.call') }}</span>
        </a>
        <a :href="getEmailLink" target="_blank"
          class="flex-1 flex items-center justify-center gap-1 py-2 bg-comma-neutral-100 hover:bg-comma-primary hover:text-white rounded-lg text-sm transition-colors">
          <Icon name="heroicons:envelope" class="w-4 h-4" />
          <span class="hidden sm:inline">{{ $t('properties_page.email') }}</span>
        </a>
        <a :href="getWhatsAppLink" target="_blank"
          class="flex-1 flex items-center justify-center py-2 bg-comma-neutral-100 hover:bg-comma-secondary hover:text-white rounded-lg transition-colors">
          <Icon name="heroicons:chat-bubble-left" class="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NormalizedProperty } from '~/types/property'

const props = defineProps<{
  property: NormalizedProperty
}>()

const { locale } = useI18n()
const localePath = useLocalePath()

const DEFAULT_PHONE = '+971508008879'
const DEFAULT_EMAIL = 'info@commarealestate.ae'
const DEFAULT_WHATSAPP = '971506729129'
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&fit=crop'

const displayTitle = computed(() => {
  const localized = locale.value === 'ar' ? props.property.titleArabic : props.property.titleEnglish
  const fallback = locale.value === 'ar' ? props.property.titleEnglish : props.property.titleArabic
  return localized || fallback || props.property.referenceNumber || `Property #${props.property.id}`
})

const displayLocation = computed(() => {
  const localized = locale.value === 'ar' ? props.property.locationArabic : props.property.locationEnglish
  const fallback = locale.value === 'ar' ? props.property.locationEnglish : props.property.locationArabic
  return localized || fallback || props.property.location || props.property.community || props.property.city
})

const propertySlug = computed(() => String(props.property.titleEnglish || props.property.titleArabic || props.property.referenceNumber || `property-${props.property.id}`)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, ''))

const propertySize = computed(() => {
  const size = props.property.buildUpAreaSqft || props.property.totalAreaSqft
  return size ? `${Math.round(Number(size)).toLocaleString()} sqft` : '—'
})

const hasValidData = computed(() => props.property.price != null)

const imageSrc = computed(() => {
  if (props.property.coverImage) return props.property.coverImage
  if (props.property.propertyPhotos?.length) return props.property.propertyPhotos[0]
  return FALLBACK_IMAGE
})

const handleImageError = (event: Event) => {
  (event.target as HTMLImageElement).src = FALLBACK_IMAGE
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(price)
}

function getPropertyUrl() {
  return `${window.location.origin}${localePath(`/properties/${props.property.id}-${propertySlug.value}`)}`
}

function getMessageText() {
  return `Hello,

I'm interested in the following property:

Property: ${displayTitle.value}
Location: ${displayLocation.value}
Price: ${formatPrice(props.property.price)}

Property Link: ${getPropertyUrl()}

Could you please share more details?`
}

const getEmailLink = computed(() => {
  const subject = encodeURIComponent(`Inquiry about: ${displayTitle.value}`)
  const body = encodeURIComponent(getMessageText())
  return `mailto:${DEFAULT_EMAIL}?subject=${subject}&body=${body}`
})

const getWhatsAppLink = computed(() => {
  const text = encodeURIComponent(getMessageText())
  return `https://wa.me/${DEFAULT_WHATSAPP}?text=${text}`
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
