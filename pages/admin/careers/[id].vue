<template>
  <div v-if="career" class="max-w-2xl mx-auto">
    <!-- Back Button -->
    <UButton
      @click="router.back()"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      {{ $t('admin.back') }}
    </UButton>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-12">
      <Icon name="eos-icons:loading" class="w-8 h-8 text-comma-primary animate-spin" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      {{ $t('admin.careers.error_loading') }}
    </div>

    <!-- Career Details -->
    <div v-else class="bg-white rounded-2xl shadow-card border border-comma-border-subtle overflow-hidden">
      <!-- Header with status and actions -->
      <div class="p-6 border-b border-comma-border-subtle flex justify-between items-center">
        <div class="flex items-center gap-2">
          <UBadge
            :color="career.is_read ? 'gray' : 'amber'"
            variant="soft"
          >
            {{ career.is_read ? $t('admin.careers.read') : $t('admin.careers.unread') }}
          </UBadge>
          <span class="text-sm text-comma-neutral-500">ID: {{ career.career_message_id }}</span>
        </div>
        <div class="flex gap-2">
          <UButton
            v-if="!career.is_read"
            color="primary"
            size="sm"
            :loading="markingAsRead"
            @click="markAsRead"
          >
            {{ $t('admin.careers.mark_read') }}
          </UButton>
          <UButton
            color="red"
            variant="soft"
            size="sm"
            :loading="deleting"
            @click="confirmDelete"
          >
            {{ $t('admin.careers.delete') }}
          </UButton>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-5">
        <!-- Name & Field -->
        <div>
          <h1 class="text-2xl font-bold text-comma-neutral-900">{{ career.name }}</h1>
          <p class="text-comma-primary">{{ career.professional_field }}</p>
        </div>

        <!-- Contact Info -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-if="career.email" class="space-y-1">
            <div class="text-sm text-comma-neutral-500">{{ $t('admin.careers.email') }}</div>
            <a :href="`mailto:${career.email}`" class="text-comma-primary hover:underline">{{ career.email }}</a>
          </div>
          <div v-if="career.phone_number" class="space-y-1">
            <div class="text-sm text-comma-neutral-500">{{ $t('admin.careers.phone') }}</div>
            <a :href="`tel:${career.phone_number}`" class="text-comma-primary hover:underline">{{ career.phone_number }}</a>
          </div>
          <div v-if="career.link" class="space-y-1 sm:col-span-2">
            <div class="text-sm text-comma-neutral-500">{{ $t('admin.careers.linkedin') }}</div>
            <a :href="career.link" target="_blank" rel="noopener" class="text-comma-primary hover:underline break-all">{{ career.link }}</a>
          </div>
        </div>

        <!-- Experience -->
        <div v-if="career.years_of_experience" class="flex items-center gap-2">
          <Icon name="i-heroicons-clock" class="w-5 h-5 text-comma-secondary" />
          <span class="text-comma-neutral-700">{{ career.years_of_experience }}</span>
        </div>

        <!-- Message -->
        <div v-if="career.message">
          <h2 class="text-lg font-bold text-comma-neutral-900 mb-2">{{ $t('admin.careers.message') }}</h2>
          <p class="text-comma-neutral-700 whitespace-pre-line bg-comma-neutral-50 p-4 rounded-lg">{{ career.message }}</p>
        </div>

        <!-- Dates -->
        <div class="text-sm text-comma-neutral-400 border-t border-comma-border-subtle pt-4">
          <div>{{ $t('admin.careers.received') }}: {{ formatFullDate(career.created_at) }}</div>
          <div v-if="career.read_at">{{ $t('admin.careers.read_at') }}: {{ formatFullDate(career.read_at) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCareer } from '~/composables/useCareers'

definePageMeta({
  title: 'admin.careers.details'
})

const route = useRoute()
const router = useRouter()
const { locale, t } = useI18n()

const localePath = useLocalePath()
const toast = useToast()
const careerId = Number(route.params.id)

const { career, pending, error, refresh } = useCareer(careerId)

const markingAsRead = ref(false)
const deleting = ref(false)

const formatFullDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Mark as read
const markAsRead = async () => {
  if (!career.value || career.value.is_read) return
  markingAsRead.value = true
  try {
    const { data: response } = await useApiFetch(
      { apiType: 'admin', url: 'careers/mark-as-read', method: 'post' },
      { body: { ids: [career.value.career_message_id] } }
    )
    if (response.value.status === 1) {
      career.value.is_read = true
      career.value.read_at = new Date().toISOString()
      toast.add({
        title: t('admin.careers.marked_read_success'),
        icon: 'i-heroicons-check-circle',
        color: 'green'
      })
    } else {
      throw new Error(response.value.message || 'Failed to mark as read')
    }
  } catch (err) {
    toast.add({
      title: t('admin.careers.error'),
      description: err.message,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } finally {
    markingAsRead.value = false
  }
}

// Confirm and delete
const confirmDelete = () => {
  if (!career.value) return
  if (confirm(t('admin.careers.confirm_delete'))) {
    deleteCareer()
  }
}

const deleteCareer = async () => {
  if (!career.value) return
  deleting.value = true
  try {
    const { data: response } = await useApiFetch(
      { apiType: 'admin', url: `careers/${career.value.career_message_id}`, method: 'delete' }
    )
    if (response.value.status === 1) {
      toast.add({
        title: t('admin.careers.deleted_success'),
        icon: 'i-heroicons-check-circle',
        color: 'green'
      })
      router.push(localePath('admin-careers'))
    } else {
      throw new Error(response.value.message || 'Delete failed')
    }
  } catch (err) {
    toast.add({
      title: t('admin.careers.error'),
      description: err.message,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } finally {
    deleting.value = false
  }
}
</script>