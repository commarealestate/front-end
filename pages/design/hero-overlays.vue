<template>
  <div class="min-h-screen bg-comma-neutral-900" :dir="direction">
    <!-- Sticky controls -->
    <header class="sticky top-0 z-50 border-b border-white/10 bg-comma-neutral-900/95 backdrop-blur-md">
      <div class="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-comma-secondary">Phase 0 — Design Review</p>
          <h1 class="font-display text-xl font-bold text-white lg:text-2xl">Hero Overlay Comparison</h1>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button
            v-for="option in overlayOptions"
            :key="option.id"
            type="button"
            class="rounded-lg px-4 py-2 text-sm font-semibold transition"
            :class="activeVariant === option.id
              ? 'bg-comma-primary text-white shadow-lg'
              : 'bg-white/10 text-white/80 hover:bg-white/20'"
            @click="activeVariant = option.id"
          >
            {{ option.label }}
            <span v-if="option.recommended" class="ml-1 text-comma-secondary">★</span>
          </button>
          <button
            type="button"
            class="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
            @click="locale = locale === 'ar' ? 'en' : 'ar'"
          >
            {{ locale === 'ar' ? 'English' : 'العربية' }}
          </button>
        </div>
      </div>
    </header>

    <!-- Active preview (full viewport) -->
    <section class="relative h-[85vh] w-full overflow-hidden">
      <div class="absolute inset-0">
        <video autoplay muted loop playsinline class="h-full w-full object-cover" :class="mediaBoostClass">
          <source src="~/assets/images/hero-vid.mp4" type="video/mp4" />
        </video>
        <HeroOverlay :variant="activeVariant" :direction="direction" />
      </div>

      <div class="container relative z-10 mx-auto flex h-full items-center px-4 lg:px-8">
        <div class="max-w-2xl" :class="[{ 'text-right': direction === 'rtl' }, contentPanelClass]">
          <h2 class="mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl" :class="headingClass">
            {{ $t('hero_title') }}
          </h2>
          <p class="mb-4 text-xl leading-relaxed md:text-2xl" :class="bodyClass">
            {{ $t('hero_slogan') }}
          </p>
          <p class="text-lg md:text-xl" :class="bodyClass">
            "{{ $t('hero_quote') }}"
          </p>
        </div>
      </div>

      <div class="absolute bottom-6 left-1/2 z-20 max-w-lg -translate-x-1/2 rounded-xl bg-black/60 px-5 py-3 text-center backdrop-blur-sm">
        <p class="text-sm font-semibold text-white">{{ activeOption?.label }}</p>
        <p class="mt-1 text-xs text-white/75">{{ activeOption?.summary }}</p>
      </div>
    </section>

    <!-- Side-by-side comparison -->
    <section class="bg-comma-neutral-50 py-16 lg:py-24">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="mb-10 max-w-3xl">
          <h2 class="font-display text-3xl font-bold text-comma-neutral-900">Three options for client review</h2>
          <p class="mt-3 text-comma-neutral-600 leading-relaxed">
            Same homepage hero video and copy. Option B keeps headlines readable while letting the footage stay brighter and more vivid.
            Pick one before we roll it out to Properties, Agents, Projects, and the homepage slideshow.
          </p>
        </div>

        <div class="grid gap-8 lg:grid-cols-3">
          <article
            v-for="option in overlayOptions"
            :key="option.id"
            class="overflow-hidden rounded-2xl border bg-white shadow-card"
            :class="option.recommended ? 'border-comma-primary ring-2 ring-comma-primary/20' : 'border-comma-border-subtle'"
          >
            <div class="relative aspect-[4/5] overflow-hidden">
              <video autoplay muted loop playsinline class="h-full w-full object-cover" :class="mediaBoostFor(option.id)">
                <source src="~/assets/images/hero-vid-two.mp4" type="video/mp4" />
              </video>
              <HeroOverlay :variant="option.id" :direction="direction" />
              <div class="absolute inset-0 flex items-end p-5">
                <div>
                  <p class="text-lg font-bold text-white drop-shadow-lg">{{ $t('hero_title') }}</p>
                  <p class="mt-1 line-clamp-2 text-sm text-white/90 drop-shadow">{{ $t('hero_slogan') }}</p>
                </div>
              </div>
              <span
                v-if="option.recommended"
                class="absolute right-3 top-3 rounded-full bg-comma-primary px-3 py-1 text-xs font-bold text-white"
              >
                Recommended
              </span>
            </div>
            <div class="space-y-3 p-5">
              <h3 class="font-display text-lg font-bold text-comma-neutral-900">{{ option.label }}</h3>
              <p class="text-sm text-comma-neutral-600">{{ option.description }}</p>
              <ul class="space-y-1.5 text-sm text-comma-neutral-700">
                <li v-for="point in option.pros" :key="point" class="flex gap-2">
                  <span class="text-comma-primary">+</span>
                  <span>{{ point }}</span>
                </li>
              </ul>
              <button
                type="button"
                class="w-full rounded-lg py-2.5 text-sm font-semibold transition"
                :class="activeVariant === option.id
                  ? 'bg-comma-primary text-white'
                  : 'bg-comma-surface-subtle text-comma-neutral-800 hover:bg-comma-neutral-200'"
                @click="activeVariant = option.id"
              >
                Preview full screen
              </button>
            </div>
          </article>
        </div>

        <!-- Design rationale -->
        <div class="mt-16 grid gap-8 lg:grid-cols-2">
          <div class="rounded-2xl border border-comma-border-subtle bg-white p-6 lg:p-8">
            <h3 class="font-display text-xl font-bold text-comma-neutral-900">Why heroes feel too dark today</h3>
            <ul class="mt-4 space-y-2 text-sm text-comma-neutral-700">
              <li>Homepage stacks <strong>3 overlay layers</strong> on each video slide (~50–70% effective dim).</li>
              <li>Properties &amp; Agents use a flat <strong>50/40/30% black wash</strong> across the full frame.</li>
              <li>Projects slider adds <strong>75% + 60%</strong> gradients on top of photos.</li>
              <li>Slideshow on homepage uses a heavy center band at <strong>70/40/70%</strong>.</li>
            </ul>
          </div>
          <div class="rounded-2xl border border-comma-primary/30 bg-comma-primary/5 p-6 lg:p-8">
            <h3 class="font-display text-xl font-bold text-comma-neutral-900">Recommendation — Option B (Balanced)</h3>
            <ul class="mt-4 space-y-2 text-sm text-comma-neutral-700">
              <li>Darkens only the <strong>text side</strong> (LTR left / RTL right), not the whole image.</li>
              <li>Light bottom vignette for slide indicators and page transition.</li>
              <li>Slight <strong>brightness + saturation boost</strong> on media (+6%) restores life to footage.</li>
              <li>Subtle text shadow instead of crushing the entire hero with black.</li>
              <li>Same pattern works for video heroes, photo heroes, and project sliders.</li>
            </ul>
          </div>
        </div>

        <!-- Pages that will be updated after approval -->
        <div class="mt-10 rounded-2xl border border-comma-border-subtle bg-white p-6">
          <h3 class="font-display text-lg font-bold text-comma-neutral-900">Rollout scope (after approval)</h3>
          <div class="mt-4 flex flex-wrap gap-2">
            <span v-for="page in rolloutPages" :key="page" class="rounded-full bg-comma-surface-subtle px-3 py-1 text-sm text-comma-neutral-700">
              {{ page }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { HeroOverlayVariant } from '~/composables/useHeroTextStyle'

definePageMeta({
  layout: false,
})

const { locale, t } = useI18n()
const direction = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr') as 'ltr' | 'rtl')

const overlayOptions: {
  id: HeroOverlayVariant
  label: string
  summary: string
  description: string
  pros: string[]
  recommended?: boolean
}[] = [
  {
    id: 'current',
    label: 'A — Current',
    summary: 'Heavy full-frame dim — matches live site',
    description: 'Replicates today\'s stacked gradients. Text is safe but footage looks muted and flat.',
    pros: ['No change from live site', 'Maximum text contrast'],
  },
  {
    id: 'balanced',
    label: 'B — Balanced',
    summary: 'Localized scrim + light media boost — recommended',
    description: 'Dark band only behind copy. Rest of the hero stays bright and vivid. Best luxury-real-estate balance.',
    pros: ['Brighter, more premium imagery', 'Headlines stay readable', 'Works in EN and AR (RTL flip)', 'Subtle brand-appropriate polish'],
    recommended: true,
  },
  {
    id: 'bright',
    label: 'C — Bright',
    summary: 'Minimal overlay + text panel — most vivid',
    description: 'Almost no dimming. Relies on text shadow and a soft glass panel behind copy. Best for strong photography.',
    pros: ['Maximum image visibility', 'Modern editorial feel', 'Good for photo-heavy pages'],
  },
]

const activeVariant = ref<HeroOverlayVariant>('bright')
const activeOption = computed(() => overlayOptions.find(o => o.id === activeVariant.value))

const { headingClass, bodyClass, contentPanelClass, mediaBoostClass } = useHeroTextStyle(activeVariant)

function mediaBoostFor(variant: HeroOverlayVariant) {
  if (variant === 'current') return ''
  if (variant === 'balanced') return 'brightness-[1.06] contrast-[1.03] saturate-[1.05]'
  return 'brightness-[1.1] contrast-[1.04] saturate-[1.08]'
}

const rolloutPages = [
  'Homepage HeroSection',
  'Homepage Slideshow',
  'Properties listing hero',
  'Agents listing hero',
  'Projects listing hero',
  'ProjectsSection slider',
  'About hero (tint adjustment)',
]

useHead({
  title: 'Hero Overlay Design Review | Comma',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>
