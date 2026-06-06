<template>
  <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UInput
        v-model="filters.search"
        :placeholder="$t('admin_contact_page.filters.search')"
        icon="i-heroicons-magnifying-glass"
      />
      <USelect
        v-model="filters.is_read"
        :options="readOptions"
        :placeholder="$t('admin_contact_page.filters.read_status')"
      />
    </div>
    <div class="flex justify-end gap-3">
      <UButton color="gray" variant="ghost" @click="reset">
        {{ $t('admin_contact_page.filters.reset') }}
      </UButton>
      <UButton color="primary" @click="apply">
        {{ $t('admin_contact_page.filters.apply') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['filter', 'reset'])

const filters = ref({
  search: '',
  is_read: '',
})

const readOptions = [
  { label: 'All', value: '' },
  { label: 'Read', value: '1' },
  { label: 'Unread', value: '0' },
]

function apply() {
  const cleaned: Record<string, any> = {}
  if (filters.value.search) cleaned.search = filters.value.search
  if (filters.value.is_read !== '') cleaned.is_read = filters.value.is_read
  emit('filter', cleaned)
}

function reset() {
  filters.value = { search: '', is_read: '' }
  emit('reset')
}
</script>