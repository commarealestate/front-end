<template>
  <section class="relative h-screen w-full overflow-hidden">
    <!-- Video Background Slideshow -->
    <div class="absolute inset-0">
      <!-- Video Slide 1 -->
      <div 
        class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        :class="{
          'opacity-100': currentSlide === 0,
          'opacity-0': currentSlide !== 0
        }"
      >
        <video autoplay muted loop class="w-full h-full object-cover">
          <source src="~/assets/images/hero-vid.mp4" type="video/mp4" />
        </video>
        <div class="absolute inset-0 bg-gradient-to-r from-black/30 via-comma-black/20 to-transparent"></div>
      </div>
      
      <!-- Video Slide 2 -->
      <div 
        class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        :class="{
          'opacity-100': currentSlide === 1,
          'opacity-0': currentSlide !== 1
        }"
      >
        <video autoplay muted loop class="w-full h-full object-cover">
          <source src="~/assets/images/hero-vid-two.mp4" type="video/mp4" />
        </video>
        <div class="absolute inset-0 bg-gradient-to-r from-black/30 via-comma-black/20 to-transparent"></div>
      </div>
      
      <!-- Video Slide 3 -->
      <div 
        class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        :class="{
          'opacity-100': currentSlide === 2,
          'opacity-0': currentSlide !== 2
        }"
      >
        <video autoplay muted loop class="w-full h-full object-cover">
          <source src="~/assets/images/hero-vid-three.mp4" type="video/mp4" />
        </video>
        <div class="absolute inset-0 bg-gradient-to-r from-black/30 via-comma-black/20 to-transparent"></div>
      </div>

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
    </div>

    <!-- Content Container -->
    <div class="relative h-full container mx-auto px-4 lg:px-8 flex items-center">
      <div class="max-w-2xl" :class="{ 'text-right': direction === 'rtl' }">
        <!-- Main Heading -->
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          {{ $t('hero_title') }}
        </h1>
        
        <!-- Slogan -->
        <div class="mb-10 space-y-6">
          <p class="text-xl md:text-2xl text-comma-neutral-200  leading-relaxed">
            {{ $t('hero_slogan') }}
          </p>
          
          <div class="relative pl-6 md:pl-8 border-l-2 border-comma-primary-light"
               :class="{ 'border-r-2 border-l-0 pr-6 pl-0': direction === 'rtl' }">
            <p class="text-lg md:text-xl text-comma-neutral-300">
              "{{ $t('hero_quote') }}"
            </p>
          </div>
        </div>
        
        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4" 
             :class="{ 'flex-row-reverse': direction === 'rtl' }">
          <NuxtLink
            to="/properties"
            class="px-8 py-4 bg-comma-primary text-white font-semibold rounded-lg hover:bg-comma-primary-dark transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-3 group"
          >
            <Icon name="heroicons:building-office" class="w-5 h-5" />
            <span>{{ $t('View Properties') }}</span>
            <Icon 
              name="heroicons:arrow-right" 
              class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              :class="{ 'rotate-180': direction === 'rtl', 'group-hover:-translate-x-1': direction === 'rtl' }"
            />
          </NuxtLink>
          
          <NuxtLink
           :to="localePath('/contact')"
            class="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-3 group"
          >
            <Icon name="heroicons:phone" class="w-5 h-5" />
            <span>{{ $t('Contact Us') }}</span>
            <Icon 
              name="heroicons:arrow-right" 
              class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              :class="{ 'rotate-180': direction === 'rtl', 'group-hover:-translate-x-1': direction === 'rtl' }"
            />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Slide Indicators -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
      <button
        v-for="index in 3"
        :key="index"
        @click="goToSlide(index - 1)"
        class="relative"
        :aria-label="`Go to slide ${index}`"
      >
        <div class="w-3 h-3 rounded-full transition-all duration-300"
             :class="currentSlide === index - 1 ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'">
        </div>
      </button>
    </div>

    <!-- Navigation Arrows -->
    <!-- <button
      @click="prevSlide"
      class="absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
      :class="{ 'left-auto right-4 lg:right-8': direction === 'rtl' }"
      aria-label="Previous slide"
    >
      <Icon name="heroicons:chevron-left" class="w-6 h-6" :class="{ 'rotate-180': direction === 'rtl' }" />
    </button>
    
    <button
      @click="nextSlide"
      class="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
      :class="{ 'right-auto left-4 lg:left-8': direction === 'rtl' }"
      aria-label="Next slide"
    >
      <Icon name="heroicons:chevron-right" class="w-6 h-6" :class="{ 'rotate-180': direction === 'rtl' }" />
    </button> -->

    
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';

const localePath = useLocalePath();


const { locale } = useI18n();

const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr');
const currentSlide = ref(0);
const autoSlideInterval = ref(null);

// Slide Navigation
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % 3;
  resetAutoSlide();
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + 3) % 3;
  resetAutoSlide();
};

const goToSlide = (index) => {
  currentSlide.value = index;
  resetAutoSlide();
};

// Auto Slide
const startAutoSlide = () => {
  autoSlideInterval.value = setInterval(nextSlide, 5000);
};

const resetAutoSlide = () => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value);
    startAutoSlide();
  }
};

// Lifecycle
onMounted(() => {
  startAutoSlide();
});

onUnmounted(() => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value);
  }
});
</script>

<style scoped>
/* Custom animations */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Video fade effects */
video {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
