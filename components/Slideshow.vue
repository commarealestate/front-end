<template>
  <section class="relative h-screen overflow-hidden py-24 lg:py-32">
    <!-- Slideshow -->
    <div class="absolute inset-0">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        :class="currentSlide === index ? 'opacity-100' : 'opacity-0'"
      >
        <img
          :src="slide.image"
          :alt="$t(slide.titleKey)"
          class="h-full w-full object-cover"
          :class="mediaBoostClass"
        />
      </div>

      <HeroOverlay variant="bright" :direction="direction" />
    </div>

    <!-- Content -->
    <div class="container relative z-10 mx-auto px-4 lg:px-8">
      <div class="max-w-2xl" :class="contentPanelClass">
        <h2 class="mb-4 text-3xl font-bold lg:text-5xl" :class="headingClass">
          {{ $t(slides[currentSlide].titleKey) }}
        </h2>
        <p class="text-lg leading-relaxed lg:text-xl" :class="bodyClass">
          {{ $t(slides[currentSlide].descriptionKey) }}
        </p>
      </div>
    </div>

    <!-- Slide Indicators -->
    <div class="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-3">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        type="button"
        class="h-3 w-3 rounded-full transition-all duration-300"
        :class="currentSlide === index ? 'scale-125 bg-white' : 'bg-white/50 hover:bg-white/80'"
        :aria-label="$t('home.slideshow.slide_indicator', { number: index + 1 })"
        @click="goToSlide(index)"
      />
    </div>
  </section>
</template>

<script setup>
import slide1 from '~/assets/images/slide-1.jpg'
import slide2 from '~/assets/images/slide-2.jpg'
import slide3 from '~/assets/images/slide-3.jpg'

const { locale } = useI18n()
const { headingClass, bodyClass, contentPanelClass, mediaBoostClass } = useSiteHero()

const direction = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))

const slides = [
  {
    image: slide1,
    titleKey: 'home.slideshow.slide1.title',
    descriptionKey: 'home.slideshow.slide1.description',
  },
  {
    image: slide2,
    titleKey: 'home.slideshow.slide2.title',
    descriptionKey: 'home.slideshow.slide2.description',
  },
  {
    image: slide3,
    titleKey: 'home.slideshow.slide3.title',
    descriptionKey: 'home.slideshow.slide3.description',
  },
]

const currentSlide = ref(0)

let interval = null
let rafId = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const goToSlide = (index) => {
  currentSlide.value = index
}

const handleScroll = () => {
  const scrollY = window.scrollY
  const offset = Math.min(scrollY * 0.08, 60)

  rafId && cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    // reserved for future parallax
    void offset
  })
}

onMounted(() => {
  interval = setInterval(nextSlide, 6000)
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  clearInterval(interval)
  window.removeEventListener('scroll', handleScroll)
  rafId && cancelAnimationFrame(rafId)
})
</script>
