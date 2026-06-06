<template>
  <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UInput
        v-model="filters.title"
        :placeholder="$t('admin_blogs_page.filters.title')"
        icon="i-heroicons-magnifying-glass"
      />
      <USelect
        v-model="filters.is_active"
        :options="activeOptions"
        :placeholder="$t('admin_blogs_page.filters.status')"
      />
      <!-- <USelect
        v-model="filters.tags"
        :options="tagOptions"
        multiple
        :placeholder="$t('admin_blogs_page.filters.tags')"
      /> -->
    </div>
    <div class="flex justify-end gap-3">
      <UButton color="gray" variant="ghost" @click="reset">
        {{ $t('admin_blogs_page.filters.reset') }}
      </UButton>
      <UButton color="primary" @click="apply">
        {{ $t('admin_blogs_page.filters.apply') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBlogsStore } from '~/store/blogs'

const store = useBlogsStore()
const emit = defineEmits(['filter', 'reset'])

const filters = ref({
  title: '',
  is_active: '',
  tags: [] as string[],
})

const activeOptions = [
  { label: 'All', value: '' },
  { label: 'Active', value: '1' },
  { label: 'Inactive', value: '0' },
]

const tagOptions = computed(() => store.tags.map(t => ({ label: t.title, value: t.title })))

function apply() {
  const cleaned: Record<string, any> = {}
  if (filters.value.title) cleaned.title = filters.value.title
  if (filters.value.is_active !== '') cleaned.is_active = filters.value.is_active
  if (filters.value.tags.length) cleaned.tags = filters.value.tags
  emit('filter', cleaned)
}

function reset() {
  filters.value = { title: '', is_active: '', tags: [] }
  emit('reset')
}
</script>