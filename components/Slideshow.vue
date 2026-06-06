<template>
  <section class="relative py-24 lg:py-32 h-screen overflow-hidden">
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
          class="w-full h-full object-cover"
        />
        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-comma-neutral-900/70 via-comma-neutral-900/40 to-comma-neutral-900/70"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative container mx-auto px-4 lg:px-8">
      <div class="max-w-2xl text-white">
        <h2 class="text-3xl lg:text-5xl font-bold mb-4">
          {{ $t(slides[currentSlide].titleKey) }}
        </h2>
        <p class="text-lg lg:text-xl text-comma-neutral-200 leading-relaxed">
          {{ $t(slides[currentSlide].descriptionKey) }}
        </p>
      </div>
    </div>

    <!-- Slide Indicators -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        @click="goToSlide(index)"
        class="w-3 h-3 rounded-full transition-all duration-300"
        :class="currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'"
        :aria-label="$t('home.slideshow.slide_indicator', { number: index + 1 })"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

import slide1 from '~/assets/images/slide-1.jpg';
import slide2 from '~/assets/images/slide-2.jpg';
import slide3 from '~/assets/images/slide-3.jpg';

const slides = [
  {
    image: slide1,
    titleKey: 'home.slideshow.slide1.title',
    descriptionKey: 'home.slideshow.slide1.description'
  },
  {
    image: slide2,
    titleKey: 'home.slideshow.slide2.title',
    descriptionKey: 'home.slideshow.slide2.description'
  },
  {
    image: slide3,
    titleKey: 'home.slideshow.slide3.title',
    descriptionKey: 'home.slideshow.slide3.description'
  }
];

const currentSlide = ref(0);
const parallaxOffset = ref(0);

let interval = null;
let rafId = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

/**
 * Cinematic Parallax
 * حركة خفيفة جدًا (max 60px)
 */
const handleScroll = () => {
  const scrollY = window.scrollY;
  const offset = Math.min(scrollY * 0.08, 60);

  rafId && cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    parallaxOffset.value = offset;
  });
};

onMounted(() => {
  interval = setInterval(nextSlide, 6000);
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  clearInterval(interval);
  window.removeEventListener('scroll', handleScroll);
  rafId && cancelAnimationFrame(rafId);
});
</script>