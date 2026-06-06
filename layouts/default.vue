<template>
  <div id="app-root" class="relative min-h-screen font-sans  flex flex-col transition-colors duration-300"
    :dir="direction">
    <!-- Premium Header with subtle gradient -->
    <AppNavbar />

    <!-- Main content area with luxury pattern -->
    <main class="relative flex-grow ">
      <!-- Elegant background pattern -->
      <div class="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div class="absolute inset-0 luxury-pattern-bg"></div>
      </div>

      <!-- Content slot with subtle container -->
      <div class="relative z-10">
        <div class=" mx-auto">
          <slot />
        </div>
      </div>
    </main>

    <!-- Luxury Footer -->
    <AppFooter />

    <!-- Floating Promo Widget -->
    <PromoWidget />

    <!-- Back to top button -->
    <button v-show="showBackToTop" @click="scrollToTop"
      class="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-comma-primary text-white shadow-luxury hover:shadow-hover hover:scale-110 transition-all duration-300 group"
      :class="{ 'right-auto left-8': direction === 'rtl' }" aria-label="Back to top">
      <Icon name="heroicons:chevron-up" class="w-5 h-5 transition-transform group-hover:-translate-y-1" />
    </button>
  </div>
</template>

<script setup>
const { locale } = useI18n()
const showBackToTop = ref(false)

const direction = computed(() => {
  return locale.value === 'ar' ? 'rtl' : 'ltr'
})

// Handle scroll for back to top button
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 500
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

useHead({
  htmlAttrs: {
    lang: locale.value,
    dir: direction.value,
  },
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Comma Real Estate` : 'Comma Real Estate - Premium Real Estate Advisory'
  },
  meta: [
    {
      name: 'description',
      content: 'Comma Real Estate — A calm, advisory-first approach to luxury real estate. We value clarity, trust, and thoughtful decision-making over speed or volume.'
    },
    {
      name: 'theme-color',
      content: '#FAF9F8'
    }
  ],
  script: [
    {
      key: 'bitrix',
      children: `(function(w,d,u){
        var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/60000|0);
        var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
      })(window,document,'https://cdn.bitrix24.ae/b36322915/crm/site_button/loader_2_gg522r.js');`
    }
  ],
  __dangerouslyDisableSanitizersByTagID: {
    bitrix: ['children']
  }
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // Custom smooth scroll for anchor links
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]')
    if (anchor) {
      e.preventDefault()
      const targetId = anchor.getAttribute('href').substring(1)
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
/* Custom scrollbar with luxury styling */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #FAF9F8;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #8E084D 0%, #B43E66 100%);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #5C0431 0%, #8E084D 100%);
}

/* Smooth transitions */
* {
  scroll-behavior: smooth;
}

/* Focus styles */
:focus-visible {
  outline: 2px solid #8E084D;
  outline-offset: 3px;
  border-radius: 2px;
}

/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* Page transition */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Luxury text selection */
::selection {
  background-color: rgba(142, 8, 77, 0.1);
  color: #8E084D;
}

.luxury-pattern-bg {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='%238E084D' stroke-width='0.5' opacity='0.2'/%3E%3C/svg%3E");
}
</style>