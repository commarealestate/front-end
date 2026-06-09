<template>
  <div v-if="store.loading" class="flex justify-center py-12">
    <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
  </div>

  <div v-else-if="agent" class="max-w-7xl mx-auto space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div class="flex flex-col gap-4 sm:flex-row">
        <div class="w-36 h-36 rounded-xl overflow-hidden bg-comma-neutral-100 shrink-0 border border-comma-border-subtle">
          <img v-if="primaryPhoto" :src="primaryPhoto" :alt="fullName" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-comma-neutral-400">
            <AdminLocalIcon name="user-circle" class="w-24 h-24" />
          </div>
        </div>

        <div class="space-y-3">
          <div>
            <p class="text-sm text-comma-neutral-500">Agent #{{ agent.agent_id }}</p>
            <h1 class="text-3xl font-display font-bold text-comma-neutral-900">
              {{ fullName }}
            </h1>
            <p v-if="primaryPosition" class="text-comma-primary font-medium mt-1">{{ primaryPosition }}</p>
          </div>

          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 rounded-full text-sm font-semibold" :class="agent.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ agent.active ? t('admin_agents_page.active') : t('admin_agents_page.inactive') }}
            </span>
            <span v-if="agent.cre" class="px-3 py-1 rounded-full text-sm font-semibold bg-comma-primary/10 text-comma-primary">
              CRE {{ agent.cre }}
            </span>
            <span v-if="websiteLevelLabel" class="px-3 py-1 rounded-full text-sm font-semibold bg-comma-secondary/10 text-comma-secondary">
              {{ websiteLevelLabel }}
            </span>
            <span v-if="agent.display_order !== null && agent.display_order !== undefined" class="px-3 py-1 rounded-full text-sm font-semibold bg-comma-surface-subtle text-comma-neutral-700">
              Display #{{ agent.display_order }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <UButton color="primary" variant="outline" icon="i-heroicons-pencil-square" :to="localePath(`/admin/agents/${agent.agent_id}/edit`)">
          {{ t('admin_agents_page.edit') }}
        </UButton>
        <UButton color="red" variant="outline" icon="i-heroicons-trash" @click="confirmDelete">
          {{ t('admin_agents_page.delete') }}
        </UButton>
      </div>
    </div>

    <div v-if="agent.agent_description || agent.personal_notes || agent.work_notes" class="bg-white rounded-xl shadow-card border border-comma-border-subtle p-6">
      <h2 class="text-lg font-semibold text-comma-neutral-900 mb-3">Notes & Description</h2>
      <div class="space-y-4 text-comma-neutral-700 leading-relaxed">
        <div v-if="agent.agent_description">
          <div class="text-xs uppercase text-comma-neutral-500 font-semibold mb-1">Agent Description</div>
          <p class="whitespace-pre-line">{{ agent.agent_description }}</p>
        </div>
        <div v-if="agent.personal_notes">
          <div class="text-xs uppercase text-comma-neutral-500 font-semibold mb-1">Personal Notes</div>
          <p class="whitespace-pre-line">{{ agent.personal_notes }}</p>
        </div>
        <div v-if="agent.work_notes">
          <div class="text-xs uppercase text-comma-neutral-500 font-semibold mb-1">Work Notes</div>
          <p class="whitespace-pre-line">{{ agent.work_notes }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <section v-for="section in detailSections" :key="section.title" class="bg-white rounded-xl shadow-card border border-comma-border-subtle p-6">
        <h2 class="text-lg font-semibold text-comma-neutral-900 mb-5">{{ section.title }}</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div v-for="field in section.fields" :key="field.label" class="min-w-0">
            <dt class="text-xs uppercase tracking-wide text-comma-neutral-500 font-semibold">{{ field.label }}</dt>
            <dd class="mt-1 text-sm text-comma-neutral-900 break-words">
              <template v-if="isArrayValue(field.value)">
                <div v-if="field.value.length" class="flex flex-wrap gap-2">
                  <a
                    v-for="item in field.value"
                    :key="String(item)"
                    :href="String(item)"
                    target="_blank"
                    class="inline-flex items-center gap-1 px-2 py-1 rounded bg-comma-surface-subtle text-comma-primary hover:underline"
                  >
                    <AdminLocalIcon name="link" class="w-4 h-4" />
                    {{ fileName(item) }}
                  </a>
                </div>
                <span v-else class="text-comma-neutral-400">-</span>
              </template>
              <template v-else>
                <span>{{ formatValue(field.value, 'type' in field ? field.type : undefined) }}</span>
              </template>
            </dd>
          </div>
        </dl>
      </section>
    </div>

    <section class="bg-white rounded-xl shadow-card border border-comma-border-subtle p-6">
      <h2 class="text-lg font-semibold text-comma-neutral-900 mb-5">Activity Timeline</h2>
      <div v-if="agentActivities.length" class="space-y-4">
        <div v-for="activity in agentActivities" :key="activity.id" class="flex gap-3 border-b border-comma-border-subtle pb-4 last:border-0 last:pb-0">
          <div class="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-comma-primary/10 text-comma-primary">
            <UIcon name="i-heroicons-clock" class="h-5 w-5" />
          </div>
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <p class="font-medium text-comma-neutral-900">{{ activityLabel(activity.activity_type) }}</p>
              <span class="text-sm text-comma-neutral-500">{{ formatDate(activity.occurred_at || activity.created_at || '') }}</span>
            </div>
            <p v-if="activity.notes" class="mt-1 text-sm text-comma-neutral-600 whitespace-pre-line">{{ activity.notes }}</p>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-comma-neutral-500">No activity recorded yet.</p>
    </section>

    <section class="bg-white rounded-xl shadow-card border border-comma-border-subtle p-6">
      <h2 class="text-lg font-semibold text-comma-neutral-900 mb-5">Service Areas</h2>
      <div v-if="agent.service_areas?.length" class="flex flex-wrap gap-2">
        <span v-for="area in agent.service_areas" :key="area.service_area_id" class="px-3 py-1 bg-comma-primary/10 text-comma-primary rounded-full text-sm">
          {{ area.name || area.name_en || area.name_ar }}
        </span>
      </div>
      <p v-else class="text-sm text-comma-neutral-500">No service areas assigned.</p>
    </section>
  </div>

  <div v-else class="max-w-4xl mx-auto py-12 text-center text-comma-neutral-500">
    Agent not found.
  </div>
</template>

<script setup lang="ts">
import { useAgentsStore } from '~/store/agents'

const route = useRoute()
const store = useAgentsStore()
const localePath = useLocalePath()
const { t } = useI18n()

const agentId = route.params.id as string

onMounted(async () => {
  await store.fetchAgent(agentId)
})

const agent = computed(() => store.agent)

const fullName = computed(() => {
  if (!agent.value) return ''
  const parts = [agent.value.first_name || agent.value.name, agent.value.second_name || agent.value.middle_name, agent.value.last_name].filter(Boolean)
  return parts.join(' ') || 'Unnamed agent'
})

const primaryPhoto = computed(() => firstArrayItem(agent.value?.personal_photo) || firstArrayItem(agent.value?.photo))
const primaryPosition = computed(() => agent.value?.position || agent.value?.work_position || agent.value?.personal_profession || '')
const websiteLevelLabel = computed(() => {
  if (agent.value?.website_level === 'higher_management') return 'Level 1 - Higher Management'
  if (agent.value?.website_level === 'management') return 'Level 2 - Management'
  if (agent.value?.website_level === 'agents') return 'Level 3 - Agents'
  return ''
})

const detailSections = computed(() => {
  if (!agent.value) return []
  const a = agent.value

  return [
    {
      title: 'Identity',
      fields: [
        { label: 'Title', value: a.title },
        { label: 'First Name', value: a.first_name || a.name },
        { label: 'Second Name', value: a.second_name || a.middle_name },
        { label: 'Last Name', value: a.last_name },
        { label: 'Slug', value: a.slug },
        { label: 'XML ID', value: a.xml_id },
        { label: 'Agent Type', value: a.agent_type },
        { label: 'Departments', value: joinList(a.departments) },
      ],
    },
    {
      title: 'Contact',
      fields: [
        { label: 'Email', value: a.email },
        { label: 'CRM Email', value: a.e_mail },
        { label: 'Company Email', value: a.company_e_mail },
        { label: 'Mobile', value: a.personal_mobile },
        { label: 'Personal Phone', value: a.personal_phone },
        { label: 'Work Phone', value: a.work_phone },
        { label: 'Fax', value: a.personal_fax || a.work_fax },
        { label: 'Inner Phone', value: a.uf_phone_inner },
      ],
    },
    {
      title: 'Personal',
      fields: [
        { label: 'Gender', value: genderLabel(a.personal_gender) },
        { label: 'Birthday', value: a.personal_birthday, type: 'date' },
        { label: 'Profession', value: a.personal_profession },
        { label: 'Website', value: a.personal_www },
        { label: 'City', value: a.personal_city },
        { label: 'State', value: a.personal_state },
        { label: 'Country', value: a.personal_country },
        { label: 'Street', value: a.personal_street },
        { label: 'ZIP', value: a.personal_zip },
        { label: 'Mailbox', value: a.personal_mailbox },
      ],
    },
    {
      title: 'Work',
      fields: [
        { label: 'Position', value: a.position || a.work_position },
        { label: 'Company', value: a.work_company },
        { label: 'Department', value: a.work_department },
        { label: 'Website', value: a.work_www },
        { label: 'Profile', value: a.work_profile },
        { label: 'Work City', value: a.work_city },
        { label: 'Work State', value: a.work_state },
        { label: 'Work Country', value: a.work_country },
        { label: 'Work Street', value: a.work_street },
        { label: 'Work ZIP', value: a.work_zip },
      ],
    },
    {
      title: 'Website Profile',
      fields: [
        { label: 'Active', value: a.active ? 'Yes' : 'No' },
        { label: 'CRE', value: a.cre },
        { label: 'Website Level', value: websiteLevelLabel.value },
        { label: 'Display Order', value: a.display_order },
        { label: 'Specialties', value: a.specialties },
        { label: 'Service Area Text', value: a.service_area },
        { label: 'Online', value: a.is_online },
        { label: 'District', value: a.uf_district },
        { label: 'Employment Date', value: a.uf_employment_date, type: 'date' },
        { label: 'Interests', value: a.uf_interests },
        { label: 'Skills', value: a.uf_skills },
      ],
    },
    {
      title: 'Social & Links',
      fields: [
        { label: 'LinkedIn', value: a.uf_linkedin },
        { label: 'Facebook', value: a.uf_facebook },
        { label: 'Twitter', value: a.uf_twitter },
        { label: 'Skype', value: a.uf_skype },
        { label: 'Skype Link', value: a.uf_skype_link },
        { label: 'Zoom', value: a.uf_zoom },
        { label: 'Web Sites', value: a.uf_web_sites },
        { label: 'Xing', value: a.uf_xing },
      ],
    },
    {
      title: 'Certificates & Files',
      fields: [
        { label: 'Personal Photo', value: a.personal_photo?.length ? a.personal_photo : a.photo || [] },
        { label: 'Work Logo', value: a.work_logo || [] },
        { label: 'Emirates ID', value: a.emirates_id || [] },
        { label: 'Education Certificate URL', value: a.education_certificate },
        { label: 'Education Certificate Files', value: a.latest_educational_certificate || [] },
        { label: 'Abu Dhabi Broker URL', value: a.abu_dhabi_broker_cert },
        { label: 'Abu Dhabi Broker Files', value: a.abu_dhabi_real_estate_broker_certificate || [] },
        { label: 'Dubai Broker URL', value: a.dubai_broker_cert },
        { label: 'Dubai Broker Files', value: a.dubai_real_estate_broker_certificate || [] },
      ],
    },
    {
      title: 'System',
      fields: [
        { label: 'Last Login', value: a.last_login, type: 'date' },
        { label: 'Registered At', value: a.date_register, type: 'date' },
        { label: 'First Contact', value: a.first_contact_at, type: 'date' },
        { label: 'Last Activity', value: a.last_activity_at, type: 'date' },
        { label: 'Time Zone', value: a.time_zone },
        { label: 'Created At', value: a.created_at, type: 'date' },
        { label: 'Updated At', value: a.updated_at, type: 'date' },
      ],
    },
  ]
})

const agentActivities = computed(() => agent.value?.activities || [])

function isArrayValue(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

function firstArrayItem(value: unknown) {
  return Array.isArray(value) ? String(value[0] || '') : ''
}

function joinList(value: unknown) {
  return Array.isArray(value) ? value.filter(Boolean).join(', ') : value
}

function genderLabel(value: unknown) {
  if (value === 'M') return 'Male'
  if (value === 'F') return 'Female'
  if (value === 'O') return 'Other'
  return value
}

function formatValue(value: unknown, type?: string) {
  if (value === null || value === undefined || value === '') return '-'
  if (type === 'date') return formatDate(String(value))
  return String(value)
}

function formatDate(date: string) {
  if (!date) return '-'
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleString()
}

function activityLabel(type: string) {
  const labels: Record<string, string> = {
    lead_created: 'Lead Created',
    whatsapp_sent: 'WhatsApp Sent',
    call_made: 'Call Made',
    meeting_scheduled: 'Meeting Scheduled',
    note: 'Note',
    status_change: 'Status Change',
    reply_sent: 'Reply Sent',
    marked_read: 'Marked Read',
    agent_created: 'Agent Created',
    agent_updated: 'Agent Updated',
  }

  return labels[type] || type
}

function fileName(value: unknown) {
  const text = String(value)
  return text.split('/').filter(Boolean).pop() || text
}

async function confirmDelete() {
  if (confirm('Are you sure you want to delete this agent?')) {
    await store.deleteAgent(agentId)
    navigateTo(localePath('/admin/agents'))
  }
}
</script>
