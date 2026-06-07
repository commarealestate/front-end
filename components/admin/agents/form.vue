<template>
  <div class="max-w-5xl mx-auto space-y-8">
    <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
      {{ mode === 'create' ? t('admin_agents_page.add_new') : t('admin_agents_page.edit_agent') }}
    </h1>

    <UAlert
      v-if="generalErrors.length"
      color="red"
      variant="soft"
      title="Validation Error"
      icon="i-heroicons-exclamation-triangle"
    >
      <template #description>
        <ul class="list-disc ps-5 space-y-1">
          <li v-for="error in generalErrors" :key="error">{{ error }}</li>
        </ul>
      </template>
    </UAlert>

    <UForm :state="form" @submit="handleSubmit" class="space-y-8">
      <UTabs :items="tabItems" class="w-full">
        <template #item="{ item }">
          <div v-if="item.key === 'personal'" class="space-y-6 p-4">
            <!-- Personal Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup label="Name" name="name" required :error="fieldError('name')">
                <UInput v-model="form.name" />
              </UFormGroup>
              <UFormGroup label="Last Name" name="last_name" required :error="fieldError('last_name')">
                <UInput v-model="form.last_name" />
              </UFormGroup>
              <UFormGroup label="Second Name" name="second_name" :error="fieldError('second_name')">
                <UInput v-model="form.second_name" />
              </UFormGroup>
              <UFormGroup label="Title" name="title" required :error="fieldError('title')">
                <UInput v-model="form.title" />
              </UFormGroup>
              <UFormGroup label="Gender" name="personal_gender" :error="fieldError('personal_gender')">
                <USelect v-model="form.personal_gender" :options="genderOptions" />
              </UFormGroup>
              <UFormGroup label="Birthday" name="personal_birthday" :error="fieldError('personal_birthday')">
                <UInput v-model="form.personal_birthday" type="date" />
              </UFormGroup>
              <UFormGroup label="Profession" name="personal_profession" :error="fieldError('personal_profession')">
                <UInput v-model="form.personal_profession" />
              </UFormGroup>
              <UFormGroup label="Personal Website" name="personal_www" :error="fieldError('personal_www')">
                <UInput v-model="form.personal_www" />
              </UFormGroup>
              <UFormGroup label="ICQ" name="personal_icq" :error="fieldError('personal_icq')">
                <UInput v-model="form.personal_icq" />
              </UFormGroup>
              <UFormGroup label="City" name="personal_city" :error="fieldError('personal_city')">
                <UInput v-model="form.personal_city" />
              </UFormGroup>
              <UFormGroup label="State" name="personal_state" :error="fieldError('personal_state')">
                <UInput v-model="form.personal_state" />
              </UFormGroup>
              <UFormGroup label="ZIP" name="personal_zip" :error="fieldError('personal_zip')">
                <UInput v-model="form.personal_zip" />
              </UFormGroup>
              <UFormGroup label="Country" name="personal_country" :error="fieldError('personal_country')">
                <UInput v-model="form.personal_country" />
              </UFormGroup>
              <UFormGroup label="Mailbox" name="personal_mailbox" :error="fieldError('personal_mailbox')">
                <UInput v-model="form.personal_mailbox" />
              </UFormGroup>
              <UFormGroup label="CRE ID" name="cre" :error="fieldError('cre')">
                <UInput v-model="form.cre" type="number" />
              </UFormGroup>
              <UFormGroup label="Show On Website" name="show_on_website" :error="fieldError('show_on_website')">
                <UToggle v-model="form.show_on_website" />
              </UFormGroup>
              <UFormGroup label="Active" name="active" :error="fieldError('active')">
                <UToggle v-model="form.active" />
              </UFormGroup>
              <UFormGroup label="Personal Notes" name="personal_notes" :error="fieldError('personal_notes')" class="md:col-span-2">
                <UTextarea v-model="form.personal_notes" :rows="3" />
              </UFormGroup>
            </div>

            <!-- Personal Photo -->
            <UFormGroup label="Personal Photo" name="personal_photo" :error="fieldError('personal_photo')">
              <UInput
                type="file"
                accept="image/*"
                @change="handlePersonalPhotoUpload"
              />
              <div v-if="personalPhotoPreview || existingPersonalPhoto" class="mt-2 relative w-40 h-40">
                <img :src="personalPhotoSrc" class="w-full h-full object-cover rounded-lg" />
                <button
                  type="button"
                  class="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
                  @click="removePersonalPhoto"
                >
                  <UIcon name="i-heroicons-x-mark" class="w-4 h-4 text-red-600" />
                </button>
              </div>
            </UFormGroup>
          </div>

          <div v-else-if="item.key === 'work'" class="space-y-6 p-4">
            <!-- Work Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup label="Work Position" name="work_position" :error="fieldError('work_position')">
                <UInput v-model="form.work_position" />
              </UFormGroup>
              <UFormGroup label="Work Company" name="work_company" :error="fieldError('work_company')">
                <UInput v-model="form.work_company" />
              </UFormGroup>
              <UFormGroup label="Work Department" name="work_department" :error="fieldError('work_department')">
                <UInput v-model="form.work_department" />
              </UFormGroup>
              <UFormGroup label="Work Phone" name="work_phone" :error="fieldError('work_phone')">
                <UInput v-model="form.work_phone" />
              </UFormGroup>
              <UFormGroup label="Work Fax" name="work_fax" :error="fieldError('work_fax')">
                <UInput v-model="form.work_fax" />
              </UFormGroup>
              <UFormGroup label="Work Pager" name="work_pager" :error="fieldError('work_pager')">
                <UInput v-model="form.work_pager" />
              </UFormGroup>
              <UFormGroup label="Work Website" name="work_www" :error="fieldError('work_www')">
                <UInput v-model="form.work_www" />
              </UFormGroup>
              <UFormGroup label="Work Profile" name="work_profile" :error="fieldError('work_profile')">
                <UInput v-model="form.work_profile" />
              </UFormGroup>
              <UFormGroup label="Work Street" name="work_street" :error="fieldError('work_street')">
                <UInput v-model="form.work_street" />
              </UFormGroup>
              <UFormGroup label="Work Mailbox" name="work_mailbox" :error="fieldError('work_mailbox')">
                <UInput v-model="form.work_mailbox" />
              </UFormGroup>
              <UFormGroup label="Work City" name="work_city" :error="fieldError('work_city')">
                <UInput v-model="form.work_city" />
              </UFormGroup>
              <UFormGroup label="Work State" name="work_state" :error="fieldError('work_state')">
                <UInput v-model="form.work_state" />
              </UFormGroup>
              <UFormGroup label="Work ZIP" name="work_zip" :error="fieldError('work_zip')">
                <UInput v-model="form.work_zip" />
              </UFormGroup>
              <UFormGroup label="Work Country" name="work_country" :error="fieldError('work_country')">
                <UInput v-model="form.work_country" />
              </UFormGroup>
              <UFormGroup label="Position" name="position" :error="fieldError('position')">
                <UInput v-model="form.position" />
              </UFormGroup>
              <UFormGroup label="Agent Type" name="agent_type" :error="fieldError('agent_type')">
                <UInput v-model="form.agent_type" />
              </UFormGroup>
              <UFormGroup label="Specialties" name="specialties" :error="fieldError('specialties')" class="md:col-span-2">
                <UInput v-model="form.specialties" placeholder="Separate multiple values with commas" />
              </UFormGroup>
              <UFormGroup label="Agent Description" name="agent_description" :error="fieldError('agent_description')" class="md:col-span-2">
                <UTextarea v-model="form.agent_description" :rows="4" />
              </UFormGroup>
              <UFormGroup label="Work Notes" name="work_notes" :error="fieldError('work_notes')" class="md:col-span-2">
                <UTextarea v-model="form.work_notes" :rows="3" />
              </UFormGroup>
            </div>

            <!-- Work Logo -->
            <UFormGroup label="Work Logo" name="work_logo" :error="fieldError('work_logo')">
              <UInput
                type="file"
                accept="image/*"
                @change="handleWorkLogoUpload"
              />
              <div v-if="workLogoPreview || existingWorkLogo" class="mt-2 relative w-40 h-40">
                <img :src="workLogoSrc" class="w-full h-full object-cover rounded-lg" />
                <button
                  type="button"
                  class="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
                  @click="removeWorkLogo"
                >
                  <UIcon name="i-heroicons-x-mark" class="w-4 h-4 text-red-600" />
                </button>
              </div>
            </UFormGroup>
          </div>

          <div v-else-if="item.key === 'contact'" class="space-y-6 p-4">
            <!-- Contact Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup label="Email" name="email" required :error="fieldError('email')">
                <UInput v-model="form.email" type="email" />
              </UFormGroup>
              <UFormGroup label="Company Email" name="company_e_mail" :error="fieldError('company_e_mail')">
                <UInput v-model="form.company_e_mail" type="email" />
              </UFormGroup>
              <UFormGroup label="Mobile" name="personal_mobile" :error="fieldError('personal_mobile')">
                <UInput v-model="form.personal_mobile" />
              </UFormGroup>
              <UFormGroup label="Phone" name="personal_phone" :error="fieldError('personal_phone')">
                <UInput v-model="form.personal_phone" />
              </UFormGroup>
              <UFormGroup label="Fax" name="personal_fax" :error="fieldError('personal_fax')">
                <UInput v-model="form.personal_fax" />
              </UFormGroup>
              <UFormGroup label="Street" name="personal_street" :error="fieldError('personal_street')">
                <UInput v-model="form.personal_street" />
              </UFormGroup>
              <UFormGroup label="Pager" name="personal_pager" :error="fieldError('personal_pager')">
                <UInput v-model="form.personal_pager" />
              </UFormGroup>
            </div>
          </div>

          <div v-else-if="item.key === 'serviceAreas'" class="space-y-6 p-4">
            <!-- Service Areas -->
            <UFormGroup label="Service Areas" name="service_area_ids" :error="fieldError('service_area_ids')">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label
                  v-for="area in serviceAreas"
                  :key="area.service_area_id"
                  class="flex items-center gap-2 p-2 rounded-lg border border-comma-border-subtle hover:bg-comma-surface-subtle cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="area.service_area_id"
                    v-model="selectedServiceAreas"
                    class="rounded border-comma-border-subtle text-comma-primary focus:ring-comma-primary"
                  />
                  <span>{{ area.name }}</span>
                </label>
              </div>
            </UFormGroup>
          </div>

          <div v-else-if="item.key === 'certificates'" class="space-y-6 p-4">
            <!-- Certificates (URL fields) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup label="Emirates ID" name="emirates_id" :error="fieldError('emirates_id')">
                <UInput v-model="form.emirates_id" />
              </UFormGroup>
              <UFormGroup label="Education Certificate" name="education_certificate" :error="fieldError('education_certificate')">
                <UInput v-model="form.education_certificate" />
              </UFormGroup>
              <UFormGroup label="Abu Dhabi Broker Cert" name="abu_dhabi_broker_cert" :error="fieldError('abu_dhabi_broker_cert')">
                <UInput v-model="form.abu_dhabi_broker_cert" />
              </UFormGroup>
              <UFormGroup label="Dubai Broker Cert" name="dubai_broker_cert" :error="fieldError('dubai_broker_cert')">
                <UInput v-model="form.dubai_broker_cert" />
              </UFormGroup>
            </div>
          </div>

          <div v-else-if="item.key === 'social'" class="space-y-6 p-4">
            <!-- Social Links -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup label="LinkedIn" name="uf_linkedin" :error="fieldError('uf_linkedin')">
                <UInput v-model="form.uf_linkedin" />
              </UFormGroup>
              <UFormGroup label="Skype Link" name="uf_skype_link" :error="fieldError('uf_skype_link')">
                <UInput v-model="form.uf_skype_link" />
              </UFormGroup>
              <UFormGroup label="Zoom" name="uf_zoom" :error="fieldError('uf_zoom')">
                <UInput v-model="form.uf_zoom" />
              </UFormGroup>
              <UFormGroup label="Employment Date" name="uf_employment_date" :error="fieldError('uf_employment_date')">
                <UInput v-model="form.uf_employment_date" type="date" />
              </UFormGroup>
              <UFormGroup label="Timeman" name="uf_timeman" :error="fieldError('uf_timeman')">
                <UInput v-model="form.uf_timeman" />
              </UFormGroup>
              <UFormGroup label="Interests" name="uf_interests" :error="fieldError('uf_interests')">
                <UInput v-model="form.uf_interests" />
              </UFormGroup>
              <UFormGroup label="Skills" name="uf_skills" :error="fieldError('uf_skills')">
                <UInput v-model="form.uf_skills" />
              </UFormGroup>
              <UFormGroup label="Web Sites" name="uf_web_sites" :error="fieldError('uf_web_sites')">
                <UInput v-model="form.uf_web_sites" />
              </UFormGroup>
              <UFormGroup label="District" name="uf_district" :error="fieldError('uf_district')">
                <UInput v-model="form.uf_district" />
              </UFormGroup>
              <UFormGroup label="Inner Phone" name="uf_phone_inner" :error="fieldError('uf_phone_inner')">
                <UInput v-model="form.uf_phone_inner" />
              </UFormGroup>
              <UFormGroup label="Facebook" name="uf_facebook" :error="fieldError('uf_facebook')">
                <UInput v-model="form.uf_facebook" />
              </UFormGroup>
              <UFormGroup label="Twitter" name="uf_twitter" :error="fieldError('uf_twitter')">
                <UInput v-model="form.uf_twitter" />
              </UFormGroup>
              <UFormGroup label="Skype" name="uf_skype" :error="fieldError('uf_skype')">
                <UInput v-model="form.uf_skype" />
              </UFormGroup>
              <UFormGroup label="Xing" name="uf_xing" :error="fieldError('uf_xing')">
                <UInput v-model="form.uf_xing" />
              </UFormGroup>
            </div>
          </div>
        </template>
      </UTabs>

      <div class="flex justify-end gap-3">
        <UButton color="gray" variant="ghost" :to="localePath('/admin/agents')">
          {{ t('admin_agents_page.cancel') }}
        </UButton>
        <UButton type="submit" color="primary" :loading="submitting">
          {{ mode === 'create' ? t('admin_agents_page.create') : t('admin_agents_page.update') }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAgentsStore } from '~/store/agents'

