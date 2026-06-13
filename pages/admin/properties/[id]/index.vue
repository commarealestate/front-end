<template>
  <div v-if="store.loading" class="flex justify-center py-12">
    <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
  </div>

  <div v-else-if="property" class="space-y-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
          {{ displayTitle }}
        </h1>
        <p v-if="property.reference_number" class="mt-1 text-sm text-comma-neutral-500">
          Ref: {{ property.reference_number }}
        </p>
      </div>

      <div class="flex gap-2">
        <UButton
          color="primary"
          variant="outline"
          icon="i-heroicons-pencil-square"
          :to="localePath(`/admin/properties/${property.property_id}/edit`)"
        >
          {{ $t('admin_properties_page.edit') }}
        </UButton>
        <UButton color="red" variant="outline" icon="i-heroicons-trash" @click="confirmDelete">
          {{ $t('admin_properties_page.delete') }}
        </UButton>
      </div>
    </div>

    <div v-if="propertyImages.length" class="rounded-xl bg-white p-4 shadow-card">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <div class="relative overflow-hidden rounded-xl bg-comma-neutral-100">
          <img :src="propertyImages[0]" :alt="displayTitle" class="h-[360px] w-full object-cover" />
          <span class="absolute left-3 top-3 rounded bg-white/90 px-3 py-1 text-xs font-semibold text-comma-primary">
            Cover
          </span>
          <button
            type="button"
            class="absolute right-3 top-3 rounded-full bg-white/85 p-2 shadow hover:bg-white"
            @click="deleteImage(propertyImages[0])"
          >
            <UIcon name="i-heroicons-x-mark" class="h-4 w-4 text-red-600" />
          </button>
        </div>

        <div class="grid grid-cols-2 content-start gap-3">
          <div
            v-for="(img, idx) in propertyImages.slice(1, 5)"
            :key="img"
            class="group relative overflow-hidden rounded-lg bg-comma-neutral-100"
          >
            <img :src="img" :alt="`${displayTitle} image ${idx + 2}`" class="h-[110px] w-full object-cover" />
            <button
              type="button"
              class="absolute right-2 top-2 rounded-full bg-white/85 p-2 opacity-0 shadow transition group-hover:opacity-100 hover:bg-white"
              @click="deleteImage(img)"
            >
              <UIcon name="i-heroicons-x-mark" class="h-4 w-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="propertyImages.length > 5" class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        <div
          v-for="img in propertyImages.slice(5)"
          :key="img"
          class="group relative overflow-hidden rounded-lg bg-comma-neutral-100"
        >
          <img :src="img" :alt="displayTitle" class="h-24 w-full object-cover" />
          <button
            type="button"
            class="absolute right-2 top-2 rounded-full bg-white/85 p-2 opacity-0 shadow transition group-hover:opacity-100 hover:bg-white"
            @click="deleteImage(img)"
          >
            <UIcon name="i-heroicons-x-mark" class="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>

    <div v-else class="rounded-xl bg-comma-surface-elevated p-12 text-center text-comma-neutral-500">
      {{ $t('admin_properties_page.no_images') }}
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <div class="rounded-xl bg-white p-6 shadow-card">
          <h2 class="mb-4 text-lg font-display font-semibold">
            {{ $t('admin_properties_page.description') }}
          </h2>
          <div class="space-y-6">
            <div>
              <div class="mb-2 text-xs font-semibold uppercase tracking-wide text-comma-neutral-500">
                English
              </div>
              <p class="whitespace-pre-line leading-8 text-comma-neutral-700">
                {{ englishDescription || 'No English description available.' }}
              </p>
            </div>
            <div>
              <div class="mb-2 text-xs font-semibold uppercase tracking-wide text-comma-neutral-500">
                Arabic
              </div>
              <p class="whitespace-pre-line text-right leading-8 text-comma-neutral-700" dir="rtl">
                {{ arabicDescription || 'لا يوجد وصف عربي.' }}
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-xl bg-white p-6 shadow-card">
          <h2 class="mb-4 text-lg font-display font-semibold">
            {{ $t('admin_properties_page.features') }}
          </h2>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="flex items-center gap-2 rounded-lg bg-comma-surface-subtle px-3 py-2">
              <UIcon name="i-heroicons-cube" class="h-5 w-5 text-comma-primary" />
              <span>{{ property.bedrooms ?? '-' }} {{ $t('admin_properties_page.bedrooms') }}</span>
            </div>
            <div class="flex items-center gap-2 rounded-lg bg-comma-surface-subtle px-3 py-2">
              <UIcon name="i-heroicons-fire" class="h-5 w-5 text-comma-primary" />
              <span>{{ property.bathrooms ?? '-' }} {{ $t('admin_properties_page.bathrooms') }}</span>
            </div>
            <div class="flex items-center gap-2 rounded-lg bg-comma-surface-subtle px-3 py-2">
              <UIcon name="i-heroicons-arrows-up-down" class="h-5 w-5 text-comma-primary" />
              <span>{{ property.size || '-' }} sqft</span>
            </div>
            <div class="flex items-center gap-2 rounded-lg bg-comma-surface-subtle px-3 py-2">
              <UIcon name="i-heroicons-calendar" class="h-5 w-5 text-comma-primary" />
              <span>{{ property.year_built || property.build_year || '-' }}</span>
            </div>
          </div>
        </div>

        <div v-if="property.amenities?.length" class="rounded-xl bg-white p-6 shadow-card">
          <h2 class="mb-4 text-lg font-display font-semibold">
            {{ $t('admin_properties_page.amenities') }}
          </h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="amenity in property.amenities"
              :key="amenity"
              class="rounded-full bg-comma-surface-subtle px-3 py-1 text-sm text-comma-neutral-700"
            >
              {{ amenity }}
            </span>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-xl bg-white p-6 shadow-card">
          <h2 class="mb-4 text-lg font-display font-semibold">
            {{ $t('admin_properties_page.pricing') }}
          </h2>
          <div class="space-y-3">
            <div class="flex justify-between gap-4">
              <span class="text-comma-neutral-600">{{ $t('admin_properties_page.original_price') }}</span>
              <span class="text-right font-bold text-comma-primary">{{ formatPrice(property.original_price) }}</span>
            </div>
            <div v-if="property.hot_deal" class="flex justify-between gap-4">
              <span class="text-comma-neutral-600">{{ $t('admin_properties_page.hot_deal_price') }}</span>
              <span class="text-right font-bold text-comma-secondary">{{ formatPrice(property.hot_deal_price) }}</span>
            </div>
            <div class="flex justify-between gap-4">
              <span class="text-comma-neutral-600">{{ $t('admin_properties_page.status') }}</span>
              <span class="text-right font-medium">{{ displayStatus }}</span>
            </div>
            <div class="flex justify-between gap-4">
              <span class="text-comma-neutral-600">{{ $t('admin_properties_page.property_type') }}</span>
              <span class="text-right font-medium">{{ property.property_type || '-' }}</span>
            </div>
          </div>
        </div>

        <div class="rounded-xl bg-white p-6 shadow-card">
          <h2 class="mb-4 text-lg font-display font-semibold">
            {{ $t('admin_properties_page.location') }}
          </h2>
          <p class="text-comma-neutral-700">{{ property.location || property.community || '-' }}</p>
          <p v-if="property.unit_no" class="mt-1 text-sm text-comma-neutral-500">Unit: {{ property.unit_no }}</p>
        </div>

        <div class="rounded-xl bg-white p-6 shadow-card">
          <h2 class="mb-4 text-lg font-display font-semibold">
            {{ $t('admin_properties_page.agent') }}
          </h2>
          <AdminPropertiesAgentSyncPanel :property="property" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePropertiesStore } from '~/store/properties'

