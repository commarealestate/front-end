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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            <span class="font-semibold text-sm tracking-wider uppercase">Legal</span>
          </div>
          
          <h1 class="text-4xl md:text-6xl font-bold mb-4">
            {{ $t('legal.refundPolicy.title') }}
          </h1>
          <p class="text-xl opacity-90 max-w-2xl mx-auto">
            {{ $t('legal.refundPolicy.subtitle') }}
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
              {{ $t('legal.refundPolicy.lastUpdated') }}: {{ $t('legal.refundPolicy.updateDate') }}
            </p>
          </div>

          <!-- Introduction -->
          <div class="mb-12">
            <h2 class="text-3xl font-bold text-bestlink-black mb-6 flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-bestlink-green to-bestlink-light-green rounded-xl flex items-center justify-center mr-4">
                <span class="text-white font-bold">1</span>
              </div>
              {{ $t('legal.refundPolicy.sections.introduction.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed text-lg">
              {{ $t('legal.refundPolicy.sections.introduction.content') }}
            </p>
          </div>

          <!-- Service-Specific Policies -->
          <div class="mb-12">
            <h2 class="text-3xl font-bold text-bestlink-black mb-8 flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-bestlink-green to-bestlink-light-green rounded-xl flex items-center justify-center mr-4">
                <span class="text-white font-bold">2</span>
              </div>
              {{ $t('legal.refundPolicy.sections.services.title') }}
            </h2>
            
            <!-- Import/Export Services -->
            <div class="mb-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
              <h3 class="text-xl font-bold text-bestlink-black mb-3 flex items-center">
                <svg class="w-6 h-6 text-bestlink-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ $t('legal.refundPolicy.sections.services.import.title') }}
              </h3>
              <p class="text-gray-700 leading-relaxed text-lg">
                {{ $t('legal.refundPolicy.sections.services.import.content') }}
              </p>
            </div>

            <!-- Design Services -->
            <div class="mb-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
              <h3 class="text-xl font-bold text-bestlink-black mb-3 flex items-center">
                <svg class="w-6 h-6 text-bestlink-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ $t('legal.refundPolicy.sections.services.design.title') }}
              </h3>
              <p class="text-gray-700 leading-relaxed text-lg">
                {{ $t('legal.refundPolicy.sections.services.design.content') }}
              </p>
            </div>

            <!-- Translation Services -->
            <div class="mb-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
              <h3 class="text-xl font-bold text-bestlink-black mb-3 flex items-center">
                <svg class="w-6 h-6 text-bestlink-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ $t('legal.refundPolicy.sections.services.translation.title') }}
              </h3>
              <p class="text-gray-700 leading-relaxed text-lg">
                {{ $t('legal.refundPolicy.sections.services.translation.content') }}
              </p>
            </div>
          </div>

          <!-- Refund Conditions -->
          <div class="mb-12">
            <h2 class="text-3xl font-bold text-bestlink-black mb-6 flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-bestlink-green to-bestlink-light-green rounded-xl flex items-center justify-center mr-4">
                <span class="text-white font-bold">3</span>
              </div>
              {{ $t('legal.refundPolicy.sections.conditions.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-6 text-lg">
              {{ $t('legal.refundPolicy.sections.conditions.content') }}
            </p>
            <ul class="space-y-4">
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-green mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.refundPolicy.sections.conditions.list.timeline') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-green mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.refundPolicy.sections.conditions.list.documentation') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-green mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.refundPolicy.sections.conditions.list.communication') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-green mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.refundPolicy.sections.conditions.list.completion') }}</span>
              </li>
            </ul>
          </div>

          <!-- Refund Process -->
          <div class="mb-12">
            <h2 class="text-3xl font-bold text-bestlink-black mb-6 flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-bestlink-green to-bestlink-light-green rounded-xl flex items-center justify-center mr-4">
                <span class="text-white font-bold">4</span>
              </div>
              {{ $t('legal.refundPolicy.sections.process.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-8 text-lg">
              {{ $t('legal.refundPolicy.sections.process.content') }}
            </p>
            <div class="space-y-6">
              <div class="flex items-start p-6 bg-gradient-to-r from-bestlink-green/5 to-transparent rounded-2xl border-l-4 border-bestlink-green">
                <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-bestlink-green to-bestlink-light-green text-white rounded-xl flex items-center justify-center font-bold text-lg mr-4 shadow-lg">1</div>
                <p class="text-gray-700 text-lg pt-2">{{ $t('legal.refundPolicy.sections.process.steps.contact') }}</p>
              </div>
              <div class="flex items-start p-6 bg-gradient-to-r from-bestlink-green/5 to-transparent rounded-2xl border-l-4 border-bestlink-green">
                <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-bestlink-green to-bestlink-light-green text-white rounded-xl flex items-center justify-center font-bold text-lg mr-4 shadow-lg">2</div>
                <p class="text-gray-700 text-lg pt-2">{{ $t('legal.refundPolicy.sections.process.steps.review') }}</p>
              </div>
              <div class="flex items-start p-6 bg-gradient-to-r from-bestlink-green/5 to-transparent rounded-2xl border-l-4 border-bestlink-green">
                <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-bestlink-green to-bestlink-light-green text-white rounded-xl flex items-center justify-center font-bold text-lg mr-4 shadow-lg">3</div>
                <p class="text-gray-700 text-lg pt-2">{{ $t('legal.refundPolicy.sections.process.steps.processing') }}</p>
              </div>
            </div>
          </div>

          <!-- Non-Refundable Items -->
          <div class="mb-12">
            <h2 class="text-3xl font-bold text-bestlink-black mb-6 flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-bestlink-red to-red-700 rounded-xl flex items-center justify-center mr-4">
                <span class="text-white font-bold">5</span>
              </div>
              {{ $t('legal.refundPolicy.sections.nonRefundable.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed mb-6 text-lg">
              {{ $t('legal.refundPolicy.sections.nonRefundable.content') }}
            </p>
            <ul class="space-y-4">
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-red mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.refundPolicy.sections.nonRefundable.list.completed') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-red mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.refundPolicy.sections.nonRefundable.list.custom') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-red mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.refundPolicy.sections.nonRefundable.list.thirdParty') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-bestlink-red mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span class="text-gray-700 text-lg">{{ $t('legal.refundPolicy.sections.nonRefundable.list.consultation') }}</span>
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
  title: 'Refund Policy - Best Link General Trading',
  meta: [
    { name: 'description', content: 'Refund policy for Best Link General Trading services including terms and conditions for refunds on our import, export, design, and translation services.' }
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
