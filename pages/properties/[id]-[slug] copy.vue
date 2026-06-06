<template>
  <div v-if="property" class="min-h-screen bg-comma-neutral-50" :dir="direction">
    <!-- Compact Hero with Title -->
    <section class="relative h-64 lg:h-96 overflow-hidden pt-16 bg-comma-neutral-900">
      <div class="absolute inset-0">
        <img
          :src="property.property_photos?.[0] || FALLBACK_IMAGE"
          :alt="propertyTitle"
          class="w-full h-full object-cover opacity-60"
          @error="handleImageError"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-black/50 to-black/40"></div>
      </div>
      <div class="absolute inset-0 flex items-center">
        <div class="container mx-auto px-4 lg:px-8">
          <h1 class="text-3xl lg:text-4xl xl:text-5xl font-bold text-white font-display max-w-4xl">
            {{ propertyTitle }}
          </h1>
        </div>
      </div>
    </section>

    <section class="py-8 lg:py-12">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Left Column: 2/3 width -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Header with Price and Reference -->
            <div class="bg-white rounded border border-comma-border-subtle p-6">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 class="text-2xl font-bold text-comma-neutral-900 font-display">{{ propertyTitle }}</h2>
                  <p class="text-comma-neutral-600 mt-1 flex items-center gap-1">
                    <Icon name="mdi:map-marker" class="w-4 h-4 text-comma-primary" />
                    {{ property.location }} <span v-if="property.city">, {{ property.city }}</span>
                  </p>
                </div>
                <div class="text-left lg:text-right">
                  <div class="text-3xl font-bold text-comma-primary flex items-center gap-2">
                    <Icon name="mdi:cash" class="w-6 h-6" />
                    {{ formatPrice(property.price) }}
                  </div>
                  <p class="text-sm text-comma-neutral-500 flex items-center gap-1 justify-end mt-1">
                    <Icon name="mdi:tag" class="w-3 h-3" />
                    {{ $t('property_page.ref') }}: {{ property.reference_number || property.property_id }}
                  </p>
                </div>
              </div>

              <!-- Property Info Row with Icons (using new field names) -->
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6 pt-6 border-t border-comma-border-subtle">
                <div class="text-center">
                  <Icon name="mdi:bed" class="w-5 h-5 mx-auto text-comma-primary mb-1" />
                  <div class="text-lg font-semibold text-comma-neutral-900">{{ property.bedroom ?? 0 }}</div>
                  <div class="text-xs text-comma-neutral-600">{{ $t('property_page.bedrooms') }}</div>
                </div>
                <div class="text-center">
                  <Icon name="mdi:shower" class="w-5 h-5 mx-auto text-comma-primary mb-1" />
                  <div class="text-lg font-semibold text-comma-neutral-900">{{ property.bathroom ?? 0 }}</div>
                  <div class="text-xs text-comma-neutral-600">{{ $t('property_page.bathrooms') }}</div>
                </div>
                <div class="text-center">
                  <Icon name="mdi:arrow-expand" class="w-5 h-5 mx-auto text-comma-primary mb-1" />
                  <div class="text-lg font-semibold text-comma-neutral-900">{{ propertySize }} sqft</div>
                  <div class="text-xs text-comma-neutral-600">{{ $t('property_page.size') }}</div>
                </div>
                <div class="text-center">
                  <Icon name="mdi:car" class="w-5 h-5 mx-auto text-comma-primary mb-1" />
                  <div class="text-lg font-semibold text-comma-neutral-900">{{ property.parking || $t('property_page.na') }}</div>
                  <div class="text-xs text-comma-neutral-600">{{ $t('property_page.parking') }}</div>
                </div>
                <div class="text-center">
                  <Icon name="mdi:calendar" class="w-5 h-5 mx-auto text-comma-primary mb-1" />
                  <div class="text-lg font-semibold text-comma-neutral-900">{{ property.build_year || $t('property_page.na') }}</div>
                  <div class="text-xs text-comma-neutral-600">{{ $t('property_page.year_built') }}</div>
                </div>
              </div>
            </div>

            <!-- Image Gallery (using property_photos) -->
            <div class="bg-white rounded border border-comma-border-subtle overflow-hidden">
              <div class="aspect-[16/9] bg-comma-neutral-100">
                <img
                  :src="currentMainImage"
                  :alt="propertyTitle"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
              </div>
              <div v-if="property.property_photos?.length > 1" class="grid grid-cols-5 gap-1 p-2 bg-comma-neutral-50">
                <button
                  v-for="(img, idx) in property.property_photos.slice(0, 5)"
                  :key="idx"
                  @click="currentImageIndex = idx"
                  class="aspect-square overflow-hidden rounded border-2 transition-all"
                  :class="currentImageIndex === idx ? 'border-comma-primary' : 'border-transparent hover:border-comma-primary/50'"
                >
                  <img :src="img" class="w-full h-full object-cover" @error="handleImageError" />
                </button>
              </div>
            </div>

            <!-- Description (localized) -->
            <div class="bg-white rounded border border-comma-border-subtle p-6">
              <h3 class="text-xl font-bold text-comma-neutral-900 mb-4 font-display flex items-center gap-2">
                <Icon name="mdi:file-document" class="w-5 h-5 text-comma-primary" />
                {{ $t('property_page.description') }}
              </h3>
              <p class="text-comma-neutral-700 leading-relaxed whitespace-pre-line">
                {{ propertyDescription }}
              </p>
            </div>

            <!-- Address with Icons (using new fields) -->
            <div class="bg-white rounded border border-comma-border-subtle p-6">
              <h3 class="text-xl font-bold text-comma-neutral-900 mb-4 font-display flex items-center gap-2">
                <Icon name="mdi:map-marker" class="w-5 h-5 text-comma-primary" />
                {{ $t('property_page.address') }}
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex items-start gap-2">
                  <Icon name="mdi:map-marker" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.location') }}</span>
                    <p class="font-medium">{{ property.location || $t('property_page.na') }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <Icon name="mdi:city" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.city') }}</span>
                    <p class="font-medium">{{ property.city || $t('property_page.na') }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <Icon name="mdi:home-group" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.community') }}</span>
                    <p class="font-medium">{{ property.community || $t('property_page.na') }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <Icon name="mdi:office-building" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.project') }}</span>
                    <p class="font-medium">{{ property.tower || property.project_name || $t('property_page.na') }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Details Grid with Icons (using correct field names) -->
            <div class="bg-white rounded border border-comma-border-subtle p-6">
              <h3 class="text-xl font-bold text-comma-neutral-900 mb-4 font-display flex items-center gap-2">
                <Icon name="mdi:clipboard-list" class="w-5 h-5 text-comma-primary" />
                {{ $t('property_page.property_details') }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-if="property.reference_number" class="flex items-start gap-2">
                  <Icon name="mdi:tag" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.reference') }}</span>
                    <p class="font-medium">{{ property.reference_number }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <Icon name="mdi:cash" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.price') }}</span>
                    <p class="font-medium">{{ formatPrice(property.price) }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <Icon name="mdi:arrow-expand" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.size') }}</span>
                    <p class="font-medium">{{ propertySize }} sqft</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <Icon name="mdi:bed" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.bedrooms') }}</span>
                    <p class="font-medium">{{ property.bedroom ?? 0 }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <Icon name="mdi:shower" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.bathrooms') }}</span>
                    <p class="font-medium">{{ property.bathroom ?? 0 }}</p>
                  </div>
                </div>
                <div v-if="property.parking" class="flex items-start gap-2">
                  <Icon name="mdi:car" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.parking') }}</span>
                    <p class="font-medium">{{ property.parking }}</p>
                  </div>
                </div>
                <div v-if="property.build_year" class="flex items-start gap-2">
                  <Icon name="mdi:calendar" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.year_built') }}</span>
                    <p class="font-medium">{{ property.build_year }}</p>
                  </div>
                </div>
                <div v-if="property.developers" class="flex items-start gap-2">
                  <Icon name="mdi:office-building-cog" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.developer') }}</span>
                    <p class="font-medium">{{ property.developers }}</p>
                  </div>
                </div>
                <div v-if="property.offering_type" class="flex items-start gap-2">
                  <Icon name="mdi:handshake" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.offering_type') }}</span>
                    <p class="font-medium">{{ property.offering_type }}</p>
                  </div>
                </div>
                <div v-if="property.project_status" class="flex items-start gap-2">
                  <Icon name="mdi:progress-clock" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.project_status') }}</span>
                    <p class="font-medium">{{ property.project_status }}</p>
                  </div>
                </div>
                <div v-if="property.available_from" class="flex items-start gap-2">
                  <Icon name="mdi:calendar-check" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.available_from') }}</span>
                    <p class="font-medium">{{ formatDate(property.available_from) }}</p>
                  </div>
                </div>
                <div v-if="property.payment_method" class="flex items-start gap-2">
                  <Icon name="mdi:credit-card" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.payment_method') }}</span>
                    <p class="font-medium">{{ property.payment_method }}</p>
                  </div>
                </div>
                <div v-if="property.service_charge" class="flex items-start gap-2">
                  <Icon name="mdi:cash-refund" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.service_charge') }}</span>
                    <p class="font-medium">{{ formatPrice(Number(property.service_charge)) }}</p>
                  </div>
                </div>
                <div v-if="property.down_payment_price" class="flex items-start gap-2">
                  <Icon name="mdi:bank" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.down_payment') }}</span>
                    <p class="font-medium">{{ formatPrice(Number(property.down_payment_price)) }}</p>
                  </div>
                </div>
                <div v-if="property.sale_type" class="flex items-start gap-2">
                  <Icon name="mdi:sale" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.sale_type') }}</span>
                    <p class="font-medium">{{ property.sale_type }}</p>
                  </div>
                </div>
                <div v-if="property.furnished" class="flex items-start gap-2">
                  <Icon name="mdi:sofa" class="w-4 h-4 text-comma-primary mt-0.5" />
                  <div>
                    <span class="text-sm text-comma-neutral-600">{{ $t('property_page.furnished') }}</span>
                    <p class="font-medium">{{ property.furnished }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Amenities as Checklist (parsed from string array) -->
            <div v-if="amenitiesList.length" class="bg-white rounded border border-comma-border-subtle p-6">
              <h3 class="text-xl font-bold text-comma-neutral-900 mb-4 font-display flex items-center gap-2">
                <Icon name="mdi:star" class="w-5 h-5 text-comma-primary" />
                {{ $t('property_page.amenities') }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div
                  v-for="(item, idx) in amenitiesList"
                  :key="idx"
                  class="flex items-center gap-2"
                >
                  <Icon name="mdi:check-circle" class="w-5 h-5 text-comma-primary flex-shrink-0" />
                  <span class="text-comma-neutral-700">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Sidebar: Contact Card -->
          <aside class="lg:col-span-1 space-y-6">
            <div class="bg-white rounded border border-comma-border-subtle p-6 sticky top-24">
              <h3 class="text-xl font-bold text-comma-neutral-900 mb-6 font-display">{{ $t('property_page.contact_agent') }}</h3>

              <div class="flex items-center gap-4 mb-6 pb-6 border-b border-comma-border-subtle">
                <div class="w-16 h-16 rounded-full bg-comma-primary/10 flex items-center justify-center">
                  <Icon name="mdi:office-building" class="w-8 h-8 text-comma-primary" />
                </div>
                <div>
                  <p class="font-bold text-lg text-comma-neutral-900">{{ $t('property_page.comma_team') }}</p>
                  <p class="text-sm text-comma-neutral-600">{{ $t('property_page.real_estate_experts') }}</p>
                </div>
              </div>

              <div class="space-y-3">
                <a :href="`tel:${defaultPhone}`" class="flex items-center gap-3 p-3 rounded border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 transition">
                  <div class="w-8 h-8 rounded-full bg-comma-primary/10 flex items-center justify-center">
                    <Icon name="mdi:phone" class="w-4 h-4 text-comma-primary" />
                  </div>
                  <div>
                    <div class="text-xs text-comma-neutral-600">{{ $t('property_page.call') }}</div>
                    <div class="font-medium"><span dir="ltr">{{ defaultPhone }}</span></div>
                  </div>
                </a>
                <a :href="`mailto:${defaultEmail}`" class="flex items-center gap-3 p-3 rounded border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 transition">
                  <div class="w-8 h-8 rounded-full bg-comma-primary/10 flex items-center justify-center">
                    <Icon name="mdi:email" class="w-4 h-4 text-comma-primary" />
                  </div>
                  <div>
                    <div class="text-xs text-comma-neutral-600">{{ $t('property_page.email') }}</div>
                    <div class="font-medium">{{ defaultEmail }}</div>
                  </div>
                </a>
                <a :href="`https://wa.me/${defaultWhatsapp}`" target="_blank" class="flex items-center gap-3 p-3 rounded border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 transition">
                  <div class="w-8 h-8 rounded-full bg-comma-primary/10 flex items-center justify-center">
                    <Icon name="mdi:whatsapp" class="w-4 h-4 text-comma-primary" />
                  </div>
                  <div>
                    <div class="text-xs text-comma-neutral-600">{{ $t('property_page.whatsapp') }}</div>
                    <div class="font-medium"><span dir="ltr">+{{ defaultWhatsapp }}</span></div>
                  </div>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>

  <!-- Loading / 404 -->
  <div v-else-if="pending" class="min-h-screen flex items-center justify-center">
    <Icon name="mdi:loading" class="w-12 h-12 text-comma-primary animate-spin" />
  </div>

  <div v-else class="min-h-screen flex items-center justify-center bg-comma-neutral-50">
    <div class="text-center px-6">
      <div class="w-24 h-24 rounded-full bg-comma-primary/10 flex items-center justify-center mx-auto mb-6">
        <Icon name="mdi:home" class="w-12 h-12 text-comma-primary" />
      </div>
      <h1 class="text-2xl font-bold text-comma-neutral-900 mb-4">{{ $t('property_page.not_found') }}</h1>
      <p class="text-comma-neutral-600 mb-8 max-w-md mx-auto">{{ $t('property_page.not_found_description') }}</p>
      <NuxtLink to="/properties" class="inline-flex items-center gap-2 px-8 py-3 bg-comma-primary text-white font-semibold rounded-lg hover:bg-comma-primary-dark transition-colors duration-300 shadow-lg hover:shadow-xl">
        <Icon :name="direction === 'ltr' ? 'mdi:arrow-left' : 'mdi:arrow-right'" class="w-5 h-5" />
        {{ $t('property_page.back_to_properties') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePropertiesStore } from '~/store/properties'
import type { Property } from '~/types/property'

const route = useRoute()
const { locale } = useI18n()
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const localePath = useLocalePath()
const store = usePropertiesStore()

// Default contact info
const defaultPhone = '+971544411700'
const defaultEmail = 'info@commarealestate.ae'
const defaultWhatsapp = '971544411700'

// Extract ID from slug (e.g., "4-own-a-piece-of-iconic-brabus-living")
const fullParam = route.params.id as string
const propertyId = Number(fullParam.split('-')[0])

// Local state
const property = ref<Property | null>(null)
const pending = ref(true)

// Localized getters
const propertyTitle = computed(() => {
  if (!property.value) return ''
  return locale.value === 'ar' ? property.value.title?.arabic : property.value.title?.english
})

const propertyDescription = computed(() => {
  if (!property.value) return ''
  return locale.value === 'ar' ? property.value.description?.arabic : property.value.description?.english
})

const propertySize = computed(() => {
  if (!property.value) return '—'
  const size = property.value.build_up_area_sqft || property.value.total_area_sqft
  return size ? Math.round(Number(size)).toLocaleString() : '—'
})

// Fetch property
onMounted(async () => {
  try {
    await store.fetchProperty(propertyId)
    if (store.property) {
      property.value = store.property
    }
  } catch (error) {
    console.error(error)
  } finally {
    pending.value = false
  }
})

// Fallback image
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&fit=crop'

// Gallery state
const currentImageIndex = ref(0)
const currentMainImage = computed(() => {
  if (!property.value?.property_photos?.length) return FALLBACK_IMAGE
  return property.value.property_photos[currentImageIndex.value]
})

const handleImageError = (event: Event) => {
  (event.target as HTMLImageElement).src = FALLBACK_IMAGE
}

// Parse amenities (array of strings, may contain dashes)
const amenitiesList = computed(() => {
  if (!property.value?.amenities?.length) return []
  const raw = property.value.amenities
  const all = raw.flatMap((item: string) =>
    item.split('-').map(s => s.trim()).filter(Boolean)
  )
  return [...new Set(all)]
})

// Format price (property.price is number)
const formatPrice = (price: number) => {
  if (!price && price !== 0) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(price)
}

// Format date
const formatDate = (date: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// SEO
useHead(() => {
  if (!property.value) return {}
  return {
    title: `${propertyTitle.value} | Comma Real Estate`,
    meta: [
      { name: 'description', content: propertyDescription.value }
    ]
  }
})
</script>