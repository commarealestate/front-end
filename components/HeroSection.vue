<template>
  <section class="relative h-screen w-full overflow-hidden">
    <!-- Video Background Slideshow -->
    <div class="absolute inset-0">
      <div
        v-for="(video, index) in heroVideos"
        :key="index"
        class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        :class="currentSlide === index ? 'opacity-100' : 'opacity-0'"
      >
        <video autoplay muted loop playsinline class="h-full w-full object-cover" :class="mediaBoostClass">
          <source :src="video" type="video/mp4" />
        </video>
      </div>

      <HeroOverlay variant="bright" :direction="direction" />
    </div>

    <!-- Content Container -->
    <div class="relative z-10 flex h-full items-center container mx-auto px-4 lg:px-8">
      <div
        class="max-w-2xl"
        :class="[{ 'text-right': direction === 'rtl' }, contentPanelClass]"
      >
        <h1 class="mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl" :class="headingClass">
          {{ $t('hero_title') }}
        </h1>

        <div class="mb-10 space-y-6">
          <p class="text-xl leading-relaxed md:text-2xl" :class="bodyClass">
            {{ $t('hero_slogan') }}
          </p>

          <div
            class="relative border-l-2 border-comma-primary-light pl-6 md:pl-8"
            :class="{ 'border-r-2 border-l-0 pr-6 pl-0': direction === 'rtl' }"
          >
            <p class="text-lg md:text-xl" :class="bodyClass">
              "{{ $t('hero_quote') }}"
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-4 sm:flex-row" :class="{ 'flex-row-reverse': direction === 'rtl' }">
          <NuxtLink
            to="/properties"
            class="group flex items-center justify-center gap-3 rounded-lg bg-comma-primary px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-comma-primary-dark hover:shadow-xl"
          >
            <Icon name="heroicons:building-office" class="h-5 w-5" />
            <span>{{ $t('View Properties') }}</span>
            <Icon
              name="heroicons:arrow-right"
              class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              :class="{ 'rotate-180': direction === 'rtl', 'group-hover:-translate-x-1': direction === 'rtl' }"
            />
          </NuxtLink>

          <NuxtLink
            :to="localePath('/contact')"
            class="group flex items-center justify-center gap-3 rounded-lg border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/20 hover:shadow-xl"
          >
            <Icon name="heroicons:phone" class="h-5 w-5" />
            <span>{{ $t('Contact Us') }}</span>
            <Icon
              name="heroicons:arrow-right"
              class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              :class="{ 'rotate-180': direction === 'rtl', 'group-hover:-translate-x-1': direction === 'rtl' }"
            />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Slide Indicators -->
    <div class="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 transform items-center gap-3">
      <button
        v-for="index in 3"
        :key="index"
        type="button"
        class="relative"
        :aria-label="`Go to slide ${index}`"
        @click="goToSlide(index - 1)"
      >
        <div
          class="h-3 w-3 rounded-full transition-all duration-300"
          :class="currentSlide === index - 1 ? 'scale-125 bg-white' : 'bg-white/50 hover:bg-white/80'"
        />
      </button>
    </div>
  </section>
</template>

<script setup>
import heroVid1 from '~/assets/images/hero-vid.mp4'
import heroVid2 from '~/assets/images/hero-vid-two.mp4'
import heroVid3 from '~/assets/images/hero-vid-three.mp4'

const localePath = useLocalePath()
const { locale } = useI18n()
const { headingClass, bodyClass, contentPanelClass, mediaBoostClass } = useSiteHero()

const direction = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))
const heroVideos = [heroVid1, heroVid2, heroVid3]
const currentSlide = ref(0)
const autoSlideInterval = ref(null)

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % 3
  resetAutoSlide()
}

const goToSlide = (index) => {
  currentSlide.value = index
  resetAutoSlide()
}

const startAutoSlide = () => {
  autoSlideInterval.value = setInterval(nextSlide, 5000)
}

const resetAutoSlide = () => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value)
    startAutoSlide()
  }
}

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value)
  }
})
</script>
