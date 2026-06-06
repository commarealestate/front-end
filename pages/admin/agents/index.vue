<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
          {{ $t('admin_agents_page.title') }}
        </h1>
        <UButton
          color="primary"
          variant="solid"
          icon="i-heroicons-plus"
          :to="localePath('/admin/agents/new')"
        >
          {{ $t('admin_agents_page.add_new') }}
        </UButton>
      </div>

      <!-- Filters  -->
      <AdminAgentsFilters @filter="applyFilters" @reset="resetFilters" />

      <!-- Loading -->
      <div v-if="store.loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
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
        <UIcon name="i-heroicons-users" class="w-16 h-16 mx-auto text-comma-neutral-400" />
        <h3 class="mt-4 text-lg font-medium text-comma-neutral-700">
          {{ $t('admin_agents_page.no_agents') }}
        </h3>
        <p class="text-comma-neutral-500">
          {{ $t('admin_agents_page.no_agents_desc') }}
        </p>
        <UButton
          color="primary"
          variant="solid"
          class="mt-4"
          :to="localePath('/admin/agents/new')"
        >
          {{ $t('admin_agents_page.add_first') }}
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
const { locale } = useI18n()
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

// Helper to get full name for sorting
function fullName(agent: Agent) {
  const parts = [agent.name, agent.second_name, agent.last_name].filter(Boolean)
  return parts.join(' ') || 'Unnamed'
}

// Priority sort function
function prioritySort(a: Agent, b: Agent) {
  const aHasPos = !!a.work_position
  const bHasPos = !!b.work_position
  if (aHasPos && !bHasPos) return -1
  if (!aHasPos && bHasPos) return 1

  if (aHasPos && bHasPos) {
    const posA = a.work_position
    const posB = b.work_position

    // 1. Co- Founder & General Manager
    if (posA === 'Co- Founder & General Manager' && posB !== 'Co- Founder & General Manager') return -1
    if (posA !== 'Co- Founder & General Manager' && posB === 'Co- Founder & General Manager') return 1

    // 2. Co-Founder & Chairman
    if (posA === 'Co-Founder & Chairman' && posB !== 'Co-Founder & Chairman') return -1
    if (posA !== 'Co-Founder & Chairman' && posB === 'Co-Founder & Chairman') return 1

    // Otherwise sort by name
    return fullName(a).localeCompare(fullName(b))
  }

  // Both have no position, sort by name
  return fullName(a).localeCompare(fullName(b))
}

// Sorted agents
const sortedAgents = computed(() => {
  return [...store.agents].sort(prioritySort)
})
</script>