const route = useRoute()
const store = usePropertiesStore()
const localePath = useLocalePath()
const { formatPrice } = useFormatters()

const propertyId = route.params.id as string

onMounted(async () => {
  await store.fetchProperty(propertyId)
})

const property = computed(() => store.property)

const displayTitle = computed(() => {
  const p: any = property.value
  return textValue(p?.title?.english) || textValue(p?.title_english) || textValue(p?.title) || p?.reference_number || '-'
})

const englishDescription = computed(() => {
  const p: any = property.value
  if (!p) return ''
  return textValue(p.description?.english) || textValue(p.description_english) || textValue(p.description)
})

const arabicDescription = computed(() => {
  const p: any = property.value
  if (!p) return ''
  return textValue(p.description?.arabic) || textValue(p.description_arabic) || textValue(p.description_ar)
})

const displayStatus = computed(() => {
  const p: any = property.value
  return p?.status || p?.inventory_status || p?.sale_type || '-'
})

const propertyImages = computed(() => {
  const p: any = property.value
  if (!p) return []
  const images = [
    ...(Array.isArray(p.cover_image) ? p.cover_image : []),
    ...(Array.isArray(p.property_photos) ? p.property_photos : []),
    ...(Array.isArray(p.images) ? p.images : []),
  ]
  return [...new Set(images.filter(Boolean))]
})

async function deleteImage(imagePath: string) {
  if (confirm('Are you sure you want to delete this image?')) {
    await store.deleteImage(propertyId, imagePath)
  }
}

async function confirmDelete() {
  if (confirm('Are you sure you want to delete this property?')) {
    await store.deleteProperty(propertyId)
    navigateTo(localePath('/admin/properties'))
  }
}

function textValue(value: unknown) {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number') return String(value)
  return ''
}
</script>
