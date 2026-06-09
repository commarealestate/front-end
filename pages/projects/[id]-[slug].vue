<template>
    <div v-if="project" class="min-h-screen bg-comma-neutral-50" :dir="direction">
        <!-- Lead-first hero -->
        <section
            class="relative min-h-screen flex items-center overflow-hidden bg-cover bg-center bg-fixed py-28 lg:py-32"
            :style="{ backgroundImage: `url(${heroImage})` }">
            <div class="absolute inset-0 bg-black/50"></div>
            <div class="container relative z-10 mx-auto px-4">
                <div class="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
                    <div class="max-w-4xl animate-fade-in-up text-white">
                        <div v-if="projectBadge" class="mb-4 inline-block">
                            <span class="rounded-full bg-comma-primary px-3 py-1 text-sm font-semibold text-white">
                                {{ projectBadge }}
                            </span>
                        </div>
                        <h1 class="mb-4 font-display text-4xl font-bold md:text-5xl lg:text-6xl">
                            {{ projectTitle }}
                        </h1>
                        <div
                            class="prose prose-invert max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl"
                            v-html="projectDescription"
                        />
                    </div>

                    <div class="rounded-xl bg-white p-5 shadow-2xl lg:p-6">
                        <h2 class="mb-4 font-display text-2xl font-bold text-comma-neutral-900">
                            {{ $t('contact_page.form_title') || 'Send Inquiry' }}
                        </h2>
                        <ProjectLeadForm :project="project" />
                    </div>
                </div>
            </div>
        </section>

        <!-- Sections and Gallery -->
        <div class="bg-white">
            <!-- First Section (if exists) -->
            <section v-if="firstSection" class="relative overflow-hidden">
                <div class="container mx-auto px-4 py-16 lg:py-24">
                    <div class="max-w-3xl mx-auto text-center">
                        <h2 class="text-3xl md:text-4xl font-display font-bold text-comma-neutral-900 mb-4">
                            {{ firstSectionTitle }}
                        </h2>
                        <div
                            class="prose prose-lg max-w-none text-comma-neutral-600"
                            v-html="firstSectionDescription"
                        />
                    </div>
                </div>
                <div class="w-full h-[500px] lg:h-[600px] overflow-hidden">
                    <img :src="firstSection.image" :alt="firstSectionTitle" class="w-full h-full object-cover" />
                </div>
            </section>

            <!-- Gallery Section (Responsive Grid with Lightbox) -->
            <section v-if="project.gallery && project.gallery.length" class="py-16 lg:py-24 bg-comma-neutral-50">
                <div class="container mx-auto px-4">
                   <Swiper :modules="[Navigation, Pagination, Autoplay]" :slides-per-view="1" :space-between="20"
                        :loop="true" :navigation="true" :pagination="{ clickable: true }" :autoplay="{ delay: 3000 }"
                        :breakpoints="{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 }
                        }" class="gallery-swiper">
                        <SwiperSlide v-for="img in project.gallery" :key="img.id">
                            <div class="aspect-[9/16] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition group max-w-[320px] mx-auto"
                                @click="openLightbox(img.image)">
                                <img :src="img.image" :alt="`Gallery image ${img.id}`"
                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </section>

            <!-- Second Section (if exists) -->
            <section v-if="secondSection" class="relative overflow-hidden">
                <div class="container mx-auto px-4 py-16 lg:py-24">
                    <div class="max-w-3xl mx-auto text-center">
                        <h2 class="text-3xl md:text-4xl font-display font-bold text-comma-neutral-900 mb-4">
                            {{ secondSectionTitle }}
                        </h2>
                        <div
                            class="prose prose-lg max-w-none text-comma-neutral-600"
                            v-html="secondSectionDescription"
                        />
                    </div>
                </div>
                <div class="w-full h-[500px] lg:h-[600px] overflow-hidden">
                    <img :src="secondSection.image" :alt="secondSectionTitle" class="w-full h-full object-cover" />
                </div>
            </section>

            <!-- Details Tabs Section -->
            <section v-if="project.details && project.details.length" class="py-16 lg:py-24 bg-white">
                <div class="container mx-auto px-4">
                    <!-- Tabs -->
                    <div class="flex flex-wrap justify-center gap-2 mb-10 border-b border-comma-border-subtle">
                        <button v-for="detail in project.details" :key="detail.details_id"
                            @click="activeTab = detail.details_id" :class="[
                                'px-6 py-3 font-medium rounded-t-lg transition-all',
                                activeTab === detail.details_id
                                    ? 'bg-comma-primary text-white shadow-md'
                                    : 'text-comma-neutral-600 hover:text-comma-primary hover:bg-comma-primary/5'
                            ]">
                            {{ locale === 'ar' ? detail.title_ar : detail.title_en }}
                        </button>
                    </div>

                    <!-- Tab Content -->
                    <div v-for="detail in project.details" v-show="activeTab === detail.details_id"
                        :key="detail.details_id" class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <!-- Left Column: Content -->
                        <div>
                            <h3 class="text-2xl font-bold text-comma-neutral-900 mb-3">
                                {{ locale === 'ar' ? detail.title_ar : detail.title_en }}
                            </h3>
                            <div
                                class="prose max-w-none text-comma-neutral-600 leading-relaxed mb-6"
                                v-html="locale === 'ar' ? detail.description_ar : detail.description_en"
                            />
                            <div v-if="detail.items && detail.items.length" class="space-y-3">
                                <h4 class="text-lg font-semibold text-comma-neutral-800">
                                    {{ $t('projects_page.highlights') || 'Highlights' }}
                                </h4>
                                <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <li v-for="item in detail.items" :key="item.item_id" class="flex items-start gap-2">
                                        <Icon name="mdi:check-circle"
                                            class="w-5 h-5 text-comma-primary flex-shrink-0 mt-0.5" />
                                        <span class="text-comma-neutral-700">{{ locale === 'ar' ? item.item_ar :
                                            item.item_en }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- Right Column: Image -->
                        <div class="rounded-2xl overflow-hidden shadow-xl h-[420px] lg:h-[500px]">
                            <img :src="detail.image" :alt="detail.title_en" class="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Lightbox Modal for Gallery -->
        <Teleport to="body">
            <div v-if="lightboxOpen" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                @click="closeLightbox">
                <div class="relative max-w-7xl w-full h-full p-4 flex items-center justify-center" @click.stop>
                    <button @click="closeLightbox"
                        class="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition z-10">
                        <Icon name="mdi:close" class="w-6 h-6" />
                    </button>
                    <img :src="lightboxImage" class="max-h-[90vh] max-w-[90vw] object-contain" />
                </div>
            </div>
        </Teleport>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="min-h-screen flex items-center justify-center bg-comma-neutral-50">
        <div class="text-center">
            <Icon name="mdi:loading" class="w-16 h-16 text-comma-primary animate-spin mx-auto mb-4" />
            <p class="text-comma-neutral-600">{{ $t('common.loading') || 'Loading...' }}</p>
        </div>
    </div>

    <!-- 404 Not Found -->
    <div v-else-if="notFound" class="min-h-screen flex items-center justify-center bg-comma-neutral-50">
        <div class="text-center px-6">
            <div class="w-24 h-24 rounded-full bg-comma-primary/10 flex items-center justify-center mx-auto mb-6">
                <Icon name="mdi:office-building" class="w-12 h-12 text-comma-primary" />
            </div>
            <h1 class="text-2xl font-bold text-comma-neutral-900 mb-4">{{ $t('projects_page.not_found')}}</h1>
            <p class="text-comma-neutral-600 mb-8">{{ $t('projects_page.not_found_description') }}</p>
            <NuxtLink to="/projects"
                class="inline-flex items-center gap-2 px-8 py-3 bg-comma-primary text-white font-semibold rounded-lg hover:bg-comma-primary-dark transition">
                <Icon name="mdi:arrow-left" class="w-5 h-5" />
                {{ $t('projects_page.back_to_projects') || 'Back to Projects' }}
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useProjectsStore } from '~/store/projects'
import type { Project } from '~/types/project'
import { stripHtml } from '~/utils/stripHtml'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const route = useRoute()
const { locale } = useI18n()
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const store = useProjectsStore()

