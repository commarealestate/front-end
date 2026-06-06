<template>
  <UCard class="border border-comma-border-subtle shadow-lg hover:shadow-xl transition-shadow" :ui="{ body: 'p-5', header: 'px-5 py-4 border-b border-comma-border-subtle bg-comma-surface-elevated', footer: 'px-5 py-3 border-t border-comma-border-subtle' }">
    <template #header>
      <div class="flex items-center justify-between p-5">
        <h3 class="text-lg font-display font-semibold text-comma-neutral-900">{{ $t('admin_dashboard_page.recent.contact') }}</h3>
        <UButton color="primary" variant="ghost" :to="localePath('/admin/contact')" size="sm" icon="i-heroicons-arrow-right" trailing>
          {{ $t('admin_dashboard_page.recent.view_all') }}
        </UButton>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-12">
      <Icon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
    </div>

    <div v-else-if="messages.length" class="space-y-4 p-5">
      <div v-for="msg in messages" :key="msg.contact_us_id" class="group">
        <NuxtLink :to="localePath(`/admin/contact/${msg.contact_us_id}`)" class="block">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h4 class="font-semibold text-comma-neutral-900 group-hover:text-comma-primary transition">{{ msg.name }}</h4>
                <UBadge :color="msg.is_read ? 'gray' : 'green'" size="xs">
                  {{ msg.is_read ? $t('admin_dashboard_page.recent.read') : $t('admin_dashboard_page.recent.unread') }}
                </UBadge>
              </div>
              <p class="text-sm text-comma-neutral-600">{{ msg.email }}</p>
              <p class="text-sm text-comma-neutral-700 mt-2 line-clamp-2 bg-comma-surface-elevated p-3 rounded-lg">{{ msg.message }}</p>
              <p class="text-xs text-comma-neutral-400 mt-2">{{ msg.created_at }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div v-else class="py-12 text-center text-comma-neutral-500 bg-comma-surface-elevated/50 rounded-lg">
      <Icon name="i-heroicons-envelope" class="w-10 h-10 mx-auto text-comma-neutral-300 mb-2" />
      <p>{{ $t('admin.no_data') }}</p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { ContactMessage } from '~/types/contact'

defineProps<{
  messages: ContactMessage[]
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