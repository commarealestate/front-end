<template>
  <div v-if="blog" class="min-h-screen bg-comma-neutral-50" :dir="direction">
    <!-- Hero Section - Premium -->
    <section class="relative min-h-[70vh] lg:min-h-[85vh] pt-16 overflow-hidden flex items-end">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img :src="blog.image || '/images/blog-details.jpg'" :alt="blog.title"
          class="w-full h-full object-cover scale-105" @error="handleImageError" />
      </div>

      <!-- Cinematic Overlay Layers -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30"></div>
      <div class="absolute inset-0 opacity-20 bg-[url('/images/noise.png')] mix-blend-overlay"></div>

      <!-- Content -->
      <div class="container relative z-10 px-4 pt-16 lg:px-8 pb-16 lg:pb-24">
        <div class="max-w-5xl mx-auto">
          <!-- Breadcrumb -->
          <nav class="mb-6">
            <ol
              class="inline-flex items-center gap-2 text-sm text-white/90 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
              :class="{ 'flex-row-reverse': direction === 'rtl' }">
              <li>
                <NuxtLink :to="localePath('/')" class="hover:text-white transition">{{ $t('blog_detail.home') }}
                </NuxtLink>
              </li>
              <Icon name="mdi:chevron-right" class="w-4 h-4 opacity-70"
                :class="{ 'rotate-180': direction === 'rtl' }" />
              <li>
                <NuxtLink :to="localePath('/blogs')" class="hover:text-white transition">{{ $t('blog_detail.blogs') }}
                </NuxtLink>
              </li>
              <Icon name="mdi:chevron-right" class="w-4 h-4 opacity-70"
                :class="{ 'rotate-180': direction === 'rtl' }" />
              <li class="text-comma-neutral-100 font-medium truncate max-w-[200px]">{{ blog.title }}</li>
            </ol>
          </nav>

          <!-- Meta Pills -->
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <span class="px-4 py-1.5 bg-comma-primary/90 text-white text-sm font-semibold rounded-full shadow-lg">
              {{ $t('blog_detail.categories.main') }}
            </span>
            <span
              class="px-4 py-1.5 bg-white/10 backdrop-blur text-white/90 text-sm rounded-full border border-white/20">
              {{ formatDate(blog.created_at) }}
            </span>
            <span v-if="blog.read_time"
              class="px-4 py-1.5 bg-white/10 backdrop-blur text-white/90 text-sm rounded-full border border-white/20">
              {{ $t('blog_detail.read_time', { minutes: blog.read_time }) }}
            </span>
          </div>

          <!-- Title -->
          <h1
            class="text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight font-display mb-6 drop-shadow-2xl">
            {{ blog.title }}
          </h1>

          <!-- Description -->
          <p class="text-lg lg:text-2xl text-white/90 max-w-4xl leading-relaxed mb-10">
            {{ blog.description }}
          </p>

          <!-- Author + Share -->
          <div
            class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
                <Icon name="mdi:office-building" class="w-7 h-7 text-white" />
              </div>
              <div>
                <p class="text-white font-semibold text-lg">Comma Real Estate</p>
                <p class="text-white/70 text-sm">{{ $t('blog_detail.published_by') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Article Content -->
    <section class="py-12 lg:py-20">
      <div class="container px-4 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <div class="grid lg:grid-cols-4 gap-8">
            <!-- Main Content -->
            <article class="lg:col-span-3">
              <div class="bg-white rounded-3xl shadow-card p-6 lg:p-10">
                <!-- Table of Contents (Mobile) -->
                <div class="lg:hidden mb-8 mt-2">
                  <div class="bg-comma-neutral-50 rounded-2xl p-6 border border-comma-border-subtle">
                    <h3 class="text-lg font-bold text-comma-neutral-900 mb-4">{{ $t('blog_detail.table_of_contents') }}
                    </h3>
                    <nav class="space-y-2">
                      <a v-for="(heading, index) in tableOfContents" :key="index" :href="`#${heading.id}`"
                        class="block text-comma-neutral-600 hover:text-comma-primary transition-colors duration-300 text-sm py-2 border-l-2 border-transparent hover:border-comma-primary hover:ltr:pl-2 hover:rtl:pr-2"
                        :class="{ 'ltr:pl-2 rtl:pr-2 border-comma-primary': activeHeading === heading.id }"
                        @click.prevent="scrollToHeading(heading.id)">
                        {{ heading.text }}
                      </a>
                    </nav>
                  </div>
                </div>

                <!-- Featured image (if any, already shown in hero but repeat if needed) -->
                <div v-if="blog.image" class="mb-8 rounded-xl overflow-hidden shadow-md">
                  <img :src="blog.image" :alt="blog.title" class="w-full h-auto" />
                </div>

                <!-- Main content (HTML) -->
                <div class="prose prose-lg max-w-none" :class="{ 'prose-rtl': direction === 'rtl' }"
                  v-html="blog.content"></div>

                <!-- Additional Contents (same as admin) -->
                <div v-if="blog.contents && blog.contents.length" class="space-y-12 mt-12">
                  <div v-for="(contentBlock, idx) in blog.contents" :key="idx"
                    class="border-t border-comma-border-subtle pt-8">
                    <div v-if="contentBlock.image" class="mb-6 rounded-xl overflow-hidden shadow-md">
                      <img :src="contentBlock.image" class="w-full max-h-96 object-cover rounded-lg" />
                    </div>
                    <div class="prose prose-lg max-w-none" :class="{ 'prose-rtl': direction === 'rtl' }"
                      v-html="locale === 'ar' ? contentBlock.content_ar : contentBlock.content_en"></div>
                  </div>
                </div>

                <!-- Tags -->
                <div v-if="blog.tags && blog.tags.length" class="mt-12 pt-8 border-t border-comma-border-subtle">
                  <h3 class="text-lg font-semibold text-comma-neutral-900 mb-4">{{ $t('blog_detail.tags') }}:</h3>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="tag in blog.tags" :key="tag.tag_id"
                      class="px-3 py-1 bg-comma-neutral-100 text-comma-neutral-700 rounded-full text-sm hover:bg-comma-primary/10 hover:text-comma-primary transition-colors duration-300 cursor-pointer">
                      {{ tag.title }}
                    </span>
                  </div>
                </div>

                <!-- Share Bottom -->
                <div class="mt-8 pt-8 border-t border-comma-border-subtle">
                  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p class="text-comma-neutral-700">{{ $t('blog_detail.found_helpful') }}</p>
                    <div class="flex items-center gap-3">
                      <button @click="shareOnTwitter"
                        class="flex items-center gap-2 px-2 py-2 bg-comma-neutral-900 text-white rounded-lg hover:bg-comma-neutral-700 transition-colors duration-300">
                        <Icon name="ph:x-logo" class="w-4 h-4" />
                      </button>
                      <button @click="shareOnLinkedIn"
                        class="flex items-center gap-2 px-2 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-300">
                        <Icon name="mdi:linkedin" class="w-4 h-4" />
                      </button>
                      <button @click="shareOnWhatsapp"
                        class="flex items-center gap-2 px-2 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-300">
                        <Icon name="mdi:whatsapp" class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Author Bio -->
              <div
                class="mt-8 bg-gradient-to-br from-comma-surface-elevated to-white rounded-3xl shadow-card p-6 lg:p-8 border border-comma-border-subtle">
                <div class="flex items-start gap-6">
                  <div
                    class="w-20 h-20 rounded-full bg-gradient-to-br from-comma-primary to-comma-primary-dark flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Icon name="mdi:office-building" class="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 class="text-2xl font-bold text-comma-neutral-900 mb-3 font-display">{{
                      $t('blog_detail.about_comma') }}</h3>
                    <p class="text-comma-neutral-600 mb-4">{{ $t('blog_detail.comma_description') }}</p>
                    <NuxtLink :to="localePath('/about')"
                      class="inline-flex items-center gap-2 text-comma-primary font-semibold hover:text-comma-primary-dark transition-colors duration-300 group">
                      {{ $t('blog_detail.learn_more') }}
                      <Icon name="mdi:arrow-right"
                        class="w-4 h-4 transform group-hover:ltr:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300" />
                    </NuxtLink>
                  </div>
                </div>
              </div>

              <!-- Related Articles -->
              <div class="mt-16">
                <h2 class="text-2xl lg:text-3xl font-bold text-comma-neutral-900 mb-8 font-display">{{
                  $t('blog_detail.related_articles') }}</h2>
                <div v-if="relatedBlogs.length > 0" class="grid md:grid-cols-2 gap-6">
                  <div v-for="related in relatedBlogs" :key="related.blog_id"
                    class="bg-white rounded-2xl shadow-card overflow-hidden group hover:shadow-hover transition-all duration-500 hover:-translate-y-1 border border-comma-border-subtle">
                    <div class="p-6">
                      <div class="flex items-center gap-2 mb-3">
                        <span
                          class="px-3 py-1 bg-comma-primary/10 text-comma-primary text-xs font-semibold rounded-full">{{
                            $t('blog_detail.categories.main') }}</span>
                        <span class="text-comma-neutral-500 text-xs">{{ formatDate(related.created_at) }}</span>
                      </div>
                      <h3
                        class="text-xl font-bold text-comma-neutral-900 mb-3 leading-tight group-hover:text-comma-primary transition-colors duration-300 font-display">
                        {{ related.title }}</h3>
                      <p class="text-comma-neutral-600 text-sm mb-4 line-clamp-2">{{ related.description }}</p>
                      <NuxtLink :to="localePath(`/blogs/${related.blog_id}-${related.slug || related.blog_id}`)"
                        class="inline-flex items-center gap-2 text-comma-primary font-semibold text-sm group/link hover:text-comma-primary-dark transition-colors duration-300">
                        {{ $t('blog_detail.read_article') }}
                        <Icon name="mdi:arrow-right"
                          class="w-4 h-4 transform group-hover/link:ltr:translate-x-1 rtl:group-hover/link:-translate-x-1 transition-transform duration-300" />
                      </NuxtLink>
                    </div>
                  </div>
                </div>
                <p v-else class="text-comma-neutral-500 text-center">{{ $t('blog_detail.no_related') }}</p>
              </div>
            </article>

            <!-- Sidebar -->
            <aside class="lg:col-span-1">
              <div class="bg-white rounded-2xl shadow-card p-6 mb-6 sticky top-24 border border-comma-border-subtle">
                <h3 class="text-lg font-bold text-comma-neutral-900 mb-4">{{ $t('blog_detail.table_of_contents') }}
                </h3>
                <nav class="space-y-2" v-if="tableOfContents.length > 0">
                  <a v-for="(heading, index) in tableOfContents" :key="index" :href="`#${heading.id}`"
                    class="block text-comma-neutral-600 hover:text-comma-primary transition-colors duration-300 text-sm py-2 border-l-2 border-transparent hover:border-comma-primary hover:ltr:pl-2 hover:rtl:pr-2"
                    :class="{ 'ltr:pl-2 rtl:pr-2 border-comma-primary': activeHeading === heading.id }"
                    @click.prevent="scrollToHeading(heading.id)">
                    {{ heading.text }}
                  </a>
                </nav>
                <p v-else class="text-comma-neutral-500 text-sm">{{ $t('blog_detail.no_toc_available') }}</p>
              </div>

              <!-- CTA -->
              <div
                class="bg-gradient-to-br from-comma-primary to-comma-primary-dark rounded-2xl p-6 text-center shadow-lg">
                <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name="mdi:phone" class="w-8 h-8 text-white" />
                </div>
                <h3 class="text-xl font-bold text-white mb-3 font-display">{{ $t('blog_detail.cta_title') }}</h3>
                <p class="text-white/90 text-sm mb-6">{{ $t('blog_detail.cta_subtitle') }}</p>
                <NuxtLink :to="localePath('/contact')"
                  class="inline-block w-full py-3 bg-white text-comma-primary font-semibold rounded-xl hover:bg-comma-neutral-100 transition-all duration-300 hover:scale-105 shadow-md">
                  {{ $t('blog_detail.contact_expert') }}
                </NuxtLink>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Loading -->
  <div v-else-if="pending" class="min-h-screen flex items-center justify-center">
    <Icon name="mdi:loading" class="w-12 h-12 text-comma-primary animate-spin" />
  </div>

  <!-- Not Found -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <Icon name="mdi:newspaper" class="w-16 h-16 text-comma-neutral-300 mx-auto mb-4" />
      <h1 class="text-2xl font-bold text-comma-neutral-900 mb-2">{{ $t('blog_detail.not_found') }}</h1>
      <p class="text-comma-neutral-600 mb-6">{{ $t('blog_detail.not_found_description') }}</p>
      <NuxtLink to="/blogs"
        class="px-6 py-3 bg-comma-primary text-white font-semibold rounded-lg hover:bg-comma-primary-dark transition-colors duration-300">
        {{ $t('blog_detail.back_to_blogs') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBlogsStore } from '~/store/blogs'

const { locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')

const store = useBlogsStore()
const pending = ref(true)
const blog = ref<any>(null)
const relatedBlogs = ref<any[]>([])
const tableOfContents = ref<Array<{ id: string; text: string; level: number }>>([])
const activeHeading = ref('')

// Extract ID from combined parameter (e.g., "1-welcome-to-our-blog")
const fullParam = route.params.id as string
const blogId = Number(fullParam.split('-')[0])

// Fetch blog data
onMounted(async () => {
  try {
    await store.fetchBlog(blogId)
    if (store.blog) {
      const raw = store.blog
      blog.value = {
        ...raw,
        title: locale.value === 'ar' ? raw.title_ar : raw.title_en,
        description: locale.value === 'ar' ? raw.description_ar : raw.description_en,
        content: locale.value === 'ar' ? raw.content_ar : raw.content_en,
        // contents array is already present, each has content_en/ar and image
      }
      await fetchRelatedBlogs()
      extractHeadingsFromHtml()
    }
  } catch (error) {
    console.error(error)
  } finally {
    pending.value = false
  }
})

// Extract headings from the HTML content (main content + additional contents)
function extractHeadingsFromHtml() {
  if (!blog.value) return
  const headings: Array<{ id: string; text: string; level: number }> = []
  const mainContent = blog.value.content || ''
  const additionalContents = blog.value.contents || []

  // Simple regex to extract h2 and h3 tags from HTML
  const regex = /<(h2|h3)[^>]*>(.*?)<\/\1>/gi
  let match
  while ((match = regex.exec(mainContent)) !== null) {
    const level = match[1] === 'h2' ? 2 : 3
    const text = match[2].replace(/<[^>]*>/g, '').trim()
    const id = text.toLowerCase()
      .replace(/[^\w\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/g, '-')
      .replace(/^-+|-+$/g, '')
    headings.push({ id, text, level })
  }

  // Also extract from additional contents
  for (const block of additionalContents) {
    const blockContent = locale.value === 'ar' ? block.content_ar : block.content_en
    if (blockContent) {
      const blockRegex = /<(h2|h3)[^>]*>(.*?)<\/\1>/gi
      while ((match = blockRegex.exec(blockContent)) !== null) {
        const level = match[1] === 'h2' ? 2 : 3
        const text = match[2].replace(/<[^>]*>/g, '').trim()
        const id = text.toLowerCase()
          .replace(/[^\w\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/g, '-')
          .replace(/^-+|-+$/g, '')
        headings.push({ id, text, level })
      }
    }
  }

  tableOfContents.value = headings
}

// Scroll tracking for active heading
function handleScroll() {
  const headingElements = document.querySelectorAll('h2, h3')
  let current = ''
  headingElements.forEach(heading => {
    const rect = heading.getBoundingClientRect()
    if (rect.top <= window.innerHeight / 3 && rect.bottom >= 0) {
      current = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || ''
    }
  })
  activeHeading.value = current
}

function scrollToHeading(id: string) {
  const element = document.getElementById(id)
  if (element) {
    const offset = 100
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' })
    activeHeading.value = id
  }
}

// Related blogs: fetch latest 3 excluding current
async function fetchRelatedBlogs() {
  if (!blog.value) return
  await store.fetchBlogs({ per_page: 4, sort_by: 'created_at', sort_direction: 'desc' })
  relatedBlogs.value = store.blogs
    .filter(b => b.blog_id !== blog.value.blog_id)
    .slice(0, 2)
    .map(b => ({
      ...b,
      title: locale.value === 'ar' ? b.title_ar : b.title_en,
      description: locale.value === 'ar' ? b.description_ar : b.description_en,
      slug: b.slug || b.blog_id
    }))
}

// Share methods
function shareOnTwitter() {
  const url = `https://x.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.value?.title || '')}`
  window.open(url, '_blank')
}
function shareOnLinkedIn() {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
  window.open(url, '_blank')
}
function shareOnWhatsapp() {
  const text = blog.value?.title || ''
  const url = `https://wa.me/?text=${encodeURIComponent(`${text} ${window.location.href}`)}`
  window.open(url, '_blank')
}

// Helpers
function formatDate(dateString: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = '/images/blog-details.jpg'
}

// Scroll listener
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

// SEO
useHead(() => {
  if (!blog.value) return {}
  return {
    title: `${blog.value.title} | Comma Real Estate`,
    meta: [
      { name: 'description', content: blog.value.description },
      { name: 'keywords', content: blog.value.tags?.map((t: any) => t.title).join(', ') || '' },
      { property: 'og:title', content: `${blog.value.title} | Comma Real Estate` },
      { property: 'og:description', content: blog.value.description },
      { property: 'og:type', content: 'article' },
      { property: 'og:image', content: blog.value.image || '/images/blog-details.jpg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `${blog.value.title} | Comma Real Estate` },
      { name: 'twitter:description', content: blog.value.description },
    ]
  }
})
</script>

<style scoped>
/* Same styles as before, unchanged */
.hero-share-btn {
  @apply w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/20;
}

section img {
  transform: scale(1.1);
}

@keyframes heroGlow {

  0%,
  100% {
    opacity: .6
  }

  50% {
    opacity: .9
  }
}

.prose {
  color: #292524;
  max-width: 100% !important;
  font-size: 1.125rem;
  line-height: 1.75;
}

.prose :deep(h1) {
  font-size: 2.5rem;
  color: #1C1917;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  margin-top: 2em;
  margin-bottom: 1em;
  border-bottom: 3px solid #8E084D;
  padding-bottom: 0.5rem;
}

.prose :deep(h2) {
  font-size: 2rem;
  color: #1C1917;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  margin-top: 1.8em;
  margin-bottom: 0.8em;
  border-bottom: 2px solid #E9E7E6;
  padding-bottom: 0.4rem;
}

.prose :deep(h3) {
  font-size: 1.5rem;
  color: #8E084D;
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.6em;
}

.prose :deep(p) {
  line-height: 1.8;
  margin-bottom: 1.5em;
  font-size: 1.125rem;
}

.prose :deep(strong) {
  color: #8E084D;
  font-weight: 600;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-bottom: 1.5em;
  padding-left: 1.5em;
}

.prose :deep(li) {
  margin-bottom: 0.5em;
}

.prose :deep(blockquote) {
  border-left: 4px solid #D4A346;
  padding-left: 1.5rem;
  margin-left: 0;
  margin-right: 0;
  color: #57534E;
  background: #FAF9F8;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-top: 2em;
  margin-bottom: 2em;
}

.prose :deep(a) {
  color: #8E084D;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.3s;
}

.prose :deep(a:hover) {
  color: #5C0431;
}

.prose :deep(img) {
  border-radius: 0.75rem;
  margin: 2em 0;
  max-width: 100%;
  height: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.prose :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 2em 0;
}

.prose :deep(th) {
  background: #F5F3F2;
  font-weight: 600;
  text-align: left;
  padding: 0.75rem;
  border: 1px solid #E9E7E6;
}

.prose :deep(td) {
  padding: 0.75rem;
  border: 1px solid #E9E7E6;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(.prose-rtl) {
  direction: rtl;
  text-align: right;
}

:deep(.prose-rtl ul),
:deep(.prose-rtl ol) {
  padding-right: 1.5em;
  padding-left: 0;
}

:deep(.prose-rtl blockquote) {
  border-right: 4px solid #D4A346;
  border-left: none;
  padding-right: 1.5rem;
  padding-left: 0;
}
</style>