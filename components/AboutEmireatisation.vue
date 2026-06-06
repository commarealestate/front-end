<template>
  <section class="relative py-20 lg:py-32 overflow-hidden bg-white" :dir="direction">
    <!-- Subtle decoration -->
    <div class="absolute top-1/2 right-0 w-72 h-72 bg-comma-secondary/5 rounded-full blur-3xl pointer-events-none -z-0"></div>

    <div class="container mx-auto px-4 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="mb-16">
        <span class="text-sm font-semibold tracking-widest text-comma-primary uppercase">{{ $t('emiratisation_section') }}</span>
        <h2 class="text-3xl lg:text-4xl font-bold text-comma-neutral-900 mt-3 mb-6">
          {{ $t('emiratisation_about_title') }}
        </h2>
      </div>

      <!-- Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <!-- Left: Main content -->
        <div class="space-y-6">
          <p class="text-base lg:text-lg text-comma-neutral-600 leading-relaxed">
            {{ $t('emiratisation_about_para1') }}
          </p>
          <p class="text-base lg:text-lg text-comma-neutral-600 leading-relaxed">
            {{ $t('emiratisation_about_para2') }}
          </p>
        </div>

        <!-- Right: Highlight -->
        <div class="relative pl-6 lg:pl-8 py-8 border-l-4 border-comma-primary bg-comma-neutral-50 rounded-r-lg p-6 lg:p-8">
          <Icon 
            name="mdi:format-quote-open" 
            class="w-8 h-8 text-comma-primary/30 mb-3"
          />
          <p class="text-lg lg:text-xl font-semibold text-comma-neutral-800 leading-relaxed">
            {{ $t('emiratisation_about_highlight') }}
          </p>
          <p class="text-sm text-comma-neutral-500 mt-4">
            {{ $t('emiratisation_about_ceo') }}
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
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr');
</script>
