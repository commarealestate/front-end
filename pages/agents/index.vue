<template>
  <div class="min-h-screen bg-comma-neutral-50" :dir="direction">
    <!-- Hero Section -->
    <section
      class="relative h-[70vh] lg:min-h-screen flex items-center overflow-hidden bg-[url('/images/agents.jpeg')] bg-cover bg-center bg-fixed">
      <div class="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern"></div>
      <div class="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/30"></div>
      <div class="container relative z-10 px-4 lg:px-8 mx-auto text-center">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight font-display">
            {{ $t('agents_page.title') }}
          </h1>
          <p class="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
            {{ $t('agents_page.subtitle') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-8 lg:py-12 bg-comma-neutral-50">
      <div class="container px-4 lg:px-8">
        <!-- Mobile Filter Button -->
        <div class="lg:hidden mb-6">
          <button @click="isFilterOpen = true"
            class="flex items-center gap-3 w-full px-6 py-4 bg-white rounded-2xl shadow-card hover:shadow-hover transition-all duration-300">
            <Icon name="mdi:filter" class="w-5 h-5 text-comma-primary" />
            <span class="font-semibold text-comma-neutral-900">{{ $t('agents_page.filter_agents') }}</span>
            <span class="ltr:ml-auto rtl:mr-auto text-comma-neutral-600 text-sm">{{ filteredAgents.length }} {{
              $t('agents_page.results') }}</span>
          </button>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Desktop Sidebar Filter -->
          <aside class="hidden lg:block lg:w-1/4">
            <div class="sticky top-32 bg-white rounded-2xl shadow-card p-6 border border-comma-border-subtle">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-comma-neutral-900 font-display">{{ $t('agents_page.filter_agents') }}
                </h3>
                <button @click="resetFilters"
                  class="text-sm text-comma-primary hover:text-comma-primary-dark font-medium transition-colors duration-300">
                  {{ $t('agents_page.reset_all') }}
                </button>
              </div>

              <!-- Results Count -->
              <div class="mb-8 p-4 bg-comma-surface-subtle rounded-xl">
                <p class="text-comma-neutral-900 font-semibold">{{ filteredAgents.length }} {{
                  $t('agents_page.agents_found') }}</p>
                <p class="text-sm text-comma-neutral-600">{{ $t('agents_page.refine_search') }}</p>
              </div>

              <!-- Name Search -->
              <div class="mb-8">
                <label class="block text-sm font-medium text-comma-neutral-800 mb-3">
                  <Icon name="mdi:magnify" class="inline-block w-4 h-4 ltr:mr-2 rtl:ml-2" />
                  {{ $t('agents_page.search_by_name') }}
                </label>
                <input v-model="searchQuery" type="text" :placeholder="$t('agents_page.name_placeholder')"
                  class="w-full px-4 py-3 rounded-xl border border-comma-border-subtle focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 outline-none transition-all duration-300 bg-white" />
              </div>

              <!-- Active Status Filter -->
              <div class="mb-8">
                <h4 class="text-sm font-semibold text-comma-neutral-900 mb-3 flex items-center gap-2">
                  <Icon name="mdi:check-circle" class="w-4 h-4 text-comma-primary" />
                  {{ $t('agents_page.status') }}
                </h4>
                <div class="space-y-2">
                  <label
                    class="flex items-center gap-3 p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 transition-colors duration-300 cursor-pointer">
                    <input type="radio" v-model="activeFilter" :value="null" class="w-4 h-4 text-comma-primary" />
                    <span class="text-sm text-comma-neutral-700">{{ $t('agents_page.all') }}</span>
                  </label>
                  <label
                    class="flex items-center gap-3 p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 transition-colors duration-300 cursor-pointer">
                    <input type="radio" v-model="activeFilter" :value="true" class="w-4 h-4 text-comma-primary" />
                    <span class="text-sm text-comma-neutral-700">{{ $t('agents_page.active') }}</span>
                  </label>
                  <label
                    class="flex items-center gap-3 p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 transition-colors duration-300 cursor-pointer">
                    <input type="radio" v-model="activeFilter" :value="false" class="w-4 h-4 text-comma-primary" />
                    <span class="text-sm text-comma-neutral-700">{{ $t('agents_page.inactive') }}</span>
                  </label>
                </div>
              </div>

              <!-- Service Area Filter -->
              <div class="mb-8">
                <h4 class="text-sm font-semibold text-comma-neutral-900 mb-3 flex items-center gap-2">
                  <Icon name="mdi:map-marker" class="w-4 h-4 text-comma-secondary" />
                  {{ $t('agents_page.service_areas') }}
                </h4>
                <div class="space-y-2 max-h-48 overflow-y-auto pr-2">
                  <label v-for="area in uniqueServiceAreas" :key="area"
                    class="flex items-center gap-3 p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 transition-colors duration-300 cursor-pointer"
                    :class="{ 'border-comma-primary bg-comma-primary/10': selectedArea === area }">
                    <input type="radio" v-model="selectedArea" :value="area" class="w-4 h-4 text-comma-primary" />
                    <span class="text-sm text-comma-neutral-700">{{ area }}</span>
                  </label>
                  <label
                    class="flex items-center gap-3 p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 transition-colors duration-300 cursor-pointer">
                    <input type="radio" v-model="selectedArea" value="" class="w-4 h-4 text-comma-primary" />
                    <span class="text-sm text-comma-neutral-700">{{ $t('agents_page.all_areas') }}</span>
                  </label>
                </div>
              </div>

              <!-- Quick Stats -->
              <div class="pt-6 border-t border-comma-border-subtle">
                <h4 class="text-sm font-semibold text-comma-neutral-900 mb-3">{{ $t('agents_page.quick_stats') }}</h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-comma-neutral-600">{{ $t('agents_page.total_agents') }}</span>
                    <span class="font-semibold text-comma-neutral-900">{{ store.visibleAgents.length }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-comma-neutral-600">{{ $t('agents_page.active_agents') }}</span>
                    <span class="font-semibold text-comma-neutral-900">{{ activeCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <!-- Main Content Area -->
          <main class="lg:w-3/4">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h2 class="text-2xl lg:text-3xl font-bold text-comma-neutral-900 font-display mb-2">
                  {{ $t('agents_page.our_agents') }}
                </h2>
                <p class="text-comma-neutral-600">
                  {{ $t('agents_page.agents_count', { count: filteredAgents.length, total: store.visibleAgents.length })
                  }}
                </p>
              </div>

              <!-- Sort Options -->
              <div class="hidden lg:flex items-center gap-4">
                <span class="text-sm text-comma-neutral-600">{{ $t('agents_page.sort_by') }}:</span>
                <select v-model="sortBy"
                  class="px-4 py-2 rounded-lg border border-comma-border-subtle bg-white text-comma-neutral-700 focus:outline-none focus:border-comma-primary">
                  <option value="priority">{{ $t('agents_page.sort.priority') }}</option>
                  <option value="name">{{ $t('agents_page.sort.name') }}</option>
                  <option value="recent">{{ $t('agents_page.sort.recent') }}</option>
                </select>
              </div>
            </div>

            <!-- Mobile Sort -->
            <div class="lg:hidden mb-6">
              <select v-model="sortBy"
                class="w-full px-4 py-3 rounded-xl border border-comma-border-subtle bg-white text-comma-neutral-700 focus:outline-none focus:border-comma-primary">
                <option value="priority">{{ $t('agents_page.sort.priority') }}</option>
                <option value="name">{{ $t('agents_page.sort.name') }}</option>
                <option value="recent">{{ $t('agents_page.sort.recent') }}</option>
              </select>
            </div>

            <!-- Loading State -->
            <div v-if="store.loading" class="text-center py-16">
              <Icon name="mdi:loading" class="w-12 h-12 text-comma-primary animate-spin mx-auto" />
            </div>

            <!-- Agents Grid (only visible agents) -->
            <div v-else-if="groupedAgentSections.length > 0" class="space-y-10">
              <section v-for="section in groupedAgentSections" :key="section.key" class="space-y-4">
                <div class="flex items-center justify-between gap-4 border-b border-comma-border-subtle pb-3">
                  <div>
                    <p class="text-sm font-medium text-comma-primary">{{ section.level }}</p>
                    <h3 class="text-xl lg:text-2xl font-bold text-comma-neutral-900 font-display">
                      {{ section.label }}
                    </h3>
                  </div>
                  <span class="text-sm text-comma-neutral-500">{{ section.agents.length }}</span>
                </div>

                <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
                  <div v-for="agent in section.agents" :key="agentKey(agent)"
                    class="bg-white rounded-2xl shadow-card overflow-hidden group hover:shadow-hover transition-all duration-500 hover:-translate-y-1 border border-comma-border-subtle h-full flex flex-col">
                <div class="flex flex-col lg:flex-row h-full">
                  <!-- Agent Portrait -->
                  <div class="lg:w-2/5 relative overflow-hidden">
                    <div class="w-full h-full min-h-[240px] lg:min-h-full">
                      <img :src="agent.photo?.[0] || AGENT_FALLBACK_IMAGE" :alt="fullName(agent)"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        @error="handleAgentImageError" />
                    </div>

                    <!-- Active Badge -->
                    <!-- <div class="absolute top-4 ltr:left-4 rtl:right-4">
                      <span class="px-3 py-1 text-xs font-semibold rounded-full shadow-lg"
                        :class="agent.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'">
                        {{ agent.active ? $t('agents_page.active') : $t('agents_page.inactive') }}
                      </span>
                    </div> -->
                  </div>

                  <!-- Agent Info -->
                  <div class="lg:w-3/5 p-6 flex flex-col h-full">
                    <!-- Top Content -->
                    <div>
                      <!-- Name and Position -->
                      <div class="mb-3">
                        <h3 class="text-xl lg:text-2xl font-bold text-comma-neutral-900 font-display leading-tight">
                          {{ fullName(agent) }}
                        </h3>
                        <p v-if="jobTitle(agent)" class="text-comma-primary font-semibold mt-1 line-clamp-1">
                          {{ jobTitle(agent) }}
                        </p>
                      </div>

                      <!-- Bio -->
                      <div class="mb-4">
                        <p class="text-comma-neutral-700 leading-relaxed text-sm line-clamp-3 min-h-[60px]">
                          {{ agent.agent_description || $t('agents_page.no_bio') }}
                        </p>
                      </div>

                      <!-- Key Stats -->
                      <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="text-center">
                          <div class="text-lg font-bold text-comma-primary">{{ agent.service_areas?.length || 0 }}
                          </div>
                          <div class="text-xs text-comma-neutral-600">{{ $t('agents_page.areas') }}</div>
                        </div>
                        <div class="text-center">
                          <div class="text-lg font-bold text-comma-primary">{{ agent.uf_employment_date ?
                            experience(agent) + '+' : '-' }}</div>
                          <div class="text-xs text-comma-neutral-600">{{ $t('agents_page.years') }}</div>
                        </div>
                      </div>

                      <!-- Service Areas -->
                      <div class="flex flex-wrap gap-2 mb-4 min-h-[28px]">
                        <span v-for="area in agent.service_areas?.slice(0, 2)" :key="area.service_area_id"
                          class="px-2.5 py-1 bg-comma-primary/10 text-comma-primary text-xs font-medium rounded-full">
                          {{ locale === 'ar' ? area.name_ar : area.name_en }}
                        </span>
                      </div>
                    </div>

                    <!-- Button (Always Bottom) -->
                    <div class="mt-auto">
                      <NuxtLink :to="localePath(`/agents/${agentKey(agent)}-${agentSlug(agent)}`)"
                        class="block w-full py-3 bg-gradient-to-r from-comma-primary to-comma-primary-dark text-white text-center font-semibold rounded-xl hover:from-comma-primary-dark hover:to-comma-primary transition-all duration-300 group/btn shadow-md">
                        <span class="flex items-center justify-center gap-2">
                          {{ $t('agents_page.view_profile') }}
                          <Icon name="mdi:arrow-right"
                            class="w-4 h-4 transform group-hover/btn:ltr:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform duration-300" />
                        </span>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-16 bg-white rounded-2xl shadow-card">
              <Icon name="mdi:account-search" class="w-16 h-16 text-comma-neutral-300 mx-auto mb-4" />
              <h3 class="text-xl font-semibold text-comma-neutral-800 mb-2">{{ $t('agents_page.no_agents') }}</h3>
              <p class="text-comma-neutral-600 mb-6">{{ $t('agents_page.try_again') }}</p>
              <button @click="resetFilters"
                class="px-6 py-3 bg-comma-primary text-white font-semibold rounded-xl hover:bg-comma-primary-dark transition-colors duration-300">
                {{ $t('agents_page.reset_search') }}
              </button>
            </div>
          </main>
        </div>
      </div>
    </section>

    <!-- Latest Listings Section -->
    <section class="py-12 lg:py-16 bg-comma-surface-elevated">
      <div class="container px-4 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl lg:text-3xl font-bold text-comma-neutral-900 mb-4 font-display">
            {{ $t('agents_page.latest_listings') }}
          </h2>
          <p class="text-comma-neutral-600 max-w-2xl mx-auto">
            {{ $t('agents_page.latest_listings_desc') }}
          </p>
        </div>

        <div v-if="!propertiesStore.loading && latestProperties.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="property in latestProperties" :key="property.property_id"
            class="bg-white rounded-2xl shadow-card overflow-hidden group hover:shadow-hover transition-all duration-500 hover:-translate-y-1">
            <div class="relative h-48 overflow-hidden">
              <img :src="property.property_photos?.[0] || PROPERTY_FALLBACK_IMAGE" :alt="propertyTitle(property)"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                @error="handlePropertyImageError" />
              <div class="absolute top-4 ltr:left-4 rtl:right-4">
                <span class="px-3 py-1 bg-comma-primary text-white text-sm font-semibold rounded-full">
                  {{ property.property_type || property.sale_type }}
                </span>
              </div>
              <div class="absolute top-4 ltr:right-4 rtl:left-4">
                <span class="px-3 py-1 bg-white text-comma-primary text-sm font-semibold rounded-full">
                  {{ formatPrice(property.price) }}
                </span>
              </div>
            </div>
            <div class="p-6">
              <h3
                class="text-xl font-bold text-comma-neutral-900 mb-2 group-hover:text-comma-primary transition-colors duration-300 line-clamp-1">
                {{ propertyTitle(property) }}
              </h3>
              <div class="flex items-center gap-2 text-comma-neutral-600 mb-3">
                <Icon name="mdi:map-marker" class="w-4 h-4" />
                <span class="text-sm">{{ property.location || property.community || property.city }}</span>
              </div>
              <div class="flex items-center gap-4 text-sm text-comma-neutral-600 mb-4">
                <span v-if="property.bedroom" class="flex items-center gap-1">
                  <Icon name="mdi:bed" class="w-4 h-4" />
                  {{ property.bedroom }} {{ $t('agents_page.beds') }}
                </span>
                <span v-if="property.bathroom" class="flex items-center gap-1">
                  <Icon name="mdi:bathtub" class="w-4 h-4" />
                  {{ property.bathroom }} {{ $t('agents_page.baths') }}
                </span>
                <span class="flex items-center gap-1">
                  <Icon name="mdi:square" class="w-4 h-4" />
                  {{ propertySize(property) }} {{ $t('agents_page.sqft') }}
                </span>
              </div>
              <NuxtLink :to="localePath(`/properties/${property.property_id}-${propertySlug(property)}`)"
                class="inline-flex items-center gap-1 text-comma-primary font-semibold text-sm group/link hover:text-comma-primary-dark transition-colors duration-300">
                {{ $t('agents_page.view_details') }}
                <Icon name="mdi:arrow-right"
                  class="w-4 h-4 transform group-hover/link:ltr:translate-x-1 rtl:group-hover/link:-translate-x-1 transition-transform duration-300" />
              </NuxtLink>
            </div>
          </div>
        </div>
        <div v-else-if="propertiesStore.loading" class="text-center py-16">
          <Icon name="mdi:loading" class="w-12 h-12 text-comma-primary animate-spin mx-auto" />
        </div>
        <div v-else class="text-center py-16">
          <p class="text-comma-neutral-600">{{ $t('agents_page.no_latest_properties') }}</p>
        </div>

        <div class="text-center mt-12">
          <NuxtLink :to="localePath('/properties')"
            class="inline-flex items-center gap-2 px-8 py-3 bg-comma-primary text-white font-semibold rounded-xl hover:bg-comma-primary-dark transition-all duration-300 hover:scale-105">
            {{ $t('agents_page.view_all_properties') }}
            <Icon name="mdi:arrow-right" class="w-5 h-5" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Mobile Filter Drawer -->
    <div v-if="isFilterOpen" class="fixed inset-0 z-50 lg:hidden">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="isFilterOpen = false"></div>
      <div class="absolute inset-y-0 ltr:right-0 rtl:left-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-comma-border-subtle p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-comma-neutral-900 font-display">{{ $t('agents_page.filter_agents') }}
            </h3>
            <button @click="isFilterOpen = false" class="p-2 rounded-full hover:bg-comma-neutral-100">
              <Icon name="mdi:close" class="w-5 h-5 text-comma-neutral-600" />
            </button>
          </div>
          <div class="mt-4 p-3 bg-comma-surface-subtle rounded-xl">
            <p class="text-comma-neutral-900 font-semibold">{{ filteredAgents.length }} {{
              $t('agents_page.agents_found') }}</p>
          </div>
        </div>
        <div class="p-6 space-y-6">
          <!-- Name Search -->
          <div>
            <label class="block text-sm font-medium text-comma-neutral-800 mb-3">
              <Icon name="mdi:magnify" class="inline-block w-4 h-4 ltr:mr-2 rtl:ml-2" />
              {{ $t('agents_page.search_by_name') }}
            </label>
            <input v-model="searchQuery" type="text" :placeholder="$t('agents_page.name_placeholder')"
              class="w-full px-4 py-3 rounded-xl border border-comma-border-subtle focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 outline-none" />
          </div>

          <!-- Active Status -->
          <div>
            <h4 class="text-sm font-semibold text-comma-neutral-900 mb-3">{{ $t('agents_page.status') }}</h4>
            <div class="space-y-2">
              <label
                class="flex items-center gap-3 p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 cursor-pointer">
                <input type="radio" v-model="activeFilter" :value="null" class="w-4 h-4 text-comma-primary" />
                <span class="text-sm text-comma-neutral-700">{{ $t('agents_page.all') }}</span>
              </label>
              <label
                class="flex items-center gap-3 p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 cursor-pointer">
                <input type="radio" v-model="activeFilter" :value="true" class="w-4 h-4 text-comma-primary" />
                <span class="text-sm text-comma-neutral-700">{{ $t('agents_page.active') }}</span>
              </label>
              <label
                class="flex items-center gap-3 p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 cursor-pointer">
                <input type="radio" v-model="activeFilter" :value="false" class="w-4 h-4 text-comma-primary" />
                <span class="text-sm text-comma-neutral-700">{{ $t('agents_page.inactive') }}</span>
              </label>
            </div>
          </div>

          <!-- Service Area -->
          <div>
            <h4 class="text-sm font-semibold text-comma-neutral-900 mb-3">{{ $t('agents_page.service_areas') }}</h4>
            <div class="space-y-2 max-h-40 overflow-y-auto pr-2">
              <label v-for="area in uniqueServiceAreas" :key="area"
                class="flex items-center gap-3 p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 cursor-pointer"
                :class="{ 'border-comma-primary bg-comma-primary/10': selectedArea === area }">
                <input type="radio" v-model="selectedArea" :value="area" class="w-4 h-4 text-comma-primary" />
                <span class="text-sm text-comma-neutral-700">{{ area }}</span>
              </label>
              <label
                class="flex items-center gap-3 p-3 rounded-lg border border-comma-border-subtle hover:border-comma-primary hover:bg-comma-primary/5 cursor-pointer">
                <input type="radio" v-model="selectedArea" value="" class="w-4 h-4 text-comma-primary" />
                <span class="text-sm text-comma-neutral-700">{{ $t('agents_page.all_areas') }}</span>
              </label>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="sticky bottom-0 bg-white pt-6 border-t border-comma-border-subtle">
            <div class="grid grid-cols-2 gap-3">
              <button @click="resetFilters"
                class="py-3 border border-comma-border-strong text-comma-neutral-700 rounded-xl hover:bg-comma-neutral-100">
                {{ $t('agents_page.reset_all') }}
              </button>
              <button @click="isFilterOpen = false"
                class="py-3 bg-gradient-to-r from-comma-primary to-comma-primary-dark text-white rounded-xl hover:from-comma-primary-dark hover:to-comma-primary">
                {{ $t('agents_page.apply_filters') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAgentsStore } from '~/store/agents'
import { usePropertiesStore } from '~/store/properties'
import type { Agent } from '~/types/agent'
import type { Property } from '~/types/property'

const { locale } = useI18n()
const localePath = useLocalePath()
const direction = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))

const store = useAgentsStore()
const propertiesStore = usePropertiesStore()

// Fetch data on mount
onMounted(async () => {
  await store.fetchAgents({ per_page: 100 })
  await store.fetchServiceAreas()
  await propertiesStore.fetchProperties({ per_page: 3, sort_by: 'created_at', sort_direction: 'desc' })
})

// Filters state
const searchQuery = ref('')
const activeFilter = ref<boolean | null>(null)
const selectedArea = ref('')
const sortBy = ref('priority')
const isFilterOpen = ref(false)

// Helper: get full name
function fullName(agent: Agent): string {
  const parts = [agent.first_name || agent.name, agent.second_name || agent.middle_name, agent.last_name].filter(Boolean)
  return parts.join(' ') || 'Unnamed'
}

function jobTitle(agent: Agent): string {
  return agent.work_position || agent.position || agent.personal_profession || agent.agent_type || ''
}

function agentKey(agent: Agent): number {
  return Number(agent.agent_id ?? agent.id)
}

function agentSlug(agent: Agent): string {
  const localizedSlug = locale.value === 'ar' ? agent.slug_ar : agent.slug_en
  const fallbackName = fullName(agent).toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '')
  return String(localizedSlug || agent.slug || fallbackName || agentKey(agent))
}

// Helper: calculate years of experience
function experience(agent: Agent): number {
  if (!agent.uf_employment_date) return 0
  const start = new Date(agent.uf_employment_date)
  const now = new Date()
  return Math.max(0, now.getFullYear() - start.getFullYear())
}

// Unique service area names (localized) from visible agents only
const uniqueServiceAreas = computed(() => {
  const areasSet = new Set<string>()
  store.visibleAgents.forEach((agent) => {
    agent.service_areas?.forEach((area) => {
      const name = locale.value === 'ar' ? area.name_ar : area.name_en
      if (name) areasSet.add(name)
    })
  })
  return Array.from(areasSet).sort()
})

// Filtered agents (only visible)
const filteredAgents = computed(() => {
  let filtered = [...store.visibleAgents]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter((agent) => fullName(agent).toLowerCase().includes(q))
  }

  if (activeFilter.value !== null) {
    filtered = filtered.filter((agent) => agent.active === activeFilter.value)
  }

  if (selectedArea.value) {
    filtered = filtered.filter((agent) =>
      agent.service_areas?.some(
        (area) => (locale.value === 'ar' ? area.name_ar : area.name_en) === selectedArea.value,
      ),
    )
  }

  return filtered
})

const agentLevelConfig = [
  { key: 'higher_management', level: 'Level 1', label: { en: 'Higher Management', ar: 'الإدارة العليا' } },
  { key: 'management', level: 'Level 2', label: { en: 'Management', ar: 'الإدارة' } },
  { key: 'agents', level: 'Level 3', label: { en: 'Agents', ar: 'المستشارون' } },
] as const

function levelRank(agent: Agent): number {
  if (agent.website_level === 'higher_management') return 1
  if (agent.website_level === 'management') return 2
  if (agent.website_level === 'agents') return 3
  return 3
}

function dateRank(value?: string | null): number {
  if (!value) return Number.MAX_SAFE_INTEGER
  const timestamp = new Date(value).getTime()
  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp
}

function websiteDisplaySort(a: Agent, b: Agent): number {
  const orderA = a.display_order ?? Number.MAX_SAFE_INTEGER
  const orderB = b.display_order ?? Number.MAX_SAFE_INTEGER
  if (orderA !== orderB) return orderA - orderB

  const levelA = levelRank(a)
  const levelB = levelRank(b)
  if (levelA !== levelB) return levelA - levelB

  const creA = a.cre ?? Number.MAX_SAFE_INTEGER
  const creB = b.cre ?? Number.MAX_SAFE_INTEGER
  if (creA !== creB) return creA - creB

  const dateA = dateRank(a.uf_employment_date)
  const dateB = dateRank(b.uf_employment_date)
  if (dateA !== dateB) return dateA - dateB

  return fullName(a).localeCompare(fullName(b))
}

// Sorted agents based on selected sort
const sortedAgents = computed(() => {
  const agents = [...filteredAgents.value]
  switch (sortBy.value) {
    case 'name':
      return agents.sort((a, b) => fullName(a).localeCompare(fullName(b)))
    case 'recent':
      return agents.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    default:
      return agents.sort(websiteDisplaySort)
  }
})

const groupedAgentSections = computed(() => {
  const agents = sortedAgents.value
  if (sortBy.value !== 'priority') {
    return [
      {
        key: 'all',
        level: '',
        label: locale.value === 'ar' ? 'كل المستشارين' : 'All Agents',
        agents,
      },
    ].filter((section) => section.agents.length > 0)
  }

  return agentLevelConfig
    .map((config) => ({
      key: config.key,
      level: config.level,
      label: locale.value === 'ar' ? config.label.ar : config.label.en,
      agents: agents.filter((agent) => (agent.website_level || 'agents') === config.key),
    }))
    .filter((section) => section.agents.length > 0)
})

const activeCount = computed(() => store.visibleAgents.filter((a) => a.active).length)

// Reset all filters
function resetFilters() {
  searchQuery.value = ''
  activeFilter.value = null
  selectedArea.value = ''
  sortBy.value = 'priority'
  isFilterOpen.value = false
}

// Fallback images
const AGENT_FALLBACK_IMAGE = '/images/avatar2.jpg'
const PROPERTY_FALLBACK_IMAGE = '/images/prop.jpg'

function handleAgentImageError(event: Event) {
  ; (event.target as HTMLImageElement).src = AGENT_FALLBACK_IMAGE
}
function handlePropertyImageError(event: Event) {
  ; (event.target as HTMLImageElement).src = PROPERTY_FALLBACK_IMAGE
}

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(price)
}

// Property helpers
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
function propertySize(property: Property) {
  const size = property.build_up_area_sqft || property.total_area_sqft
  return size ? Math.round(Number(size)).toLocaleString() : 'N/A'
}

const latestProperties = computed(() => propertiesStore.properties.slice(0, 3))
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bg-grid-pattern {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white' stroke-opacity='0.05'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f5f3f2;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #d6d2d0;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a29e;
}
</style>
