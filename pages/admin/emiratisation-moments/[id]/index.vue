<template>
 
    <div v-if="store.loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
    </div>
    <div v-else-if="moment" class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
          {{ moment.title }}
        </h1>
        <div class="flex gap-2">
          <UButton
            color="primary"
            variant="outline"
            icon="i-heroicons-pencil-square"
            :to="localePath(`/admin/emiratisation-moments/${moment.emiratisation_moments_id}/edit`)"
          >
            {{ $t('admin_moments_page.edit') }}
          </UButton>
          <UButton
            color="red"
            variant="outline"
            icon="i-heroicons-trash"
            @click="confirmDelete"
          >
            {{ $t('admin_moments_page.delete') }}
          </UButton>
        </div>
      </div>

      <!-- Media Display -->
      <div class="bg-white rounded-2xl shadow-card p-6">
        <div class="max-w-2xl mx-auto">
          <video
            v-if="isVideo"
            :src="moment.media"
            controls
            class="w-full rounded-lg"
          />
          <img
            v-else
            :src="moment.media"
            :alt="moment.title"
            class="w-full rounded-lg"
          />
        </div>
      </div>

      <!-- Details -->
      <div class="bg-white rounded-2xl shadow-card p-6">
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt class="text-sm text-comma-neutral-600">Title (EN)</dt>
            <dd class="font-medium">{{ moment.title_en }}</dd>
          </div>
          <div>
            <dt class="text-sm text-comma-neutral-600">Title (AR)</dt>
            <dd class="font-medium">{{ moment.title_ar }}</dd>
          </div>
          <div class="md:col-span-2">
            <dt class="text-sm text-comma-neutral-600">Description (EN)</dt>
            <dd class="font-medium">{{ moment.description_en }}</dd>
          </div>
          <div class="md:col-span-2">
            <dt class="text-sm text-comma-neutral-600">Description (AR)</dt>
            <dd class="font-medium">{{ moment.description_ar }}</dd>
          </div>
          <div>
            <dt class="text-sm text-comma-neutral-600">Created At</dt>
            <dd class="font-medium">{{ formatDate(moment.created_at) }}</dd>
          </div>
          <div>
            <dt class="text-sm text-comma-neutral-600">Updated At</dt>
            <dd class="font-medium">{{ formatDate(moment.updated_at) }}</dd>
          </div>
        </dl>
      </div>
    </div>

</template>

<script setup lang="ts">
import { useMomentsStore } from '~/store/moments'

const route = useRoute()
const store = useMomentsStore()
const localePath = useLocalePath()
const { locale } = useI18n()

const momentId = route.params.id as string

onMounted(async () => {
  await store.fetchMoment(momentId)
})

const moment = computed(() => store.moment)

const isVideo = computed(() => {
  if (!moment.value) return false
  const ext = moment.value.media.split('.').pop()?.toLowerCase()
  return ext === 'mp4' || ext === 'mov' || ext === 'avi' || ext === 'webm'
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US')
}

async function confirmDelete() {
  if (confirm('Are you sure you want to delete this moment?')) {
    await store.deleteMoment(momentId)
    navigateTo(localePath('/admin/emiratisation-moments'))
  }
}
</script>