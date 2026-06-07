<template>
  <form class="space-y-4" @submit.prevent="submitLead">
    <div>
      <label class="mb-1.5 block text-sm font-medium text-comma-neutral-800">
        {{ $t('contact_page.form_name') || 'Name' }} *
      </label>
      <input
        v-model="form.name"
        type="text"
        required
        class="w-full rounded-lg border border-comma-border-subtle px-4 py-3 outline-none transition focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20"
      />
    </div>

    <div>
      <label class="mb-1.5 block text-sm font-medium text-comma-neutral-800">
        {{ $t('contact_page.form_phone') || 'Phone' }} *
      </label>
      <input
        v-model="form.phone"
        type="tel"
        required
        class="w-full rounded-lg border border-comma-border-subtle px-4 py-3 outline-none transition focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20"
      />
    </div>

    <div>
      <label class="mb-1.5 block text-sm font-medium text-comma-neutral-800">
        {{ $t('contact_page.form_email') || 'Email' }} *
      </label>
      <input
        v-model="form.email"
        type="email"
        required
        class="w-full rounded-lg border border-comma-border-subtle px-4 py-3 outline-none transition focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20"
      />
    </div>

    <div>
      <label class="mb-1.5 block text-sm font-medium text-comma-neutral-800">
        {{ $t('contact_page.form_message') || 'Message' }}
      </label>
      <textarea
        v-model="form.message"
        rows="3"
        class="w-full resize-none rounded-lg border border-comma-border-subtle px-4 py-3 outline-none transition focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20"
      ></textarea>
    </div>

    <button
      type="submit"
      :disabled="submitting"
      class="flex w-full items-center justify-center gap-2 rounded-lg bg-comma-primary px-5 py-3 font-semibold text-white transition hover:bg-comma-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
    >
      <Icon v-if="submitting" name="mdi:loading" class="h-5 w-5 animate-spin" />
      {{ submitting ? ($t('contact_page.form_submitting') || 'Submitting...') : ($t('contact_page.form_submit') || 'Submit') }}
    </button>

    <p v-if="successMessage" class="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {{ errorMessage }}
    </p>
  </form>
</template>

<script setup lang="ts">
import type { Project } from '~/types/project'
import { useNotificationStore } from '~/store/notification'

const props = defineProps<{
  project: Project
}>()

const route = useRoute()
const notification = useNotificationStore()
const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = reactive({
  name: '',
  phone: '',
  email: '',
  message: '',
})

const projectTitle = computed(() => props.project.title_en || props.project.title || String(props.project.project_id))
const pageUrl = computed(() => (process.client ? window.location.href : ''))

const trackingValues = computed(() => {
  const values: Record<string, string> = {}
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

  utmKeys.forEach((key) => {
    const value = route.query[key]
    if (typeof value === 'string' && value) {
      values[key] = value
    }
  })

  return values
})

const leadMessage = computed(() => {
  const lines = [
    form.message.trim(),
    '',
    '--- Project Inquiry ---',
    `Project ID: ${props.project.project_id}`,
    `Project Title: ${projectTitle.value}`,
    'Source: Project Page',
  ]

  if (pageUrl.value) {
    lines.push(`Page URL: ${pageUrl.value}`)
  }

  Object.entries(trackingValues.value).forEach(([key, value]) => {
    lines.push(`${key}: ${value}`)
  })

  return lines.filter((line, index) => line !== '' || index === 1).join('\n')
})

function appendTrackingFields(formData: FormData) {
  formData.append('project_id', String(props.project.project_id))
  formData.append('project_title', projectTitle.value)
  formData.append('source', 'Project Page')

  if (pageUrl.value) {
    formData.append('page_url', pageUrl.value)
  }

  Object.entries(trackingValues.value).forEach(([key, value]) => {
    formData.append(key, value)
  })
}

async function submitLead() {
  submitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('phone', form.phone)
    formData.append('email', form.email)
    formData.append('message', leadMessage.value)
    appendTrackingFields(formData)

    const { data, error } = await useApiFetch(
      {
        apiType: 'common',
        url: 'contact-us',
        method: 'POST',
      },
      {
        body: formData,
      },
    )

    if (error.value) {
      throw new Error(error.value?.data?.message || error.value?.message || 'Request failed')
    }

    if (data.value?.status !== 1) {
      throw new Error(data.value?.message || 'Request failed')
    }

    form.name = ''
    form.phone = ''
    form.email = ''
    form.message = ''
    successMessage.value = 'Your request has been sent successfully.'
  } catch (err: any) {
    errorMessage.value = err.message || 'Failed to send request.'
    notification.error('Error', errorMessage.value)
  } finally {
    submitting.value = false
  }
}
</script>