const props = defineProps<{
  mode: 'create' | 'edit'
  agentId?: string
}>()

const store = useAgentsStore()
const localePath = useLocalePath()
const router = useRouter()
const { t } = useI18n()
const submitting = ref(false)
const fieldErrors = reactive<Record<string, string>>({})
const generalErrors = ref<string[]>([])

// Tabs
const tabItems = [
  { key: 'personal', label: 'Personal Info' },
  { key: 'work', label: 'Work Info' },
  { key: 'contact', label: 'Contact' },
  { key: 'serviceAreas', label: 'Service Areas' },
  { key: 'certificates', label: 'Certificates' },
  { key: 'social', label: 'Social Links' },
]

// Form state
const form = reactive({
  name: '',
  first_name: '',
  last_name: '',
  second_name: '',
  middle_name: '',
  title: '',
  email: '',
  e_mail: '',
  company_e_mail: '',
  time_zone: 'Asia/Dubai',
  show_on_website: true,
  active: true,
  cre: '',
  position: '',
  agent_type: '',
  specialties: '',
  agent_description: '',
  is_online: 'N',
  personal_gender: '',
  personal_profession: '',
  personal_www: '',
  personal_birthday: '',
  personal_icq: '',
  personal_phone: '',
  personal_fax: '',
  personal_mobile: '',
  personal_pager: '',
  personal_street: '',
  personal_city: '',
  personal_state: '',
  personal_zip: '',
  personal_country: '',
  personal_mailbox: '',
  personal_notes: '',
  work_phone: '',
  work_company: '',
  work_position: '',
  work_department: '',
  work_www: '',
  work_fax: '',
  work_pager: '',
  work_street: '',
  work_mailbox: '',
  work_city: '',
  work_state: '',
  work_zip: '',
  work_country: '',
  work_profile: '',
  work_notes: '',
  uf_skype_link: '',
  uf_zoom: '',
  uf_employment_date: '',
  uf_timeman: '',
  uf_interests: '',
  uf_skills: '',
  uf_web_sites: '',
  uf_xing: '',
  uf_linkedin: '',
  uf_facebook: '',
  uf_twitter: '',
  uf_skype: '',
  uf_district: '',
  uf_phone_inner: '',
  emirates_id: '',
  education_certificate: '',
  abu_dhabi_broker_cert: '',
  dubai_broker_cert: '',
})

