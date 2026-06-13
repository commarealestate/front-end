<template>
  <div class="space-y-4">
    <!-- CRM sync linkage -->
    <div
      v-if="isApiProperty"
      class="rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3"
    >
      <div class="mb-2 flex items-center gap-2">
        <UIcon name="i-heroicons-arrow-path" class="h-4 w-4 text-blue-600" />
        <span class="text-xs font-semibold uppercase tracking-wide text-blue-700">
          {{ $t('admin_properties_page.agent_sync.crm_sync') }}
        </span>
      </div>
      <dl class="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <div v-for="field in syncFields" :key="field.label">
          <dt class="text-xs text-blue-600/80">{{ field.label }}</dt>
          <dd class="text-sm font-medium text-blue-900">{{ field.value }}</dd>
        </div>
      </dl>
    </div>

    <!-- No agent -->
    <div v-if="!agent">
      <p v-if="listingOwner" class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <UIcon name="i-heroicons-exclamation-triangle" class="mr-1 inline h-4 w-4" />
        {{ $t('admin_properties_page.agent_sync.listing_owner_unlinked', { id: listingOwner }) }}
      </p>
      <p v-else class="italic text-comma-neutral-500">
        {{ $t('admin_properties_page.no_agent') }}
      </p>
    </div>

    <!-- Linked agent -->
    <div v-else class="space-y-4">
      <div class="flex items-start gap-4">
        <div class="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-comma-neutral-100">
          <img
            v-if="agentPhoto"
            :src="agentPhoto"
            :alt="agentFullName"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full w-full items-center justify-center">
            <AdminLocalIcon name="user" class="h-8 w-8 text-comma-neutral-400" />
          </div>
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="text-base font-semibold text-comma-neutral-900">
              {{ agentFullName }}
            </h3>
            <span
              v-if="isExternalAgent"
              class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700"
            >
              {{ $t('admin_properties_page.agent_sync.external_badge') }}
            </span>
            <span
              v-else
              class="rounded-full bg-comma-surface-subtle px-2 py-0.5 text-xs font-semibold text-comma-neutral-600"
            >
              {{ $t('admin_properties_page.agent_sync.internal_badge') }}
            </span>
          </div>
          <p v-if="agentPosition" class="mt-0.5 text-sm text-comma-neutral-600">
            {{ agentPosition }}
          </p>
          <UButton
            v-if="agentAdminLink"
            size="xs"
            color="primary"
            variant="soft"
            class="mt-2"
            :to="agentAdminLink"
          >
            {{ $t('admin_properties_page.agent_sync.view_profile') }}
          </UButton>
        </div>
      </div>

      <dl class="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
        <div v-for="field in agentFields" :key="field.label" class="min-w-0">
          <dt class="text-xs uppercase tracking-wide text-comma-neutral-500">{{ field.label }}</dt>
          <dd class="mt-0.5 break-words text-sm text-comma-neutral-900">
            <template v-if="field.type === 'link' && field.value">
              <a :href="String(field.value)" target="_blank" class="text-comma-primary hover:underline">
                {{ field.value }}
              </a>
            </template>
            <template v-else-if="field.type === 'bool'">
              {{ field.value ? $t('admin_properties_page.agent_sync.yes') : $t('admin_properties_page.agent_sync.no') }}
            </template>
            <template v-else>
              {{ displayValue(field.value) }}
            </template>
          </dd>
        </div>
      </dl>

      <p v-if="agentDescription" class="rounded-lg bg-comma-surface-subtle px-3 py-2 text-sm text-comma-neutral-700">
        {{ agentDescription }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  property: Record<string, any>
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const agent = computed(() => props.property?.agent ?? null)
const listingOwner = computed(() => {
  const value = props.property?.listing_owner
  if (value === null || value === undefined || value === '' || Number(value) === 0) return null
  return String(value)
})
const isApiProperty = computed(() => props.property?.source === 'api')
const isExternalAgent = computed(() => Boolean(agent.value?.is_external))

const crmPropertyId = computed(() =>
  props.property?.property_crm_id ?? props.property?.xml_id ?? null,
)

const syncFields = computed(() => [
  {
    label: t('admin_properties_page.agent_sync.source'),
    value: props.property?.source || '-',
  },
  {
    label: t('admin_properties_page.agent_sync.crm_property_id'),
    value: crmPropertyId.value || '-',
  },
  {
    label: t('admin_properties_page.agent_sync.listing_owner'),
    value: listingOwner.value || '-',
  },
  {
    label: t('admin_properties_page.agent_sync.inventory_status'),
    value: props.property?.inventory_status || '-',
  },
])

const agentFullName = computed(() => {
  if (!agent.value) return ''
  const parts = [
    agent.value.first_name || agent.value.name,
    agent.value.second_name || agent.value.middle_name,
    agent.value.last_name,
  ].filter(Boolean)
  return parts.join(' ').trim() || t('admin_properties_page.agent_sync.unnamed_agent')
})

const agentPosition = computed(() =>
  agent.value?.position || agent.value?.work_position || agent.value?.personal_profession || '',
)

const agentPhoto = computed(() => {
  const photos = agent.value?.personal_photo || agent.value?.photo || []
  return Array.isArray(photos) && photos.length ? String(photos[0]) : ''
})

const agentDescription = computed(() => agent.value?.agent_description || '')

const agentAdminLink = computed(() => {
  const id = agent.value?.agent_id ?? agent.value?.id
  return id ? localePath(`/admin/agents/${id}`) : null
})

const agentFields = computed(() => {
  if (!agent.value) return []
  const a = agent.value

  return [
    { label: t('admin_properties_page.agent_sync.crm_agent_id'), value: a.xml_id },
    { label: t('admin_properties_page.agent_sync.local_agent_id'), value: a.agent_id ?? a.id },
    { label: t('admin_properties_page.agent_sync.agent_type'), value: a.agent_type },
    { label: t('admin_properties_page.agent_sync.departments'), value: joinList(a.departments) },
    { label: t('admin_properties_page.agent_sync.email'), value: a.e_mail || a.email },
    { label: t('admin_properties_page.agent_sync.company_email'), value: a.company_e_mail },
    { label: t('admin_properties_page.agent_sync.mobile'), value: a.personal_mobile },
    { label: t('admin_properties_page.agent_sync.phone'), value: a.personal_phone || a.work_phone },
    { label: t('admin_properties_page.agent_sync.specialties'), value: a.specialties },
    { label: t('admin_properties_page.agent_sync.service_area'), value: a.service_area },
    { label: t('admin_properties_page.agent_sync.cre'), value: a.cre },
    { label: t('admin_properties_page.agent_sync.show_on_website'), value: a.show_on_website },
    { label: t('admin_properties_page.agent_sync.active'), value: a.active, type: 'bool' },
  ].filter((field) => displayValue(field.value) !== '-')
})

function joinList(value: unknown) {
  return Array.isArray(value) ? value.filter(Boolean).join(', ') : value
}

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '-'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}
</script>
