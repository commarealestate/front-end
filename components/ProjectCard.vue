<template>
    <div
        class="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-500 hover:-translate-y-1 border border-comma-border-subtle flex flex-col h-full">
        <NuxtLink :to="`/projects/${project.project_id}-${project.slug}`"
            class="block relative h-64 overflow-hidden bg-comma-neutral-200 flex-shrink-0">
            <img :src="coverImage" :alt="projectTitle"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                @error="handleImageError" />
            <!-- Badge -->
            <div v-if="projectBadge" class="absolute top-3 left-3">
                <span class="px-2.5 py-1 bg-comma-primary text-white text-xs font-semibold rounded-full shadow-md">
                    {{ projectBadge }}
                </span>
            </div>
            <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            </div>
        </NuxtLink>

        <div class="p-5 flex-1 flex flex-col">
            <h3
                class="text-xl font-bold text-comma-neutral-900 line-clamp-2 mb-2 group-hover:text-comma-primary transition-colors">
                {{ projectTitle }}
            </h3>
            <p class="text-comma-neutral-600 text-sm line-clamp-3 mb-4">
                {{ projectDescription }}
            </p>
            <div class="mt-auto pt-4">
                <NuxtLink :to="`/projects/${project.project_id}-${project.slug}`"
                    class="inline-flex items-center gap-2 text-comma-primary font-medium hover:gap-3 transition-all">
                    {{ $t('projects_page.view_details') || 'View Details' }}
                    <Icon name="mdi:arrow-right" class="w-4 h-4" />
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Project } from '~/types/project'

const props = defineProps<{
    project: Project
}>()

const { locale } = useI18n()

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&fit=crop'

const projectTitle = computed(() => {
    return locale.value === 'ar' ? props.project.title_ar : props.project.title_en
})

const projectDescription = computed(() => {
    return locale.value === 'ar' ? props.project.description_ar : props.project.description_en
})

const projectBadge = computed(() => {
    return locale.value === 'ar' ? props.project.badge_ar : props.project.badge_en
})

const coverImage = computed(() => {
    return props.project.cover_image?.[0] || FALLBACK_IMAGE
})

function handleImageError(event: Event) {
    (event.target as HTMLImageElement).src = FALLBACK_IMAGE
}
</script>