// Extract ID from slug (e.g., "2-yas-riva-residences")
const fullParam = route.params.id as string
const projectId = Number(fullParam.split('-')[0])

const project = ref<Project | null>(null)
const loading = ref(true)
const notFound = ref(false)
const activeTab = ref<number | null>(null)
const lightboxOpen = ref(false)
const lightboxImage = ref('')

// Computed: Hero data
const heroImage = computed(() => project.value?.cover_image?.[0] || '')
const projectTitle = computed(() => {
    if (!project.value) return ''
    return locale.value === 'ar' ? project.value.title_ar : project.value.title_en
})
const projectDescription = computed(() => {
    if (!project.value) return ''
    return locale.value === 'ar' ? project.value.description_ar : project.value.description_en
})
const projectBadge = computed(() => {
    if (!project.value) return ''
    return locale.value === 'ar' ? project.value.badge_ar : project.value.badge_en
})

// Sections: first and second (if multiple sections exist)
const sections = computed(() => project.value?.sections || [])
const firstSection = computed(() => sections.value[0] || null)
const firstSectionTitle = computed(() => {
    if (!firstSection.value) return ''
    return locale.value === 'ar' ? firstSection.value.title_ar : firstSection.value.title_en
})
const firstSectionDescription = computed(() => {
    if (!firstSection.value) return ''
    return locale.value === 'ar' ? firstSection.value.description_ar : firstSection.value.description_en
})

const secondSection = computed(() => sections.value[1] || null)
const secondSectionTitle = computed(() => {
    if (!secondSection.value) return ''
    return locale.value === 'ar' ? secondSection.value.title_ar : secondSection.value.title_en
})
const secondSectionDescription = computed(() => {
    if (!secondSection.value) return ''
    return locale.value === 'ar' ? secondSection.value.description_ar : secondSection.value.description_en
})

// Set first detail as active tab on load
watch(project, (newProject) => {
    if (newProject?.details?.length && activeTab.value === null) {
        activeTab.value = newProject.details[0].details_id
    }
}, { immediate: true })

// Lightbox functions
function openLightbox(imageUrl: string) {
    lightboxImage.value = imageUrl
    lightboxOpen.value = true
}
function closeLightbox() {
    lightboxOpen.value = false
    lightboxImage.value = ''
}

// Fetch project data
async function fetchProject() {
    loading.value = true
    notFound.value = false
    try {
        const fetched = await store.fetchProjectById(projectId)
        if (fetched) {
            project.value = fetched
        } else {
            notFound.value = true
        }
    } catch (error) {
        console.error('Error fetching project:', error)
        notFound.value = true
    } finally {
        loading.value = false
    }
}

// SEO
useHead(() => {
    if (!project.value) return {}
    return {
        title: `${projectTitle.value} | Comma Real Estate`,
        meta: [
            { name: 'description', content: stripHtml(projectDescription.value).slice(0, 160) }
        ]
    }
})

onMounted(() => {
    fetchProject()
})
</script>

<style scoped>
.animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
