<template>
  <div class="min-h-screen bg-comma-neutral-50" :dir="direction">
    <!-- Hero Section -->
    <section
      class="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[url('/images/careers-hero.jpeg')] bg-cover bg-center lg:bg-fixed">

      <div class="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/50"></div>
      <div class="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern"></div>

      <div class="container relative z-10 px-4 lg:px-8 mx-auto text-center">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight font-display">
            {{ $t('career_page.title') }}
          </h1>
          <p class="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
            {{ $t('career_page.subtitle') }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            ...
          </div>
        </div>
      </div>

    </section>

    <!-- Main Content -->
    <section class="py-12 lg:py-20">
      <div class="container px-4 lg:px-8">
        <!-- Who Should Join -->
        <div class="max-w-4xl mx-auto mb-16">
          <div class="bg-gradient-to-br from-white to-comma-surface-elevated rounded-3xl shadow-card p-8 lg:p-12">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-full bg-comma-primary/10 flex items-center justify-center">
                <Icon name="mdi:account-group" class="w-6 h-6 text-comma-primary" />
              </div>
              <h2 class="text-2xl lg:text-3xl font-bold text-comma-neutral-900 font-display">
                {{ $t('career_page.who_should_join.title') }}
              </h2>
            </div>

            <div class="prose prose-lg max-w-none" :class="{ 'prose-rtl': direction === 'rtl' }">
              <p class="text-comma-neutral-700">
                {{ $t('career_page.who_should_join.description') }}
              </p>

              <!-- Professional Fields -->
              <div class="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
                <div v-for="field in professionalFields" :key="field.id"
                  class="bg-comma-neutral-50 rounded-xl p-4 flex items-center gap-3 hover:bg-comma-primary/5 transition-colors duration-300 border border-comma-border-subtle">
                  <Icon :name="field.icon" class="w-5 h-5 text-comma-primary flex-shrink-0" />
                  <span class="text-comma-neutral-800 font-medium text-sm">
                    {{ $t(`career_page.fields.${field.id}`) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Why Join Comma -->
        <div class="max-w-4xl mx-auto mb-20">
          <h2 class="text-2xl lg:text-3xl font-bold text-comma-neutral-900 mb-8 text-center font-display">
            {{ $t('career_page.why_join.title') }}
          </h2>

          <div class="grid md:grid-cols-3 gap-6">
            <div v-for="reason in reasonsToJoin" :key="reason.id"
              class="bg-white rounded-2xl shadow-card p-6 text-center hover:shadow-hover transition-all duration-500 hover:-translate-y-1">
              <div class="w-16 h-16 rounded-full bg-comma-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon :name="reason.icon" class="w-8 h-8 text-comma-primary" />
              </div>
              <h3 class="text-xl font-bold text-comma-neutral-900 mb-3 font-display">
                {{ $t(`career_page.reasons.${reason.id}.title`) }}
              </h3>
              <p class="text-comma-neutral-600">
                {{ $t(`career_page.reasons.${reason.id}.description`) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Call to Action & Form -->
        <div id="join-form" class="max-w-4xl mx-auto">
          <div
            class="bg-gradient-to-br from-comma-primary to-comma-primary-dark rounded-3xl shadow-luxury overflow-hidden">
            <!-- Header -->
            <div class="p-8 lg:p-12 text-center">
              <h2 class="text-2xl lg:text-3xl font-bold text-white mb-4 font-display">
                {{ $t('career_page.cta_title') }}
              </h2>
              <p class="text-white/90 mb-4 max-w-2xl mx-auto">
                {{ $t('career_page.cta_subtitle') }}
              </p>
              <p class="text-white/80 text-sm">
                {{ locale === 'ar' ? 'أو راسلنا على' : 'Or email us at' }}
                <a :href="careersMailto" class="font-semibold text-white underline hover:text-comma-secondary">{{ careersEmail }}</a>
              </p>
            </div>

            <!-- Form -->
            <div class="bg-white p-6 lg:p-10">
              <form @submit.prevent="submitForm" class="space-y-6">
                <!-- Personal Information -->
                <div class="grid md:grid-cols-2 gap-6">
                  <!-- Full Name -->
                  <div>
                    <label for="fullName" class="block text-sm font-medium text-comma-neutral-800 mb-2">
                      {{ $t('career_page.form.full_name') }} *
                    </label>
                    <input id="fullName" v-model="form.fullName" type="text" required
                      :placeholder="$t('career_page.form.full_name_placeholder')"
                      class="w-full px-4 py-3 rounded-lg border border-comma-border-subtle focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 outline-none transition-all duration-300"
                      :class="{ 'border-red-500': errors.fullName }" />
                    <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">
                      {{ errors.fullName }}
                    </p>
                  </div>

                  <!-- Email -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-comma-neutral-800 mb-2">
                      {{ $t('career_page.form.email') }} *
                    </label>
                    <input id="email" v-model="form.email" type="email" required placeholder="your.email@example.com"
                      class="w-full px-4 py-3 rounded-lg border border-comma-border-subtle focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 outline-none transition-all duration-300"
                      :class="{ 'border-red-500': errors.email }" />
                    <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                      {{ errors.email }}
                    </p>
                  </div>

                  <!-- Phone -->
                  <div>
                    <label for="phone" class="block text-sm font-medium text-comma-neutral-800 mb-2">
                      {{ $t('career_page.form.phone') }} *
                    </label>
                    <input id="phone" v-model="form.phone" type="tel" required placeholder="+971 50 123 4567"
                      class="w-full px-4 py-3 rounded-lg border border-comma-border-subtle focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 outline-none transition-all duration-300"
                      :class="{ 'border-red-500': errors.phone }" />
                    <p v-if="errors.phone" class="mt-1 text-sm text-red-600">
                      {{ errors.phone }}
                    </p>
                  </div>

                  <!-- Professional Field -->
                  <div>
                    <label for="field" class="block text-sm font-medium text-comma-neutral-800 mb-2">
                      {{ $t('career_page.form.professional_field') }} *
                    </label>
                    <select id="field" v-model="form.field" required
                      class="w-full px-4 py-3 rounded-lg border border-comma-border-subtle focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 outline-none transition-all duration-300 bg-white"
                      :class="{ 'border-red-500': errors.field }">
                      <option value="" disabled>{{ $t('career_page.form.select_field') }}</option>
                      <option v-for="field in professionalFields" :key="field.id" :value="field.id">
                        {{ $t(`career_page.fields.${field.id}`) }}
                      </option>
                      <option value="other">{{ $t('career_page.form.other') }}</option>
                    </select>
                    <p v-if="errors.field" class="mt-1 text-sm text-red-600">
                      {{ errors.field }}
                    </p>
                  </div>
                </div>

                <!-- Years of Experience -->
                <div>
                  <label class="block text-sm font-medium text-comma-neutral-800 mb-2">
                    {{ $t('career_page.form.experience') }} *
                  </label>
                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    <button v-for="exp in experienceOptions" :key="exp.value" type="button"
                      @click="form.experience = exp.value"
                      class="py-3 rounded-lg border transition-all duration-300 text-sm font-medium"
                      :class="form.experience === exp.value
                        ? 'bg-comma-primary text-white border-comma-primary shadow-md'
                        : 'border-comma-border-subtle text-comma-neutral-700 hover:border-comma-primary hover:bg-comma-primary/5'">
                      {{ $t(`career_page.experience.${exp.value}`) }}
                    </button>
                  </div>
                  <p v-if="errors.experience" class="mt-1 text-sm text-red-600">
                    {{ errors.experience }}
                  </p>
                </div>

                <!-- Message (About You) -->
                <div>
                  <label for="about" class="block text-sm font-medium text-comma-neutral-800 mb-2">
                    {{ $t('career_page.form.message') }} *
                  </label>
                  <textarea id="about" v-model="form.about" required rows="4"
                    :placeholder="$t('career_page.form.message_placeholder')"
                    class="w-full px-4 py-3 rounded-lg border border-comma-border-subtle focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 outline-none transition-all duration-300 resize-none"
                    :class="{ 'border-red-500': errors.about }"></textarea>
                  <p v-if="errors.about" class="mt-1 text-sm text-red-600">
                    {{ errors.about }}
                  </p>
                </div>

                <!-- LinkedIn Profile (Required) -->
                <div>
                  <label for="linkedin" class="block text-sm font-medium text-comma-neutral-800 mb-2">
                    {{ $t('career_page.form.linkedin') }} *
                  </label>
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Icon name="mdi:linkedin" class="w-4 h-4 text-white" />
                    </div>
                    <input id="linkedin" v-model="form.linkedin" type="url" required
                      placeholder="https://linkedin.com/in/yourprofile"
                      class="flex-1 px-4 py-3 rounded-lg border border-comma-border-subtle focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 outline-none transition-all duration-300"
                      :class="{ 'border-red-500': errors.linkedin }" />
                  </div>
                  <p v-if="errors.linkedin" class="mt-1 text-sm text-red-600">
                    {{ errors.linkedin }}
                  </p>
                </div>

                <!-- Privacy Notice -->
                <div class="bg-comma-neutral-50 rounded-lg p-4">
                  <p class="text-sm text-comma-neutral-600">
                    {{ $t('career_page.privacy_notice') }}
                  </p>
                </div>

                <!-- Submit Button -->
                <div class="pt-4">
                  <button type="submit" :disabled="isSubmitting"
                    class="w-full py-4 bg-comma-primary text-white font-semibold rounded-xl hover:bg-comma-primary-dark transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg">
                    <Icon v-if="isSubmitting" name="mdi:loading" class="w-5 h-5 animate-spin" />
                    {{ isSubmitting ? $t('career_page.form.submitting') : $t('career_page.form.submit') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Success Modal -->
        <Transition name="modal">
          <div v-if="showSuccessModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            @click.self="closeSuccessModal">
            <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
              <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Icon name="mdi:check-circle" class="w-10 h-10 text-green-600" />
              </div>
              <h3 class="text-2xl font-bold text-comma-neutral-900 mb-2">
                {{ $t('career_page.success.title') }}
              </h3>
              <p class="text-comma-neutral-600 mb-6">
                {{ $t('career_page.success.message') }}
              </p>
              <button @click="closeSuccessModal"
                class="px-6 py-3 bg-comma-primary text-white font-semibold rounded-lg hover:bg-comma-primary-dark transition-colors duration-300">
                {{ $t('career_page.success.close') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const { locale, t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const { email: careersEmail, mailtoLink: careersMailto } = useSiteContact('careers')

// SEO Head (unchanged)
useHead({
  title: t('career_page.meta.title'),
  meta: [
    {
      name: 'description',
      content: t('career_page.meta.description')
    },
    { name: 'keywords', content: t('career_page.meta.keywords') }
  ]
})

// Form State (unchanged)
const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  field: '',
  experience: '',
  about: '',
  linkedin: ''
})

const errors = reactive({})
const isSubmitting = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

// Professional Fields (unchanged)
const professionalFields = [
  { id: 'real-estate', icon: 'mdi:home-city', labelEn: 'Real Estate' },
  { id: 'sales', icon: 'mdi:account-cash', labelEn: 'Sales' },
  { id: 'marketing', icon: 'mdi:bullhorn', labelEn: 'Marketing' },
  { id: 'admin', icon: 'mdi:briefcase', labelEn: 'Administration' },
  { id: 'media', icon: 'mdi:video', labelEn: 'Media & Content' },
  { id: 'technical', icon: 'mdi:cog', labelEn: 'Technical' },
  { id: 'finance', icon: 'mdi:finance', labelEn: 'Finance' },
  { id: 'customer-service', icon: 'mdi:headset', labelEn: 'Customer Service' },
  { id: 'analytics', icon: 'mdi:chart-bar', labelEn: 'Data & Analytics' }
]

// Experience Options (unchanged)
const experienceOptions = [
  { value: '0-2', labelEn: '0-2 years' },
  { value: '2-5', labelEn: '2-5 years' },
  { value: '5-8', labelEn: '5-8 years' },
  { value: '8-12', labelEn: '8-12 years' },
  { value: '12+', labelEn: '12+ years' }
]

// Reasons to Join (unchanged)
const reasonsToJoin = [
  { id: 'quality', icon: 'mdi:medal' },
  { id: 'structure', icon: 'mdi:chart-tree' },
  { id: 'growth', icon: 'mdi:trending-up' }
]

// Validation (unchanged)
const validateForm = () => {
  let isValid = true
  Object.keys(errors).forEach(key => delete errors[key])

  if (!form.fullName.trim()) {
    errors.fullName = t('career_page.validation.required', { field: t('career_page.form.full_name') })
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = t('career_page.validation.required', { field: t('career_page.form.email') })
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('career_page.validation.email')
    isValid = false
  }

  if (!form.phone.trim()) {
    errors.phone = t('career_page.validation.required', { field: t('career_page.form.phone') })
    isValid = false
  }

  if (!form.field) {
    errors.field = t('career_page.validation.required', { field: t('career_page.form.professional_field') })
    isValid = false
  }

  if (!form.experience) {
    errors.experience = t('career_page.validation.required', { field: t('career_page.form.experience') })
    isValid = false
  }

  if (!form.about.trim()) {
    errors.about = t('career_page.validation.required', { field: t('career_page.form.message') })
    isValid = false
  }

  if (!form.linkedin.trim()) {
    errors.linkedin = t('career_page.validation.required', { field: t('career_page.form.linkedin') })
    isValid = false
  } else if (!form.linkedin.includes('linkedin.com/in/')) {
    errors.linkedin = t('career_page.validation.linkedin')
    isValid = false
  }

  return isValid
}

// Submit Form
const submitForm = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const selectedField = professionalFields.find(f => f.id === form.field)
    const professionalFieldValue = selectedField ? selectedField.labelEn : form.field

    const selectedExp = experienceOptions.find(e => e.value === form.experience)
    const experienceValue = selectedExp ? selectedExp.labelEn : form.experience

    const payload = {
      name: form.fullName,
      professional_field: professionalFieldValue,
      email: form.email,
      phone_number: form.phone,
      years_of_experience: experienceValue,
      message: form.about,
      link: form.linkedin
    }

    const response = await useApiFetch(
      { url: "careers", method: "post", apiType: "common" },
      { body: payload }
    )

    const resData = response?.data?.value

    console.log('API Response:', resData)

    // Check if response is successful (status 1, code 201)
    if (response && resData.status === 1 && resData.code === 201) {
      // Reset form
      Object.assign(form, {
        fullName: '',
        email: '',
        phone: '',
        field: '',
        experience: '',
        about: '',
        linkedin: ''
      })
      // Show success modal
      showSuccessModal.value = true
    } else {
      // Handle API error response
      const errorMsg = resData?.message || t('career_page.error.message')
      throw new Error(errorMsg)
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    errorMessage.value = error.message || t('career_page.error.message')
    showErrorModal.value = true
  } finally {
    isSubmitting.value = false
  }
}

// Modal handlers
const closeSuccessModal = () => {
  showSuccessModal.value = false
  // Redirect to home page after closing success modal
  router.push(localePath('/'))
}

const closeErrorModal = () => {
  showErrorModal.value = false
}
</script>

<style scoped>
.bg-grid-pattern {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white' stroke-opacity='0.05'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}

/* Prose styling */
.prose {
  color: #292524;
}

.prose p {
  line-height: 1.7;
  margin-bottom: 1em;
}

:deep(.prose-rtl) {
  direction: rtl;
  text-align: right;
}

/* Form input focus styles */
input:focus,
textarea:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(142, 8, 77, 0.1);
}
</style>