const selectedServiceAreas = ref<number[]>([])
const personalPhotoFile = ref<File | null>(null)
const personalPhotoPreview = ref<string | null>(null)
const existingPersonalPhoto = ref<string | null>(null)
const workLogoFile = ref<File | null>(null)
const workLogoPreview = ref<string | null>(null)
const existingWorkLogo = ref<string | null>(null)

const genderOptions = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
  { label: 'Other', value: 'O' },
]

const fieldLabels: Record<string, string> = {
  name: 'Name',
  last_name: 'Last Name',
  second_name: 'Second Name',
  middle_name: 'Second Name',
  title: 'Title',
  first_name: 'Name',
  personal_gender: 'Gender',
  personal_birthday: 'Birthday',
  personal_profession: 'Profession',
  personal_www: 'Personal Website',
  personal_icq: 'ICQ',
  personal_city: 'City',
  personal_state: 'State',
  personal_zip: 'ZIP',
  personal_country: 'Country',
  personal_mailbox: 'Mailbox',
  personal_notes: 'Personal Notes',
  personal_photo: 'Personal Photo',
  cre: 'CRE ID',
  show_on_website: 'Show On Website',
  active: 'Active',
  work_position: 'Work Position',
  work_company: 'Work Company',
  work_department: 'Work Department',
  work_phone: 'Work Phone',
  work_fax: 'Work Fax',
  work_pager: 'Work Pager',
  work_www: 'Work Website',
  work_profile: 'Work Profile',
  work_street: 'Work Street',
  work_mailbox: 'Work Mailbox',
  work_city: 'Work City',
  work_state: 'Work State',
  work_zip: 'Work ZIP',
  work_country: 'Work Country',
  work_notes: 'Work Notes',
  work_logo: 'Work Logo',
  position: 'Position',
  agent_type: 'Agent Type',
  specialties: 'Specialties',
  agent_description: 'Agent Description',
  email: 'Email',
  e_mail: 'Email',
  company_e_mail: 'Company Email',
  personal_mobile: 'Mobile',
  personal_phone: 'Phone',
  personal_fax: 'Fax',
  personal_street: 'Street',
  personal_pager: 'Pager',
  service_area_ids: 'Service Areas',
  emirates_id: 'Emirates ID',
  education_certificate: 'Education Certificate',
  abu_dhabi_broker_cert: 'Abu Dhabi Broker Cert',
  dubai_broker_cert: 'Dubai Broker Cert',
  uf_linkedin: 'LinkedIn',
  uf_skype_link: 'Skype Link',
  uf_zoom: 'Zoom',
  uf_employment_date: 'Employment Date',
  uf_timeman: 'Timeman',
  uf_interests: 'Interests',
  uf_skills: 'Skills',
  uf_web_sites: 'Web Sites',
  uf_district: 'District',
  uf_phone_inner: 'Inner Phone',
  uf_facebook: 'Facebook',
  uf_twitter: 'Twitter',
  uf_skype: 'Skype',
  uf_xing: 'Xing',
}

