<template>
  <section class="relative py-24 overflow-hidden bg-comma-neutral-50">
    <!-- Subtle animated decorative elements -->
    <div
      class="absolute top-0 right-0 w-96 h-96 bg-comma-primary/4 rounded-full blur-3xl pointer-events-none -z-0 animate-float">
    </div>
    <div
      class="absolute bottom-20 left-0 w-72 h-72 bg-comma-secondary/4 rounded-full blur-3xl pointer-events-none -z-0 animate-float-delayed">
    </div>
    <div
      class="absolute top-1/2 right-1/4 w-48 h-64 bg-comma-primary/3 rounded-full blur-2xl pointer-events-none -z-0 transform rotate-45">
    </div>

    <div class="container mx-auto px-4 lg:px-8 relative z-10">
      <!-- Hero Title Section -->
      <div class="mb-16 lg:mb-24">
        <div class="inline-flex items-center gap-3 mb-6">
          <div class="w-10 h-0.5 bg-comma-primary"></div>
          <span class="text-xs font-semibold text-comma-primary uppercase tracking-[0.15em]">{{
            $t('about_section.label') }}</span>
        </div>

        <h2 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-comma-neutral-800 leading-tight mb-6 max-w-3xl">
          {{ $t('about_section.title') }}
        </h2>
        <p class="text-xl text-comma-neutral-600 max-w-full leading-relaxed">
          {{ $t('about_section.description1') }}
        </p>
      </div>

      <!-- Main Content with Images Grid -->
      <div class="mb-20 lg:mb-32">
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          <!-- Left: Description Text -->
          <div class="w-full lg:w-5/12 space-y-4">
            <p class="text-base lg:text-lg text-comma-neutral-600 leading-relaxed">
              {{ $t('about_section.description2') }}
            </p>

            <!-- CTA Button - Compact, inline -->
            <div>
              <NuxtLink :to="localePath('/about')"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-comma-primary text-white font-semibold hover:bg-comma-primary-dark transition-all duration-300 hover:shadow-md group text-sm lg:text-base">
                <span>{{ $t('about_section.learn_more') }}</span>
                <Icon name="heroicons:arrow-right"
                  class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </NuxtLink>
            </div>
          </div>

          <!-- Right: Property Types Images -->
          <div class="hidden sm:grid grid-cols-3 gap-4 lg:gap-6 h-96">

            <!-- Villa (Left - Top) -->
            <NuxtLink :to="localePath({ path: '/properties', query: { property_type: 'villa' } })"
              class="relative overflow-hidden rounded-2xl group cursor-pointer lg:-translate-y-8 shadow-card hover:shadow-luxury transition-all duration-500">
              <img src="~/assets/images/about-villa.jpg" alt="Villas"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1" />

              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

              <div class="absolute bottom-5 left-5">
                <h3 class="text-xl lg:text-2xl font-bold text-white font-display">
                  {{ $t('about.villas') }}
                </h3>
              </div>
            </NuxtLink>


            <!-- Townhouse (Center) -->
            <NuxtLink :to="localePath({ path: '/properties', query: { property_type: 'townhouse' } })"
              class="relative overflow-hidden rounded-2xl group cursor-pointer shadow-card hover:shadow-luxury transition-all duration-500">
              <img src="~/assets/images/about-townhouse.jpg" alt="Townhouses"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-1" />

              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

              <div class="absolute bottom-5 left-5">
                <h3 class="text-xl lg:text-2xl font-bold text-white font-display">
                  {{ $t('about.townhouses') }}
                </h3>
              </div>
            </NuxtLink>


            <!-- Apartment (Right - Bottom) -->
            <NuxtLink :to="localePath({ path: '/properties', query: { property_type: 'apartment' } })"
              class="relative overflow-hidden rounded-2xl group cursor-pointer lg:translate-y-8 shadow-card hover:shadow-luxury transition-all duration-500">
              <img src="~/assets/images/about-apartment.jpg" alt="Apartments"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1" />

              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

              <div class="absolute bottom-5 left-5">
                <h3 class="text-xl lg:text-2xl font-bold text-white font-display">
                  {{ $t('about.apartments') }}
                </h3>
              </div>
            </NuxtLink>

          </div>
        </div>
      </div>

      <!-- Services Grid -->
      <div>
        <div class="mb-12">
          <h3 class="text-4xl lg:text-6xl font-bold text-comma-neutral-800">{{ $t('about_section.services_title') }}
          </h3>
          <p class="text-sm lg:text-base text-comma-neutral-600 mt-2">{{ $t('about_section.services_subtitle') }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="(service, index) in services" :key="index"
            class="group relative p-6 rounded-xl bg-comma-secondary-light/5 backdrop-blur border border-comma-border-subtle hover:border-comma-primary/40 transition-all duration-300 hover:shadow-md hover:-translate-y-1 overflow-hidden">
            <!-- Background accent on hover -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-comma-primary/8 to-comma-secondary/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>

            <div class="relative z-10 space-y-3">
              <div
                class="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-comma-primary/10 group-hover:bg-comma-primary/15 transition-all duration-300">
                <Icon :name="service.icon" class="w-5 h-5 text-comma-primary" />
              </div>
              <h4
                class="text-base font-semibold text-comma-neutral-800 group-hover:text-comma-primary transition-colors duration-300">
                {{ $t(service.nameKey) }}
              </h4>
              <p class="text-sm text-comma-neutral-600 leading-relaxed">
                {{ $t(service.descKey) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { locale } = useI18n();
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr');

const localePath = useLocalePath();

const services = [
  {
    nameKey: 'about_section.services.brokerage.name',
    descKey: 'about_section.services.brokerage.description',
    icon: 'heroicons:hand-raised'
  },
  {
    nameKey: 'about_section.services.developer_sales.name',
    descKey: 'about_section.services.developer_sales.description',
    icon: 'heroicons:building-office'
  },
  {
    nameKey: 'about_section.services.resales.name',
    descKey: 'about_section.services.resales.description',
    icon: 'heroicons:arrows-right-left'
  },
  {
    nameKey: 'about_section.services.property_management.name',
    descKey: 'about_section.services.property_management.description',
    icon: 'heroicons:wrench-screwdriver'
  },
  {
    nameKey: 'about_section.services.advisory.name',
    descKey: 'about_section.services.advisory.description',
    icon: 'heroicons:light-bulb'
  },
  {
    nameKey: 'about_section.services.investment_consulting.name',
    descKey: 'about_section.services.investment_consulting.description',
    icon: 'heroicons:chart-bar'
  }
];

import aboutImage1 from '~/assets/images/about-main.jpg';
import aboutImage2 from '~/assets/images/about-left.jpg';
import aboutImage3 from '~/assets/images/about-right.jpg';

const propertyImages = [
  { src: aboutImage1, alt: 'Luxury Apartment Building' },
  { src: aboutImage2, alt: 'Modern Condo Development' },
  { src: aboutImage3, alt: 'Multi Family House' }
];

// Parallax effect on scroll
const handleParallax = () => {
  const containers = document.querySelectorAll('[ref="imageContainer0"], [ref="imageContainer1"], [ref="imageContainer2"]');

  containers.forEach((container, index) => {
    const rect = container.getBoundingClientRect();
    const scrolled = window.scrollY;
    const parallaxFactor = [0.3, 0.2, 0.25][index] || 0.2;
    const offset = (rect.top - window.innerHeight / 2) * parallaxFactor;
    container.style.transform = `translateY(${offset}px)`;
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleParallax, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleParallax);
});
</script>

<style scoped>
/* ... (styles unchanged) ... */
</style>