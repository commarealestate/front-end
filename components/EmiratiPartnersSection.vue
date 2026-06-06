<template>
  <section class="relative py-20 lg:py-32 overflow-hidden bg-comma-neutral-50">
    <!-- Decorative elements -->
    <div class="absolute bottom-0 right-0 w-80 h-80 bg-comma-primary/5 rounded-full blur-3xl pointer-events-none -z-0"></div>

    <div class="container mx-auto px-4 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="mb-16 text-center max-w-2xl mx-auto">
        <span class="text-sm font-semibold tracking-widest text-comma-primary uppercase">{{ $t('home.emiratisation_partners.label') }}</span>
        <h2 class="text-3xl lg:text-4xl font-bold text-comma-neutral-900 mt-3 mb-6">
          {{ $t('home.emiratisation_partners.title') }}
        </h2>
        <p class="text-lg text-comma-neutral-600 leading-relaxed">
          {{ $t('home.emiratisation_partners.description') }}
        </p>
      </div>

      <!-- Partners Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="(partner, index) in partners" 
          :key="index"
          class="h-32 rounded-lg border border-comma-border-subtle hover:border-comma-primary/40 bg-white hover:bg-comma-primary/5 transition-all duration-300 flex items-center justify-center p-4 group cursor-pointer"
          :dir="direction"
        >
          <div class="text-center">
            <div class="text-3xl font-bold text-comma-neutral-300 group-hover:text-comma-primary transition-colors duration-300 mb-2">
              {{ partner.icon }}
            </div>
            <p class="text-xs font-semibold text-comma-neutral-700 group-hover:text-comma-primary transition-colors duration-300">
              {{ $t(`home.emiratisation_partners.partners.${partner.key}`) }}
            </p>
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

const partners = [
  { key: 'ministry', icon: '🏛️' },
  { key: 'local_authority', icon: '🏢' },
  { key: 'training_institute', icon: '🎓' },
  { key: 'industry_partner', icon: '🤝' },
  { key: 'government_agency', icon: '📋' },
  { key: 'education_center', icon: '📚' },
  { key: 'development_fund', icon: '💼' },
  { key: 'strategic_partner', icon: '🌟' }
];
</script>