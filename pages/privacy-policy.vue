<template>
  <div class="min-h-screen bg-gradient-to-br from-bestlink-green/5 to-white">
    <!-- Modern hero header -->
    <section class="relative py-24 bg-gradient-to-br from-bestlink-green via-bestlink-light-green to-bestlink-green overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute top-20 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-10 w-80 h-80 bg-bestlink-red/20 rounded-full blur-3xl animate-float-delayed"></div>
      </div>
      
      <div class="relative container mx-auto px-4">
        <div class="text-center text-white max-w-4xl mx-auto">
          <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-6">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <span class="font-semibold text-sm tracking-wider uppercase">Legal</span>
          </div>
          
          <h1 class="text-4xl md:text-6xl font-bold mb-4">
            {{ $t('legal.privacyPolicy.title') }}
          </h1>
          <p class="text-xl opacity-90 max-w-2xl mx-auto">
            {{ $t('legal.privacyPolicy.subtitle') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-16 lg:py-20">
      <div class="container mx-auto px-4 max-w-5xl">
        <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 border border-bestlink-light-green/20">
          
          <!-- Last Updated -->
          <div class="mb-12 p-6 bg-gradient-to-r from-bestlink-green/10 to-bestlink-light-green/10 rounded-2xl border-l-4 border-bestlink-green">
            <p class="text-bestlink-black font-semibold text-lg">
              {{ $t('legal.privacyPolicy.lastUpdated') }}: {{ $t('legal.privacyPolicy.updateDate') }}
            </p>
          </div>

          <!-- Introduction -->
          <div class="mb-12">
            <h2 class="text-3xl font-bold text-bestlink-black mb-6 flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-bestlink-green to-bestlink-light-green rounded-xl flex items-center justify-center mr-4">
                <span class="text-white font-bold">1</span>
              </div>
              {{ $t('legal.privacyPolicy.sections.introduction.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed text-lg">
              {{ $t('legal.privacyPolicy.sections.introduction.content') }}
            </p>
          </div>

          <!-- Information We Collect -->
          <div class="mb-12">
            <h2 class="text-3xl font-bold text-bestlink-black mb-6 flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-bestlink-green to-bestlink-light-green rounded-xl flex items-center justify-center mr-4">
                <span class="text-white font-bold">2</span>
              </div>
              {{ $t('legal.privacyPolicy.sections.collection.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-6 text-lg">
              {{ $t('legal.privacyPolicy.sections.collection.content') }}
            </p>
            <ul class="space-y-4">
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-green mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.privacyPolicy.sections.collection.list.personal') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-green mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.privacyPolicy.sections.collection.list.contact') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-green mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.privacyPolicy.sections.collection.list.business') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-green mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.privacyPolicy.sections.collection.list.technical') }}</span>
              </li>
            </ul>
          </div>

          <!-- How We Use Information -->
          <div class="mb-12">
            <h2 class="text-3xl font-bold text-bestlink-black mb-6 flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-bestlink-green to-bestlink-light-green rounded-xl flex items-center justify-center mr-4">
                <span class="text-white font-bold">3</span>
              </div>
              {{ $t('legal.privacyPolicy.sections.usage.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-6 text-lg">
              {{ $t('legal.privacyPolicy.sections.usage.content') }}
            </p>
            <ul class="space-y-4">
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-green mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.privacyPolicy.sections.usage.list.services') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-green mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.privacyPolicy.sections.usage.list.communication') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-green mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.privacyPolicy.sections.usage.list.improvement') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-green mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.privacyPolicy.sections.usage.list.legal') }}</span>
              </li>
            </ul>
          </div>

          <!-- Information Sharing -->
          <div class="mb-12">
            <h2 class="text-3xl font-bold text-bestlink-black mb-6 flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-bestlink-green to-bestlink-light-green rounded-xl flex items-center justify-center mr-4">
                <span class="text-white font-bold">4</span>
              </div>
              {{ $t('legal.privacyPolicy.sections.sharing.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed text-lg">
              {{ $t('legal.privacyPolicy.sections.sharing.content') }}
            </p>
          </div>

          <!-- Data Security -->
          <div class="mb-12">
            <h2 class="text-3xl font-bold text-bestlink-black mb-6 flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-bestlink-green to-bestlink-light-green rounded-xl flex items-center justify-center mr-4">
                <span class="text-white font-bold">5</span>
              </div>
              {{ $t('legal.privacyPolicy.sections.security.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed text-lg">
              {{ $t('legal.privacyPolicy.sections.security.content') }}
            </p>
          </div>

          <!-- Your Rights -->
          <div class="mb-12">
            <h2 class="text-3xl font-bold text-bestlink-black mb-6 flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-bestlink-green to-bestlink-light-green rounded-xl flex items-center justify-center mr-4">
                <span class="text-white font-bold">6</span>
              </div>
              {{ $t('legal.privacyPolicy.sections.rights.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-6 text-lg">
              {{ $t('legal.privacyPolicy.sections.rights.content') }}
            </p>
            <ul class="space-y-4">
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-green mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.privacyPolicy.sections.rights.list.access') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-green mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.privacyPolicy.sections.rights.list.correction') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-green mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.privacyPolicy.sections.rights.list.deletion') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-green mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.privacyPolicy.sections.rights.list.portability') }}</span>
              </li>
            </ul>
          </div>

          <!-- Contact Information -->
          <div class="mt-16 p-8 bg-gradient-to-br from-bestlink-green/10 via-bestlink-light-green/5 to-transparent rounded-2xl border border-bestlink-green/20">
            <h3 class="text-2xl font-bold text-bestlink-black mb-6">
              {{ $t('legal.contact.title') }}
            </h3>
            <div class="space-y-3">
              <p class="text-gray-700 text-lg">
                <strong class="text-bestlink-black">{{ $t('legal.contact.email') }}:</strong> info@uaebestlink.com
              </p>
              <p class="text-gray-700 text-lg">
                <strong class="text-bestlink-black">{{ $t('legal.contact.phone') }}:</strong> +971 506122283
              </p>
              <p class="text-gray-700 text-lg">
                <strong class="text-bestlink-black">{{ $t('legal.contact.address') }}:</strong> Al Ain, Abu Dhabi, United Arab Emirates
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>

useHead({
  title: 'Privacy Policy - Best Link General Trading',
  meta: [
    { name: 'description', content: 'Privacy policy for Best Link General Trading explaining how we collect, use, and protect your personal information.' }
  ]
})
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(15px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(20px) translateX(-15px);
  }
}

.animate-float {
  animation: float 15s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 20s ease-in-out infinite;
}
</style>
