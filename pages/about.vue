<template>
  <div class="min-h-screen bg-comma-neutral-50" :dir="direction">
    <!-- Hero Section with Parallax Image -->
    <section class="relative py-20 lg:py-28 overflow-hidden">
      <!-- Background Image with Parallax -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-cover bg-center bg-fixed scale-110"
          :style="{ backgroundImage: `url('/images/about-hero.jpg')` }"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-comma-primary/80 to-comma-primary-dark/90"></div>
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern"></div>
        </div>
      </div>

      <div class="container relative z-10 px-4 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight font-display"
            v-motion-fade-visible :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }">
            {{ $t('about_page.title') }}
          </h1>
          <p class="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto" v-motion-fade-visible
            :initial="{ opacity: 0, y: 50 }" :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 200 } }">
            {{ $t('about_page.subtitle') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Philosophy Section with Floating Image -->
    <section class="py-12 lg:py-20" ref="philosophySection">
      <div class="container px-4 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div
            class="bg-white rounded-3xl shadow-card p-8 lg:p-12 border border-comma-border-subtle relative overflow-hidden">
            <!-- Decorative background image -->
            <div class="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
              <img src="/images/comma-symbol.png" alt="" class="w-full h-full object-contain" />
            </div>
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 rounded-full bg-comma-primary/10 flex items-center justify-center">
                  <Icon name="mdi:thought-bubble" class="w-6 h-6 text-comma-primary" />
                </div>
                <h2 class="text-2xl lg:text-3xl font-bold text-comma-neutral-900 font-display">
                  {{ $t('about_page.philosophy_title') }}
                </h2>
              </div>
              <div class="prose prose-lg max-w-none" :class="{ 'prose-rtl': direction === 'rtl' }">
                <blockquote class="text-comma-primary text-xl  border-l-4 border-comma-secondary pl-6 my-6">
                  {{ $t('about_page.philosophy_quote') }}
                </blockquote>
                <p class="text-comma-neutral-700 leading-relaxed">
                  {{ $t('about_page.philosophy_description') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Who We Are with Image Split -->
    <section class="pb-12 lg:pb-20" ref="whoWeAreSection">
      <div class="container px-4 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-8 items-center">
            <div class="order-2 lg:order-1">
              <div class="bg-white rounded-3xl shadow-card p-8 lg:p-12 border border-comma-border-subtle">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-12 h-12 rounded-full bg-comma-primary/10 flex items-center justify-center">
                    <Icon name="mdi:office-building" class="w-6 h-6 text-comma-primary" />
                  </div>
                  <h2 class="text-2xl lg:text-3xl font-bold text-comma-neutral-900 font-display">
                    {{ $t('about_page.who_we_are_title') }}
                  </h2>
                </div>
                <div class="prose prose-lg max-w-none" :class="{ 'prose-rtl': direction === 'rtl' }">
                  <p class="text-comma-neutral-700 leading-relaxed">
                    {{ $t('about_page.who_we_are_description') }}
                  </p>
                </div>
              </div>
            </div>
            <div class="order-1 lg:order-2">
              <div class="relative h-80 lg:h-96 rounded-3xl overflow-hidden shadow-luxury">
                <img src="/images/whoWeAre.jpg" alt="Comma Real Estate Team" class="w-full h-full object-cover" v-motion
                  :initial="{ scale: 1 }"
                  :enter="{ scale: 1.05, transition: { duration: 10000, repeat: Infinity, repeatType: 'mirror' } }" />
                <div class="absolute inset-0 bg-gradient-to-t from-comma-primary/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section (no image, but could add subtle pattern) -->
    <section class="pb-12 lg:pb-20" ref="servicesSection">
      <div class="container px-4 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-2xl lg:text-3xl font-bold text-comma-neutral-900 font-display mb-4">
              {{ $t('about_page.services_title') }}
            </h2>
            <p class="text-comma-neutral-600 max-w-2xl mx-auto">
              {{ $t('about_page.services_subtitle') }}
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(service, index) in services" :key="service.key"
              class="bg-white rounded-2xl shadow-card p-6 hover:shadow-hover transition-all duration-500 hover:-translate-y-1 border border-comma-border-subtle"
              v-motion :initial="{ opacity: 0, y: 50 }"
              :enter="{ opacity: 1, y: 0, transition: { delay: index * 100 } }" :visible-once="true">
              <div class="w-12 h-12 rounded-full bg-comma-primary/10 flex items-center justify-center mb-4">
                <Icon :name="service.icon" class="w-6 h-6 text-comma-primary" />
              </div>
              <h3 class="text-xl font-bold text-comma-neutral-900 mb-3 font-display">
                {{ $t(`about_page.services.${service.key}.title`) }}
              </h3>
              <p class="text-comma-neutral-600 text-sm leading-relaxed">
                {{ $t(`about_page.services.${service.key}.description`) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Approach with Parallax Background -->
    <section class="pt-24 pb-16 mb-6 lg:pt-32 lg:pb-24 relative overflow-hidden flex items-start min-h-[650px] lg:min-h-[750px]" ref="approachSection">
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-cover bg-center bg-fixed"
          :style="{ backgroundImage: `url('/images/approach.jpg')` }"></div>
        <div class="absolute inset-0 bg-comma-primary/10 backdrop-blur-sm"></div>
      </div>
      <div class="container relative z-10 px-4 lg:px-8">
        <div class="max-w-4xl mx-auto mt-6 lg:mt-12">
          <div
            class="bg-white/95 backdrop-blur-sm rounded-b-3xl shadow-card p-8 lg:p-12 border border-comma-border-subtle">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-full bg-comma-primary/10 flex items-center justify-center">
                <Icon name="mdi:compass" class="w-6 h-6 text-comma-primary" />
              </div>
              <h2 class="text-2xl lg:text-3xl font-bold text-comma-neutral-900 font-display">
                {{ $t('about_page.approach_title') }}
              </h2>
            </div>
            <div class="prose prose-lg max-w-none" :class="{ 'prose-rtl': direction === 'rtl' }">
              <p class="text-comma-neutral-700 leading-relaxed">
                {{ $t('about_page.approach_description') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- National Talent with Image -->
    <section class="pb-12 lg:pb-20" ref="talentSection">
      <div class="container px-4 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-8 items-center">
            <div class="order-2 lg:order-2">
              <div class="bg-white rounded-3xl shadow-card p-8 lg:p-12 border border-comma-border-subtle">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-12 h-12 rounded-full bg-comma-primary/10 flex items-center justify-center">
                    <Icon name="mdi:account-group" class="w-6 h-6 text-comma-primary" />
                  </div>
                  <h2 class="text-2xl lg:text-3xl font-bold text-comma-neutral-900 font-display">
                    {{ $t('about_page.talent_title') }}
                  </h2>
                </div>
                <div class="prose prose-lg max-w-none" :class="{ 'prose-rtl': direction === 'rtl' }">
                  <p class="text-comma-neutral-700 leading-relaxed">
                    {{ $t('about_page.talent_description') }}
                  </p>
                  <ul class="list-disc pl-5 mt-4 space-y-1 text-comma-neutral-700">
                    <li>{{ $t('about_page.talent_points.deep_understanding') }}</li>
                    <li>{{ $t('about_page.talent_points.ethics') }}</li>
                    <li>{{ $t('about_page.talent_points.analytical') }}</li>
                    <li>{{ $t('about_page.talent_points.hands_on') }}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="order-1 lg:order-1">
              <div class="relative h-80 lg:h-96 rounded-3xl overflow-hidden shadow-luxury">
                <img src="/images/talent.jpg" alt="Emirati Talent" class="w-full h-full object-cover" v-motion
                  :initial="{ scale: 1 }"
                  :enter="{ scale: 1.05, transition: { duration: 10000, repeat: Infinity, repeatType: 'mirror' } }" />
                <div class="absolute inset-0 bg-gradient-to-t from-comma-primary/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Who We Serve with Image -->
    <section class="pb-12 lg:pb-20" ref="serveSection">
      <div class="container px-4 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-8 items-center">
            <div class="order-2 lg:order-1">
              <div class="bg-white rounded-3xl shadow-card p-8 lg:p-12 border border-comma-border-subtle">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-12 h-12 rounded-full bg-comma-primary/10 flex items-center justify-center">
                    <Icon name="mdi:handshake" class="w-6 h-6 text-comma-primary" />
                  </div>
                  <h2 class="text-2xl lg:text-3xl font-bold text-comma-neutral-900 font-display">
                    {{ $t('about_page.who_we_serve_title') }}
                  </h2>
                </div>
                <div class="prose prose-lg max-w-none" :class="{ 'prose-rtl': direction === 'rtl' }">
                  <p class="text-comma-neutral-700 leading-relaxed">
                    {{ $t('about_page.who_we_serve_description') }}
                  </p>
                </div>
              </div>
            </div>
            <div class="order-1 lg:order-2">
              <div class="relative h-80 lg:h-96 rounded-3xl overflow-hidden shadow-luxury">
                <img src="/images/clients.jpg" alt="Our Clients" class="w-full h-full object-cover" v-motion
                  :initial="{ scale: 1 }"
                  :enter="{ scale: 1.05, transition: { duration: 10000, repeat: Infinity, repeatType: 'mirror' } }" />
                <div class="absolute inset-0 bg-gradient-to-t from-comma-primary/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision, Mission, Values with Background Pattern -->
    <section class="pb-12 lg:pb-20" ref="vmvSection">
      <div class="container px-4 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-2xl lg:text-3xl font-bold text-comma-neutral-900 font-display mb-4">
              {{ $t('about_page.vmv_title') }}
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(item, index) in vmvItems" :key="item.key"
              class="bg-white rounded-2xl shadow-card p-6 hover:shadow-hover transition-all duration-500 hover:-translate-y-1 border border-comma-border-subtle relative overflow-hidden"
              v-motion :initial="{ opacity: 0, y: 50 }"
              :enter="{ opacity: 1, y: 0, transition: { delay: index * 100 } }" :visible-once="true">
              <div class="relative z-10">
                <div class="w-12 h-12 rounded-full bg-comma-primary/10 flex items-center justify-center mb-4">
                  <Icon :name="item.icon" class="w-6 h-6 text-comma-primary" />
                </div>
                <h3 class="text-xl font-bold text-comma-neutral-900 mb-3 font-display">{{ $t(`${item.title}`) }}</h3>
                <p v-if="item.key === 'values'" class="text-comma-neutral-600 text-sm leading-relaxed">
                  <span v-for="value in values" :key="value.key" class="block mb-2">
                    • {{ $t(`about_page.values.${value.key}`) }}
                  </span>
                </p>
                <p v-else class="text-comma-neutral-600 text-sm leading-relaxed">
                  {{ $t(`${item.description}`) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Closing Statement with Parallax Background -->
    <section class="py-24 lg:py-32 min-h-[500px] flex items-center relative overflow-hidden" ref="closingSection">
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-cover bg-center bg-fixed"
          :style="{ backgroundImage: `url('/images/closing-bg.jpg')` }"></div>
        <div class="absolute inset-0 bg-comma-primary/70"></div>
      </div>
      <div class="container relative z-10 px-4 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="text-center text-white">
            <Icon name="mdi:format-quote-open" class="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p class="text-xl lg:text-2xl  leading-relaxed mb-6" v-motion :initial="{ opacity: 0, scale: 0.9 }"
              :enter="{ opacity: 1, scale: 1, transition: { duration: 800 } }" :visible-once="true">
              {{ $t('about_page.closing') }}
            </p>
            <Icon name="mdi:format-quote-open" class="w-16 h-16 mx-auto mb-4 opacity-50" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useMotion } from '@vueuse/motion'

const { locale } = useI18n()
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')

useHead({
  title: 'About Comma Real Estate | UAE Real Estate Brokerage',
  meta: [
    { name: 'description', content: 'Learn about Comma Real Estate, a UAE-based brokerage and advisory firm committed to thoughtful decisions, local expertise, and long-term value.' }
  ]
})

const services = [
  { key: 'brokerage', icon: 'mdi:handshake' },
  { key: 'developer_sales', icon: 'mdi:office-building-marker' },
  { key: 'resales', icon: 'mdi:swap-horizontal' },
  { key: 'property_management', icon: 'mdi:home-group' },
  { key: 'advisory', icon: 'mdi:chart-line' }
]

const values = [
  { key: 'trust' },
  { key: 'clarity' },
  { key: 'local_insight' },
  { key: 'responsibility' },
  { key: 'sustainability' }
]

const vmvItems = [
  { key: 'vision', icon: 'mdi:eye', title: 'about_page.vision_title', description: 'about_page.vision_description', iconBg: '/images/vision-bg.jpg' },
  { key: 'mission', icon: 'mdi:bullseye', title: 'about_page.mission_title', description: 'about_page.mission_description', iconBg: '/images/mission-bg.jpg' },
  { key: 'values', icon: 'mdi:star', title: 'about_page.values_title', description: '', iconBg: '/images/values-bg.jpg' }
]
</script>

<style scoped>
.bg-grid-pattern {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white' stroke-opacity='0.1'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

.prose {
  color: #292524;
  max-width: 100% !important;
  font-size: 1.125rem;
  line-height: 1.75;
}

.prose :deep(blockquote) {
  border-left: 4px solid #D4A346;
  padding-left: 1.5rem;
  margin-left: 0;
  margin-right: 0;
  /* font-style: italic; */
  color: #57534E;
  background: #FAF9F8;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-top: 1em;
  margin-bottom: 1em;
}

.prose-rtl :deep(blockquote) {
  border-right: 4px solid #D4A346;
  border-left: none;
  padding-right: 1.5rem;
  padding-left: 0;
}

/* Parallax effect for background images */
.bg-fixed {
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
}

/* Animation on scroll */
[v-motion] {
  will-change: transform, opacity;
}
</style>