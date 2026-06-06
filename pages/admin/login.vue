<template>
  <div class="relative min-h-screen flex flex-col lg:flex-row overflow-hidden bg-comma-neutral-50">
    <!-- Language Switcher (absolute on both halves) -->
    <div class="absolute top-4 right-4 z-20" :class="{ 'left-4 right-auto': locale === 'ar' }">
      <UButton
        variant="ghost"
        size="sm"
        class="text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
        @click="toggleLanguage"
      >
        <Icon name="i-heroicons-language" class="w-5 h-5 mr-1" />
        <span>{{ locale === 'ar' ? 'EN' : 'عربي' }}</span>
      </UButton>
    </div>

    <!-- Left side – Luxury Real Estate Image (hidden on mobile, visible on lg) -->
    <div 
      class="hidden lg:flex lg:w-1/2 relative bg-cover bg-center" 
      :style="{ backgroundImage: `url(${imageSrc})` }"
    >
      <!-- Gradient overlay with strata colors -->
      <div class="absolute inset-0 bg-gradient-to-r from-comma-primary-dark/80 to-comma-secondary/30"></div>
      
      <!-- Decorative pattern overlay -->
      <div class="absolute inset-0 opacity-10 bg-grid-white/[0.02] bg-grid-pattern"></div>

      <div class="relative z-10 flex flex-col justify-end p-12 text-white">
        <h1 class="text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg font-display">
          {{ t('admin.welcome_back') }}
        </h1>
        <p class="text-lg text-white/90 max-w-md drop-shadow leading-relaxed">
          {{ t('admin.access_dashboard') }}
        </p>
      </div>
    </div>

    <!-- Right side – Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 bg-comma-neutral-50 lg:bg-transparent">
      <!-- Card with luxury backdrop blur -->
      <div class="w-full max-w-md p-8 rounded-2xl bg-white/90 backdrop-blur-md shadow-luxury border border-comma-border-subtle">
        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <img
            src="~/assets/images/logo.png"
            alt="Comma Real Estate"
            class="h-16 drop-shadow-md"
          />
        </div>

        <!-- Form Title (visible on mobile, hidden on large screens because left side already has title) -->
        <h2 class="text-2xl font-bold text-center mb-2 text-comma-neutral-800 lg:hidden font-display">
          {{ t('admin.welcome_back') }}
        </h2>

        <!-- Error Message -->
        <div
          v-if="msg"
          class="flex items-center gap-2 bg-red-50 border border-red-200 text-comma-neutral-800 px-4 py-2 rounded-lg mb-4"
        >
          <Icon name="material-symbols:info-outline" class="text-red-600" />
          <span class="text-sm">{{ t(msg) }}</span>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="login" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-comma-neutral-700 mb-2">
              {{ t('admin.email') }}
            </label>
            <input
              v-model="user.email"
              type="email"
              :placeholder="'admin@commarealestate.ae'"
              class="w-full px-4 py-3 rounded-lg bg-white border border-comma-border-subtle placeholder-comma-neutral-400 text-comma-neutral-800 focus:ring-2 focus:ring-comma-primary focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-comma-neutral-700 mb-2">
              {{ t('admin.password') }}
            </label>
            <input
              v-model="user.password"
              type="password"
              :placeholder="'••••••••'"
              class="w-full px-4 py-3 rounded-lg bg-white border border-comma-border-subtle placeholder-comma-neutral-400 text-comma-neutral-800 focus:ring-2 focus:ring-comma-primary focus:border-transparent outline-none transition"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 mt-4 rounded-lg font-semibold text-white bg-gradient-to-r from-comma-primary to-comma-primary-dark hover:from-comma-primary-light hover:to-comma-primary transition-all shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <Icon v-if="loading" name="eos-icons:loading" class="animate-spin w-5 h-5" />
            <span>{{ loading ? t('admin.signing_in') : t('admin.sign_in') }}</span>
          </button>
        </form>

        <!-- Optional footer note -->
        <p class="text-xs text-comma-neutral-500 text-center mt-6">
          {{ t('admin.secure_access') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/store/admin/auth'
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: 'admin-auth',
})

const { t, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()
const { authenticateUser } = useAuthStore()
const { authenticated, loading, msg } = storeToRefs(useAuthStore())

const user = ref({
  email: '',
  password: '',
})

// High-quality luxury real estate image (replace with your own)
const imageSrc = ref('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')

// Language toggle
const toggleLanguage = async () => {
  const newLang = locale.value === 'ar' ? 'en' : 'ar'
  await navigateTo(switchLocalePath(newLang))
}

const login = async () => {
  await authenticateUser(user.value)
  if (authenticated.value) {
    router.push(locale.value === 'ar' ? '/ar/admin' : '/admin')
  }
}
</script>

<style scoped>
/* Grid pattern overlay */
.bg-grid-pattern {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white' stroke-opacity='0.1'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>