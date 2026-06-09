<template>
  <section class="bg-comma-neutral-50 py-12 lg:py-20" :dir="direction">
    <div class="container px-4 lg:px-8">
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="mb-2 text-sm font-semibold uppercase tracking-wide text-comma-primary">
            {{ $t('home.projects_section.label') }}
          </p>
          <h2 class="font-display text-3xl font-bold text-comma-neutral-900 lg:text-4xl">
            {{ $t('home.projects_section.title') }}
          </h2>
        </div>
        <NuxtLink
          :to="localePath('/projects')"
          class="inline-flex items-center gap-2 font-semibold text-comma-primary transition hover:text-comma-primary-dark"
        >
          {{ $t('home.projects_section.view_all') }}
          <Icon
            name="mdi:arrow-right"
            class="h-5 w-5"
            :class="{ 'rotate-180': direction === 'rtl' }"
          />
        </NuxtLink>
      </div>

      <div
        v-if="store.loading && !projects.length"
        class="relative min-h-[70vh] animate-pulse overflow-hidden rounded-2xl bg-comma-neutral-200 lg:min-h-[75vh]"
      />

      <div
        v-else-if="projects.length"
        class="group/slider relative min-h-[70vh] overflow-hidden rounded-2xl shadow-luxury lg:min-h-[75vh]"
        @mouseenter="pauseAutoplay"
        @mouseleave="resumeAutoplay"
      >
        <div
          v-for="(project, index) in projects"
          :key="project.project_id"
          class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          :class="currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'"
        >
          <img
            :src="getCoverImage(project)"
            :alt="getProjectTitle(project)"
            class="h-full w-full object-cover"
            @error="handleImageError"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div class="relative z-20 flex h-full min-h-[70vh] flex-col justify-end p-6 sm:p-10 lg:min-h-[75vh] lg:p-14">
          <div class="max-w-3xl text-white">
            <span
              v-if="getProjectBadge(projects[currentSlide])"
              class="mb-4 inline-block rounded-full bg-comma-primary px-3 py-1 text-sm font-semibold text-white"
            >
              {{ getProjectBadge(projects[currentSlide]) }}
            </span>
            <h3 class="mb-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl xl:text-6xl">
              {{ getProjectTitle(projects[currentSlide]) }}
            </h3>
            <p class="mb-8 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg lg:text-xl">
              {{ getProjectDescription(projects[currentSlide]) }}
            </p>
            <NuxtLink
              :to="localePath(`/projects/${projects[currentSlide].project_id}-${projects[currentSlide].slug}`)"
              class="inline-flex items-center gap-3 rounded-lg bg-comma-primary px-6 py-3 font-semibold text-white transition hover:bg-comma-primary-dark hover:shadow-lg"
            >
              {{ $t('projects_page.view_details') }}
              <Icon
                name="mdi:arrow-right"
                class="h-5 w-5"
                :class="{ 'rotate-180': direction === 'rtl' }"
              />
            </NuxtLink>
          </div>
        </div>

        <template v-if="projects.length > 1">
          <button
            type="button"
            class="absolute top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25"
            :class="direction === 'rtl' ? 'right-4 sm:right-6' : 'left-4 sm:left-6'"
            :aria-label="$t('home.projects_section.prev')"
            @click="prevSlide"
          >
            <Icon
              name="mdi:chevron-left"
              class="h-7 w-7"
              :class="{ 'rotate-180': direction === 'rtl' }"
            />
          </button>
          <button
            type="button"
            class="absolute top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25"
            :class="direction === 'rtl' ? 'left-4 sm:left-6' : 'right-4 sm:right-6'"
            :aria-label="$t('home.projects_section.next')"
            @click="nextSlide"
          >
            <Icon
              name="mdi:chevron-right"
              class="h-7 w-7"
              :class="{ 'rotate-180': direction === 'rtl' }"
            />
          </button>

          <div class="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2 sm:bottom-8">
            <button
              v-for="(project, index) in projects"
              :key="`dot-${project.project_id}`"
              type="button"
              class="h-2.5 rounded-full transition-all duration-300"
              :class="currentSlide === index ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'"
              :aria-label="$t('home.projects_section.slide_indicator', { number: index + 1 })"
              @click="goToSlide(index)"
            />
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Project } from '~/types/project'
import { useProjectsStore } from '~/store/projects'

const { locale } = useI18n()
const localePath = useLocalePath()
const direction = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))
const store = useProjectsStore()

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&fit=crop'
const AUTOPLAY_MS = 6000

const currentSlide = ref(0)
let interval: ReturnType<typeof setInterval> | null = null
let isPaused = false

const projects = computed(() =>
  store.projects.filter(
    (project) => !project.status || String(project.status).toLowerCase() === 'published',
  ),
)

function getProjectTitle(project: Project) {
  return locale.value === 'ar' ? project.title_ar : project.title_en
}

function getProjectDescription(project: Project) {
  return locale.value === 'ar' ? project.description_ar : project.description_en
}

function getProjectBadge(project: Project) {
  return locale.value === 'ar' ? project.badge_ar : project.badge_en
}

function getCoverImage(project: Project) {
  return project.cover_image?.[0] || FALLBACK_IMAGE
}

function handleImageError(event: Event) {
  ;(event.target as HTMLImageElement).src = FALLBACK_IMAGE
}

function nextSlide() {
  if (!projects.value.length) return
  currentSlide.value = (currentSlide.value + 1) % projects.value.length
}

function prevSlide() {
  if (!projects.value.length) return
  currentSlide.value = (currentSlide.value - 1 + projects.value.length) % projects.value.length
}

function goToSlide(index: number) {
  currentSlide.value = index
}

function startAutoplay() {
  if (interval || projects.value.length <= 1 || isPaused) return
  interval = setInterval(nextSlide, AUTOPLAY_MS)
}

function stopAutoplay() {
  if (!interval) return
  clearInterval(interval)
  interval = null
}

function pauseAutoplay() {
  isPaused = true
  stopAutoplay()
}

function resumeAutoplay() {
  isPaused = false
  startAutoplay()
}

watch(
  () => projects.value.length,
  (length) => {
    if (currentSlide.value >= length) {
      currentSlide.value = 0
    }
    stopAutoplay()
    if (length > 1) {
      startAutoplay()
    }
  },
)

onMounted(() => {
  store.fetchProjects({ per_page: 10, status: 'Published' }).catch((error) => {
    console.error('Failed to fetch homepage projects:', error)
  })
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>
