<template>
  <UCard class="border border-comma-border-subtle shadow-lg hover:shadow-xl transition-shadow" :ui="{ body: 'p-5', header: 'px-5 py-4 border-b border-comma-border-subtle bg-comma-surface-elevated', footer: 'px-5 py-3 border-t border-comma-border-subtle' }">
    <template #header>
      <div class="flex items-center justify-between p-5">
        <h3 class="text-lg font-display font-semibold text-comma-neutral-900">{{ $t('admin_dashboard_page.recent.agents') }}</h3>
        <UButton color="primary" variant="ghost" :to="localePath('/admin/agents')" size="sm" icon="i-heroicons-arrow-right" trailing>
          {{ $t('admin_dashboard_page.recent.view_all') }}
        </UButton>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-12">
      <Icon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
    </div>

    <div v-else-if="agents.length" class="space-y-4 p-5">
      <div v-for="agent in agents" :key="agent.agent_id" class="group">
        <NuxtLink :to="localePath(`/admin/agents/${agent.agent_id}`)" class="block">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-comma-neutral-100 flex items-center justify-center overflow-hidden ring-2 ring-white group-hover:ring-comma-primary/20 transition">
              <img v-if="agent.personal_photo?.length" :src="agent.personal_photo[0]" class="w-full h-full object-cover" />
              <Icon v-else name="i-heroicons-user-circle" class="w-6 h-6 text-comma-neutral-400" />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h4 class="font-semibold text-comma-neutral-900 group-hover:text-comma-primary transition">{{ agent.name }} {{ agent.last_name }}</h4>
                <UBadge :color="agent.active ? 'green' : 'gray'" size="xs">
                  {{ agent.active ? $t('admin_dashboard_page.recent.active') : $t('admin_dashboard_page.recent.inactive') }}
                </UBadge>
              </div>
              <p class="text-sm text-comma-neutral-600 truncate">{{ agent.email }}</p>
              <p v-if="agent.work_position" class="text-xs text-comma-neutral-500 mt-1">{{ agent.work_position }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div v-else class="py-12 text-center text-comma-neutral-500 bg-comma-surface-elevated/50 rounded-lg">
      <Icon name="i-heroicons-users" class="w-10 h-10 mx-auto text-comma-neutral-300 mb-2" />
      <p>{{ $t('admin.no_data') }}</p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Agent } from '~/types/agent'

defineProps<{
  agents: Agent[]
  loading: boolean
}>()

const localePath = useLocalePath()
</script>