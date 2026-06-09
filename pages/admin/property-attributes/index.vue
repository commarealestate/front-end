<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-display font-bold text-comma-neutral-900">Property Attributes</h1>
        <p class="text-sm text-comma-neutral-600 mt-1">
          Manage dynamic resale, rental, and off-plan fields shown on property pages.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-comma-primary px-4 py-2 text-sm font-semibold text-white hover:bg-comma-primary-dark"
        @click="openCreate"
      >
        Add Attribute
      </button>
    </div>

    <div class="grid gap-3 sm:grid-cols-3">
      <select v-model="categoryFilter" class="rounded-lg border border-comma-border-subtle px-3 py-2">
        <option value="">All categories</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
      <select v-model="activeFilter" class="rounded-lg border border-comma-border-subtle px-3 py-2">
        <option value="">All statuses</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
      <button
        type="button"
        class="rounded-lg border border-comma-border-subtle px-3 py-2 text-sm font-medium hover:bg-comma-neutral-50"
        @click="loadDefinitions"
      >
        Refresh
      </button>
    </div>

    <div class="overflow-hidden rounded-2xl border border-comma-border-subtle bg-white shadow-sm">
      <div v-if="store.loading" class="p-8 text-center text-comma-neutral-500">Loading attributes...</div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-comma-neutral-50 text-left text-comma-neutral-600">
            <tr>
              <th class="px-4 py-3">Key</th>
              <th class="px-4 py-3">Label</th>
              <th class="px-4 py-3">Category</th>
              <th class="px-4 py-3">Group</th>
              <th class="px-4 py-3">Order</th>
              <th class="px-4 py-3">Active</th>
              <th class="px-4 py-3">Website</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in store.definitions" :key="item.id" class="border-t border-comma-border-subtle">
              <td class="px-4 py-3 font-mono text-xs">{{ item.key }}</td>
              <td class="px-4 py-3">{{ item.label_en }}</td>
              <td class="px-4 py-3 capitalize">{{ item.listing_category.replace('_', ' ') }}</td>
              <td class="px-4 py-3">{{ item.group_label_en }}</td>
              <td class="px-4 py-3">{{ item.display_order }}</td>
              <td class="px-4 py-3">{{ item.is_active ? 'Yes' : 'No' }}</td>
              <td class="px-4 py-3">{{ item.show_on_website ? 'Yes' : 'No' }}</td>
              <td class="px-4 py-3 text-right">
                <button class="text-comma-primary hover:underline mr-3" @click="openEdit(item)">Edit</button>
                <button class="text-red-600 hover:underline" @click="remove(item.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <h2 class="text-xl font-bold text-comma-neutral-900 mb-4">
          {{ editingId ? 'Edit Attribute' : 'Add Attribute' }}
        </h2>

        <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="save">
          <label class="space-y-1">
            <span class="text-sm font-medium">Key</span>
            <input v-model="form.key" required class="w-full rounded-lg border px-3 py-2" />
          </label>
          <label class="space-y-1">
            <span class="text-sm font-medium">Display Order</span>
            <input v-model.number="form.display_order" type="number" min="0" class="w-full rounded-lg border px-3 py-2" />
          </label>
          <label class="space-y-1">
            <span class="text-sm font-medium">Label (EN)</span>
            <input v-model="form.label_en" required class="w-full rounded-lg border px-3 py-2" />
          </label>
          <label class="space-y-1">
            <span class="text-sm font-medium">Label (AR)</span>
            <input v-model="form.label_ar" class="w-full rounded-lg border px-3 py-2" />
          </label>
          <label class="space-y-1">
            <span class="text-sm font-medium">Listing Category</span>
            <select v-model="form.listing_category" required class="w-full rounded-lg border px-3 py-2">
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
          </label>
          <label class="space-y-1">
            <span class="text-sm font-medium">Field Type</span>
            <select v-model="form.field_type" required class="w-full rounded-lg border px-3 py-2">
              <option v-for="type in fieldTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </label>
          <label class="space-y-1">
            <span class="text-sm font-medium">Group Key</span>
            <input v-model="form.group_key" required class="w-full rounded-lg border px-3 py-2" />
          </label>
          <label class="space-y-1">
            <span class="text-sm font-medium">Group Label (EN)</span>
            <input v-model="form.group_label_en" required class="w-full rounded-lg border px-3 py-2" />
          </label>
          <label class="space-y-1">
            <span class="text-sm font-medium">Group Label (AR)</span>
            <input v-model="form.group_label_ar" class="w-full rounded-lg border px-3 py-2" />
          </label>
          <label class="space-y-1">
            <span class="text-sm font-medium">Column Name</span>
            <input v-model="form.column_name" class="w-full rounded-lg border px-3 py-2" />
          </label>
          <label class="space-y-1">
            <span class="text-sm font-medium">Fallback Column</span>
            <input v-model="form.fallback_column" class="w-full rounded-lg border px-3 py-2" />
          </label>
          <label class="space-y-1">
            <span class="text-sm font-medium">Icon</span>
            <input v-model="form.icon" class="w-full rounded-lg border px-3 py-2" placeholder="mdi:tag" />
          </label>
          <label class="space-y-1">
            <span class="text-sm font-medium">Value Format</span>
            <input v-model="form.value_format" class="w-full rounded-lg border px-3 py-2" placeholder="currency, date, boolean" />
          </label>
          <label class="space-y-1">
            <span class="text-sm font-medium">Value Suffix</span>
            <input v-model="form.value_suffix" class="w-full rounded-lg border px-3 py-2" placeholder="sqft" />
          </label>
          <label class="flex items-center gap-2 sm:col-span-1">
            <input v-model="form.is_active" type="checkbox" />
            <span class="text-sm font-medium">Active</span>
          </label>
          <label class="flex items-center gap-2 sm:col-span-1">
            <input v-model="form.show_on_website" type="checkbox" />
            <span class="text-sm font-medium">Show on website</span>
          </label>

          <div class="sm:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" class="rounded-lg border px-4 py-2" @click="closeModal">Cancel</button>
            <button
              type="submit"
              class="rounded-lg bg-comma-primary px-4 py-2 font-semibold text-white disabled:opacity-60"
              :disabled="store.saving"
            >
              {{ store.saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { usePropertyAttributesStore } from '~/store/propertyAttributes'
import type { PropertyAttributeDefinition } from '~/types/property'

definePageMeta({
  layout: 'admin-layout',
  middleware: ['auth'],
})

const store = usePropertyAttributesStore()
const categoryFilter = ref('')
const activeFilter = ref('')
const showModal = ref(false)
const editingId = ref<number | null>(null)

const defaultForm = () => ({
  key: '',
  label_en: '',
  label_ar: '',
  listing_category: 'general',
  group_key: 'general_details',
  group_label_en: 'Property Details',
  group_label_ar: '',
  field_type: 'text',
  display_order: 0,
  icon: 'mdi:information-outline',
  is_active: true,
  show_on_website: true,
  column_name: '',
  fallback_column: '',
  value_suffix: '',
  value_format: '',
})

const form = ref(defaultForm())

const categories = computed(() => store.meta?.listing_categories || ['general', 'resale', 'rental', 'off_plan'])
const fieldTypes = computed(() => store.meta?.field_types || ['text', 'number', 'currency', 'boolean', 'date', 'array'])

onMounted(async () => {
  await store.fetchMeta()
  await loadDefinitions()
})

async function loadDefinitions() {
  const filters: Record<string, string> = {}
  if (categoryFilter.value) filters.listing_category = categoryFilter.value
  if (activeFilter.value) filters.is_active = activeFilter.value
  await store.fetchDefinitions(filters)
}

function openCreate() {
  editingId.value = null
  form.value = defaultForm()
  showModal.value = true
}

function openEdit(item: PropertyAttributeDefinition) {
  editingId.value = item.id
  form.value = {
    key: item.key,
    label_en: item.label_en,
    label_ar: item.label_ar || '',
    listing_category: item.listing_category,
    group_key: item.group_key,
    group_label_en: item.group_label_en,
    group_label_ar: item.group_label_ar || '',
    field_type: item.field_type,
    display_order: item.display_order,
    icon: item.icon || '',
    is_active: item.is_active,
    show_on_website: item.show_on_website,
    column_name: item.column_name || '',
    fallback_column: item.fallback_column || '',
    value_suffix: item.value_suffix || '',
    value_format: item.value_format || '',
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function save() {
  const payload = { ...form.value }
  if (editingId.value) {
    await store.updateDefinition(editingId.value, payload)
  } else {
    await store.createDefinition(payload)
  }
  closeModal()
  await loadDefinitions()
}

async function remove(id: number) {
  if (!confirm('Delete this attribute definition?')) return
  await store.deleteDefinition(id)
}
</script>
