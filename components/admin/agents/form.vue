<template>
  <div class="max-w-5xl mx-auto space-y-8">
    <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
      {{ mode === 'create' ? $t('admin_agents_page.add_new') : $t('admin_agents_page.edit_agent') }}
    </h1>

    <UForm :state="form" @submit="handleSubmit" class="space-y-8">
      <UTabs :items="tabItems" class="w-full">
        <template #item="{ item }">
          <div v-if="item.key === 'personal'" class="space-y-6 p-4">
            <!-- Personal Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup label="Name" name="name" required>
                <UInput v-model="form.name" />
              </UFormGroup>
              <UFormGroup label="Last Name" name="last_name" required>
                <UInput v-model="form.last_name" />
              </UFormGroup>
              <UFormGroup label="Second Name" name="second_name">
                <UInput v-model="form.second_name" />
              </UFormGroup>
              <UFormGroup label="Gender" name="personal_gender">
                <USelect v-model="form.personal_gender" :options="genderOptions" />
              </UFormGroup>
              <UFormGroup label="Birthday" name="personal_birthday">
                <UInput v-model="form.personal_birthday" type="date" />
              </UFormGroup>
              <UFormGroup label="Profession" name="personal_profession">
                <UInput v-model="form.personal_profession" />
              </UFormGroup>
              <UFormGroup label="City" name="personal_city">
                <UInput v-model="form.personal_city" />
              </UFormGroup>
              <UFormGroup label="Country" name="personal_country">
                <UInput v-model="form.personal_country" />
              </UFormGroup>
            </div>

            <!-- Personal Photo -->
            <UFormGroup label="Personal Photo" name="personal_photo">
              <UInput
                type="file"
                accept="image/*"
                @change="handlePersonalPhotoUpload"
              />
              <div v-if="personalPhotoPreview || existingPersonalPhoto" class="mt-2 relative w-40 h-40">
                <img :src="personalPhotoPreview || existingPersonalPhoto" class="w-full h-full object-cover rounded-lg" />
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
              <UFormGroup label="Work Position" name="work_position">
                <UInput v-model="form.work_position" />
              </UFormGroup>
              <UFormGroup label="Work Company" name="work_company">
                <UInput v-model="form.work_company" />
              </UFormGroup>
              <UFormGroup label="Work Department" name="work_department">
                <UInput v-model="form.work_department" />
              </UFormGroup>
              <UFormGroup label="Work Phone" name="work_phone">
                <UInput v-model="form.work_phone" />
              </UFormGroup>
              <UFormGroup label="Work Website" name="work_www">
                <UInput v-model="form.work_www" />
              </UFormGroup>
              <UFormGroup label="Work Profile" name="work_profile">
                <UInput v-model="form.work_profile" />
              </UFormGroup>
            </div>

            <!-- Work Logo -->
            <UFormGroup label="Work Logo" name="work_logo">
              <UInput
                type="file"
                accept="image/*"
                @change="handleWorkLogoUpload"
              />
              <div v-if="workLogoPreview || existingWorkLogo" class="mt-2 relative w-40 h-40">
                <img :src="workLogoPreview || existingWorkLogo" class="w-full h-full object-cover rounded-lg" />
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
              <UFormGroup label="Email" name="email" required>
                <UInput v-model="form.email" type="email" />
              </UFormGroup>
              <UFormGroup label="Mobile" name="personal_mobile">
                <UInput v-model="form.personal_mobile" />
              </UFormGroup>
              <UFormGroup label="Phone" name="personal_phone">
                <UInput v-model="form.personal_phone" />
              </UFormGroup>
              <UFormGroup label="Fax" name="personal_fax">
                <UInput v-model="form.personal_fax" />
              </UFormGroup>
              <UFormGroup label="Street" name="personal_street">
                <UInput v-model="form.personal_street" />
              </UFormGroup>
            </div>
          </div>

          <div v-else-if="item.key === 'serviceAreas'" class="space-y-6 p-4">
            <!-- Service Areas -->
            <UFormGroup label="Service Areas" name="service_area_ids">
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
              <UFormGroup label="Emirates ID" name="emirates_id">
                <UInput v-model="form.emirates_id" />
              </UFormGroup>
              <UFormGroup label="Education Certificate" name="education_certificate">
                <UInput v-model="form.education_certificate" />
              </UFormGroup>
              <UFormGroup label="Abu Dhabi Broker Cert" name="abu_dhabi_broker_cert">
                <UInput v-model="form.abu_dhabi_broker_cert" />
              </UFormGroup>
              <UFormGroup label="Dubai Broker Cert" name="dubai_broker_cert">
                <UInput v-model="form.dubai_broker_cert" />
              </UFormGroup>
            </div>
          </div>

          <div v-else-if="item.key === 'social'" class="space-y-6 p-4">
            <!-- Social Links -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup label="LinkedIn" name="uf_linkedin">
                <UInput v-model="form.uf_linkedin" />
              </UFormGroup>
              <UFormGroup label="Facebook" name="uf_facebook">
                <UInput v-model="form.uf_facebook" />
              </UFormGroup>
              <UFormGroup label="Twitter" name="uf_twitter">
                <UInput v-model="form.uf_twitter" />
              </UFormGroup>
              <UFormGroup label="Skype" name="uf_skype">
                <UInput v-model="form.uf_skype" />
              </UFormGroup>
              <UFormGroup label="Xing" name="uf_xing">
                <UInput v-model="form.uf_xing" />
              </UFormGroup>
            </div>
          </div>
        </template>
      </UTabs>

      <div class="flex justify-end gap-3">
        <UButton color="gray" variant="ghost" :to="localePath('/admin/agents')">
          {{ $t('admin_agents_page.cancel') }}
        </UButton>
        <UButton type="submit" color="primary" :loading="submitting">
          {{ mode === 'create' ? $t('admin_agents_page.create') : $t('admin_agents_page.update') }}
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
const submitting = ref(false)

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
  last_name: '',
  second_name: '',
  title: '',
  email: '',
  time_zone: 'Asia/Dubai',
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

// Load service areas on mount
onMounted(async () => {
  await store.fetchServiceAreas()
})

const serviceAreas = computed(() => store.serviceAreas)

// Load existing agent if editing
onMounted(async () => {
  if (props.mode === 'edit' && props.agentId) {
    await store.fetchAgent(props.agentId)
    if (store.agent) {
      const a = store.agent
      // Map all fields
      Object.assign(form, {
        name: a.name || '',
        last_name: a.last_name || '',
        second_name: a.second_name || '',
        title: a.title || '',
        email: a.email || '',
        time_zone: a.time_zone || 'Asia/Dubai',
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
        education_certificate: a.education_certificate || '',
        abu_dhabi_broker_cert: a.abu_dhabi_broker_cert || '',
        dubai_broker_cert: a.dubai_broker_cert || '',
      })
      selectedServiceAreas.value = a.service_areas?.map(sa => sa.service_area_id) || []
      existingPersonalPhoto.value = a.personal_photo?.[0] || null
      existingWorkLogo.value = a.work_logo?.[0] || null
    }
  }
})

// File handlers
function handlePersonalPhotoUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    personalPhotoFile.value = target.files[0]
    personalPhotoPreview.value = URL.createObjectURL(target.files[0])
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

function handleWorkLogoUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    workLogoFile.value = target.files[0]
    workLogoPreview.value = URL.createObjectURL(target.files[0])
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
  try {
    const formData = new FormData()
    // Append all fields from 'form' (except empty ones)
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, String(value))
      }
    })
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
  } catch (err) {
    // error handled in store
  } finally {
    submitting.value = false
  }
}
</script>