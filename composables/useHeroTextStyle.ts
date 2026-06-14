export type HeroOverlayVariant = 'current' | 'balanced' | 'bright'

/** Site-wide hero overlay — Option C (bright) */
export const SITE_HERO_VARIANT: HeroOverlayVariant = 'bright'

export function useSiteHero() {
  const variant = ref(SITE_HERO_VARIANT)
  return {
    variant,
    ...useHeroTextStyle(variant),
  }
}

export function useHeroTextStyle(variant: MaybeRef<HeroOverlayVariant>) {
  const headingClass = computed(() => {
    const v = unref(variant)
    if (v === 'bright') {
      return 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]'
    }
    if (v === 'current') {
      return 'text-white'
    }
    return 'text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]'
  })

  const bodyClass = computed(() => {
    const v = unref(variant)
    if (v === 'bright') {
      return 'text-white/95 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]'
    }
    if (v === 'current') {
      return 'text-comma-neutral-200'
    }
    return 'text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]'
  })

  const contentPanelClass = computed(() => {
    const v = unref(variant)
    if (v !== 'bright') return ''
    return 'rounded-2xl bg-black/20 backdrop-blur-[2px] px-6 py-8 sm:px-8 sm:py-10'
  })

  const mediaBoostClass = computed(() => {
    const v = unref(variant)
    if (v === 'current') return ''
    if (v === 'balanced') return 'brightness-[1.06] contrast-[1.03] saturate-[1.05]'
    return 'brightness-[1.1] contrast-[1.04] saturate-[1.08]'
  })

  return { headingClass, bodyClass, contentPanelClass, mediaBoostClass }
}
