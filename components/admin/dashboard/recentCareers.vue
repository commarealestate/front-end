<template>
  <UCard class="border border-comma-border-subtle shadow-lg hover:shadow-xl transition-shadow" :ui="{ body: 'p-5', header: 'px-5 py-4 border-b border-comma-border-subtle bg-comma-surface-elevated', footer: 'px-5 py-3 border-t border-comma-border-subtle' }">
    <template #header>
      <div class="flex items-center justify-between p-5">
        <h3 class="text-lg font-display font-semibold text-comma-neutral-900">{{ $t('admin_dashboard_page.recent.careers') }}</h3>
        <UButton color="primary" variant="ghost" :to="localePath('/admin/careers')" size="sm" icon="i-heroicons-arrow-right" trailing>
          {{ $t('admin_dashboard_page.recent.view_all') }}
        </UButton>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-12">
      <Icon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
    </div>

    <div v-else-if="applications.length" class="space-y-4 p-5">
      <div v-for="app in applications" :key="app.career_message_id" class="group">
        <NuxtLink :to="localePath(`/admin/careers/${app.career_message_id}`)" class="block">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h4 class="font-semibold text-comma-neutral-900 group-hover:text-comma-primary transition">{{ app.name }}</h4>
                <UBadge :color="app.is_read ? 'gray' : 'green'" size="xs">
                  {{ app.is_read ? $t('admin_dashboard_page.recent.read') : $t('admin_dashboard_page.recent.unread') }}
                </UBadge>
              </div>
              <p class="text-sm text-comma-neutral-600">{{ app.professional_field }} • {{ app.email }}</p>
              <div class="flex items-center gap-2 mt-2 text-xs text-comma-neutral-700">
                <span class="bg-comma-primary/10 px-2 py-1 rounded">{{ app.years_of_experience || $t('admin_dashboard_page.careers.no_experience') }} {{ $t('admin_dashboard_page.careers.years') }}</span>
                <span class="text-comma-neutral-400">{{ app.created_at }}</span>
              </div>
              <p v-if="app.message" class="text-sm text-comma-neutral-700 mt-2 line-clamp-2">{{ app.message }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div v-else class="py-12 text-center text-comma-neutral-500 bg-comma-surface-elevated/50 rounded-lg">
      <Icon name="i-heroicons-briefcase" class="w-10 h-10 mx-auto text-comma-neutral-300 mb-2" />
      <p>{{ $t('admin.no_data') }}</p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { CareerMessage } from '~/composables/useCareers'

defineProps<{
  applications: CareerMessage[]
  loading: boolean
}>()

const localePath = useLocalePath()
const { locale } = useI18n()

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}
</script>