<template>

    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
          {{ $t('admin_properties_page.title') }}
        </h1>
        <UButton
          color="primary"
          variant="solid"
          icon="i-heroicons-plus"
          :to="localePath('/admin/properties/new')"
        >
          {{ $t('admin_properties_page.add_new') }}
        </UButton>
      </div>

      <!-- Filters (auto‑imported) -->
      <AdminPropertiesFilters @filter="applyFilters" @reset="resetFilters" />

      <!-- View Toggle -->
      <div class="flex justify-end gap-2">
        <UButton
          :color="viewMode === 'grid' ? 'primary' : 'gray'"
          variant="ghost"
          icon="i-heroicons-squares-2x2"
          @click="viewMode = 'grid'"
        />
        <UButton
          :color="viewMode === 'list' ? 'primary' : 'gray'"
          variant="ghost"
          icon="i-heroicons-list-bullet"
          @click="viewMode = 'list'"
        />
      </div>

      <!-- Loading -->
      <div v-if="store.loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
      </div>

      <!-- Grid / List -->
      <AdminPropertiesGrid
        v-else-if="viewMode === 'grid' && store.properties.length"
        :properties="store.properties"
        @hotDealToggle="openHotDealModal"
      />
      <AdminPropertiesList
        v-else-if="viewMode === 'list' && store.properties.length"
        :properties="store.properties"
        @hotDealToggle="openHotDealModal"
      />

      <!-- Empty state -->
      <div v-else class="text-center py-16 bg-comma-surface-elevated rounded-xl">
        <UIcon name="i-heroicons-building-office" class="w-16 h-16 mx-auto text-comma-neutral-400" />
        <h3 class="mt-4 text-lg font-medium text-comma-neutral-700">
          {{ $t('admin_properties_page.no_properties') }}
        </h3>
        <p class="text-comma-neutral-500">
          {{ $t('admin_properties_page.no_properties_desc') }}
        </p>
        <UButton
          color="primary"
          variant="solid"
          class="mt-4"
          :to="localePath('/admin/properties/new')"
        >
          {{ $t('admin_properties_page.add_first') }}
        </UButton>
      </div>

      <!-- Pagination -->
      <div v-if="store.pagination" class="mt-8 flex justify-center">
        <UPagination
          v-model="page"
          :page-count="store.pagination.perPage"
          :total="store.pagination.total"
          @update:model-value="fetchPage"
        />
      </div>
    </div>

    <!-- Hot Deal Modal -->
    <AdminPropertiesHotDealModal
      v-model="showHotDealModal"
      :property="selectedProperty"
      @confirm="handleHotDealConfirm"
    />

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePropertiesStore } from '~/store/properties'
import type { Property } from '~/types/property'

const store = usePropertiesStore()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()

const viewMode = ref<'grid' | 'list'>('grid')
const page = ref(1)
const filters = ref<Record<string, any>>({})

// Hot Deal modal
const showHotDealModal = ref(false)
const selectedProperty = ref<Property | null>(null)

// Load initial data
onMounted(() => {
  const query = { ...route.query }
  page.value = Number(query.page) || 1
  delete query.page
  filters.value = query
  fetchProperties()
})

function applyFilters(newFilters: Record<string, any>) {
  filters.value = newFilters
  page.value = 1
  fetchProperties()
}

function resetFilters() {
  filters.value = {}
  page.value = 1
  fetchProperties()
}

function fetchPage(newPage: number) {
  page.value = newPage
  fetchProperties()
}

async function fetchProperties() {
  const params: Record<string, any> = {
    ...filters.value,
    page: page.value,
  }
  await store.fetchProperties(params)
  router.replace({ query: params })
}

// Hot Deal handling
function openHotDealModal(property: Property) {
  selectedProperty.value = property
  showHotDealModal.value = true
}

async function handleHotDealConfirm({ hotDeal, price }: { hotDeal: boolean; price?: number }) {
  if (!selectedProperty.value) return
  await store.toggleHotDeal(selectedProperty.value.property_id, hotDeal, price)
  selectedProperty.value = null
}
</script>