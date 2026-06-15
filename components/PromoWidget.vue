<template>
  <div v-if="hotDealProperty">
    <!-- GEAR TAB -->
    <button v-if="!isOpen" @click="open" class="fixed top-1/2 -translate-y-1/2 z-50
             w-14 h-36 flex flex-col items-center justify-center gap-3
             bg-white/80 backdrop-blur border border-white/40
             text-comma-primary shadow-2xl
             hover:shadow-comma-primary/30 hover:scale-105
             transition-all duration-300 group" :class="gearTabClass">
      <div class="w-10 h-10 rounded-full bg-comma-primary text-white
               flex items-center justify-center shadow-lg
               group-hover:rotate-12 transition">
        <Icon name="mdi:fire" class="w-5 h-5" />
      </div>
    </button>

    <!-- PANEL -->
    <div class="fixed top-1/2 -translate-y-1/2 z-40 transition-transform duration-500 hidden lg:block"
      :class="panelSideClass" :style="{ transform: isOpen ? openTransform : closedTransform }">
      <div class="relative w-72 bg-white shadow-2xl border border-comma-border-subtle overflow-hidden"
        :class="panelRadiusClass">
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 bg-comma-primary text-white">
          <div class="flex items-center gap-2">
            <Icon name="mdi:fire" class="w-4 h-4" />
            <span class="font-bold text-sm">{{ $t('promo_widget.hot_deal') }}</span>
          </div>
          <button @click="close" class="hover:opacity-80">
            <Icon name="mdi:close" class="w-4 h-4" />
          </button>
        </div>

        <!-- Image -->
        <div class="h-32 overflow-hidden">
          <img :src="hotDealImage" :alt="displayTitle" class="w-full h-full object-cover" />
        </div>

        <!-- Content -->
        <div class="p-4 space-y-3">
          <h4 class="font-bold text-comma-neutral-900 text-base leading-tight">
            {{ displayTitle }}
          </h4>

          <p class="text-xs text-comma-neutral-600 flex items-center gap-1">
            <Icon name="mdi:map-marker" class="w-3 h-3" />
            {{ propertyLocation }}
          </p>

          <div class="text-lg font-bold text-comma-primary">
            {{ displayPrice }}
          </div>

          <p v-if="displayDescription" class="text-xs text-comma-neutral-700 line-clamp-2">
            {{ displayDescription }}
          </p>

          <!-- Actions -->
          <div class="grid grid-cols-3 gap-2">
            <a v-if="telLink" :href="telLink" class="btn-mini primary">
              <Icon name="mdi:phone" class="w-4 h-4" />
            </a>
            <a v-if="mailtoLink" :href="mailtoLink" class="btn-mini secondary">
              <Icon name="mdi:email" class="w-4 h-4" />
            </a>
            <a v-if="whatsappLink" :href="whatsappLink" target="_blank" rel="noopener noreferrer" class="btn-mini whatsapp">
              <Icon name="mdi:whatsapp" class="w-4 h-4" />
            </a>
          </div>

          <NuxtLink :to="localePath(`/properties/${hotDealProperty.property_id}-${propertySlug}`)"
            class="block text-center text-xs font-semibold text-comma-primary hover:underline">
            {{ $t('promo_widget.view_details') }} →
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- MOBILE SHEET -->
    <div v-if="mobileVisible" class="fixed inset-0 z-50 flex items-end lg:hidden">
      <div class="absolute inset-0 bg-black/20" @click="closeMobile"></div>
      <div ref="sheet" class="relative w-full bg-white rounded-t-3xl shadow-2xl p-4 transition-transform duration-300"
        :style="{ transform: `translateY(${dragY}px)` }" @touchstart="startDrag" @touchmove="onDrag"
        @touchend="endDrag">
        <div class="flex justify-center mb-3">
          <div class="w-10 h-1.5 rounded-full bg-gray-300"></div>
        </div>
        <button @click="closeMobile"
          class="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon name="mdi:close" class="w-4 h-4" />
        </button>
        <div class="flex gap-3">
          <img :src="hotDealImage" class="w-28 h-28 rounded-xl object-cover" />
          <div class="flex-1">
            <p class="text-xs text-comma-primary font-semibold flex items-center gap-1">
              🔥 {{ $t('promo_widget.hot_deal') }}
            </p>
            <h4 class="font-bold text-sm leading-snug line-clamp-2">
              {{ displayTitle }}
            </h4>
            <p class="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <Icon name="mdi:map-marker" class="w-3 h-3" />
              {{ propertyLocation }}
            </p>
            <p class="text-sm font-bold text-comma-primary mt-1">
              {{ displayPrice }}
            </p>
            <div class="flex gap-2 mt-3">
              <NuxtLink :to="localePath(`/properties/${hotDealProperty.property_id}-${propertySlug}`)"
                class="flex-1 text-center py-2 rounded-lg bg-comma-primary text-white text-xs font-semibold">
                {{ $t('promo_widget.view') }}
              </NuxtLink>
              <a v-if="whatsappLink" :href="whatsappLink" target="_blank" rel="noopener noreferrer"
                class="px-3 flex items-center justify-center rounded-lg bg-green-500 text-white">
                <Icon name="mdi:whatsapp" class="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading -->
  <div v-else-if="store.hotDealLoading" class="fixed top-1/2 right-0 z-50 hidden lg:block">
    <div class="w-14 h-36 bg-white/50 backdrop-blur flex items-center justify-center">
      <Icon name="mdi:loading" class="w-6 h-6 text-comma-primary animate-spin" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePropertiesStore, normalizePropertyAgent } from '~/store/properties'
