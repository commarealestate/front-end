<template>
  <footer 
    class="bg-comma-neutral-900 text-white relative overflow-hidden"
    :dir="direction"
  >
    <!-- Luxury background pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0 luxury-pattern-bg"></div>
    </div>
    
    <!-- Gold accent line -->
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-comma-secondary to-transparent"></div>

    <div class="container mx-auto px-4 lg:px-8 relative z-10">
      <!-- Main Footer Content -->
      <div class="pt-16 pb-12">
        <!-- Logo and Tagline -->
        <div class="flex flex-col items-center text-center mb-12">
          <NuxtLink to="/" class="mb-6 group">
            <img
              src="~/assets/images/logo.png"
              alt="Comma Real Estate"
              class="h-64 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
          </NuxtLink>
          <p class="text-comma-neutral-300 text-lg max-w-2xl  font-light">
            {{ $t('footer.tagline') }}
          </p>
        </div>

        <!-- Main Grid - 3 Columns -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          <!-- Column 1: About Comma -->
          <div>
            <h4 class="text-white font-semibold text-lg mb-6 relative">
              <span class="relative z-10">{{ $t('footer.about_title') }}</span>
              <span class="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-comma-primary rounded-full"></span>
            </h4>
            <p class="text-comma-neutral-300 text-sm leading-relaxed mb-4">
              {{ $t('footer.about_description') }}
            </p>
            <div class="flex gap-3">
              <a 
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2 rounded-full border border-comma-neutral-700 hover:border-comma-primary hover:bg-comma-primary/10 transition-all duration-300 group"
                :aria-label="`Follow us on ${social.name}`"
              >
                <Icon :name="social.icon" class="w-6 h-auto text-comma-neutral-400 group-hover:text-white transition-colors duration-300" />
              </a>
            </div>
          </div>

          <!-- Column 2: Quick Links (using nav items) -->
          <div>
            <h4 class="text-white font-semibold text-lg mb-6 relative">
              <span class="relative z-10">{{ $t('footer.quick_links') }}</span>
              <span class="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-comma-secondary rounded-full"></span>
            </h4>
            <ul class="space-y-2">
              <li v-for="link in navLinks" :key="link.path">
                <NuxtLink 
                  :to="localePath(link.path)" 
                  class="text-comma-neutral-300 hover:text-white transition-colors duration-300 flex items-center group text-sm"
                >
                  <Icon 
                    :name="direction === 'ltr' ? 'heroicons:chevron-right' : 'heroicons:chevron-left'" 
                    class="w-3 h-3 mr-2 text-comma-neutral-500 group-hover:text-comma-primary transition-colors duration-300" 
                  />
                  <span>{{ $t(link.label) }}</span>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Column 3: Contact Information -->
          <div>
            <h4 class="text-white font-semibold text-lg mb-6 relative">
              <span class="relative z-10">{{ $t('footer.contact_title') }}</span>
              <span class="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-comma-primary rounded-full"></span>
            </h4>
            
            <div class="space-y-4">
              <!-- Address -->
              <div class="flex items-start gap-3">
                <div class="p-2 rounded-lg bg-comma-primary/10 flex-shrink-0">
                  <Icon name="heroicons:map-pin" class="w-4 h-4 text-comma-primary" />
                </div>
                <div>
                  <p class="text-white text-sm">{{ $t('footer.address') }}</p>
                </div>
              </div>
              
              <!-- Phone -->
              <div class="flex items-start gap-3">
                <div class="p-2 rounded-lg bg-comma-primary/10 flex-shrink-0">
                  <Icon name="heroicons:phone" class="w-4 h-4 text-comma-primary" />
                </div>
                <div>
                  <a href="tel:+971508008879" dir="ltr" class="text-white text-sm hover:text-comma-secondary transition-colors duration-300">
                    +971 50 800 8879
                  </a>
                </div>
              </div>
              
              <!-- Email -->
              <div class="flex items-start gap-3">
                <div class="p-2 rounded-lg bg-comma-primary/10 flex-shrink-0">
                  <Icon name="heroicons:envelope" class="w-4 h-4 text-comma-primary" />
                </div>
                <div>
                  <a href="mailto:info@commarealestate.ae" class="text-white text-sm hover:text-comma-secondary transition-colors duration-300">
                    info@commarealestate.ae
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-comma-neutral-800 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <!-- Copyright -->
            <div class="text-comma-neutral-500 text-sm text-center md:text-left">
              &copy; {{ new Date().getFullYear() }} <span class="text-comma-primary font-semibold">Comma Real Estate</span>. 
              {{ $t('footer.all_rights') }}
            </div>
            
            <!-- Legal Links -->
            <!-- <div class="flex flex-wrap justify-center gap-6">
              <NuxtLink 
                v-for="link in legalLinks" 
                :key="link.label"
                :to="localePath(link.path)"
                class="text-comma-neutral-400 hover:text-white text-sm transition-colors duration-300 relative group"
              >
                {{ $t(link.label) }}
                <span class="absolute -bottom-1 left-0 w-0 h-px bg-comma-primary transition-all duration-300 group-hover:w-full"></span>
              </NuxtLink>
            </div> -->
            
            <!-- Back to Top -->
            <button
              @click="scrollToTop"
              class="text-comma-neutral-400 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2"
            >
              {{ $t('footer.back_to_top') }}
              <Icon name="heroicons:arrow-up" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const { locale } = useI18n();
const localePath = useLocalePath();

const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr');

// Navigation items from AppNavbar (reused)
const navLinks = [
  { label: 'nav.home', path: '/' },
  { label: 'nav.properties', path: '/properties' },
  { label: 'nav.agents', path: '/agents' },
  { label: 'nav.blogs', path: '/blogs' },
  { label: 'nav.about', path: '/about' },
  { label: 'nav.emiratisation', path: '/emiratisation' },
  { label: 'nav.careers', path: '/career' }
];

// Social Links (from company profile)
const socialLinks = [
  { name: 'Instagram', icon: 'mdi:instagram', url: 'https://www.instagram.com/commarealestate.ae' },
  { name: 'X', icon: 'ph:x-logo', url: 'https://x.com/commarealestate' },
  { name: 'LinkedIn', icon: 'mdi:linkedin', url: 'https://www.linkedin.com/company/comma-real-estate/' },
  { name: 'Facebook', icon: 'mdi:facebook', url: 'https://www.facebook.com/Commarealestate/' },
  { name: 'Youtube', icon: 'mdi:youtube', url: 'https://www.youtube.com/@CommaRealEstate' },
  { name: 'Tiktok', icon: 'ph:tiktok-logo', url: 'https://www.tiktok.com/@CommaRealEstate' }
];

// Legal Links
const legalLinks = [
  { label: 'footer.privacy', path: '/privacy' },
  { label: 'footer.terms', path: '/terms' }
];

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
.luxury-pattern-bg {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='%238E084D' stroke-width='0.5' opacity='0.2'/%3E%3C/svg%3E");
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>