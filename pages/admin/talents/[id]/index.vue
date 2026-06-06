<template>

    <div v-if="store.loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
    </div>
    <div v-else-if="talent" class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
          {{ talent.name }}
        </h1>
        <div class="flex gap-2">
          <UButton
            color="primary"
            variant="outline"
            icon="i-heroicons-pencil-square"
            :to="localePath(`/admin/talents/${talent.talent_id}/edit`)"
          >
            {{ $t('admin_talents_page.edit') }}
          </UButton>
          <UButton
            color="red"
            variant="outline"
            icon="i-heroicons-trash"
            @click="confirmDelete"
          >
            {{ $t('admin_talents_page.delete') }}
          </UButton>
        </div>
      </div>

      <!-- Image and details -->
      <div class="bg-white rounded-2xl shadow-card p-6 lg:p-8">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Image -->
          <div class="md:w-1/3">
            <div class="rounded-xl overflow-hidden bg-comma-neutral-100">
              <img
                v-if="talent.image"
                :src="talent.image"
                :alt="talent.name"
                class="w-full h-auto"
              />
              <div v-else class="aspect-square flex items-center justify-center text-comma-neutral-400">
                <Icon name="i-heroicons-user-circle" class="w-32 h-32" />
              </div>
            </div>
          </div>

          <!-- Details -->
          <div class="md:w-2/3 space-y-4">
            <div>
              <div class="text-sm text-comma-neutral-600">Name (EN)</div>
              <div class="font-medium text-lg">{{ talent.name_en }}</div>
            </div>
            <div>
              <div class="text-sm text-comma-neutral-600">Name (AR)</div>
              <div class="font-medium text-lg">{{ talent.name_ar }}</div>
            </div>
            <div>
              <div class="text-sm text-comma-neutral-600">Title (EN)</div>
              <div class="font-medium">{{ talent.title_en }}</div>
            </div>
            <div>
              <div class="text-sm text-comma-neutral-600">Title (AR)</div>
              <div class="font-medium">{{ talent.title_ar }}</div>
            </div>
            <div v-if="talent.email">
              <div class="text-sm text-comma-neutral-600">Email</div>
              <div class="font-medium">
                <a :href="`mailto:${talent.email}`" class="text-comma-primary hover:underline">{{ talent.email }}</a>
              </div>
            </div>
            <div v-if="talent.url">
              <div class="text-sm text-comma-neutral-600">URL</div>
              <div class="font-medium">
                <a :href="talent.url" target="_blank" class="text-comma-primary hover:underline">{{ talent.url }}</a>
              </div>
            </div>
            <div v-if="(talent as any).desc_en">
              <div class="text-sm text-comma-neutral-600">Description (EN)</div>
              <div class="text-comma-neutral-700 whitespace-pre-line">{{ (talent as any).desc_en }}</div>
            </div>
            <div v-if="(talent as any).desc_ar">
              <div class="text-sm text-comma-neutral-600">Description (AR)</div>
              <div class="text-comma-neutral-700 whitespace-pre-line">{{ (talent as any).desc_ar }}</div>
            </div>
            <div class="text-xs text-comma-neutral-500">
              Created: {{ talent.created_at }}
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<script setup lang="ts">
import { useTalentsStore } from '~/store/talents'

const route = useRoute()
const store = useTalentsStore()
const localePath = useLocalePath()
const { locale } = useI18n()

const talentId = route.params.id as string

onMounted(async () => {
  await store.fetchTalent(talentId)
})

const talent = computed(() => store.talent)



async function confirmDelete() {
  if (confirm('Are you sure you want to delete this talent?')) {
    await store.deleteTalent(talentId)
    navigateTo(localePath('/admin/talents'))
  }
}
</script>