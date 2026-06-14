<template>
  <div class="pointer-events-none absolute inset-0" aria-hidden="true">
    <!-- Option A: current (heavy full-frame dim) -->
    <template v-if="variant === 'current'">
      <div
        class="absolute inset-0"
        :class="direction === 'rtl'
          ? 'bg-gradient-to-l from-black/40 via-black/15 to-transparent'
          : 'bg-gradient-to-r from-black/40 via-black/15 to-transparent'"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      <div
        class="absolute inset-0"
        :class="direction === 'rtl'
          ? 'bg-gradient-to-l from-black/30 via-transparent to-transparent'
          : 'bg-gradient-to-r from-black/30 via-transparent to-transparent'"
      />
    </template>

    <!-- Option B: balanced — localized scrim + light vignette -->
    <template v-else-if="variant === 'balanced'">
      <template v-if="align === 'center'">
        <div class="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/35 via-black/12 to-transparent" />
      </template>
      <template v-else>
        <div
          class="absolute inset-0"
          :class="direction === 'rtl'
            ? 'bg-gradient-to-l from-black/50 via-black/20 via-40% to-transparent'
            : 'bg-gradient-to-r from-black/50 via-black/20 via-40% to-transparent'"
        />
        <div class="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
      </template>
    </template>

    <!-- Option C: bright — minimal overlay, image stays vivid -->
    <template v-else-if="variant === 'bright'">
      <template v-if="align === 'center'">
        <div class="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
      </template>
      <template v-else>
        <div
          class="absolute inset-0"
          :class="direction === 'rtl'
            ? 'bg-gradient-to-l from-black/25 via-black/10 via-35% to-transparent'
            : 'bg-gradient-to-r from-black/25 via-black/10 via-35% to-transparent'"
        />
        <div class="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black/20 to-transparent" />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { HeroOverlayVariant } from '~/composables/useHeroTextStyle'

withDefaults(defineProps<{
  variant?: HeroOverlayVariant
  direction?: 'ltr' | 'rtl'
  align?: 'start' | 'center'
}>(), {
  variant: 'bright',
  direction: 'ltr',
  align: 'start',
})
</script>
