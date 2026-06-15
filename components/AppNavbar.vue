<template>
  <header
    ref="navbar"
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="{
      'bg-white/95 backdrop-blur-md shadow-luxury': isScrolled,
      'bg-white': !isScrolled,
      'border-b border-comma-border-subtle': isScrolled,
      'border-transparent': !isScrolled
    }"
  >
   

    <nav class="container mx-auto px-4 lg:px-6">
      <div class="flex items-center justify-between h-20 lg:h-24">
        
        <!-- Logo (Left in LTR, Right in RTL) -->
        <div class="flex-shrink-0 order-1">
          <NuxtLink :to="localePath('/')" class="flex items-center group">
            <img
              src="~/assets/images/logo.png"
              alt="Comma Real Estate"
              class="h-16 lg:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              loading="eager"
            />
          </NuxtLink>
        </div>

        <!-- Desktop Navigation (Center in LTR, also Center in RTL but order changes) -->
        <div class="hidden lg:flex items-center justify-center flex-1 order-2">
          <div class="flex items-center space-x-8" :class="{ 'space-x-reverse': direction === 'rtl' }">
            <NuxtLink
              v-for="item in allNavItems"
              :key="item.path"
              :to="localePath(item.path)"
              class="group relative text-sm font-bold transition-all duration-300"
              :class="{
                'text-comma-primary': isActiveLink(item.path),
                'text-comma-neutral-700 hover:text-comma-primary': !isActiveLink(item.path)
              }"
            >
              <span class="relative">
                {{ $t(item.label) }}
                <span
                  class="absolute -bottom-1 left-0 w-0 h-0.5 bg-comma-primary transition-all duration-300 group-hover:w-full"
                  :class="{ 'w-full': isActiveLink(item.path) }"
                />
              </span>
            </NuxtLink>
          </div>
        </div>

        <!-- Desktop Actions (Right in LTR, Left in RTL) -->
        <div class="hidden lg:flex items-center space-x-4 order-3" :class="{ 'space-x-reverse': direction === 'rtl' }">
          <!-- Language Switcher (Premium) -->
          <button
            @click="toggleLanguage"
            class="flex items-center space-x-2 px-3 py-2 rounded-lg border border-comma-border-subtle hover:border-comma-primary hover:shadow-sm transition-all duration-300 group"
            :class="{ 'space-x-reverse': direction === 'rtl' }"
            :disabled="isSwitching"
          >
            <span class="fi text-base" :class="currentFlag"></span>
            <span class="text-sm font-medium text-comma-neutral-700 group-hover:text-comma-primary">{{ locale === 'en' ? 'EN' : 'AR' }}</span>
            <Icon
              :name="isSwitching ? 'heroicons:arrow-path' : 'heroicons:chevron-down'"
              class="w-3 h-3 text-comma-neutral-400 transition-transform duration-300 group-hover:text-comma-primary"
              :class="{ 'animate-spin': isSwitching }"
            />
          </button>

          <!-- Contact Button (Premium) -->
          <NuxtLink
            :to="localePath('/contact')"
            class="px-5 py-2.5 bg-gradient-to-r from-comma-primary to-comma-primary-dark text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <Icon name="heroicons:phone" class="w-4 h-4" />
            {{ $t('nav.contact') }}
          </NuxtLink>
        </div>

        <!-- Mobile Menu Toggle -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="lg:hidden p-2 rounded-lg text-comma-neutral-600 hover:text-comma-primary transition-colors duration-300 order-3"
        >
          <Icon
            :name="isMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'"
            class="w-6 h-6"
          />
        </button>
      </div>
    </nav>

    <!-- Mobile Menu (Premium Slide-down) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div 
        v-if="isMenuOpen" 
        class="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-comma-border-subtle shadow-lg z-40"
      >
        <div class="container mx-auto px-4 py-4 space-y-4">
          
          <!-- Mobile Navigation -->
          <div class="space-y-1">
            <NuxtLink 
              v-for="item in allNavItems" 
              :key="item.path"
              :to="localePath(item.path)"
              class="block p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary transition-all duration-300"
              :class="{ 'border-comma-primary bg-comma-primary/5': isActiveLink(item.path) }"
              @click="isMenuOpen = false"
            >
              <div class="flex items-center gap-3" :class="{ 'flex-row-reverse': direction === 'rtl' }">
                <Icon :name="item.icon" class="w-4 h-4 text-comma-primary" />
                <span class="text-sm font-medium text-comma-neutral-800">{{ $t(item.label) }}</span>
              </div>
            </NuxtLink>
          </div>
          
          <!-- Mobile Actions -->
          <div class="pt-4 border-t border-comma-border-subtle space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="toggleLanguage"
                class="p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary transition-colors duration-300 flex items-center justify-center gap-2"
                :disabled="isSwitching"
              >
                <span class="fi" :class="currentFlag"></span>
                <span class="text-sm font-medium">{{ locale === 'en' ? 'العربية' : 'English' }}</span>
              </button>
            </div>
            
            <NuxtLink
              :to="localePath('/contact')"
              class="block w-full py-3 text-center bg-gradient-to-r from-comma-primary to-comma-primary-dark text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              @click="isMenuOpen = false"
            >
              <Icon name="heroicons:phone" class="w-4 h-4" />
              {{ $t('nav.contact') }}
            </NuxtLink>
            
            <div class="space-y-2">
              <a 
                :href="telLink" 
                class="flex items-center gap-3 p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary transition-colors duration-300"
              >
                <div class="w-8 h-8 rounded-full bg-comma-primary/10 flex items-center justify-center">
                  <Icon name="heroicons:phone" class="w-4 h-4 text-comma-primary" />
                </div>
                <div>
                  <div class="text-xs text-comma-neutral-400">{{ $t('nav.call_us') }}</div>
                  <div class="text-sm font-medium text-comma-neutral-700" dir="ltr">{{ phoneDisplay }}</div>
                </div>
              </a>
              <a 
                :href="mailtoLink" 
                class="flex items-center gap-3 p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary transition-colors duration-300"
              >
                <div class="w-8 h-8 rounded-full bg-comma-primary/10 flex items-center justify-center">
                  <Icon name="heroicons:envelope" class="w-4 h-4 text-comma-primary" />
                </div>
                <div>
                  <div class="text-xs text-comma-neutral-400">{{ $t('nav.email_us') }}</div>
                  <div class="text-sm font-medium text-comma-neutral-700">{{ email }}</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Language Overlay -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showLanguageOverlay" 
        class="fixed inset-0 bg-white/90 backdrop-blur-sm z-[9999] flex items-center justify-center"
      >
        <div class="text-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-comma-primary mx-auto mb-3"></div>
          <p class="text-comma-neutral-600 font-medium text-sm">{{ $t('nav.switching_language') }}</p>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import "flag-icons/css/flag-icons.min.css";