function clearErrors() {
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key])
  generalErrors.value = []
}

function addFieldError(field: string, message: string) {
  fieldErrors[field] = fieldErrors[field] ? `${fieldErrors[field]}\n${message}` : message
}

function parseValidationErrorItem(item: unknown) {
  if (typeof item !== 'string') {
    generalErrors.value.push(String(item))
    return
  }

  const match = item.match(/^([^:]+):\s*(.+)$/)
  if (match) {
    const field = match[1].trim()
    const message = match[2].trim()
    addFieldError(field, message)
    generalErrors.value.push(`${fieldLabels[field] || field}: ${message}`)
  } else {
    generalErrors.value.push(item)
  }
}

function setBackendErrors(err: any) {
  clearErrors()

  const response = err?.response?._data || err?.data || err?.response
  const errors = err?.validationErrors ?? response?.errors ?? err?.errors
  const message = response?.message || err?.message

  if (Array.isArray(errors)) {
    errors.forEach(parseValidationErrorItem)
  } else if (errors && typeof errors === 'object') {
    Object.entries(errors).forEach(([field, messages]) => {
      const messageList = Array.isArray(messages) ? messages : [messages]
      const fieldMessage = messageList.map(String).join('\n')
      addFieldError(field, fieldMessage)
      generalErrors.value.push(`${fieldLabels[field] || field}: ${fieldMessage}`)
    })
  }

  if (!Object.keys(fieldErrors).length && !generalErrors.value.length) {
    generalErrors.value = [message || 'The form could not be saved. Please check the entered values.']
  } else if (message && message !== 'Validation Error' && !generalErrors.value.includes(message)) {
    generalErrors.value.unshift(message)
  }
}

