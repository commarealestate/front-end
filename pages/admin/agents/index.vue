<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
          {{ t('admin_agents_page.title') }}
        </h1>
        <UButton
          color="primary"
          variant="solid"
          :to="localePath('/admin/agents/new')"
        >
          <AdminLocalIcon name="plus" class="w-4 h-4" />
          {{ t('admin_agents_page.add_new') }}
        </UButton>
      </div>

      <!-- Filters  -->
      <AdminAgentsFilters @filter="applyFilters" @reset="resetFilters" />

      <!-- Loading -->
      <div v-if="store.loading" class="flex justify-center py-12">
        <AdminLocalIcon name="arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
      </div>

      <!-- Grid -->
      <div v-else-if="sortedAgents.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AdminAgentsCard
          v-for="agent in sortedAgents"
          :key="agent.agent_id"
          :agent="agent"
          @toggle-active="handleToggleActive"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-16 bg-comma-surface-elevated rounded-xl">
        <AdminLocalIcon name="users" class="w-16 h-16 mx-auto text-comma-neutral-400" />
        <h3 class="mt-4 text-lg font-medium text-comma-neutral-700">
          {{ t('admin_agents_page.no_agents') }}
        </h3>
        <p class="text-comma-neutral-500">
          {{ t('admin_agents_page.no_agents_desc') }}
        </p>
        <UButton
          color="primary"
          variant="solid"
          class="mt-4"
          :to="localePath('/admin/agents/new')"
        >
          {{ t('admin_agents_page.add_first') }}
        </UButton>
      </div>

      <!-- Pagination  -->
      <div v-if="store.pagination" class="mt-8 flex justify-center">
        <UPagination
          v-model="page"
          :page-count="store.pagination.perPage"
          :total="store.pagination.total"
          @update:model-value="fetchPage"
        />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAgentsStore } from '~/store/agents'
import type { Agent } from '~/types/agent'

const store = useAgentsStore()
const localePath = useLocalePath()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const page = ref(1)
const filters = ref<Record<string, any>>({})

onMounted(async () => {
  await store.fetchServiceAreas()
  const query = { ...route.query }
  page.value = Number(query.page) || 1
  delete query.page
  filters.value = query
  fetchAgents()
})

function applyFilters(newFilters: Record<string, any>) {
  filters.value = newFilters
  page.value = 1
  fetchAgents()
}

function resetFilters() {
  filters.value = {}
  page.value = 1
  fetchAgents()
}

function fetchPage(newPage: number) {
  page.value = newPage
  fetchAgents()
}

async function fetchAgents() {
  const params: Record<string, any> = {
    ...filters.value,
    page: page.value,
  }
  await store.fetchAgents(params)
  router.replace({ query: params })
}

async function handleToggleActive(agent: Agent) {
  await store.toggleActive(agent.agent_id, !agent.active)
}

function fullName(agent: Agent) {
  const parts = [agent.first_name || agent.name, agent.second_name || agent.middle_name, agent.last_name].filter(Boolean)
  return parts.join(' ') || 'Unnamed'
}

function levelRank(agent: Agent) {
  if (agent.website_level === 'higher_management') return 1
  if (agent.website_level === 'management') return 2
  if (agent.website_level === 'agents') return 3
  return 4
}

function dateRank(value?: string | null) {
  if (!value) return Number.MAX_SAFE_INTEGER
  const timestamp = new Date(value).getTime()
  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp
}

function agentDisplaySort(a: Agent, b: Agent) {
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

const sortedAgents = computed(() => {
  return [...store.agents].sort(agentDisplaySort)
})
</script>
