<template>
  <section :dir="direction" class="relative py-20 lg:py-32 overflow-hidden bg-comma-neutral-50">
    <!-- Decorative elements -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-comma-primary/8 rounded-full blur-3xl pointer-events-none -z-0"></div>

    <div class="container mx-auto px-4 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="mb-12 max-w-2xl">
        <span class="text-sm font-semibold tracking-widest text-comma-primary uppercase">{{ $t('home.emiratisation.label') }}</span>
        <h2 class="text-3xl lg:text-4xl font-bold text-comma-neutral-900 mt-3 mb-4">
          {{ $t('home.emiratisation.title') }}
        </h2>
        <p class="text-lg text-comma-neutral-600">
          {{ $t('home.emiratisation.intro') }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="store.loading" class="text-center py-16">
        <Icon name="mdi:loading" class="w-12 h-12 text-comma-primary animate-spin mx-auto" />
      </div>

      <!-- Team Members Grid -->
      <div v-else-if="displayTalents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="talent in displayTalents" 
          :key="talent.talent_id"
          class="group relative rounded-xl overflow-hidden bg-white border border-comma-border-subtle hover:border-comma-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full"
        >
          <!-- Image - Portrait orientation (aspect ratio 3:4) -->
          <div class="relative aspect-[3/4] overflow-hidden bg-comma-neutral-200 flex-shrink-0">
            <img 
              :src="talent.image || FALLBACK_IMAGE" 
              :alt="talent.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              @error="handleImageError"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          </div>

          <!-- Content -->
          <div class="p-5 flex flex-col flex-1">
            <!-- Name -->
            <h3 class="text-lg font-bold text-comma-neutral-900 line-clamp-1 min-h-[28px]">
              {{ talent.name }}
            </h3>

            <!-- Title/Role -->
            <p class="text-sm font-semibold text-comma-primary mt-0.5 min-h-[20px]">
              {{ talent.title }}
            </p>

            <!-- Description (if available) -->
            <p v-if="talent.description" class="text-sm text-comma-neutral-600 leading-relaxed mt-3 line-clamp-3 flex-1">
              {{ talent.description }}
            </p>
            <div v-else class="flex-1"></div>

            <!-- Contact Buttons -->
            <div class="flex gap-2 pt-4 mt-auto border-t border-comma-border-subtle">
              <!-- Profile Link (if URL exists) -->
              <a 
                v-if="talent.url"
                :href="talent.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 py-2 px-2 rounded-lg bg-comma-primary/10 hover:bg-comma-primary/20 transition-all duration-300 flex items-center justify-center gap-1 group"
                :title="$t('home.emiratisation.view_profile')"
              >
                <Icon name="heroicons:link" class="w-4 h-4 text-comma-primary" />
                <span class="text-xs font-medium text-comma-primary hidden sm:inline">{{ $t('home.emiratisation.profile') }}</span>
              </a>
              <!-- Email Button -->
              <a 
                v-if="talent.email"
                :href="`mailto:${talent.email}`"
                class="flex-1 py-2 px-2 rounded-lg bg-comma-neutral-100 hover:bg-comma-neutral-200 transition-all duration-300 flex items-center justify-center gap-1"
                :title="$t('home.emiratisation.send_email')"
              >
                <Icon name="heroicons:envelope" class="w-4 h-4 text-comma-neutral-600" />
                <span class="text-xs font-medium text-comma-neutral-600 hidden sm:inline">{{ $t('home.emiratisation.email') }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 bg-white rounded-2xl shadow-card">
        <Icon name="mdi:account-group" class="w-16 h-16 text-comma-neutral-300 mx-auto mb-4" />
        <p class="text-comma-neutral-600">{{ $t('home.emiratisation.no_talents') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTalentsStore } from '~/store/talents'
import { storeToRefs } from 'pinia'

const { locale, t } = useI18n()
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')

const store = useTalentsStore()
const { talents, loading } = storeToRefs(store)

// Fallback image (portrait placeholder)
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&h=533'

// Fetch talents on mount
onMounted(() => {
  store.fetchTalents({ per_page: 6 })
})

// Map talents with localized fields
const displayTalents = computed(() => {
  return talents.value.map(t => ({
    talent_id: t.talent_id,
    name: locale.value === 'ar' ? t.name_ar : t.name_en,
    title: locale.value === 'ar' ? t.title_ar : t.title_en,
    description: locale.value === 'ar' ? (t as any).desc_ar : (t as any).desc_en,
    image: t.image,
    email: t.email,
    url: t.url,
  }))
})

// Handle image error
function handleImageError(event: Event) {
  (event.target as HTMLImageElement).src = FALLBACK_IMAGE
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>