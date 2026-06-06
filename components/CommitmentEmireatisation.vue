<template>
  <section class="relative py-20 lg:py-32 overflow-hidden bg-comma-neutral-50">
    <!-- Decorative elements -->
    <div class="absolute top-0 right-1/4 w-64 h-64 bg-comma-primary/5 rounded-full blur-3xl pointer-events-none -z-0"></div>

    <div class="container mx-auto px-4 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="mb-16 max-w-2xl">
        <span class="text-sm font-semibold tracking-widest text-comma-primary uppercase">{{ $t('emiratisation_commitment_label') }}</span>
        <h2 class="text-3xl lg:text-4xl font-bold text-comma-neutral-900 mt-3">
          {{ $t('emiratisation_commitment_title') }}
        </h2>
      </div>

      <!-- Commitment Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(commitment, index) in commitments" 
          :key="index"
          class="group relative p-8 rounded-xl bg-white border border-comma-border-subtle hover:border-comma-primary/40 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          :dir="direction"
        >
          <!-- Background accent -->
          <div class="absolute inset-0 bg-gradient-to-br from-comma-primary/5 to-comma-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

          <!-- Content -->
          <div class="relative z-10 space-y-4">
            <!-- Icon -->
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-comma-primary/10 group-hover:bg-comma-primary/15 transition-all duration-300">
              <Icon :name="commitment.icon" class="w-6 h-6 text-comma-primary" />
            </div>

            <!-- Title -->
            <h3 class="text-lg font-semibold text-comma-neutral-900 group-hover:text-comma-primary transition-colors duration-300">
              {{ $t(commitment.title) }}
            </h3>

            <!-- Description -->
            <p class="text-sm text-comma-neutral-600 leading-relaxed">
              {{ $t(commitment.description) }}
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

const commitments = [
  {
    icon: 'heroicons:academic-cap',
    title: 'emiratisation_commitment_1_title',
    description: 'emiratisation_commitment_1_desc'
  },
  {
    icon: 'heroicons:hand-thumb-up',
    title: 'emiratisation_commitment_2_title',
    description: 'emiratisation_commitment_2_desc'
  },
  {
    icon: 'heroicons:light-bulb',
    title: 'emiratisation_commitment_3_title',
    description: 'emiratisation_commitment_3_desc'
  },
  {
    icon: 'heroicons:chart-bar',
    title: 'emiratisation_commitment_4_title',
    description: 'emiratisation_commitment_4_desc'
  },
  {
    icon: 'ph:target',
    title: 'emiratisation_commitment_5_title',
    description: 'emiratisation_commitment_5_desc'
  },
  {
    icon: 'heroicons:link',
    title: 'emiratisation_commitment_6_title',
    description: 'emiratisation_commitment_6_desc'
  }
];
</script>
