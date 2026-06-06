<template>
 
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
            {{ $t('admin.dashboard') }}
          </h1>
          <p class="text-comma-neutral-600 mt-1">{{ welcomeMessage }}</p>
        </div>
        <UButton color="primary" variant="solid" icon="i-heroicons-arrow-path" @click="refreshAll" :loading="refreshing">
          {{ $t('admin_dashboard_page.refresh') }}
        </UButton>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <AdminDashboardStatsCard
          :title="$t('admin_dashboard_page.stats.properties')"
          :count="propertiesTotal"
          icon="i-heroicons-home"
          to="/admin/properties"
        />
        <AdminDashboardStatsCard
          :title="$t('admin_dashboard_page.stats.blogs')"
          :count="blogsTotal"
          icon="i-heroicons-newspaper"
          to="/admin/blogs"
        />
        <AdminDashboardStatsCard
          :title="$t('admin_dashboard_page.stats.agents')"
          :count="agentsTotal"
          icon="i-heroicons-users"
          to="/admin/agents"
        />
        <AdminDashboardStatsCard
          :title="$t('admin_dashboard_page.stats.contact')"
          :count="contactTotal"
          icon="i-heroicons-envelope"
          to="/admin/contact"
          :subtext="`${unreadCount} unread`"
        />
        <AdminDashboardStatsCard
          :title="$t('admin_dashboard_page.stats.careers')"
          :count="careersTotal"
          icon="i-heroicons-briefcase"
          to="/admin/careers"
        />
      </div>

      <!-- Two-column layout for recent items -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left column -->
        <div class="space-y-6">
          <AdminDashboardRecentProperties
            :properties="recentProperties"
            :loading="propertiesLoading"
            :total="propertiesTotal"
          />
          <AdminDashboardRecentAgents
            :agents="recentAgents"
            :loading="agentsLoading"
          />
        </div>

        <!-- Right column -->
        <div class="space-y-6">
          <AdminDashboardRecentBlogs
            :blogs="recentBlogs"
            :loading="blogsLoading"
          />
          <AdminDashboardRecentContact
            :messages="recentMessages"
            :loading="contactLoading"
          />
          <AdminDashboardRecentCareers
            :applications="recentCareers"
            :loading="careersLoading"
          />
        </div>
      </div>
    </div>
  
</template>

<script setup lang="ts">
import { usePropertiesStore } from '~/store/properties'
import { useBlogsStore } from '~/store/blogs'
import { useAgentsStore } from '~/store/agents'
import { useMomentsStore } from '~/store/moments'
import { useTalentsStore } from '~/store/talents'
import { useContactStore } from '~/store/contact'
import { useCareers } from '~/composables/useCareers'

const { t, locale } = useI18n()
const localePath = useLocalePath()

// Stores
const propertiesStore = usePropertiesStore()
const blogsStore = useBlogsStore()
const agentsStore = useAgentsStore()
const momentsStore = useMomentsStore()
const talentsStore = useTalentsStore()
const contactStore = useContactStore()

// Careers composable
const { careers, pending: careersLoading, fetchCareers } = useCareers()
const careersTotal = computed(() => careers.value?.length || 0)

// Fetch data on mount
const refreshing = ref(false)

async function fetchAll() {
  refreshing.value = true
  await Promise.all([
    propertiesStore.fetchProperties({ per_page: 5 }),
    blogsStore.fetchBlogs({ per_page: 5 }),
    agentsStore.fetchAgents({ per_page: 5 }),
    momentsStore.fetchMoments({ per_page: 5 }),
    talentsStore.fetchTalents({ per_page: 5 }),
    contactStore.fetchMessages({ per_page: 5 }),
    fetchCareers({ per_page: 5 }),
  ])
  refreshing.value = false
}

onMounted(fetchAll)

// Totals from pagination
const propertiesTotal = computed(() => propertiesStore.pagination?.total || 0)
const blogsTotal = computed(() => blogsStore.pagination?.total || 0)
const agentsTotal = computed(() => agentsStore.pagination?.total || 0)
const momentsTotal = computed(() => momentsStore.pagination?.total || 0)
const talentsTotal = computed(() => talentsStore.pagination?.total || 0)
const contactTotal = computed(() => contactStore.pagination?.total || 0)

// Unread count for contact
const unreadCount = computed(() => contactStore.messages?.filter(m => !m.is_read).length)

// Recent items (first 5)
const recentProperties = computed(() => propertiesStore.properties.slice(0, 5))
const recentBlogs = computed(() => blogsStore.blogs.slice(0, 5))
const recentAgents = computed(() => agentsStore.agents.slice(0, 5))
const recentMessages = computed(() => contactStore.messages.slice(0, 5))
const recentCareers = computed(() => careers.value?.slice(0, 5) || [])

// Loading states
const propertiesLoading = computed(() => propertiesStore.loading)
const blogsLoading = computed(() => blogsStore.loading)
const agentsLoading = computed(() => agentsStore.loading)
const contactLoading = computed(() => contactStore.loading)

// Welcome message with date
const currentDate = new Date().toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
const welcomeMessage = computed(() => t('admin_dashboard_page.current_date', { date: currentDate }))

// Refresh function
const refreshAll = () => {
  fetchAll()
}
</script>