<template>
  <section :dir="direction" class="relative py-20 lg:py-32 overflow-hidden bg-white">
    <!-- Decorative elements -->
    <div class="absolute top-1/2 left-0 w-72 h-72 bg-comma-secondary/5 rounded-full blur-3xl pointer-events-none -z-0"></div>

    <div class="container mx-auto px-4 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="mb-16 max-w-3xl">
        <span class="text-sm font-semibold tracking-widest text-comma-primary uppercase">{{ $t('emiratisation_initiatives_label') }}</span>
        <h2 class="text-3xl lg:text-4xl font-bold text-comma-neutral-900 mt-3 mb-6">
          {{ $t('emiratisation_initiatives_title') }}
        </h2>
        <p class="text-lg text-comma-neutral-600 leading-relaxed">
          {{ $t('emiratisation_initiatives_description') }}
        </p>
      </div>

      <!-- Highlights Grid (static) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div 
          v-for="(highlight, index) in highlights" 
          :key="index"
          class="p-6 rounded-lg border border-comma-border-subtle hover:border-comma-primary/40 hover:bg-comma-primary/2 transition-all duration-300 group cursor-pointer"
        >
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-comma-primary/10 group-hover:bg-comma-primary/20 transition-all duration-300">
                <Icon :name="highlight.icon" class="w-5 h-5 text-comma-primary" />
              </div>
            </div>
            <h3 class="text-sm font-semibold text-comma-neutral-900 group-hover:text-comma-primary transition-colors duration-300">
              {{ $t(highlight.title) }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Gallery Section -->
      <div class="mt-16">
        <h3 class="text-2xl font-bold text-comma-neutral-900 mb-8">
          {{ $t('emiratisation_initiatives_gallery') }}
        </h3>

        <!-- Loading -->
        <div v-if="store.loading" class="text-center py-16">
          <Icon name="mdi:loading" class="w-12 h-12 text-comma-primary animate-spin mx-auto" />
        </div>

        <!-- Magazine Grid -->
        <div v-else-if="sortedMoments.length > 0" class="magazine-grid">
          <div
            v-for="(moment, idx) in sortedMoments"
            :key="moment.emiratisation_moments_id"
            :class="['magazine-item', getItemClass(idx)]"
            @click="openMedia(moment)"
          >
            <!-- Media -->
            <div class="relative w-full h-full overflow-hidden group cursor-pointer">
              <img 
                v-if="!isVideo(moment.media)"
                :src="moment.media"
                :alt="moment.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                @error="handleImageError"
              />
              <video 
                v-else
                :src="moment.media"
                class="w-full h-full object-cover"
                muted
                preload="metadata"
              ></video>
              <!-- Overlay on hover -->
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <Icon name="heroicons:arrows-pointing-out" class="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <!-- Title overlay (optional) -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p class="text-white text-sm font-semibold line-clamp-2">{{ moment.title }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16 bg-comma-surface-elevated rounded-xl">
          <Icon name="mdi:image-off" class="w-16 h-16 text-comma-neutral-400 mx-auto mb-4" />
          <p class="text-comma-neutral-600">{{ $t('emiratisation_initiatives_no_moments') }}</p>
        </div>
      </div>
    </div>

    <!-- Media Modal -->
    <UModal v-model="showModal" :ui="{ width: 'max-w-5xl' }">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-display font-semibold">{{ selectedMoment?.title }}</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="showModal = false" />
          </div>
        </template>
        <div class="flex justify-center">
          <img 
            v-if="selectedMoment && !isVideo(selectedMoment.media)"
            :src="selectedMoment.media" 
            :alt="selectedMoment.title"
            class="max-w-full max-h-[70vh] object-contain rounded"
          />
          <video 
            v-else-if="selectedMoment && isVideo(selectedMoment.media)"
            :src="selectedMoment.media"
            controls
            autoplay
            class="max-w-full max-h-[70vh] rounded"
          ></video>
        </div>
        <p v-if="selectedMoment?.description" class="mt-4 text-comma-neutral-700">{{ selectedMoment.description }}</p>
      </UCard>
    </UModal>
  </section>
</template>

<script setup lang="ts">
import { useMomentsStore } from '~/store/moments'
import type { Moment } from '~/types/moment'

const { locale, t } = useI18n()
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')

const store = useMomentsStore()
const { moments, loading } = storeToRefs(store)

// Static highlights
const highlights = [
  { icon: 'heroicons:academic-cap', title: 'emiratisation_initiative_1' },
  { icon: 'heroicons:briefcase', title: 'emiratisation_initiative_2' },
  { icon: 'heroicons:users', title: 'emiratisation_initiative_3' },
  { icon: 'heroicons:trophy', title: 'emiratisation_initiative_4' }
]

// Modal state
const showModal = ref(false)
const selectedMoment = ref<Moment | null>(null)

// Fetch moments on mount
onMounted(() => {
  store.fetchMoments({ per_page: 12 }) // fetch more for magazine layout
})

// Sort moments by created_at descending (newest first)
const sortedMoments = computed(() => {
  return [...moments.value].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
})

// Helper to check if media is video
function isVideo(url: string): boolean {
  if (!url) return false
  const ext = url.split('.').pop()?.toLowerCase()
  return ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(ext || '')
}

// Handle image error
function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = '/images/placeholder.jpg'
}

// Open modal
function openMedia(moment: Moment) {
  selectedMoment.value = moment
  showModal.value = true
}

// Magazine grid item classes based on index
function getItemClass(index: number): string {
  // First item (index 0) -> hero, spans 2 columns and 2 rows
  if (index === 0) return 'item-hero'
  // Second item (index 1) -> wide, spans 2 columns
  if (index === 1) return 'item-wide'
  // Third item (index 2) -> tall, spans 2 rows
  if (index === 2) return 'item-tall'
  // Fourth item (index 3) -> regular
  // Fifth item (index 4) -> regular
  // Sixth item (index 5) -> wide
  if (index === 5) return 'item-wide'
  // Default
  return ''
}
</script>

<style scoped>
.magazine-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(220px, auto);
  gap: 1rem;
}

.magazine-item {
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: #f5f3f2;
  cursor: pointer;
}

/* Item spans */
.item-hero {
  grid-column: span 2;
  grid-row: span 2;
}

.item-wide {
  grid-column: span 2;
}

.item-tall {
  grid-row: span 2;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .magazine-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .item-hero {
    grid-column: span 2;
    grid-row: span 1;
  }
  
  .item-wide {
    grid-column: span 2;
  }
  
  .item-tall {
    grid-row: span 1;
  }
}

@media (max-width: 640px) {
  .magazine-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .item-hero,
  .item-wide,
  .item-tall {
    grid-column: span 1;
    grid-row: span 1;
  }
}

/* Ensure images cover their containers */
.magazine-item img,
.magazine-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Hover overlay */
.magazine-item .absolute {
  pointer-events: none;
}
</style>