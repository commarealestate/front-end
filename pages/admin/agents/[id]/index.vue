<template>

    <div v-if="store.loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
    </div>
    <div v-else-if="agent" class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
          {{ fullName }}
        </h1>
        <div class="flex gap-2">
          <UButton
            color="primary"
            variant="outline"
            icon="i-heroicons-pencil-square"
            :to="localePath(`/admin/agents/${agent.agent_id}/edit`)"
          >
            {{ $t('admin_agents_page.edit') }}
          </UButton>
          <UButton
            color="red"
            variant="outline"
            icon="i-heroicons-trash"
            @click="confirmDelete"
          >
            {{ $t('admin_agents_page.delete') }}
          </UButton>
        </div>
      </div>

      <!-- Agent Info Card -->
      <div class="bg-white rounded-2xl shadow-card p-6 lg:p-8">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Photo -->
          <div class="md:w-1/3">
            <div class="rounded-xl overflow-hidden bg-comma-neutral-100">
              <img
                v-if="agent.personal_photo?.length"
                :src="agent.personal_photo[0]"
                :alt="fullName"
                class="w-full h-auto"
              />
              <div v-else class="aspect-square flex items-center justify-center text-comma-neutral-400">
                <Icon name="i-heroicons-user-circle" class="w-32 h-32" />
              </div>
            </div>
          </div>

          <!-- Details -->
          <div class="md:w-2/3 space-y-4">
            <div class="flex items-center gap-2">
              <span
                class="px-3 py-1 rounded-full text-sm font-semibold"
                :class="agent.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ agent.active ? $t('admin_agents_page.active') : $t('admin_agents_page.inactive') }}
              </span>
              <span v-if="agent.work_position" class="text-comma-primary font-medium">{{ agent.work_position }}</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="agent.email">
                <div class="text-sm text-comma-neutral-600">Email</div>
                <div class="font-medium">{{ agent.email }}</div>
              </div>
              <div v-if="agent.personal_mobile">
                <div class="text-sm text-comma-neutral-600">Mobile</div>
                <div class="font-medium">{{ agent.personal_mobile }}</div>
              </div>
              <div v-if="agent.personal_phone">
                <div class="text-sm text-comma-neutral-600">Phone</div>
                <div class="font-medium">{{ agent.personal_phone }}</div>
              </div>
              <div v-if="agent.personal_city">
                <div class="text-sm text-comma-neutral-600">City</div>
                <div class="font-medium">{{ agent.personal_city }}</div>
              </div>
              <div v-if="agent.personal_birthday">
                <div class="text-sm text-comma-neutral-600">Birthday</div>
                <div class="font-medium">{{ formatDate(agent.personal_birthday) }}</div>
              </div>
              <div v-if="agent.uf_employment_date">
                <div class="text-sm text-comma-neutral-600">Employment Date</div>
                <div class="font-medium">{{ formatDate(agent.uf_employment_date) }}</div>
              </div>
            </div>

            <!-- Work Info -->
            <div class="pt-4 border-t border-comma-border-subtle">
              <h3 class="text-lg font-semibold mb-3">Work Details</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-if="agent.work_company">
                  <div class="text-sm text-comma-neutral-600">Company</div>
                  <div class="font-medium">{{ agent.work_company }}</div>
                </div>
                <div v-if="agent.work_department">
                  <div class="text-sm text-comma-neutral-600">Department</div>
                  <div class="font-medium">{{ agent.work_department }}</div>
                </div>
                <div v-if="agent.work_phone">
                  <div class="text-sm text-comma-neutral-600">Work Phone</div>
                  <div class="font-medium">{{ agent.work_phone }}</div>
                </div>
                <div v-if="agent.work_www">
                  <div class="text-sm text-comma-neutral-600">Website</div>
                  <div class="font-medium">
                    <a :href="agent.work_www" target="_blank" class="text-comma-primary hover:underline">{{ agent.work_www }}</a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Service Areas -->
            <div v-if="agent.service_areas?.length" class="pt-4 border-t border-comma-border-subtle">
              <h3 class="text-lg font-semibold mb-3">Service Areas</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="area in agent.service_areas"
                  :key="area.service_area_id"
                  class="px-3 py-1 bg-comma-primary/10 text-comma-primary rounded-full text-sm"
                >
                  {{ area.name }}
                </span>
              </div>
            </div>

            <!-- Social Links -->
            <div v-if="hasSocialLinks" class="pt-4 border-t border-comma-border-subtle">
              <h3 class="text-lg font-semibold mb-3">Social</h3>
              <div class="flex gap-3">
                <a v-if="agent.uf_linkedin" :href="agent.uf_linkedin" target="_blank" class="text-[#0A66C2] hover:opacity-80">
                  <Icon name="mdi:linkedin" class="w-6 h-6" />
                </a>
                <a v-if="agent.uf_facebook" :href="agent.uf_facebook" target="_blank" class="text-[#1877F2] hover:opacity-80">
                  <Icon name="mdi:facebook" class="w-6 h-6" />
                </a>
                <a v-if="agent.uf_twitter" :href="agent.uf_twitter" target="_blank" class="text-[#1DA1F2] hover:opacity-80">
                  <Icon name="mdi:twitter" class="w-6 h-6" />
                </a>
                <a v-if="agent.uf_skype" :href="`skype:${agent.uf_skype}?chat`" class="text-[#00AFF0] hover:opacity-80">
                  <Icon name="mdi:skype" class="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 
</template>

<script setup lang="ts">
import { useAgentsStore } from '~/store/agents'

const route = useRoute()
const store = useAgentsStore()
const localePath = useLocalePath()

const agentId = route.params.id as string

onMounted(async () => {
  await store.fetchAgent(agentId)
})

const agent = computed(() => store.agent)

const fullName = computed(() => {
  if (!agent.value) return ''
  const parts = [agent.value.name, agent.value.second_name, agent.value.last_name].filter(Boolean)
  return parts.join(' ') || 'Unnamed'
})

const hasSocialLinks = computed(() => {
  return agent.value?.uf_linkedin || agent.value?.uf_facebook || agent.value?.uf_twitter || agent.value?.uf_skype
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

async function confirmDelete() {
  if (confirm('Are you sure you want to delete this agent?')) {
    await store.deleteAgent(agentId)
    navigateTo(localePath('/admin/agents'))
  }
}
</script>