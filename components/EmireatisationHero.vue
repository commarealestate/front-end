<template>
  <section class="relative min-h-screen flex items-center py-16 lg:py-24 overflow-hidden bg-comma-neutral-50">
    <!-- Decorative background elements -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-comma-primary/8 rounded-full blur-3xl pointer-events-none -z-0 animate-float"></div>
    <div class="absolute bottom-20 left-0 w-80 h-80 bg-comma-secondary/8 rounded-full blur-3xl pointer-events-none -z-0 animate-float-delayed"></div>

    <div class="container mx-auto px-4 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        <!-- Left: Content -->
        <div class="space-y-8">
          <!-- Label -->
          <div class="inline-block">
            <span class="text-sm font-semibold tracking-widest text-comma-primary uppercase">{{ $t('emiratisation_program_label') }}</span>
          </div>

          <!-- Main Title -->
          <h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-comma-neutral-900 leading-tight">
            <span class="text-pretty">{{ $t('emiratisation_hero_title') }}</span>
          </h1>

          <!-- Subtitle -->
          <p class="text-lg lg:text-xl text-comma-neutral-600 leading-relaxed max-w-md">
            {{ $t('emiratisation_hero_subtitle') }}
          </p>

          <!-- CTA Button -->
          <!-- <div class="pt-4 flex flex-col sm:flex-row gap-4">
            <NuxtLink
              to="/emiratisation#about"
              class="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-comma-primary text-white font-semibold hover:bg-comma-primary-dark transition-all duration-300 hover:shadow-lg group"
            >
              <span>{{ $t('emiratisation_hero_cta') }}</span>
              <Icon 
                name="heroicons:arrow-right" 
                class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              />
            </NuxtLink>
            <button
              class="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg border-2 border-comma-primary text-comma-primary font-semibold hover:bg-comma-primary/5 transition-all duration-300"
            >
              <Icon name="heroicons:play" class="w-5 h-5" />
              <span>{{ $t('emiratisation_play_video') }}</span>
            </button>
          </div> -->
        </div>

        <!-- Right: Hero Image -->
        <div class="relative hidden lg:block">
          <div class="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="/images/emiratisation.jpeg" 
              alt="Emiratisation Program" 
              class="w-full h-full object-cover object-bottom"
            />
            <!-- Overlay gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-comma-primary/20 via-transparent to-transparent"></div>
          </div>
          
          <!-- Floating stat card -->
          <div class="absolute bottom-4 right-4 lg:bottom-8 lg:right-8 bg-white/95 backdrop-blur-sm rounded-lg p-4 lg:p-6 shadow-lg">
            <p class="text-2xl lg:text-3xl font-bold text-comma-primary">500+</p>
            <p class="text-xs lg:text-sm text-comma-neutral-600 mt-1">{{ $t('emiratisation_employees') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr');
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}
</style>
