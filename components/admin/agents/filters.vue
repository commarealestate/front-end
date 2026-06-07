<template>
  <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="relative">
        <AdminLocalIcon
          name="magnifying-glass"
          class="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-comma-neutral-400"
        />
        <UInput
          v-model="filters.name"
          :placeholder="t('admin_agents_page.filters.name')"
          class="pl-8"
        />
      </div>
      <USelect
        v-model="filters.active"
        :options="activeOptions"
        :placeholder="t('admin_agents_page.filters.status')"
      />
      <UInput
        v-model="filters.service_area_name"
        :placeholder="t('admin_agents_page.filters.service_area')"
      />
    </div>
    <div class="flex justify-end gap-3">
      <UButton color="gray" variant="ghost" @click="reset">
        {{ t('admin_agents_page.filters.reset') }}
      </UButton>
      <UButton color="primary" @click="apply">
        {{ t('admin_agents_page.filters.apply') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const emit = defineEmits(['filter', 'reset'])

const filters = ref({
  name: '',
  active: '',
  service_area_name: '',
})

const activeOptions = [
  { label: 'All', value: '' },
  { label: 'Active', value: '1' },
  { label: 'Inactive', value: '0' },
]

function apply() {
  const cleaned = Object.fromEntries(
    Object.entries(filters.value).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
  )
  emit('filter', cleaned)
}

function reset() {
  filters.value = { name: '', active: '', service_area_name: '' }
  emit('reset')
}
</script>
