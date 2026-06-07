<template>
  <section class="bg-comma-neutral-50 py-12 lg:py-16" :dir="direction">
    <div class="container px-4 lg:px-8">
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="mb-2 text-sm font-semibold uppercase tracking-wide text-comma-primary">
            {{ $t('nav.projects') || 'Projects' }}
          </p>
          <h2 class="font-display text-3xl font-bold text-comma-neutral-900 lg:text-4xl">
            {{ $t('projects_page.hero_title') || 'Our Projects' }}
          </h2>
        </div>
        <NuxtLink
          :to="localePath('/projects')"
          class="inline-flex items-center gap-2 font-semibold text-comma-primary transition hover:text-comma-primary-dark"
        >
          {{ $t('properties_section.view_all') || 'View All' }}
          <Icon name="mdi:arrow-right" class="h-5 w-5" />
        </NuxtLink>
      </div>

      <div v-if="store.loading && !projects.length" class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div v-for="item in 3" :key="item" class="h-96 animate-pulse rounded-2xl bg-white"></div>
      </div>

      <div v-else-if="projects.length" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProjectCard v-for="project in projects" :key="project.project_id" :project="project" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useProjectsStore } from '~/store/projects'

const { locale } = useI18n()
const localePath = useLocalePath()
const direction = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))
const store = useProjectsStore()
const projects = computed(() =>
  store.projects
    .filter((project) => !project.status || String(project.status).toLowerCase() === 'published')
    .slice(0, 3),
)

onMounted(() => {
  store.fetchProjects({ per_page: 3, status: 'Published' }).catch((error) => {
    console.error('Failed to fetch homepage projects:', error)
  })
})
</script>
