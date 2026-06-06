<template>
  <AdminLayout>
    <div v-if="store.loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
    </div>
    <div v-else-if="blog" class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-3xl font-display font-bold text-comma-neutral-900">
          {{ blog.title }}
        </h1>
        <div class="flex gap-2">
          <UButton
            color="primary"
            variant="outline"
            icon="i-heroicons-pencil-square"
            :to="localePath(`/admin/blogs/${blog.blog_id}/edit`)"
          >
            {{ $t('admin_blogs_page.edit') }}
          </UButton>
          <UButton
            color="red"
            variant="outline"
            icon="i-heroicons-trash"
            @click="confirmDelete"
          >
            {{ $t('admin_blogs_page.delete') }}
          </UButton>
        </div>
      </div>

      <!-- Meta info -->
      <div class="flex flex-wrap items-center gap-4 text-sm text-comma-neutral-600 border-b border-comma-border-subtle pb-4">
        <span v-if="blog.read_time" class="flex items-center gap-1">
          <UIcon name="i-heroicons-clock" class="w-4 h-4" />
          {{ blog.read_time }} min read
        </span>
        <span v-if="blog.tags?.length" class="flex items-center gap-1">
          <UIcon name="i-heroicons-tag" class="w-4 h-4" />
          {{ blog.tags.map(t => t.title).join(', ') }}
        </span>
        <span class="flex items-center gap-1">
          <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
          {{ blog.created_at }}
        </span>
        <span
          class="px-2 py-1 rounded text-xs font-semibold"
          :class="blog.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
        >
          {{ blog.is_active ? $t('admin_blogs_page.active') : $t('admin_blogs_page.inactive') }}
        </span>
      </div>

      <!-- Featured image -->
      <div v-if="blog.image" class="rounded-xl overflow-hidden shadow-card">
        <img :src="blog.image" :alt="blog.title" class="w-full h-auto" />
      </div>

      <!-- Description -->
      <div class="bg-comma-surface-elevated p-6 rounded-xl italic text-comma-neutral-700 border-l-4 border-comma-primary">
        {{ blog.description }}
      </div>

      <!-- Main content -->
      <div class="prose prose-lg max-w-none" v-html="blog.content"></div>

      <!-- Additional contents -->
      <div v-if="blog.contents && blog.contents.length" class="space-y-12 mt-12">
        <div v-for="(content, idx) in blog.contents" :key="idx" class="border-t border-comma-border-subtle pt-8">
          <div v-if="content.image" class="mb-6">
            <img :src="content.image" class="w-full max-h-96 object-cover rounded-lg" />
          </div>
          <div class="prose prose-lg max-w-none" v-html="locale === 'ar' ? content.content_ar : content.content_en"></div>
        </div>
      </div>

      <!-- SEO data -->
      <UCard v-if="hasSeoData" class="mt-8">
        <template #header>
          <h2 class="font-display font-semibold">{{ $t('admin_blogs_page.seo_data') }}</h2>
        </template>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div v-if="blog.meta_title"><span class="font-medium">Meta Title:</span> {{ blog.meta_title }}</div>
          <div v-if="blog.meta_description"><span class="font-medium">Meta Description:</span> {{ blog.meta_description }}</div>
          <div v-if="blog.canonical_url"><span class="font-medium">Canonical URL:</span> {{ blog.canonical_url }}</div>
          <div v-if="blog.og_title"><span class="font-medium">OG Title:</span> {{ blog.og_title }}</div>
          <div v-if="blog.og_description"><span class="font-medium">OG Description:</span> {{ blog.og_description }}</div>
        </div>
      </UCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { useBlogsStore } from '~/store/blogs'

const route = useRoute()
const store = useBlogsStore()
const localePath = useLocalePath()
const { locale } = useI18n()

const blogId = route.params.id as string

onMounted(async () => {
  await store.fetchBlog(blogId)
})

const blog = computed(() => store.blog)

const hasSeoData = computed(() => {
  return blog.value && (
    blog.value.meta_title ||
    blog.value.meta_description ||
    blog.value.canonical_url ||
    blog.value.og_title ||
    blog.value.og_description
  )
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function confirmDelete() {
  if (confirm('Are you sure you want to delete this blog?')) {
    await store.deleteBlog(blogId)
    navigateTo(localePath('/admin/blogs'))
  }
}
</script>

<style scoped>
.prose {
  color: #1C1917;
}
.prose h1 {
  font-size: 2.25rem;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
.prose h2 {
  font-size: 1.875rem;
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
.prose h3 {
  font-size: 1.5rem;
  font-family: 'Playfair Display', serif;
  font-weight: 600;
}
.prose p {
  line-height: 1.75;
  margin-bottom: 1.25rem;
}
.prose ul, .prose ol {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}
.prose li {
  margin-bottom: 0.5rem;
}
.prose blockquote {
  border-left: 4px solid #8E084D;
  padding-left: 1rem;
  font-style: italic;
  color: #57534E;
  margin: 1.5rem 0;
}
.prose code {
  background: #F5F3F2;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}
.prose pre {
  background: #1C1917;
  color: #FAF9F8;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}
.prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}
.prose th, .prose td {
  border: 1px solid #E9E7E6;
  padding: 0.5rem;
}
.prose th {
  background: #F5F3F2;
  font-weight: 600;
}
</style>