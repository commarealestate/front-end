<template>
  <div v-if="property" class="min-h-screen bg-comma-neutral-50" :dir="direction">
    <!-- Hero Section with Parallax Effect -->
    <section class="relative h-[70vh] lg:h-[80vh] overflow-hidden pt-16 bg-comma-neutral-900">
      <div class="absolute inset-0">
        <img :src="heroImage" :alt="propertyTitle" loading="lazy"
          class="w-full h-full object-cover transform scale-105 transition-transform duration-1000 group-hover:scale-100"
          @error="handleImageError" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
      </div>
      <div class="absolute inset-0 flex items-end pb-12 lg:pb-20">
        <div class="container mx-auto px-4 lg:px-8">
          <div class="max-w-4xl animate-slide-up">
            <!-- Badges -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="px-3 py-1 bg-comma-primary text-white text-sm font-semibold rounded-full shadow-lg">
                {{ property.saleType }}
              </span>
              <span v-if="property.offeringType"
                class="px-3 py-1 bg-comma-secondary text-white text-sm font-semibold rounded-full shadow-lg">
                {{ property.offeringType }}
              </span>
            </div>
            <h1 class="text-3xl lg:text-5xl xl:text-6xl font-bold text-white font-display leading-tight">
              {{ propertyTitle }}
            </h1>
            <div class="flex flex-wrap items-center gap-4 mt-4 text-white/90">
              <div class="flex items-center gap-1">
                <Icon name="mdi:map-marker" class="w-5 h-5" />
                <span>{{ property.location }}<span v-if="property.city">, {{ property.city }}</span></span>
              </div>
              <div class="flex items-center gap-1">
                <Icon name="mdi:tag" class="w-5 h-5" />
                <span>{{ $t('property_page.ref') }}: {{ property.referenceNumber }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-12 lg:py-16">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="grid lg:grid-cols-3 gap-8 xl:gap-12">
          <!-- Left Column (2/3) -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Price & Quick Info Card -->
            <div
              class="bg-white rounded-2xl shadow-luxury border border-comma-border-subtle p-6 lg:p-8 transition-all hover:shadow-hover">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 class="text-2xl lg:text-3xl font-bold text-comma-neutral-900 font-display">{{ propertyTitle }}
                  </h2>
                  <p class="text-comma-neutral-600 mt-1 flex items-center gap-1">
                    <Icon name="mdi:map-marker" class="w-4 h-4 text-comma-primary" />
                    {{ property.location }} <span v-if="property.city">, {{ property.city }}</span>
                  </p>
                </div>
                <div class="text-left lg:text-right">
                  <div class="text-3xl lg:text-4xl font-bold text-comma-primary flex items-center gap-2">
                    <Icon name="mdi:cash" class="w-7 h-7" />
                    {{ formatPrice(property.price) }}
                  </div>
                  <p class="text-sm text-comma-neutral-500 mt-1">
                    {{ $t('property_page.price_negotiable') }}
                  </p>
                </div>
              </div>

              <!-- Features Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-8 pt-6 border-t border-comma-border-subtle">
                <div class="text-center group">
                  <div
                    class="w-12 h-12 mx-auto bg-comma-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-comma-primary/20 transition-colors">
                    <Icon name="mdi:bed" class="w-6 h-6 text-comma-primary" />
                  </div>
                  <div class="text-xl font-bold text-comma-neutral-900">{{ property.bedroom ?? 0 }}</div>
                  <div class="text-xs text-comma-neutral-600">{{ $t('property_page.bedrooms') }}</div>
                </div>
                <div class="text-center group">
                  <div
                    class="w-12 h-12 mx-auto bg-comma-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-comma-primary/20 transition-colors">
                    <Icon name="mdi:shower" class="w-6 h-6 text-comma-primary" />
                  </div>
                  <div class="text-xl font-bold text-comma-neutral-900">{{ property.bathroom ?? 0 }}</div>
                  <div class="text-xs text-comma-neutral-600">{{ $t('property_page.bathrooms') }}</div>
                </div>
                <div class="text-center group">
                  <div
                    class="w-12 h-12 mx-auto bg-comma-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-comma-primary/20 transition-colors">
                    <Icon name="mdi:arrow-expand" class="w-6 h-6 text-comma-primary" />
                  </div>
                  <div class="text-xl font-bold text-comma-neutral-900">{{ propertySize }} sqft</div>
                  <div class="text-xs text-comma-neutral-600">{{ $t('property_page.size') }}</div>
                </div>
                <div class="text-center group">
                  <div
                    class="w-12 h-12 mx-auto bg-comma-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-comma-primary/20 transition-colors">
                    <Icon name="mdi:car" class="w-6 h-6 text-comma-primary" />
                  </div>
                  <div class="text-xl font-bold text-comma-neutral-900">{{ property.parking || $t('property_page.na')
                  }}</div>
                  <div class="text-xs text-comma-neutral-600">{{ $t('property_page.parking') }}</div>
                </div>
                <div class="text-center group">
                  <div
                    class="w-12 h-12 mx-auto bg-comma-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-comma-primary/20 transition-colors">
                    <Icon name="mdi:calendar" class="w-6 h-6 text-comma-primary" />
                  </div>
                  <div class="text-xl font-bold text-comma-neutral-900">{{ property.buildYear || $t('property_page.na')
                  }}</div>
                  <div class="text-xs text-comma-neutral-600">{{ $t('property_page.year_built') }}</div>
                </div>
              </div>
            </div>

            <!-- Image Gallery with Lightbox -->
            <div class="bg-white rounded-2xl shadow-luxury border border-comma-border-subtle overflow-hidden">
              <div class="relative aspect-[16/9] bg-comma-neutral-100">
                <img :src="currentMainImage" :alt="propertyTitle" loading="lazy"
                  class="w-full h-full object-cover cursor-pointer"
                  @click="openLightbox" @error="handleImageError" />
                <button @click="openLightbox"
                  class="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition">
                  <Icon name="mdi:fullscreen" class="w-5 h-5" />
                </button>
              </div>
              <div v-if="allImages.length > 1" class="grid grid-cols-5 gap-1 p-2 bg-comma-neutral-50">
                <button v-for="(img, idx) in allImages.slice(0, 5)" :key="idx" @click="currentImageIndex = idx"
                  class="aspect-square overflow-hidden rounded-lg border-2 transition-all"
                  :class="currentImageIndex === idx ? 'border-comma-primary shadow-md' : 'border-transparent hover:border-comma-primary/50'">
                  <img :src="img" class="w-full h-full object-cover" loading="lazy" @error="handleImageError" />
                </button>
                <button v-if="allImages.length > 5" @click="openLightbox"
                  class="aspect-square bg-comma-neutral-200 rounded-lg flex items-center justify-center text-comma-primary font-semibold hover:bg-comma-primary/10 transition">
                  +{{ allImages.length - 5 }}
                </button>
              </div>
            </div>

            <!-- Description -->
            <div class="bg-white rounded-2xl shadow-luxury border border-comma-border-subtle p-6 lg:p-8">
              <h3 class="text-2xl font-bold text-comma-neutral-900 mb-4 font-display flex items-center gap-2">
                <Icon name="mdi:file-document" class="w-6 h-6 text-comma-primary" />
                {{ $t('property_page.description') }}
              </h3>
              <div class="prose prose-lg max-w-none text-comma-neutral-700 leading-relaxed whitespace-pre-line">
                {{ propertyDescription }}
              </div>
            </div>

            <!-- Address / Location Details -->
            <div class="bg-white rounded-2xl shadow-luxury border border-comma-border-subtle p-6 lg:p-8">
              <h3 class="text-2xl font-bold text-comma-neutral-900 mb-6 font-display flex items-center gap-2">
                <Icon name="mdi:map-marker" class="w-6 h-6 text-comma-primary" />
                {{ $t('property_page.address_details') }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex items-start gap-3">
                  <Icon name="mdi:map-marker" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.location') }}</div>
                    <div class="font-medium">{{ property.location || $t('property_page.na') }}</div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon name="mdi:city" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.city') }}</div>
                    <div class="font-medium">{{ property.city || $t('property_page.na') }}</div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon name="mdi:home-group" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.community') }}</div>
                    <div class="font-medium">{{ property.community || $t('property_page.na') }}</div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon name="mdi:office-building" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.project') }}</div>
                    <div class="font-medium">{{ property.tower || property.projectName || $t('property_page.na') }}
                    </div>
                  </div>
                </div>
                <div v-if="property.subCommunity" class="flex items-start gap-3">
                  <Icon name="mdi:map-marker-radius" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.sub_community') }}</div>
                    <div class="font-medium">{{ property.subCommunity }}</div>
                  </div>
                </div>
                <div v-if="property.unitNo" class="flex items-start gap-3">
                  <Icon name="mdi:door" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.unit_no') }}</div>
                    <div class="font-medium">{{ property.unitNo }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detailed Property Info Grid -->
            <div class="bg-white rounded-2xl shadow-luxury border border-comma-border-subtle p-6 lg:p-8">
              <h3 class="text-2xl font-bold text-comma-neutral-900 mb-6 font-display flex items-center gap-2">
                <Icon name="mdi:clipboard-list" class="w-6 h-6 text-comma-primary" />
                {{ $t('property_page.property_details') }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-start gap-3">
                  <Icon name="mdi:tag" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.reference') }}</div>
                    <div class="font-medium">{{ property.referenceNumber }}</div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon name="mdi:cash" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.price') }}</div>
                    <div class="font-medium">{{ formatPrice(property.price) }}</div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon name="mdi:arrow-expand" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.size') }}</div>
                    <div class="font-medium">{{ propertySize }} sqft</div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon name="mdi:bed" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.bedrooms') }}</div>
                    <div class="font-medium">{{ property.bedroom ?? 0 }}</div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon name="mdi:shower" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.bathrooms') }}</div>
                    <div class="font-medium">{{ property.bathroom ?? 0 }}</div>
                  </div>
                </div>
                <div v-if="property.parking" class="flex items-start gap-3">
                  <Icon name="mdi:car" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.parking') }}</div>
                    <div class="font-medium">{{ property.parking }}</div>
                  </div>
                </div>
                <div v-if="property.buildYear" class="flex items-start gap-3">
                  <Icon name="mdi:calendar" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.year_built') }}</div>
                    <div class="font-medium">{{ property.buildYear }}</div>
                  </div>
                </div>
                <div v-if="property.developers" class="flex items-start gap-3">
                  <Icon name="mdi:office-building-cog" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.developer') }}</div>
                    <div class="font-medium">{{ property.developers }}</div>
                  </div>
                </div>
                <div v-if="property.offeringType" class="flex items-start gap-3">
                  <Icon name="mdi:handshake" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.offering_type') }}</div>
                    <div class="font-medium">{{ property.offeringType }}</div>
                  </div>
                </div>
                <div v-if="property.projectStatus" class="flex items-start gap-3">
                  <Icon name="mdi:progress-clock" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.project_status') }}</div>
                    <div class="font-medium">{{ property.projectStatus }}</div>
                  </div>
                </div>
                <div v-if="property.availableFrom" class="flex items-start gap-3">
                  <Icon name="mdi:calendar-check" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.available_from') }}</div>
                    <div class="font-medium">{{ formatDate(property.availableFrom) }}</div>
                  </div>
                </div>
                <div v-if="property.paymentMethod" class="flex items-start gap-3">
                  <Icon name="mdi:credit-card" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.payment_method') }}</div>
                    <div class="font-medium">{{ property.paymentMethod }}</div>
                  </div>
                </div>
                <div v-if="property.serviceCharge" class="flex items-start gap-3">
                  <Icon name="mdi:cash-refund" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.service_charge') }}</div>
                    <div class="font-medium">{{ formatPrice(Number(property.serviceCharge)) }}</div>
                  </div>
                </div>
                <div v-if="property.downPaymentPrice" class="flex items-start gap-3">
                  <Icon name="mdi:bank" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.down_payment') }}</div>
                    <div class="font-medium">{{ formatPrice(Number(property.downPaymentPrice)) }}</div>
                  </div>
                </div>
                <div v-if="property.saleType" class="flex items-start gap-3">
                  <Icon name="mdi:sale" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.sale_type') }}</div>
                    <div class="font-medium">{{ property.saleType }}</div>
                  </div>
                </div>
                <div v-if="property.furnished" class="flex items-start gap-3">
                  <Icon name="mdi:sofa" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.furnished') }}</div>
                    <div class="font-medium">{{ property.furnished }}</div>
                  </div>
                </div>
                <div v-if="property.finishingType" class="flex items-start gap-3">
                  <Icon name="mdi:palette" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.finishing_type') }}</div>
                    <div class="font-medium">{{ property.finishingType }}</div>
                  </div>
                </div>
                <div v-if="property.floorNo" class="flex items-start gap-3">
                  <Icon name="mdi:floor-plan" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.floor_no') }}</div>
                    <div class="font-medium">{{ property.floorNo }}</div>
                  </div>
                </div>
                <div v-if="property.hasGarden" class="flex items-start gap-3">
                  <Icon name="mdi:flower" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.garden') }}</div>
                    <div class="font-medium">{{ property.hasGarden ? $t('yes') : $t('no') }}</div>
                  </div>
                </div>
                <div v-if="property.hasKitchen" class="flex items-start gap-3">
                  <Icon name="mdi:countertop" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <div>
                    <div class="text-sm text-comma-neutral-600">{{ $t('property_page.kitchen') }}</div>
                    <div class="font-medium">{{ property.hasKitchen ? $t('yes') : $t('no') }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Amenities -->
            <div v-if="property.amenities && property.amenities.length"
              class="bg-white rounded-2xl shadow-luxury border border-comma-border-subtle p-6 lg:p-8">
              <h3 class="text-2xl font-bold text-comma-neutral-900 mb-6 font-display flex items-center gap-2">
                <Icon name="mdi:star" class="w-6 h-6 text-comma-primary" />
                {{ $t('property_page.amenities') }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-for="(item, idx) in parsedAmenities" :key="idx"
                  class="flex items-center gap-2 p-2 rounded-lg hover:bg-comma-surface-subtle transition">
                  <Icon name="mdi:check-circle" class="w-5 h-5 text-comma-primary flex-shrink-0" />
                  <span class="text-comma-neutral-700">{{ item }}</span>
                </div>
              </div>
            </div>

            <!-- Installments / Payment Plan -->
            <div v-if="property.installments && property.installments.length"
              class="bg-white rounded-2xl shadow-luxury border border-comma-border-subtle p-6 lg:p-8">
              <h3 class="text-2xl font-bold text-comma-neutral-900 mb-6 font-display flex items-center gap-2">
                <Icon name="mdi:calendar-clock" class="w-6 h-6 text-comma-primary" />
                {{ $t('property_page.installments') }}
              </h3>
              <div class="space-y-3">
                <div v-for="(item, idx) in property.installments" :key="idx"
                  class="flex items-start gap-3 p-3 border-l-4 border-comma-primary bg-comma-surface-subtle rounded-r-lg">
                  <Icon name="mdi:currency-usd" class="w-5 h-5 text-comma-primary mt-0.5" />
                  <span class="text-comma-neutral-800">{{ item }}</span>
                </div>
              </div>
            </div>

            <!-- Views -->
            <div v-if="property.view && property.view.length"
              class="bg-white rounded-2xl shadow-luxury border border-comma-border-subtle p-6 lg:p-8">
              <h3 class="text-2xl font-bold text-comma-neutral-900 mb-6 font-display flex items-center gap-2">
                <Icon name="mdi:eye" class="w-6 h-6 text-comma-primary" />
                {{ $t('property_page.views') }}
              </h3>
              <div class="flex flex-wrap gap-2">
                <span v-for="(v, idx) in property.view" :key="idx"
                  class="px-3 py-1 bg-comma-neutral-100 text-comma-neutral-700 rounded-full text-sm">
                  {{ v }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right Sidebar (Contact & Agent) -->
          <aside class="lg:col-span-1 space-y-6">
            <div class="bg-white rounded-2xl shadow-luxury border border-comma-border-subtle p-6 sticky top-24">
              <h3 class="text-2xl font-bold text-comma-neutral-900 mb-6 font-display">{{
                $t('property_page.contact_agent') }}</h3>

              <!-- Agent Info (dynamic) -->
              <div v-if="agent && agent.show_on_website === 'Yes'"
                class="flex items-center gap-4 mb-6 pb-6 border-b border-comma-border-subtle">
                <div
                  class="w-16 h-16 rounded-full overflow-hidden bg-comma-primary/10 flex items-center justify-center">
                  <img v-if="agentPhoto" :src="agentPhoto" :alt="agentName" loading="lazy"
                    class="w-full h-full object-cover"
                    @error="handleAgentImageError" />
                  <Icon v-else name="mdi:account-circle" class="w-10 h-10 text-comma-primary" />
                </div>
                <div>
                  <p class="font-bold text-lg text-comma-neutral-900">{{ agentName }}</p>
                  <p v-if="agent.position" class="text-sm text-comma-neutral-600">{{ agent.position }}</p>
                  <p v-if="agent.departments?.length" class="text-xs text-comma-neutral-500">{{
                    agent.departments.join(', ') }}</p>
                </div>
              </div>

              <!-- Fallback: Comma Team -->
              <div v-else class="flex items-center gap-4 mb-6 pb-6 border-b border-comma-border-subtle">
                <div class="w-16 h-16 rounded-full bg-comma-primary/10 flex items-center justify-center">
                  <Icon name="mdi:office-building" class="w-8 h-8 text-comma-primary" />
                </div>
                <div>
                  <p class="font-bold text-lg text-comma-neutral-900">{{ $t('property_page.comma_team') }}</p>
                  <p class="text-sm text-comma-neutral-600">{{ $t('property_page.real_estate_experts') }}</p>
                </div>
              </div>

              <!-- Contact Methods -->
              <div class="space-y-3">
                <a :href="`tel:${defaultPhone}`"
                  class="flex items-center gap-3 p-3 rounded-xl border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 transition group">
                  <div
                    class="w-10 h-10 rounded-full bg-comma-primary/10 flex items-center justify-center group-hover:bg-comma-primary/20 transition">
                    <Icon name="mdi:phone" class="w-5 h-5 text-comma-primary" />
                  </div>
                  <div>
                    <div class="text-xs text-comma-neutral-600">{{ $t('property_page.call') }}</div>
                    <div class="font-medium text-comma-neutral-900"><span dir="ltr">{{ defaultPhone }}</span></div>
                  </div>
                </a>
                <a :href="`mailto:${contactEmail}`"
                  class="flex items-center gap-3 p-3 rounded-xl border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 transition group">
                  <div
                    class="w-10 h-10 rounded-full bg-comma-primary/10 flex items-center justify-center group-hover:bg-comma-primary/20 transition">
                    <Icon name="mdi:email" class="w-5 h-5 text-comma-primary" />
                  </div>
                  <div>
                    <div class="text-xs text-comma-neutral-600">{{ $t('property_page.email') }}</div>
                    <div class="font-medium text-comma-neutral-900">{{ contactEmail }}</div>
                  </div>
                </a>
                <a :href="`https://wa.me/${defaultWhatsapp}`" target="_blank"
                  class="flex items-center gap-3 p-3 rounded-xl border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 transition group">
                  <div
                    class="w-10 h-10 rounded-full bg-comma-primary/10 flex items-center justify-center group-hover:bg-comma-primary/20 transition">
                    <Icon name="mdi:whatsapp" class="w-5 h-5 text-comma-primary" />
                  </div>
                  <div>
                    <div class="text-xs text-comma-neutral-600">{{ $t('property_page.whatsapp') }}</div>
                    <div class="font-medium text-comma-neutral-900"><span dir="ltr">+{{ defaultWhatsapp }}</span></div>
                  </div>
                </a>
              </div>

              <!-- Share Button -->
              <div class="mt-6 pt-6 border-t border-comma-border-subtle">
                <button @click="copyLink"
                  class="w-full py-3 bg-comma-neutral-100 hover:bg-comma-primary/10 text-comma-neutral-700 font-semibold rounded-xl transition flex items-center justify-center gap-2">
                  <Icon name="mdi:share-variant" class="w-5 h-5" />
                  {{ $t('property_page.share') }}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <div v-if="lightboxOpen" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        @click="closeLightbox">
        <div class="relative max-w-7xl w-full h-full p-4 flex items-center justify-center" @click.stop>
          <button @click="closeLightbox"
            class="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition z-10">
            <Icon name="mdi:close" class="w-6 h-6" />
          </button>
          <button v-if="currentImageIndex > 0" @click="prevImage"
            class="absolute left-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition">
            <Icon name="mdi:chevron-left" class="w-8 h-8" />
          </button>
          <img :src="allImages[currentImageIndex]" :alt="propertyTitle" loading="lazy" class="max-h-[90vh] max-w-[90vw] object-contain" />
          <button v-if="currentImageIndex < allImages.length - 1" @click="nextImage"
            class="absolute right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition">
            <Icon name="mdi:chevron-right" class="w-8 h-8" />
          </button>
        </div>
      </div>
    </Teleport>
  </div>

  <!-- Loading State -->
  <div v-else-if="loading" class="min-h-screen flex items-center justify-center bg-comma-neutral-50">
    <div class="text-center">
      <Icon name="mdi:loading" class="w-16 h-16 text-comma-primary animate-spin mx-auto mb-4" />
      <p class="text-comma-neutral-600">{{ $t('property_page.loading') }}</p>
    </div>
  </div>

  <!-- 404 / Not Found -->
  <div v-else-if="notFound" class="min-h-screen flex items-center justify-center bg-comma-neutral-50">
    <div class="text-center px-6">
      <div class="w-24 h-24 rounded-full bg-comma-primary/10 flex items-center justify-center mx-auto mb-6">
        <Icon name="mdi:home" class="w-12 h-12 text-comma-primary" />
      </div>
      <h1 class="text-2xl font-bold text-comma-neutral-900 mb-4">{{ $t('property_page.not_found') }}</h1>
      <p class="text-comma-neutral-600 mb-8 max-w-md mx-auto">{{ $t('property_page.not_found_description') }}</p>
      <NuxtLink :to="localePath('/properties')"
        class="inline-flex items-center gap-2 px-8 py-3 bg-comma-primary text-white font-semibold rounded-lg hover:bg-comma-primary-dark transition">
        <Icon :name="direction === 'ltr' ? 'mdi:arrow-left' : 'mdi:arrow-right'" class="w-5 h-5" />
        {{ $t('property_page.back_to_properties') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePropertiesStore } from '~/store/properties'
import type { NormalizedProperty } from '~/types/property'

const route = useRoute()
const { locale, t } = useI18n()
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const localePath = useLocalePath()
const store = usePropertiesStore()

// Extract ID from slug (e.g., "4-own-a-piece-of-iconic-brabus-living")
const fullParam = route.params.id as string
const propertyId = Number(fullParam.split('-')[0])

// State
const property = ref<NormalizedProperty | null>(null)
const loading = ref(true)
const notFound = ref(false)
const agent = ref<any>(null)

// Gallery state
const allImages = ref<string[]>([])
const currentImageIndex = ref(0)
const lightboxOpen = ref(false)

// Contact info (fallback)
const defaultPhone = '+971544411700'
const defaultEmail = 'info@commarealestate.ae'
const defaultWhatsapp = '971544411700'
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&fit=crop'

// Computed properties
const propertyTitle = computed(() => {
  if (!property.value) return ''
  return locale.value === 'ar' ? property.value.titleArabic : property.value.titleEnglish
})

const propertyDescription = computed(() => {
  if (!property.value) return ''
  return locale.value === 'ar' ? property.value.descriptionArabic : property.value.descriptionEnglish
})

const propertySize = computed(() => {
  if (!property.value) return '—'
  const size = property.value.buildUpAreaSqft || property.value.totalAreaSqft
  return size ? Math.round(Number(size)).toLocaleString() : '—'
})

const heroImage = computed(() => {
  if (property.value?.coverImage) return property.value.coverImage
  if (property.value?.propertyPhotos?.length) return property.value.propertyPhotos[0]
  return FALLBACK_IMAGE
})

const currentMainImage = computed(() => {
  if (allImages.value.length) return allImages.value[currentImageIndex.value]
  return FALLBACK_IMAGE
})

// Agent display helpers
const agentName = computed(() => {
  if (agent.value) {
    return `${agent.value.first_name || ''} ${agent.value.last_name || ''}`.trim()
  }
  return ''
})

const agentPhoto = computed(() => {
  if (agent.value && agent.value.photo && agent.value.photo.length) {
    return agent.value.photo[0]
  }
  return ''
})

const contactEmail = computed(() => {
  if (agent.value && agent.value.show_on_website === 'Yes') {
    return agent.value.company_e_mail || agent.value.e_mail || defaultEmail
  }
  return defaultEmail
})

// Parsed amenities (split by dash)
const parsedAmenities = computed(() => {
  if (!property.value?.amenities?.length) return []
  const raw = property.value.amenities
  const all = raw.flatMap((item: string) =>
    item.split('-').map(s => s.trim()).filter(Boolean)
  )
  return [...new Set(all)]
})

// Fetch property data using new store method
async function fetchProperty() {
  loading.value = true
  notFound.value = false
  try {
    // 1. Fetch property by ID from backend
    const fetched = await store.fetchPropertyById(propertyId)
    if (fetched) {
      property.value = fetched

      // Build image array (coverImage first, then propertyPhotos without duplicates)
      const images = []
      if (fetched.coverImage) images.push(fetched.coverImage)
      if (fetched.propertyPhotos?.length) {
        for (const img of fetched.propertyPhotos) {
          if (!images.includes(img)) images.push(img)
        }
      }
      allImages.value = images.length ? images : [FALLBACK_IMAGE]

      // 2. Fetch agent if listing_owner exists and > 0
      if (fetched.listingOwner && fetched.listingOwner !== 0) {
        try {
          agent.value = await store.fetchAgentById(fetched.listingOwner)
        } catch (agentErr) {
          console.warn('Failed to fetch agent:', agentErr)
          agent.value = null
        }
      }
    } else {
      notFound.value = true
    }
  } catch (error) {
    console.error('Error fetching property:', error)
    notFound.value = true
  } finally {
    loading.value = false
  }
}

// Gallery methods
function openLightbox() {
  lightboxOpen.value = true
}
function closeLightbox() {
  lightboxOpen.value = false
}
function nextImage() {
  if (currentImageIndex.value < allImages.value.length - 1) {
    currentImageIndex.value++
  }
}
function prevImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

// Copy link to clipboard
async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert(t('property_page.link_copied') || 'Link copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Formatting helpers
function formatPrice(price: number) {
  if (!price && price !== 0) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(price)
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function handleImageError(event: Event) {
  (event.target as HTMLImageElement).src = FALLBACK_IMAGE
}

function handleAgentImageError(event: Event) {
  (event.target as HTMLImageElement).style.display = 'none'
}

// SEO
useHead(() => {
  if (!property.value) return {}
  return {
    title: `${propertyTitle.value} | Comma Real Estate`,
    meta: [
      { name: 'description', content: propertyDescription.value?.slice(0, 160) }
    ]
  }
})

// Initial fetch
onMounted(() => {
  fetchProperty()
})
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.8s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>