import { onMounted, onUnmounted } from 'vue';

const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const { locale, t } = useI18n();
const route = useRoute();
const navigateTo = useRouter().push;

// State
const isSwitching = ref(false);
const isMenuOpen = ref(false);
const isScrolled = ref(false);
const showLanguageOverlay = ref(false);

const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr');
const { email, phoneDisplay, telLink, mailtoLink } = useSiteContact('info')

// Navigation Items
const allNavItems = [
  { label: 'nav.home', path: '/', icon: 'heroicons:home' },
  { label: 'nav.properties', path: '/properties', icon: 'heroicons:building-office' },
  { label: 'nav.agents', path: '/agents', icon: 'heroicons:users' },
  { label: 'nav.projects', path: '/projects', icon: 'heroicons:building-office' },
  { label: 'nav.blogs', path: '/blogs', icon: 'heroicons:newspaper' },
  { label: 'nav.about', path: '/about', icon: 'heroicons:information-circle' },
  { label: 'nav.emiratisation', path: '/emiratisation', icon: 'heroicons:flag' },
  { label: 'nav.careers', path: '/career', icon: 'heroicons:briefcase' }
];

// Computed
const currentFlag = computed(() => {
  return locale.value === 'en' ? 'fi fi-us' : 'fi fi-ae';
});

// Methods
const isActiveLink = (to: string) => {
  if (to === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(to) && to !== '/';
};

const showLanguageOverlayFn = () => {
  showLanguageOverlay.value = true;
};

const toggleLanguage = async () => {
  if (isSwitching.value) return;
  isSwitching.value = true;
  
  showLanguageOverlayFn();

  try {
    await navigateTo(switchLocalePath(locale.value === 'ar' ? 'en' : 'ar'));
    
    setTimeout(() => {
      window.location.reload();
    }, 300);
  } finally {
    isSwitching.value = false;
  }
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

// Watchers & Lifecycle
watch(() => route.path, () => {
  isMenuOpen.value = false;
});

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Subtle hover effect for buttons */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 40px rgba(142, 8, 77, 0.15);
}

/* Ensure logo has enough space */
img {
  will-change: transform;
}
</style>