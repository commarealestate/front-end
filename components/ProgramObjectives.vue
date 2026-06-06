<template>
  <section class="relative py-20 lg:py-32 overflow-hidden bg-white">
    <!-- Decorative elements -->
    <div class="absolute bottom-0 left-1/3 w-80 h-80 bg-comma-secondary/8 rounded-full blur-3xl pointer-events-none -z-0"></div>

    <div class="container mx-auto px-4 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="mb-16 max-w-2xl">
        <span class="text-sm font-semibold tracking-widest text-comma-primary uppercase">{{ $t('emiratisation_objectives_label') }}</span>
        <h2 class="text-3xl lg:text-4xl font-bold text-comma-neutral-900 mt-3">
          {{ $t('emiratisation_objectives_title') }}
        </h2>
      </div>

      <!-- Objectives List with Icons -->
      <div class="space-y-4 max-w-3xl">
        <div 
          v-for="(objective, index) in objectives" 
          :key="index"
          class="flex gap-6 p-6 rounded-lg border border-comma-border-subtle hover:border-comma-primary/40 hover:bg-comma-primary/2 transition-all duration-300 group"
          :dir="direction"
        >
          <!-- Number/Icon -->
          <div class="flex-shrink-0">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-comma-primary/10 group-hover:bg-comma-primary/20 transition-all duration-300">
              <span class="text-lg font-bold text-comma-primary">{{ index + 1 }}</span>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-comma-neutral-900 group-hover:text-comma-primary transition-colors duration-300">
              {{ $t(objective.title) }}
            </h3>
            <p class="text-sm text-comma-neutral-600 mt-2">
              {{ $t(objective.description) }}
            </p>
          </div>

          <!-- Icon on right -->
          <div class="flex-shrink-0 hidden md:flex items-center justify-center">
            <Icon :name="objective.icon" class="w-6 h-6 text-comma-primary/60 group-hover:text-comma-primary transition-colors duration-300" />
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

const objectives = [
  {
    icon: 'heroicons:star',
    title: 'emiratisation_objective_1_title',
    description: 'emiratisation_objective_1_desc'
  },
  {
    icon: 'heroicons:rocket-launch',
    title: 'emiratisation_objective_2_title',
    description: 'emiratisation_objective_2_desc'
  },
  {
    icon: 'heroicons:briefcase',
    title: 'emiratisation_objective_3_title',
    description: 'emiratisation_objective_3_desc'
  },
  {
    icon: 'heroicons:flag',
    title: 'emiratisation_objective_4_title',
    description: 'emiratisation_objective_4_desc'
  },
  {
    icon: 'heroicons:chart-bar',
    title: 'emiratisation_objective_5_title',
    description: 'emiratisation_objective_5_desc'
  }
];
</script>
