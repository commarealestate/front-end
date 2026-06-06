<template>
  <div class="group bg-white rounded-xl shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden border border-comma-border-subtle flex flex-col h-full">
    <!-- Image -->
    <NuxtLink :to="localePath(`/admin/blogs/${blog.blog_id}`)">
      <div class="relative aspect-[16/9] overflow-hidden bg-comma-neutral-100">
        <img
          v-if="blog.image"
          :src="blog.image"
          :alt="blog.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-comma-neutral-400">
          <UIcon name="i-heroicons-document-text" class="w-12 h-12" />
        </div>
        <!-- Active badge -->
        <span
          class="absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded"
          :class="blog.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
        >
          {{ blog.is_active ? $t('admin_blogs_page.active') : $t('admin_blogs_page.inactive') }}
        </span>
      </div>
    </NuxtLink>

    <div class="p-4 flex flex-col flex-1">
      <NuxtLink :to="localePath(`/admin/blogs/${blog.blog_id}`)">
        <h3 class="font-display font-semibold text-comma-neutral-900 line-clamp-2 h-[48px] hover:text-comma-primary transition-colors">
          {{ blog.title || blog.title_en }}
        </h3>
      </NuxtLink>
      <p class="text-sm text-comma-neutral-600 mt-1 line-clamp-2 h-[40px]">
        {{ blog.description || blog.description_en }}
      </p>
      <div class="mt-2 flex items-center gap-2 text-xs text-comma-neutral-500">
        <span class="flex items-center gap-1">
          <UIcon name="i-heroicons-clock" class="w-3 h-3" />
          {{ blog.read_time }} min read
        </span>
        <span v-if="blog.tags?.length" class="flex items-center gap-1">
          <UIcon name="i-heroicons-tag" class="w-3 h-3" />
          {{ blog.tags.map(t => t.title).join(', ') }}
        </span>
      </div>
      <div class="mt-auto pt-3 flex items-center justify-between">
        <span class="text-sm text-comma-neutral-600">
          {{ blog.created_at }}
        </span>
        <!-- Active toggle -->
        <UToggle
          :model-value="!!blog.is_active"
          @update:model-value="$emit('toggleActive', blog)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Blog } from '~/types/blog'

defineProps<{
  blog: Blog
}>()
defineEmits<{
  (e: 'toggleActive', blog: Blog): void
}>()

const localePath = useLocalePath()
</script>