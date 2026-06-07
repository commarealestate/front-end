<template>
  <div class="group bg-white rounded-xl shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden border border-comma-border-subtle flex flex-col h-full min-h-[380px]">
    
    <!-- Photo -->
    <NuxtLink :to="localePath(`/admin/agents/${agent.agent_id}`)">
      <div class="relative aspect-[4/3] overflow-hidden bg-comma-neutral-100">
        
        <img
          v-if="primaryPhoto"
          :src="primaryPhoto"
          :alt="fullName"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <!-- Fallback -->
        <div
          v-else
          class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-comma-neutral-400"
        >
          <AdminLocalIcon name="user" class="w-20 h-20" />
          <span class="text-xs mt-2">No Image</span>
        </div>

        <!-- Active badge -->
        <span
          class="absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded"
          :class="agent.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
        >
          {{ agent.active ? t('admin_agents_page.active') : t('admin_agents_page.inactive') }}
        </span>
      </div>
    </NuxtLink>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-1">
      
      <!-- Name -->
      <NuxtLink :to="localePath(`/admin/agents/${agent.agent_id}`)" class="hover:text-comma-primary">
        <h3 class="font-display font-semibold text-comma-neutral-900 line-clamp-1 min-h-[24px]">
          {{ fullName }}
        </h3>
      </NuxtLink>

      <!-- Position -->
      <p
        v-if="agent.work_position"
        class="text-sm text-comma-neutral-600 mt-1 line-clamp-1 min-h-[20px]"
      >
        {{ agent.work_position }}
      </p>
      <div v-else class="min-h-[20px]"></div>

      <!-- Contact -->
      <div class="mt-3 space-y-1 text-sm text-comma-neutral-700 min-h-[48px]">
        <div v-if="agent.email" class="flex items-center gap-2">
          <AdminLocalIcon name="envelope" class="w-4 h-4 text-comma-primary" />
          <span class="truncate">{{ agent.email }}</span>
        </div>
        <div v-if="agent.personal_mobile" class="flex items-center gap-2">
          <AdminLocalIcon name="phone" class="w-4 h-4 text-comma-primary" />
          <span>{{ agent.personal_mobile }}</span>
        </div>
      </div>

      <!-- Service Areas -->
      <div class="mt-3 min-h-[28px] flex flex-wrap gap-1">
        <template v-if="agent.service_areas?.length">
          <span
            v-for="area in agent.service_areas.slice(0, 2)"
            :key="area.service_area_id"
            class="px-2 py-0.5 bg-comma-surface-subtle text-comma-neutral-600 text-xs rounded"
          >
            {{ area.name }}
          </span>
          <span
            v-if="agent.service_areas.length > 2"
            class="text-xs text-comma-neutral-500"
          >
            +{{ agent.service_areas.length - 2 }}
          </span>
        </template>
      </div>

      <!-- Toggle and actions -->
      <div class="mt-auto pt-3 flex items-center justify-between border-t border-comma-border-subtle">
        <UToggle
          :model-value="agent.active"
          @update:model-value="$emit('toggleActive', agent)"
        />
        <UButton
          color="gray"
          variant="ghost"
          :to="localePath(`/admin/agents/${agent.agent_id}/edit`)"
          size="sm"
        >
          <AdminLocalIcon name="pencil-square" class="w-4 h-4" />
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Agent } from '~/types/agent'

const props = defineProps<{
  agent: Agent
}>()
defineEmits<{
  (e: 'toggleActive', agent: Agent): void
}>()

const localePath = useLocalePath()
const { t } = useI18n()

const fullName = computed(() => {
  const parts = [props.agent.name, props.agent.second_name, props.agent.last_name].filter(Boolean)
  return parts.join(' ') || 'Unnamed'
})

const primaryPhoto = computed(() => {
  return props.agent.personal_photo?.[0] || props.agent.photo?.[0] || ''
})
</script>
