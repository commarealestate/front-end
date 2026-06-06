<template>
  <UCard class="border border-comma-border-subtle shadow-lg hover:shadow-xl transition-shadow" :ui="{ body: 'p-5', header: 'px-5 py-4 border-b border-comma-border-subtle bg-comma-surface-elevated', footer: 'px-5 py-3 border-t border-comma-border-subtle' }">
    <template #header>
      <div class="flex items-center justify-between p-5">
        <h3 class="text-lg font-display font-semibold text-comma-neutral-900">{{ $t('admin_dashboard_page.recent.blogs') }}</h3>
        <UButton color="primary" variant="ghost" :to="localePath('/admin/blogs')" size="sm" icon="i-heroicons-arrow-right" trailing>
          {{ $t('admin_dashboard_page.recent.view_all') }}
        </UButton>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-12">
      <Icon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
    </div>

    <div v-else-if="blogs.length" class="space-y-5 p-5">
      <div v-for="blog in blogs" :key="blog.blog_id" class="group flex gap-4">
        <div class="w-20 h-20 rounded-lg bg-comma-neutral-100 overflow-hidden flex-shrink-0 group-hover:shadow-md transition">
          <img :src="blog.image || '/images/placeholder.jpg'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div class="flex-1">
          <NuxtLink :to="localePath(`/admin/blogs/${blog.blog_id}`)" class="hover:text-comma-primary">
            <h4 class="font-semibold text-comma-neutral-900 line-clamp-2 group-hover:text-comma-primary transition">{{ blog.title_en || blog.title }}</h4>
          </NuxtLink>
          <div class="flex items-center gap-2 mt-1">
            <UBadge :color="blog.is_active ? 'green' : 'gray'" size="xs">
              {{ blog.is_active ? $t('admin_dashboard_page.recent.active') : $t('admin_dashboard_page.recent.inactive') }}
            </UBadge>
            <span class="text-xs text-comma-neutral-400">{{ formatDate(blog.created_at) }}</span>
          </div>
          <p class="text-xs text-comma-neutral-600 mt-1 line-clamp-2">{{ blog.description_en || blog.description }}</p>
        </div>
      </div>
    </div>

    <div v-else class="py-12 text-center text-comma-neutral-500 bg-comma-surface-elevated/50 rounded-lg">
      <Icon name="i-heroicons-newspaper" class="w-10 h-10 mx-auto text-comma-neutral-300 mb-2" />
      <p>{{ $t('admin.no_data') }}</p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Blog } from '~/types/blog'

defineProps<{
  blogs: Blog[]
  loading: boolean
}>()

const localePath = useLocalePath()
const { locale } = useI18n()

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}
</script>