import { storeToRefs } from 'pinia'
import type { Property } from '~/types/property'

const { locale } = useI18n()
const localePath = useLocalePath()
const store = usePropertiesStore()
const { hotDeal, hotDealLoading } = storeToRefs(store)

// Fetch hot deal on mount
onMounted(async () => {
  if (!hotDeal.value) {
    await store.fetchHotDeal()
  }
})

// Localized hot deal with fallbacks
const hotDealProperty = computed<Property | null>(() => hotDeal.value)

// Helper: get localized title with fallback
const displayTitle = computed(() => {
  if (!hotDealProperty.value) return ''
  const p = hotDealProperty.value
  if (p.title) {
    const title = locale.value === 'ar' ? p.title.arabic : p.title.english
    if (title) return title
  }
  return p.reference_number || `Property #${p.property_id}`
})

// Helper: get localized description (may be empty)
const displayDescription = computed(() => {
  if (!hotDealProperty.value?.description) return ''
  const p = hotDealProperty.value
  return locale.value === 'ar' ? p.description.arabic : p.description.english
})

// Helper: get location (string, not object)
const propertyLocation = computed(() => {
  if (!hotDealProperty.value) return ''
  return hotDealProperty.value.location || hotDealProperty.value.community || hotDealProperty.value.city || ''
})

// Helper: get slug for URL
const propertySlug = computed(() => {
  if (!hotDealProperty.value) return ''
  const p = hotDealProperty.value
  if (p.slug) {
    return locale.value === 'ar' ? p.slug.ar : p.slug.en
  }
  return String(p.property_id)
})

// Fallback image
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&fit=crop'

const hotDealImage = computed(() => {
  const photos = hotDealProperty.value?.property_photos
  if (photos && photos.length > 0) {
    return photos[0]
  }
  return FALLBACK_IMAGE
})

// Price: use hot_deal_price if exists, otherwise regular price
const displayPriceValue = computed(() => {
  if (!hotDealProperty.value) return 0
  const p = hotDealProperty.value
  return p.hot_deal_price ? Number(p.hot_deal_price) : p.price
})

const displayPrice = computed(() => {
  return formatPrice(displayPriceValue.value)
})

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(price)
}

const propertyUrl = computed(() => {
  if (!hotDealProperty.value) return ''
  return `${window.location.origin}${localePath(`/properties/${hotDealProperty.value.property_id}-${propertySlug.value}`)}`
})

const listingAgent = computed(() => normalizePropertyAgent(hotDealProperty.value?.agent))

const { telLink, mailtoLink, whatsappLink } = usePropertyContact(computed(() => ({
  agent: listingAgent.value,
  title: displayTitle.value,
  location: propertyLocation.value,
  price: displayPriceValue.value,
  referenceNumber: hotDealProperty.value?.reference_number,
  propertyUrl: propertyUrl.value,
})))

/* UI STATE */
const isOpen = ref(true)
const open = () => { isOpen.value = true }
const close = () => { isOpen.value = false }

const mobileVisible = ref(true)
const dragY = ref(0)
const dragStart = ref(0)

const startDrag = (e: TouchEvent) => {
  dragStart.value = e.touches[0].clientY
}
const onDrag = (e: TouchEvent) => {
  const current = e.touches[0].clientY
  const diff = current - dragStart.value
  if (diff > 0) dragY.value = diff
}
const endDrag = () => {
  if (dragY.value > 120) {
    closeMobile()
  } else {
    dragY.value = 0
  }
}
const closeMobile = () => {
  dragY.value = 300
  setTimeout(() => { mobileVisible.value = false }, 200)
}

/* DIRECTION & TRANSFORMS */
const direction = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))
const panelSideClass = computed(() => direction.value === 'rtl' ? 'left-0' : 'right-0')
const gearTabClass = computed(() =>
  direction.value === 'rtl'
    ? 'left-0 rounded-r-3xl'
    : 'right-0 rounded-l-3xl'
)
const panelRadiusClass = computed(() =>
  direction.value === 'rtl'
    ? 'rounded-l-none rounded-r-2xl'
    : 'rounded-r-none rounded-l-2xl'
)

const openTransform = 'translateY(-50%) translateX(0)'
const closedTransform = computed(() =>
  direction.value === 'rtl'
    ? 'translateY(-50%) translateX(-110%)'
    : 'translateY(-50%) translateX(110%)'
)
</script>

<style scoped>
.btn-mini {
  @apply flex items-center justify-center py-2 rounded-lg text-xs font-semibold transition;
}
.btn-mini.primary {
  @apply bg-comma-primary text-white hover:bg-comma-primary-dark;
}
.btn-mini.secondary {
  @apply bg-comma-surface-elevated text-comma-primary hover:bg-comma-surface-subtle;
}
.btn-mini.whatsapp {
  @apply border border-green-200 bg-green-50 text-green-700 hover:border-green-500 hover:bg-green-500 hover:text-white;
}
</style>