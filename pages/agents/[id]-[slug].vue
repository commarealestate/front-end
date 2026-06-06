<template>
  <div v-if="agent" class="min-h-screen bg-comma-neutral-50" :dir="direction">
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-28 overflow-hidden">
      <div class="absolute inset-0">
        <img :src="agent.photo?.[0] || heroBackgroundImage" :alt="fullName" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-br from-comma-primary/70 via-comma-primary/40 to-transparent">
        </div>
        <div class="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern"></div>
      </div>

      <div class="container relative z-10 px-4 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <!-- Breadcrumb -->
          <nav class="mb-6">
            <ol class="inline-flex items-center gap-2 text-sm text-white/90"
              :class="{ 'flex-row-reverse': direction === 'rtl' }">
              <li>
                <NuxtLink :to="localePath('/')" class="hover:text-white transition">{{ $t('agent_detail.home') }}
                </NuxtLink>
              </li>
              <Icon name="mdi:chevron-right" class="w-4 h-4 opacity-70"
                :class="{ 'rotate-180': direction === 'rtl' }" />
              <li>
                <NuxtLink :to="localePath('/agents')" class="hover:text-white transition">{{ $t('agent_detail.agents')
                  }}</NuxtLink>
              </li>
              <Icon name="mdi:chevron-right" class="w-4 h-4 opacity-70"
                :class="{ 'rotate-180': direction === 'rtl' }" />
              <li class="text-comma-secondary font-medium">{{ fullName }}</li>
            </ol>
          </nav>

          <!-- Agent Profile Header -->
          <div class="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <!-- Avatar -->
            <div class="relative">
              <img :src="agent.photo?.[0] || AGENT_FALLBACK_IMAGE" :alt="fullName"
                class="w-48 h-60 lg:w-56 lg:h-72 rounded-2xl border-4 border-white shadow-2xl object-cover"
                @error="handleAvatarError" />
              <div
                class="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-comma-secondary flex items-center justify-center shadow-xl">
                <Icon name="mdi:star" class="w-8 h-8 text-white" />
              </div>
            </div>
            <!-- Basic Info -->
            <div class="flex-1 text-white">
              <h1 class="text-3xl lg:text-4xl font-bold mb-2 font-display">{{ fullName }}</h1>
              <p v-if="agent.specialties" class="text-xl text-white/90 mb-4">{{ agent.specialties }}</p>
              <p v-else-if="agent.agent_type" class="text-lg text-white/80 mb-4">{{ agent.agent_type }}</p>

              <!-- Stats -->
              <div class="flex flex-wrap gap-6 mb-6">
                <div class="flex items-center gap-2">
                  <Icon name="mdi:calendar" class="w-5 h-5 text-comma-secondary" />
                  <div>
                    <div class="text-2xl font-bold">{{ experience }}+</div>
                    <div class="text-sm text-white/80">{{ $t('agent_detail.years_exp') }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <Icon name="mdi:home" class="w-5 h-5 text-comma-secondary" />
                  <div>
                    <div class="text-2xl font-bold">{{ propertiesCount }}</div>
                    <div class="text-sm text-white/80">{{ $t('agent_detail.properties') }}</div>
                  </div>
                </div>
              </div>

              <!-- Quick Contact -->
              <div class="flex flex-wrap gap-3">
                <a v-if="agent.personal_mobile" :href="`tel:${agent.personal_mobile}`"
                  class="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-300">
                  <Icon name="mdi:phone" class="w-4 h-4" />
                  <span>{{ agent.personal_mobile }}</span>
                </a>
                <a :href="`mailto:${agent.e_mail}`"
                  class="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-300">
                  <Icon name="mdi:email" class="w-4 h-4" />
                  <span>{{ agent.e_mail }}</span>
                </a>
                <a v-if="agent.personal_mobile" :href="`https://wa.me/${agent.personal_mobile.replace(/\D/g, '')}`"
                  target="_blank"
                  class="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-300">
                  <Icon name="mdi:whatsapp" class="w-4 h-4" />
                  <span>{{ agent.personal_mobile }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-12 lg:py-16">
      <div class="container px-4 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <div class="grid lg:grid-cols-3 gap-8">
            <!-- Left Column - Profile Card -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-2xl shadow-card p-6 sticky top-24">
                <!-- Contact Info -->
                <div class="space-y-4 mb-6">
                  <h3 class="text-lg font-bold text-comma-neutral-900 mb-4">{{ $t('agent_detail.contact_info') }}</h3>

                  <a v-if="agent.personal_mobile" :href="`tel:${agent.personal_mobile}`"
                    class="flex items-center gap-3 p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 transition-colors duration-300 group">
                    <div
                      class="w-10 h-10 rounded-full bg-comma-primary/10 flex items-center justify-center group-hover:bg-comma-primary transition-colors duration-300">
                      <Icon name="mdi:phone" class="w-5 h-5 text-comma-primary group-hover:text-white" />
                    </div>
                    <div>
                      <div class="text-sm text-comma-neutral-600">{{ $t('agent_detail.call') }}</div>
                      <div class="font-semibold text-comma-neutral-900">{{ agent.personal_mobile }}</div>
                    </div>
                  </a>

                  <a :href="`mailto:${agent.e_mail}`"
                    class="flex items-center gap-3 p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 transition-colors duration-300 group">
                    <div
                      class="w-10 h-10 rounded-full bg-comma-primary/10 flex items-center justify-center group-hover:bg-comma-primary transition-colors duration-300">
                      <Icon name="mdi:email" class="w-5 h-5 text-comma-primary group-hover:text-white" />
                    </div>
                    <div>
                      <div class="text-sm text-comma-neutral-600">{{ $t('agent_detail.email') }}</div>
                      <div class="font-semibold text-comma-neutral-900">{{ agent.e_mail }}</div>
                    </div>
                  </a>

                  <a v-if="agent.personal_mobile" :href="`https://wa.me/${agent.personal_mobile.replace(/\D/g, '')}`"
                    target="_blank"
                    class="flex items-center gap-3 p-3 rounded-lg border border-comma-border-subtle hover:border-green-500 hover:bg-green-50 transition-colors duration-300 group">
                    <div
                      class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300">
                      <Icon name="mdi:whatsapp" class="w-5 h-5 text-green-600 group-hover:text-white" />
                    </div>
                    <div>
                      <div class="text-sm text-comma-neutral-600">WhatsApp</div>
                      <div class="font-semibold text-comma-neutral-900">{{ agent.personal_mobile }}</div>
                    </div>
                  </a>

                  <!-- Company Email (if different) -->
                  <a v-if="agent.company_e_mail && agent.company_e_mail !== agent.e_mail"
                    :href="`mailto:${agent.company_e_mail}`"
                    class="flex items-center gap-3 p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 transition-colors duration-300 group">
                    <div
                      class="w-10 h-10 rounded-full bg-comma-primary/10 flex items-center justify-center group-hover:bg-comma-primary transition-colors duration-300">
                      <Icon name="mdi:office-building" class="w-5 h-5 text-comma-primary group-hover:text-white" />
                    </div>
                    <div>
                      <div class="text-sm text-comma-neutral-600">{{ $t('agent_detail.company_email') }}</div>
                      <div class="font-semibold text-comma-neutral-900">{{ agent.company_e_mail }}</div>
                    </div>
                  </a>
                </div>

                <!-- Social Links -->
                <div v-if="hasSocialLinks" class="mb-6">
                  <h3 class="text-lg font-bold text-comma-neutral-900 mb-4">{{ $t('agent_detail.social') }}</h3>
                  <div class="flex gap-3">
                    <a v-if="agent.uf_linkedin" :href="agent.uf_linkedin" target="_blank"
                      class="w-10 h-10 rounded-full bg-comma-neutral-100 flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300">
                      <Icon name="mdi:linkedin" class="w-5 h-5" />
                    </a>
                    <a v-if="agent.uf_twitter" :href="agent.uf_twitter" target="_blank"
                      class="w-10 h-10 rounded-full bg-comma-neutral-100 flex items-center justify-center hover:bg-blue-50 hover:text-blue-400 transition-colors duration-300">
                      <Icon name="mdi:twitter" class="w-5 h-5" />
                    </a>
                    <a v-if="agent.uf_facebook" :href="agent.uf_facebook" target="_blank"
                      class="w-10 h-10 rounded-full bg-comma-neutral-100 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300">
                      <Icon name="mdi:facebook" class="w-5 h-5" />
                    </a>
                    <a v-if="agent.uf_skype" :href="`skype:${agent.uf_skype}?chat`" target="_blank"
                      class="w-10 h-10 rounded-full bg-comma-neutral-100 flex items-center justify-center hover:bg-sky-50 hover:text-sky-600 transition-colors duration-300">
                      <Icon name="mdi:skype" class="w-5 h-5" />
                    </a>
                  </div>
                </div>

                <!-- Professional Details -->
                <div v-if="agent.specialties || agent.agent_type || agent.departments?.length" class="mb-6">
                  <h3 class="text-lg font-bold text-comma-neutral-900 mb-3">{{ $t('agent_detail.professional_details')
                    }}</h3>
                  <div class="space-y-3">
                    <div v-if="agent.specialties">
                      <div class="text-sm text-comma-neutral-600 font-medium">{{ $t('agent_detail.specialties') }}
                      </div>
                      <div class="text-comma-neutral-800">{{ agent.specialties }}</div>
                    </div>
                    <div v-if="agent.agent_type">
                      <div class="text-sm text-comma-neutral-600 font-medium">{{ $t('agent_detail.agent_type') }}</div>
                      <div class="text-comma-neutral-800">{{ agent.agent_type }}</div>
                    </div>
                    <div v-if="agent.departments?.length">
                      <div class="text-sm text-comma-neutral-600 font-medium">{{ $t('agent_detail.departments') }}
                      </div>
                      <div class="text-comma-neutral-800">{{ agent.departments.join(', ') }}</div>
                    </div>
                    <div v-if="agent.service_area">
                      <div class="text-sm text-comma-neutral-600 font-medium">{{ $t('agent_detail.service_area') }}
                      </div>
                      <div class="text-comma-neutral-800">{{ agent.service_area }}</div>
                    </div>
                  </div>
                </div>

                <!-- Service Areas (from service_areas array) -->
                <div v-if="agent.service_areas?.length" class="mb-6">
                  <h3 class="text-lg font-bold text-comma-neutral-900 mb-3">{{ $t('agent_detail.service_areas') }}</h3>
                  <div class="space-y-2">
                    <div v-for="area in agent.service_areas" :key="area.service_area_id"
                      class="flex items-center gap-2">
                      <Icon name="mdi:map-marker" class="w-4 h-4 text-comma-secondary flex-shrink-0" />
                      <span class="text-comma-neutral-700 text-sm">{{ locale === 'ar' ? area.name_ar : area.name_en
                        }}</span>
                    </div>
                  </div>
                </div>

                <!-- Certificates / Credentials -->
                <div v-if="hasCredentials" class="mb-6">
                  <h3 class="text-lg font-bold text-comma-neutral-900 mb-3">{{ $t('agent_detail.credentials') }}</h3>
                  <div class="space-y-2">
                    <div v-if="agent.emirates_id?.length" class="flex items-center gap-2">
                      <Icon name="mdi:card-account-details" class="w-4 h-4 text-comma-primary" />
                      <span class="text-sm text-comma-neutral-700">{{ $t('agent_detail.emirates_id') }}</span>
                    </div>
                    <div v-if="agent.education_certificate" class="flex items-center gap-2">
                      <Icon name="mdi:school" class="w-4 h-4 text-comma-primary" />
                      <span class="text-sm text-comma-neutral-700">{{ $t('agent_detail.education_cert') }}</span>
                    </div>
                    <div v-if="agent.abu_dhabi_broker_cert" class="flex items-center gap-2">
                      <Icon name="mdi:certificate" class="w-4 h-4 text-comma-primary" />
                      <span class="text-sm text-comma-neutral-700">{{ $t('agent_detail.abu_dhabi_broker') }}</span>
                    </div>
                    <div v-if="agent.dubai_broker_cert" class="flex items-center gap-2">
                      <Icon name="mdi:certificate" class="w-4 h-4 text-comma-primary" />
                      <span class="text-sm text-comma-neutral-700">{{ $t('agent_detail.dubai_broker') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column - Bio and Listings -->
            <div class="lg:col-span-2">
              <!-- Bio -->
              <div class="bg-white rounded-2xl shadow-card p-6 lg:p-8 mb-8">
                <h2 class="text-2xl font-bold text-comma-neutral-900 mb-6 font-display">{{ $t('agent_detail.about') }}
                </h2>
                <div class="prose max-w-none" :class="{ 'prose-rtl': direction === 'rtl' }">
                  <div class="whitespace-pre-line text-comma-neutral-700 leading-relaxed">
                    {{ agent.agent_description || $t('agent_detail.no_bio') }}
                  </div>
                </div>
              </div>

              <!-- My Listings -->
              <div class="bg-white rounded-2xl shadow-card p-6 lg:p-8">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-2xl font-bold text-comma-neutral-900 font-display">{{ $t('agent_detail.my_listings')
                    }}</h2>
                  <NuxtLink :to="localePath(`/properties?listing_owner=${agent.id}`)"
                    class="text-comma-primary font-medium hover:text-comma-primary-dark transition-colors duration-300 flex items-center gap-1">
                    {{ $t('agent_detail.view_all') }}
                    <Icon name="mdi:arrow-right" class="w-4 h-4" :class="{ 'rotate-180': direction === 'rtl' }" />
                  </NuxtLink>
                </div>

                <!-- Properties Grid -->
                <div v-if="!propertiesStore.loading && agentProperties.length > 0"
                  class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div v-for="property in agentProperties" :key="property.property_id"
                    class="bg-white rounded-xl border border-comma-border-subtle overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div class="relative h-48 overflow-hidden">
                      <img :src="property.property_photos?.[0] || PROPERTY_FALLBACK_IMAGE"
                        :alt="propertyTitle(property)"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        @error="handlePropertyImageError" />
                      <div class="absolute top-3 ltr:left-3 rtl:right-3">
                        <span class="px-2 py-1 bg-comma-primary text-white text-xs font-semibold rounded">
                          {{ property.property_type || property.sale_type }}
                        </span>
                      </div>
                    </div>
                    <div class="p-4">
                      <h3
                        class="text-lg font-bold text-comma-neutral-900 mb-1 group-hover:text-comma-primary transition-colors duration-300 line-clamp-1">
                        {{ propertyTitle(property) }}
                      </h3>
                      <div class="flex items-center gap-1 text-comma-neutral-600 text-sm mb-2">
                        <Icon name="mdi:map-marker" class="w-3 h-3" />
                        <span>{{ property.location || property.community || property.city }}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-comma-primary font-bold">{{ formatPrice(property.price) }}</span>
                        <NuxtLink :to="localePath(`/properties/${property.property_id}-${propertyTitle(property)}`)"
                          class="text-comma-primary text-sm font-medium hover:text-comma-primary-dark transition-colors duration-300">
                          {{ $t('agent_detail.view') }} →
                        </NuxtLink>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="propertiesStore.loading" class="text-center py-8">
                  <Icon name="mdi:loading" class="w-8 h-8 text-comma-primary animate-spin mx-auto" />
                </div>
                <div v-else class="text-center py-8">
                  <Icon name="mdi:home" class="w-12 h-12 text-comma-neutral-300 mx-auto mb-3" />
                  <p class="text-comma-neutral-600">{{ $t('agent_detail.no_listings') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Loading -->
  <div v-else-if="loading" class="min-h-screen flex items-center justify-center">
    <Icon name="mdi:loading" class="w-12 h-12 text-comma-primary animate-spin" />
  </div>

  <!-- 404 -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <Icon name="mdi:account" class="w-16 h-16 text-comma-neutral-300 mx-auto mb-4" />
      <h1 class="text-2xl font-bold text-comma-neutral-900 mb-2">{{ $t('agent_detail.not_found') }}</h1>
      <p class="text-comma-neutral-600 mb-6">{{ $t('agent_detail.not_found_description') }}</p>
      <NuxtLink to="/agents"
        class="px-6 py-3 bg-comma-primary text-white font-semibold rounded-lg hover:bg-comma-primary-dark transition-colors duration-300">
        {{ $t('agent_detail.back_to_agents') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAgentsStore } from '~/store/agents'
import { usePropertiesStore } from '~/store/properties'
import type { Property } from '~/types/property'

const { locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const direction = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))

const store = useAgentsStore()
const propertiesStore = usePropertiesStore()

// Extract ID from slug (e.g., "28-thamer-al-mubarak")
const fullParam = route.params.id as string
const agentId = Number(fullParam.split('-')[0])

const agent = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    // Load agents if not already loaded
    if (store.agents.length === 0) {
      await store.fetchAgents()
    }
    // Find agent in visible agents
    const found = store.visibleAgents.find((a) => Number(a.id) === agentId)
    if (found) {
      agent.value = found
      // Fetch agent's properties (listing_owner matches agent.id)
      await propertiesStore.fetchProperties({ listing_owner: agentId, per_page: 4 })
    } else {
      agent.value = null
    }
  } catch (error) {
    console.error(error)
    agent.value = null
  } finally {
    loading.value = false
  }
})

const fullName = computed(() => {
  if (!agent.value) return ''
  const parts = [agent.value.first_name, agent.value.last_name].filter(Boolean)
  return parts.join(' ') || 'Unnamed'
})

const experience = computed(() => {
  if (!agent.value?.uf_employment_date) return 0
  const start = new Date(agent.value.uf_employment_date)
  const now = new Date()
  return Math.max(0, now.getFullYear() - start.getFullYear())
})

const propertiesCount = computed(() => propertiesStore.properties.length)

const hasSocialLinks = computed(() => {
  return !!(
    agent.value?.uf_linkedin ||
    agent.value?.uf_twitter ||
    agent.value?.uf_facebook ||
    agent.value?.uf_skype
  )
})

const hasCredentials = computed(() => {
  return !!(
    agent.value?.emirates_id?.length ||
    agent.value?.education_certificate ||
    agent.value?.abu_dhabi_broker_cert ||
    agent.value?.dubai_broker_cert
  )
})

const heroBackgroundImage = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
const AGENT_FALLBACK_IMAGE = '/images/avatar2.jpg'
const PROPERTY_FALLBACK_IMAGE = '/images/prop.jpg'

function handleAvatarError(event: Event) {
  ; (event.target as HTMLImageElement).src = AGENT_FALLBACK_IMAGE
}
function handlePropertyImageError(event: Event) {
  ; (event.target as HTMLImageElement).src = PROPERTY_FALLBACK_IMAGE
}

const agentProperties = computed(() => propertiesStore.properties)

function propertyTitle(property: Property) {
  if (!property.title) return ''
  return locale.value === 'ar' ? property.title.arabic : property.title.english
}
function propertySlug(property: Property) {
  if (property.slug) {
    return locale.value === 'ar' ? property.slug.ar : property.slug.en
  }
  return property.property_id
}
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(price)
}

useHead(() => {
  if (!agent.value) return {}
  return {
    title: `${fullName.value} - ${agent.value.specialties || agent.value.agent_type || 'Agent'} | Comma Real Estate`,
    meta: [
      {
        name: 'description',
        content:
          agent.value.agent_description ||
          `Learn more about ${fullName.value}, real estate agent at Comma Real Estate.`,
      },
    ],
  }
})
</script>

<style scoped>
.bg-grid-pattern {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white' stroke-opacity='0.05'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

.prose {
  color: #292524;
}

.prose p {
  line-height: 1.7;
  margin-bottom: 1em;
}

:deep(.prose-rtl) {
  direction: rtl;
  text-align: right;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>