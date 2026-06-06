<template>
  <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
    <UInput
      v-model="filters.name"
      :placeholder="$t('admin_talents_page.filters.name')"
      icon="i-heroicons-magnifying-glass"
    />
    <div class="flex justify-end gap-3">
      <UButton color="gray" variant="ghost" @click="reset">
        {{ $t('admin_talents_page.filters.reset') }}
      </UButton>
      <UButton color="primary" @click="apply">
        {{ $t('admin_talents_page.filters.apply') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['filter', 'reset'])

const filters = ref({
  name: '',
})

function apply() {
  const cleaned = Object.fromEntries(
    Object.entries(filters.value).filter(([_, v]) => v !== '')
  )
  emit('filter', cleaned)
}

function reset() {
  filters.value = { name: '' }
  emit('reset')
}
</script>