function fieldError(field: string) {
  return fieldErrors[field]
}

// Load service areas on mount
onMounted(async () => {
  await store.fetchServiceAreas()
})

const serviceAreas = computed(() => store.serviceAreas)
const personalPhotoSrc = computed(() => personalPhotoPreview.value || existingPersonalPhoto.value || '')
const workLogoSrc = computed(() => workLogoPreview.value || existingWorkLogo.value || '')

function firstArrayItem(value: any) {
  return Array.isArray(value) ? value[0] || '' : value || ''
}

function fileFromInput(input: Event | FileList | File[] | File | null | undefined) {
  if (!input) return null
  if (input instanceof File) return input
  if (Array.isArray(input)) return input[0] || null
  if (input instanceof FileList) return input[0] || null

  const target = input.target as HTMLInputElement | null
  return target?.files?.[0] || null
}

// Load existing agent if editing
onMounted(async () => {
  if (props.mode === 'edit' && props.agentId) {
    await store.fetchAgent(props.agentId)
    if (store.agent) {
      const a = store.agent
      // Map all fields
      Object.assign(form, {
        name: a.first_name || a.name || '',
        first_name: a.first_name || a.name || '',
        last_name: a.last_name || '',
        second_name: a.second_name || a.middle_name || '',
        middle_name: a.middle_name || a.second_name || '',
        title: a.title || '',
        email: a.email || a.e_mail || '',
        e_mail: a.e_mail || a.email || '',
        company_e_mail: a.company_e_mail || '',
        time_zone: a.time_zone || 'Asia/Dubai',
        show_on_website: a.show_on_website === 'Yes' || a.show_on_website === '1' || a.show_on_website === true,
        active: a.active !== false,
        cre: a.cre || '',
        position: a.position || '',
        agent_type: a.agent_type || '',
        specialties: a.specialties || '',
        agent_description: a.agent_description || '',
        is_online: a.is_online || 'N',
        personal_gender: a.personal_gender || '',
        personal_profession: a.personal_profession || '',
        personal_www: a.personal_www || '',
        personal_birthday: a.personal_birthday || '',
        personal_icq: a.personal_icq || '',
        personal_phone: a.personal_phone || '',
        personal_fax: a.personal_fax || '',
        personal_mobile: a.personal_mobile || '',
        personal_pager: a.personal_pager || '',
        personal_street: a.personal_street || '',
        personal_city: a.personal_city || '',
        personal_state: a.personal_state || '',
        personal_zip: a.personal_zip || '',
        personal_country: a.personal_country || '',
        personal_mailbox: a.personal_mailbox || '',
        personal_notes: a.personal_notes || '',
        work_phone: a.work_phone || '',
        work_company: a.work_company || '',
        work_position: a.work_position || '',
        work_department: a.work_department || '',
        work_www: a.work_www || '',
        work_fax: a.work_fax || '',
        work_pager: a.work_pager || '',
        work_street: a.work_street || '',
        work_mailbox: a.work_mailbox || '',
        work_city: a.work_city || '',
        work_state: a.work_state || '',
        work_zip: a.work_zip || '',
        work_country: a.work_country || '',
        work_profile: a.work_profile || '',
        work_notes: a.work_notes || '',
        uf_skype_link: a.uf_skype_link || '',
        uf_zoom: a.uf_zoom || '',
        uf_employment_date: a.uf_employment_date || '',
        uf_timeman: a.uf_timeman || '',
        uf_interests: a.uf_interests || '',
        uf_skills: a.uf_skills || '',
        uf_web_sites: a.uf_web_sites || '',
        uf_xing: a.uf_xing || '',
        uf_linkedin: a.uf_linkedin || '',
        uf_facebook: a.uf_facebook || '',
        uf_twitter: a.uf_twitter || '',
        uf_skype: a.uf_skype || '',
        uf_district: a.uf_district || '',
        uf_phone_inner: a.uf_phone_inner || '',
        emirates_id: a.emirates_id || '',
        education_certificate: a.education_certificate || firstArrayItem(a.latest_educational_certificate),
        abu_dhabi_broker_cert: a.abu_dhabi_broker_cert || firstArrayItem(a.abu_dhabi_real_estate_broker_certificate),
        dubai_broker_cert: a.dubai_broker_cert || firstArrayItem(a.dubai_real_estate_broker_certificate),
      })
      selectedServiceAreas.value = a.service_areas?.map(sa => sa.service_area_id) || []
      existingPersonalPhoto.value = a.personal_photo?.[0] || a.photo?.[0] || null
      existingWorkLogo.value = a.work_logo?.[0] || null
    }
  }
})

