<template>
  <section
    class="relative -mt-24 lg:-mt-36 z-[60] pointer-events-auto"
  >
    <div class="container mx-auto px-4 lg:px-8">
      <div
        class="relative overflow-hidden rounded-2xl bg-comma-neutral-900
               border border-comma-primary/20
               shadow-[0_25px_60px_rgba(0,0,0,0.6)]
               backdrop-blur-sm"
      >
        <!-- Subtle grid pattern -->
        <div class="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div
            class="w-full h-full"
            :style="{
              backgroundImage: `
                linear-gradient(90deg, #8E084D 1px, transparent 1px),
                linear-gradient(180deg, #8E084D 1px, transparent 1px)
              `,
              backgroundSize: '64px 64px'
            }"
          />
        </div>

        <!-- Ambient glows -->
        <div class="absolute -top-10 -left-10 w-40 h-40 bg-comma-primary/20 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-comma-secondary/20 rounded-full blur-3xl"></div>

        <!-- Stats -->
        <div
          class="relative grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10
                 px-6 py-8 lg:px-10 lg:py-12"
        >
          <div
            v-for="(stat, index) in stats"
            :key="index"
            class="group text-center transition-transform duration-300
                   hover:-translate-y-1"
          >
            <!-- Icon -->
            <div class="flex justify-center mb-4">
              <div
                class="w-11 h-11 lg:w-14 lg:h-14 rounded-xl
                       bg-comma-primary/10
                       flex items-center justify-center
                       transition-colors duration-300
                       group-hover:bg-comma-primary/20"
              >
                <Icon
                  :name="stat.icon"
                  class="w-5 h-5 lg:w-6 lg:h-6 text-comma-primary-subtle"
                />
              </div>
            </div>

            <!-- Value (always LTR, solid white for contrast) -->
            <div
              dir="ltr"
              class="text-3xl lg:text-4xl font-bold mb-2 text-white drop-shadow-lg"
            >
              {{ stat.value }}
            </div>

            <!-- Label -->
            <div
              class="text-xs lg:text-sm text-comma-neutral-300 font-medium"
            >
              {{ $t(stat.label) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { locale } = useI18n();

const direction = computed(() =>
  locale.value === 'ar' ? 'rtl' : 'ltr'
);

// Updated stats with more realistic numbers and relevant icons
const stats = [
  {
    value: '500+',
    label: 'stats.properties_listed',
    icon: 'mdi:home-group' // represents multiple properties
  },
  {
    value: 'AED 2.5B+',
    label: 'stats.transaction_value',
    icon: 'mdi:cash-multiple' // money icon
  },
  {
    value: '98%',
    label: 'stats.client_satisfaction',
    icon: 'mdi:star-face' // satisfaction star
  },
  {
    value: '50+',
    label: 'stats.expert_advisors',
    icon: 'mdi:account-group' // team of experts
  }
];
</script>