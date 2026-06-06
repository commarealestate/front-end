<template>
  <div class="bg-white rounded-xl shadow-card overflow-hidden">
    <div class="divide-y divide-comma-border-subtle">
      <div
        v-for="property in properties"
        :key="property.property_id"
        class="flex items-center gap-4 p-4 hover:bg-comma-surface-elevated transition-colors"
      >
        <!-- Thumbnail -->
        <NuxtLink :to="localePath(`/admin/properties/${property.property_id}`)" class="shrink-0">
          <div class="w-16 h-16 rounded-lg overflow-hidden bg-comma-neutral-100">
            <img
              v-if="property.images?.length"
              :src="property.images[0]"
              :alt="property.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-comma-neutral-400">
              <UIcon name="i-heroicons-photo" class="w-6 h-6" />
            </div>
          </div>
        </NuxtLink>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <NuxtLink :to="localePath(`/admin/properties/${property.property_id}`)" class="hover:text-comma-primary">
            <h4 class="font-medium text-comma-neutral-900 truncate">
              {{ property.title || property.reference_number }}
            </h4>
          </NuxtLink>
          <p class="text-sm text-comma-neutral-600 truncate">{{ property.location || property.community }}</p>
          <div class="flex items-center gap-3 mt-1 text-xs text-comma-neutral-700">
            <span>{{ property.bedrooms }} beds</span>
            <span>{{ property.bathrooms }} baths</span>
            <span>{{ property.size }} sqft</span>
          </div>
        </div>

        <!-- Price & Hot Deal -->
        <div class="text-right">
          <div class="font-bold text-comma-primary">{{ formatPrice(property.original_price) }}</div>
          <div class="flex items-center justify-end gap-2 mt-1">
            <span v-if="property.hot_deal" class="text-xs px-2 py-0.5 bg-comma-secondary text-white rounded">HOT</span>
            <UToggle
              :model-value="property.hot_deal"
              size="sm"
              @update:model-value="$emit('hotDealToggle', property)"
            />
          </div>
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