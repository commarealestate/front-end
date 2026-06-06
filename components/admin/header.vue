<template>
  <header
    class="sticky top-0 z-30 bg-gradient-to-r from-comma-primary to-comma-primary-dark text-white shadow-md border-b border-comma-primary-dark"
  >
    <div class="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
      <!-- Mobile sidebar toggle -->
      <button
        @click="$emit('toggle-sidebar')"
        class="lg:hidden p-2 rounded-lg text-white/90 hover:bg-white/10 transition-colors"
      >
        <AdminLocalIcon name="bars-3" class="w-6 h-6" />
      </button>

      <!-- Page title -->
      <h1 class="text-lg sm:text-xl font-semibold truncate">
        {{ $t('admin.Dashboard') }}
      </h1>

      <!-- Actions -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Language toggle -->
        <UButton
          variant="ghost"
          size="sm"
          class="text-white hover:bg-white/10"
          @click="toggleLanguage"
        >
          <AdminLocalIcon name="language" class="w-5 h-5 ltr:mr-1 rtl:ml-1" />
          <span class="hidden sm:inline">{{ currentLangLabel }}</span>
        </UButton>

        <!-- Notifications -->
        <UButton
          variant="ghost"
          size="sm"
          class="text-white hover:bg-white/10"
          @click="goToNotifications"
        >
          <AdminLocalIcon name="bell" class="w-5 h-5" />
        </UButton>

        <!-- User menu -->
        <UDropdown :items="menuItems" :popper="{ placement: dropdownPlacement }">
          <button
            class="p-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all"
          >
            <img
              src="/images/avatar2.jpg"
              alt="User avatar"
              class="h-6 w-6 rounded-md object-cover"
            />
          </button>
          <template #account="{ item }">
            <div class="px-4 py-3 border-b border-comma-border-subtle">
              <p class="text-xs text-comma-neutral-600">{{ $t('admin.signed_in_as') }}</p>
              <p class="text-sm font-medium truncate">{{ item.label }}</p>
            </div>
          </template>
        </UDropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { UserRole } from '~/ts/enums/Role';

const emit = defineEmits(['toggle-sidebar'])
const { t, locale } = useI18n()
const router = useRouter()
const switchLocalePath = useSwitchLocalePath()

/* auth – adjust to your auth store */
const authStore = getCurrentAuthStore(UserRole.ADMIN);
const { authenticatedUser, logUserOut } = authStore;

// ========== LANGUAGE SWITCH ==========
const isSwitching = ref(false)
const currentLangLabel = locale.value === 'ar' ? 'EN' : 'عربي'

const toggleLanguage = async () => {
  if (isSwitching.value) return
  isSwitching.value = true

  const newLang = locale.value === 'ar' ? 'en' : 'ar'

  const overlay = document.createElement('div')
  overlay.id = 'lang-switch-overlay'
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: white;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  `
  document.body.appendChild(overlay)
  requestAnimationFrame(() => (overlay.style.opacity = '1'))

  await navigateTo(switchLocalePath(newLang))

  setTimeout(() => {
    window.location.reload()
  }, 200)
}

// ========== DROPDOWN ==========
const menuItems = [
  [
    {
      label: authenticatedUser.email,
      slot: 'account',
      disabled: true
    }
  ],
  [
    {
      label: t('admin.profile'),
      icon: 'i-heroicons-user-circle',
      click: () => navigateTo('/admin/profile')
    },
    {
      label: t('admin.logout'),
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: () => logUserOut()
    }
  ]
]

const dropdownPlacement = computed(() =>
  locale.value === 'ar' ? 'bottom-start' : 'bottom-end'
)

const goToNotifications = () => {
  navigateTo('/admin/notifications')
}
</script>

<style>
#lang-switch-overlay {
  backdrop-filter: blur(3px);
}
</style>
