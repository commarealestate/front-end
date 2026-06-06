<template>
  <section class="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-comma-primary to-comma-primary-dark">
    <!-- Decorative elements -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-4 lg:px-8 relative z-10">
      <div class="max-w-2xl mx-auto text-center space-y-8">
        <!-- Heading -->
        <h2 class="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
          {{ $t('emiratisation_cta_title') }}
        </h2>

        <!-- Description -->
        <p class="text-lg lg:text-xl text-white/90 leading-relaxed">
          {{ $t('emiratisation_cta_description') }}
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <NuxtLink
            :to="localePath('/career')"
            class="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-white text-comma-primary font-semibold hover:bg-comma-neutral-50 transition-all duration-300 hover:shadow-lg group"
          >
            <span>{{ $t('emiratisation_cta_button') }}</span>
            <Icon 
              :name="direction === 'ltr' ? 'heroicons:arrow-right' : 'heroicons:arrow-left'"
              class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
            />
          </NuxtLink>
        </div>

        <!-- Additional info -->
        <div class="pt-6 border-t border-white/20">
          <p class="text-sm text-white/70">
            {{ $t('emiratisation_cta_info') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const localePath = useLocalePath();
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr');
</script>