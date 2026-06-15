<template>
  <div class="min-h-screen bg-comma-neutral-50" :dir="direction">
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-comma-primary to-comma-primary-dark">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern"></div>
      </div>
      <div class="container relative z-10 px-4 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight font-display">
            {{ $t('contact_page.title') }}
          </h1>
          <p class="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
            {{ $t('contact_page.subtitle') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Info + Form -->
    <section class="py-12 lg:py-20">
      <div class="container px-4 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-8">
            <!-- Contact Details -->
            <div class="bg-white rounded-2xl shadow-card p-6 lg:p-8 border border-comma-border-subtle">
              <h2 class="text-2xl font-bold text-comma-neutral-900 mb-6 font-display">{{ $t('contact_page.get_in_touch') }}</h2>

              <!-- Address -->
              <div class="flex items-start gap-4 mb-6">
                <div class="w-10 h-10 rounded-full bg-comma-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="mdi:map-marker" class="w-5 h-5 text-comma-primary" />
                </div>
                <div>
                  <h3 class="font-semibold text-comma-neutral-900 mb-1">{{ $t('contact_page.address') }}</h3>
                  <p class="text-comma-neutral-600">{{ $t('contact_page.address_value') }}</p>
                </div>
              </div>

              <!-- Phone -->
              <div class="flex items-start gap-4 mb-6">
                <div class="w-10 h-10 rounded-full bg-comma-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="mdi:phone" class="w-5 h-5 text-comma-primary" />
                </div>
                <div>
                  <h3 class="font-semibold text-comma-neutral-900 mb-1">{{ $t('contact_page.phone') }}</h3>
                  <a :href="telLink" class="text-comma-primary hover:underline" dir="ltr">{{ phoneDisplay }}</a>
                </div>
              </div>

              <!-- Email -->
              <div class="flex items-start gap-4 mb-6">
                <div class="w-10 h-10 rounded-full bg-comma-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="mdi:email" class="w-5 h-5 text-comma-primary" />
                </div>
                <div>
                  <h3 class="font-semibold text-comma-neutral-900 mb-1">{{ $t('contact_page.email') }}</h3>
                  <a :href="mailtoLink" class="text-comma-primary hover:underline">{{ email }}</a>
                </div>
              </div>

              <!-- Website -->
              <div class="flex items-start gap-4 mb-6">
                <div class="w-10 h-10 rounded-full bg-comma-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="mdi:web" class="w-5 h-5 text-comma-primary" />
                </div>
                <div>
                  <h3 class="font-semibold text-comma-neutral-900 mb-1">{{ $t('contact_page.website') }}</h3>
                  <a :href="`https://${website}`" target="_blank" rel="noopener" class="text-comma-primary hover:underline">{{ website }}</a>
                </div>
              </div>

              <!-- Social -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-comma-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="mdi:linkedin" class="w-5 h-5 text-comma-primary" />
                </div>
                <div>
                  <h3 class="font-semibold text-comma-neutral-900 mb-1">LinkedIn</h3>
                  <a :href="`https://${linkedin}`" target="_blank" rel="noopener" class="text-comma-primary hover:underline">{{ linkedin }}</a>
                </div>
              </div>
            </div>

            <!-- Contact Form -->
            <div class="bg-white rounded-2xl shadow-card p-6 lg:p-8 border border-comma-border-subtle">
              <h2 class="text-2xl font-bold text-comma-neutral-900 mb-6 font-display">{{ $t('contact_page.form_title') }}</h2>
              <form @submit.prevent="submitForm" class="space-y-6">
                <!-- Name -->
                <div>
                  <label class="block text-sm font-medium text-comma-neutral-800 mb-2">{{ $t('contact_page.form_name') }} *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 rounded-lg border border-comma-border-subtle focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 outline-none transition-all duration-300"
                  />
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-medium text-comma-neutral-800 mb-2">{{ $t('contact_page.form_email') }} *</label>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full px-4 py-3 rounded-lg border border-comma-border-subtle focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 outline-none transition-all duration-300"
                  />
                </div>

                <!-- Phone -->
                <div>
                  <label class="block text-sm font-medium text-comma-neutral-800 mb-2">{{ $t('contact_page.form_phone') }} *</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    required
                    class="w-full px-4 py-3 rounded-lg border border-comma-border-subtle focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 outline-none transition-all duration-300"
                  />
                </div>

                <!-- Message -->
                <div>
                  <label class="block text-sm font-medium text-comma-neutral-800 mb-2">{{ $t('contact_page.form_message') }} *</label>
                  <textarea
                    v-model="form.message"
                    rows="4"
                    required
                    class="w-full px-4 py-3 rounded-lg border border-comma-border-subtle focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 outline-none transition-all duration-300 resize-none"
                  ></textarea>
                </div>

                <!-- Submit -->
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full py-3 bg-comma-primary text-white font-semibold rounded-lg hover:bg-comma-primary-dark transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Icon v-if="isSubmitting" name="mdi:loading" class="w-5 h-5 animate-spin" />
                  {{ isSubmitting ? $t('contact_page.form_submitting') : $t('contact_page.form_submit') }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Modal -->
    <UModal v-model="showSuccessModal" :prevent-close="false" :ui="{ width: 'max-w-md' }">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-display font-semibold text-comma-neutral-900">{{ $t('contact_page.success_title') }}</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="showSuccessModal = false" />
          </div>
        </template>

        <div class="text-center py-4">
          <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <Icon name="mdi:check-circle" class="w-10 h-10 text-green-600" />
          </div>
          <p class="text-comma-neutral-700">{{ $t('contact_page.success_message') }}</p>
        </div>

        <template #footer>
          <div class="flex justify-center">
            <UButton color="primary" @click="showSuccessModal = false">
              {{ $t('contact_page.close') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '~/store/notification'

const { locale, t } = useI18n()
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const notification = useNotificationStore()
const { email, phoneDisplay, telLink, mailtoLink } = useSiteContact('info')
const website = 'www.commarealestate.ae'
const linkedin = 'linkedin.com/company/comma-real-estate'

// Form state
const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: ''
})
const isSubmitting = ref(false)
const fieldErrors = ref<Record<string, string>>({})
const showSuccessModal = ref(false)

useHead({
  title: 'Contact Comma Real Estate | Abu Dhabi Real Estate',
  meta: [
    { name: 'description', content: 'Get in touch with Comma Real Estate for expert real estate advice in Abu Dhabi and the UAE.' }
  ]
})

const submitForm = async () => {
  isSubmitting.value = true
  fieldErrors.value = {}

  try {
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('email', form.email)
    formData.append('phone', form.phone)
    formData.append('message', form.message)

    const { data, error } = await useApiFetch({
      apiType: 'common',
      url: 'contact-us',
      method: 'POST',
    }, {
      body: formData,
    })

    if (error.value) {
      const errData = error.value.data
      if (errData?.errors) {
        fieldErrors.value = errData.errors
        notification.error('Validation Error', 'Please check the form fields')
      } else {
        throw new Error(error.value.message || 'Request failed')
      }
      return
    }

    if (data.value?.status === 1) {
      // Success – show modal instead of notification
      showSuccessModal.value = true
      // Reset form
      form.name = ''
      form.email = ''
      form.phone = ''
      form.message = ''
    } else {
      notification.error('Error', data.value?.message || 'Something went wrong')
    }
  } catch (err: any) {
    notification.error('Error', err.message || 'Failed to send message')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.bg-grid-pattern {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white' stroke-opacity='0.1'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}
</style>