// File handlers
function handlePersonalPhotoUpload(input: Event | FileList | File[] | File) {
  const file = fileFromInput(input)
  if (file) {
    personalPhotoFile.value = file
    personalPhotoPreview.value = URL.createObjectURL(file)
    existingPersonalPhoto.value = null
  }
}
function removePersonalPhoto() {
  personalPhotoFile.value = null
  personalPhotoPreview.value = null
  existingPersonalPhoto.value = null
  // For update, we need to signal removal. We'll add a flag if needed.
  // The API accepts remove_personal_photo=1. We'll handle in submit.
}

function handleWorkLogoUpload(input: Event | FileList | File[] | File) {
  const file = fileFromInput(input)
  if (file) {
    workLogoFile.value = file
    workLogoPreview.value = URL.createObjectURL(file)
    existingWorkLogo.value = null
  }
}
function removeWorkLogo() {
  workLogoFile.value = null
  workLogoPreview.value = null
  existingWorkLogo.value = null
}

async function handleSubmit() {
  submitting.value = true
  clearErrors()
  try {
    const formData = new FormData()
    const aliasFields = new Set(['first_name', 'middle_name', 'e_mail', 'email'])

    // Append direct backend fields only. Alias fields are handled below once.
    Object.entries(form).forEach(([key, value]) => {
      if (aliasFields.has(key)) return
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0')
        } else {
          formData.append(key, String(value))
        }
      }
    })
    formData.set('first_name', form.name)
    formData.set('name', form.name)
    formData.set('second_name', form.second_name)
    formData.set('middle_name', form.second_name)
    formData.set('e_mail', form.email)
    formData.set('show_on_website', form.show_on_website ? 'Yes' : 'No')
    formData.set('active', form.active ? '1' : '0')
    // Append service areas as array
    selectedServiceAreas.value.forEach((id, idx) => {
      formData.append(`service_area_ids[${idx}]`, String(id))
    })
    // Append files if present
    if (personalPhotoFile.value) {
      formData.append('personal_photo', personalPhotoFile.value)
    } else if (props.mode === 'edit' && !existingPersonalPhoto.value && !personalPhotoFile.value) {
      // User removed existing photo
      formData.append('remove_personal_photo', '1')
    }
    if (workLogoFile.value) {
      formData.append('work_logo', workLogoFile.value)
    } else if (props.mode === 'edit' && !existingWorkLogo.value && !workLogoFile.value) {
      formData.append('remove_work_logo', '1')
    }

    if (props.mode === 'create') {
      await store.createAgent(formData)
      router.push(localePath('/admin/agents'))
    } else if (props.mode === 'edit' && props.agentId) {
      await store.updateAgent(props.agentId, formData)
      router.push(localePath(`/admin/agents/${props.agentId}`))
    }
  } catch (err: any) {
    setBackendErrors(err)
  } finally {
    submitting.value = false
  }
}
</script>
