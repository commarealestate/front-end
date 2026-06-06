<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="property in properties"
      :key="property.property_id"
      class="group bg-white rounded-xl shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden border border-comma-border-subtle flex flex-col h-full"
    >
      <!-- Image -->
      <NuxtLink :to="localePath(`/admin/properties/${property.property_id}`)">
        <div class="relative h-40 overflow-hidden bg-comma-neutral-100">
          <img
            v-if="property.images?.length"
            :src="property.images[0]"
            :alt="property.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-comma-neutral-400"
          >
            <UIcon name="i-heroicons-photo" class="w-12 h-12" />
          </div>

          <!-- Status Badge -->
          <span
            v-if="property.status"
            class="absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded bg-white/90 backdrop-blur-sm text-comma-primary-dark"
          >
            {{ property.status }}
          </span>

          <!-- Hot Deal Badge -->
          <span
            v-if="property.hot_deal"
            class="absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded bg-comma-secondary text-white"
          >
            HOT
          </span>
        </div>
      </NuxtLink>

      <!-- Details -->
      <div class="p-4 flex flex-col flex-1">
        <!-- Title -->
        <NuxtLink :to="localePath(`/admin/properties/${property.property_id}`)">
          <h3
            class="font-display font-semibold text-comma-neutral-900 line-clamp-1 h-[24px] hover:text-comma-primary transition-colors"
          >
            {{ property.title || property.reference_number || '-' }}
          </h3>
        </NuxtLink>

        <!-- Location -->
        <p class="text-sm text-comma-neutral-600 mt-1 line-clamp-2 h-[40px]">
          {{ property.location || property.community || '-' }}
        </p>

        <!-- Features -->
        <div class="flex items-center gap-3 mt-2 text-sm text-comma-neutral-700 h-[24px]">
          <span class="flex items-center gap-1 min-w-[60px]">
            <UIcon name="i-heroicons-cube" class="w-4 h-4" />
            {{ property.bedrooms ?? '-' }} {{ $t('admin_properties_page.beds') }}
          </span>
          <span class="flex items-center gap-1 min-w-[70px]">
            <UIcon name="i-heroicons-fire" class="w-4 h-4" />
            {{ property.bathrooms ?? '-' }} {{ $t('admin_properties_page.baths') }}
          </span>
          <span class="flex items-center gap-1 min-w-[80px]">
            <UIcon name="i-heroicons-arrows-up-down" class="w-4 h-4" />
            {{ property.size ?? '-' }} sqft
          </span>
        </div>

        <!-- Price + Toggle -->
        <div class="mt-auto pt-3 flex items-center justify-between">
          <div>
            <span  v-if="property.hot_deal" class="text-lg font-bold text-comma-primary">
              {{ property.hot_deal_price ? formatPrice(property.hot_deal_price) : '-' }}
            </span>
            <span  v-else class="text-lg font-bold text-comma-primary">
              {{ property.original_price ? formatPrice(property.original_price) : '-' }}
            </span>
            <span
              v-if="property.hot_deal && property.hot_deal_price"
              class="ml-2 text-sm line-through text-comma-neutral-500"
            >
              {{ formatPrice(property.original_price) }}
            </span>
          </div>

          <!-- Hot Deal Toggle -->
          <UToggle
            :model-value="property.hot_deal"
            @update:model-value="$emit('hotDealToggle', property)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Property } from '~/types/property'

defineProps<{
  properties: Property[]
}>()

defineEmits<{
  (e: 'hotDealToggle', property: Property): void
}>()

const localePath = useLocalePath()
const { formatPrice } = useFormatters()
</script>
