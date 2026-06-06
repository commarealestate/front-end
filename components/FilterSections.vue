<template>
  <div class="space-y-6">
    <!-- Property Type -->
    <div>
      <h4 class="text-sm font-semibold text-comma-neutral-800 mb-3 flex items-center gap-2">
        <Icon name="mdi:home" class="w-4 h-4 text-comma-primary" />
        {{ $t('properties_page.property_type') }}
      </h4>
      <select v-model="localPropertyType" @change="emitUpdate('property-type', localPropertyType)"
        class="w-full p-2 border border-comma-border-subtle rounded-lg bg-white focus:border-comma-primary focus:ring-1 focus:ring-comma-primary">
        <option :value="null">{{ $t('properties_page.any') }}</option>
        <option value="villa">{{ $t('properties_page.types.villa') }}</option>
        <option value="apartment">{{ $t('properties_page.types.apartment') }}</option>
        <option value="penthouse">{{ $t('properties_page.types.penthouse') }}</option>
        <option value="townhouse">{{ $t('properties_page.types.townhouse') }}</option>
        <option value="commercial">{{ $t('properties_page.types.commercial') }}</option>
        <option value="studio">{{ $t('properties_page.types.studio') }}</option>
        <option value="duplex">{{ $t('properties_page.types.duplex') }}</option>
      </select>
    </div>

    <!-- Status (Sale/Rent) -->
    <div>
      <h4 class="text-sm font-semibold text-comma-neutral-800 mb-3 flex items-center gap-2">
        <Icon name="mdi:tag" class="w-4 h-4 text-comma-primary" />
        {{ $t('properties_page.status') }}
      </h4>
      <select v-model="localStatus" @change="emitUpdate('status', localStatus)"
        class="w-full p-2 border border-comma-border-subtle rounded-lg bg-white focus:border-comma-primary">
        <option :value="null">{{ $t('properties_page.any') }}</option>
        <option value="Sale">{{ $t('properties_page.status_options.For Sale') }}</option>
        <option value="Rent">{{ $t('properties_page.status_options.For Rent') }}</option>
        <option value="Sold">{{ $t('properties_page.status_options.Sold') }}</option>
        <option value="Under Offer">{{ $t('properties_page.status_options.Under Offer') }}</option>
      </select>
    </div>

    <!-- Bedrooms -->
    <div>
      <h4 class="text-sm font-semibold text-comma-neutral-800 mb-3 flex items-center gap-2">
        <Icon name="mdi:bed" class="w-4 h-4 text-comma-primary" />
        {{ $t('properties_page.bedrooms') }}
      </h4>
      <select v-model="localBedrooms" @change="emitUpdate('bedrooms', localBedrooms)"
        class="w-full p-2 border border-comma-border-subtle rounded-lg bg-white">
        <option :value="null">{{ $t('properties_page.any') }}</option>
        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
        <option value="10+">10+</option>
      </select>
    </div>

    <!-- Bathrooms -->
    <div>
      <h4 class="text-sm font-semibold text-comma-neutral-800 mb-3 flex items-center gap-2">
        <Icon name="mdi:shower" class="w-4 h-4 text-comma-primary" />
        {{ $t('properties_page.bathrooms') }}
      </h4>
      <select v-model="localBathrooms" @change="emitUpdate('bathrooms', localBathrooms)"
        class="w-full p-2 border border-comma-border-subtle rounded-lg bg-white">
        <option :value="null">{{ $t('properties_page.any') }}</option>
        <option v-for="n in 8" :key="n" :value="n">{{ n }}</option>
        <option value="8+">8+</option>
      </select>
    </div>

    <!-- Price Range (min / max) -->
    <div>
      <h4 class="text-sm font-semibold text-comma-neutral-800 mb-3 flex items-center gap-2">
        <Icon name="mdi:cash" class="w-4 h-4 text-comma-primary" />
        {{ $t('properties_page.price_range') }}
      </h4>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs text-comma-neutral-500">{{ $t('properties_page.min') }}</label>
          <input type="number" :value="localMinPrice" @input="updateMinPrice($event.target.value)"
            class="w-full p-2 border border-comma-border-subtle rounded-lg" :placeholder="formatPrice(minPrice)" />
        </div>
        <div>
          <label class="text-xs text-comma-neutral-500">{{ $t('properties_page.max') }}</label>
          <input type="number" :value="localMaxPrice" @input="updateMaxPrice($event.target.value)"
            class="w-full p-2 border border-comma-border-subtle rounded-lg" :placeholder="formatPrice(maxPrice)" />
        </div>
      </div>
    </div>

    <!-- Hot Deal -->
    <div>
      <label class="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" v-model="localHotDeal" @change="emitUpdate('hot-deal', localHotDeal)"
          class="w-4 h-4 text-comma-primary rounded border-comma-border-subtle focus:ring-comma-primary" />
        <span class="text-sm text-comma-neutral-800">{{ $t('properties_page.hot_deal') }}</span>
      </label>
    </div>

    <!-- Location (service area) - only if serviceAreas list is provided -->
    <div v-if="serviceAreas && serviceAreas.length">
      <h4 class="text-sm font-semibold text-comma-neutral-800 mb-3 flex items-center gap-2">
        <Icon name="mdi:map-marker" class="w-4 h-4 text-comma-primary" />
        {{ $t('properties_page.location') }}
      </h4>
      <select v-model="localServiceAreaId" @change="emitUpdate('service-area-id', localServiceAreaId)"
        class="w-full p-2 border border-comma-border-subtle rounded-lg bg-white">
        <option :value="null">{{ $t('properties_page.any') }}</option>
        <option v-for="area in serviceAreas" :key="area.service_area_id" :value="area.service_area_id">
          {{ area.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

interface FilterState {
  property_type: string | null
  status: string | null
  bedrooms: number | null
  bathrooms: number | null
  min_price: number | null
  max_price: number | null
  hot_deal: boolean
  service_area_id: number | null
}

interface ServiceArea {
  service_area_id: number
  name: string
}

const props = defineProps({
  filters: {
    type: Object as PropType<FilterState>,
    required: true
  },
  serviceAreas: {
    type: Array as PropType<ServiceArea[]>,
    default: () => []
  },
  minPrice: {
    type: Number,
    required: true
  },
  maxPrice: {
    type: Number,
    required: true
  },
  formatPrice: {
    type: Function as PropType<(price: number) => string>,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'update:property-type', value: string | null): void
  (e: 'update:status', value: string | null): void
  (e: 'update:bedrooms', value: number | null): void
  (e: 'update:bathrooms', value: number | null): void
  (e: 'update:min-price', value: number): void
  (e: 'update:max-price', value: number): void
  (e: 'update:hot-deal', value: boolean): void
  (e: 'update:service-area-id', value: number | null): void
}>()

// Local copies for v-model
const localPropertyType = ref(props.filters.property_type)
const localStatus = ref(props.filters.status)
const localBedrooms = ref(props.filters.bedrooms)
const localBathrooms = ref(props.filters.bathrooms)
const localMinPrice = ref(props.filters.min_price ?? props.minPrice)
const localMaxPrice = ref(props.filters.max_price ?? props.maxPrice)
const localHotDeal = ref(props.filters.hot_deal)
const localServiceAreaId = ref(props.filters.service_area_id)

// Watch external changes (e.g., after reset) to keep local copies in sync
watch(() => props.filters, (newFilters) => {
  localPropertyType.value = newFilters.property_type
  localStatus.value = newFilters.status
  localBedrooms.value = newFilters.bedrooms
  localBathrooms.value = newFilters.bathrooms
  localMinPrice.value = newFilters.min_price ?? props.minPrice
  localMaxPrice.value = newFilters.max_price ?? props.maxPrice
  localHotDeal.value = newFilters.hot_deal
  localServiceAreaId.value = newFilters.service_area_id
}, { deep: true })

function emitUpdate(event: string, value: any) {
  emit(`update:${event}`, value)
}

function updateMinPrice(val: string) {
  const num = val === '' ? null : Number(val)
  localMinPrice.value = num
  emit('update:min-price', num)
}

function updateMaxPrice(val: string) {
  const num = val === '' ? null : Number(val)
  localMaxPrice.value = num
  emit('update:max-price', num)
}
</script>
