<template>
  <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UInput
        v-model="filters.title"
        :placeholder="$t('admin_properties_page.filters.title')"
        icon="i-heroicons-magnifying-glass"
      />
      <USelect
        v-model="filters.status"
        :options="statusOptions"
        :placeholder="$t('admin_properties_page.filters.status')"
      />
      <USelect
        v-model="filters.property_type"
        :options="propertyTypeOptions"
        :placeholder="$t('admin_properties_page.filters.property_type')"
      />
      <USelect
        v-model="filters.hot_deal"
        :options="hotDealOptions"
        :placeholder="$t('admin_properties_page.filters.hot_deal')"
      />
      <UInput
        v-model="filters.bedrooms"
        type="number"
        :placeholder="$t('admin_properties_page.filters.bedrooms')"
      />
      <UInput
        v-model="filters.bathrooms"
        type="number"
        :placeholder="$t('admin_properties_page.filters.bathrooms')"
      />
      <UInput
        v-model="filters.min_price"
        type="number"
        :placeholder="$t('admin_properties_page.filters.min_price')"
      />
      <UInput
        v-model="filters.max_price"
        type="number"
        :placeholder="$t('admin_properties_page.filters.max_price')"
      />
    </div>

    <div class="flex justify-end gap-3">
      <UButton color="gray" variant="ghost" @click="reset">
        {{ $t('admin_properties_page.filters.reset') }}
      </UButton>
      <UButton color="primary" @click="apply">
        {{ $t('admin_properties_page.filters.apply') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['filter', 'reset'])

const filters = ref({
  title: '',
  status: '',
  property_type: '',
  hot_deal: '',
  bedrooms: '',
  bathrooms: '',
  min_price: '',
  max_price: '',
})

const statusOptions = [
  { label: 'For Sale', value: 'For Sale' },
  { label: 'For Rent', value: 'For Rent' },
  { label: 'Sold', value: 'Sold' },
  { label: 'Under Offer', value: 'Under Offer' },
]

const propertyTypeOptions = [
  { label: 'Villa', value: 'villa' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Penthouse', value: 'penthouse' },
  { label: 'Townhouse', value: 'townhouse' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Studio', value: 'studio' },
  { label: 'Duplex', value: 'duplex' },
]

const hotDealOptions = [
  { label: 'All', value: '' },
  { label: 'Yes', value: '1' },
  { label: 'No', value: '0' },
]

function apply() {
  const cleaned = Object.fromEntries(
    Object.entries(filters.value).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
  )
  emit('filter', cleaned)
}

function reset() {
  filters.value = {
    title: '',
    status: '',
    property_type: '',
    hot_deal: '',
    bedrooms: '',
    bathrooms: '',
    min_price: '',
    max_price: '',
  }
  emit('reset')
}
</script>