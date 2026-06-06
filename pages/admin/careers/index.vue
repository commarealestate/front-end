<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold text-comma-neutral-900 font-display">
        {{ $t('admin.careers.title') }}
      </h1>

      <!-- Bulk Actions -->
      <div class="flex items-center gap-2">
        <UButton
          v-if="selectedIds.length > 0 && hasUnreadSelected"
          color="primary"
          size="sm"
          @click="markSelectedAsRead"
        >
          {{ $t('admin.careers.mark_selected_read') }}
        </UButton>
      </div>
    </div>

    <!-- Filters Card -->
    <UCard class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Read/Unread Filter -->
        <UFormGroup :label="$t('admin.careers.filter_read')">
          <USelectMenu
            v-model="filterState.is_read"
            :options="readOptions"
            value-attribute="value"
            option-attribute="label"
            placeholder="All"
            clearable
          />
        </UFormGroup>

        <!-- Professional Field -->
        <UFormGroup :label="$t('admin.careers.filter_professional_field')">
          <UInput
            v-model="filterState.professional_field"
            placeholder="e.g., Real Estate"
            @keyup.enter="applyFilters"
          />
        </UFormGroup>

        <!-- Email -->
        <UFormGroup :label="$t('admin.careers.filter_email')">
          <UInput
            v-model="filterState.email"
            placeholder="email@example.com"
            @keyup.enter="applyFilters"
          />
        </UFormGroup>

        <!-- Experience Dropdown (min_experience) -->
        <UFormGroup :label="$t('admin.careers.filter_experience')">
          <USelectMenu
            v-model="selectedExperience"
            :options="experienceOptions"
            value-attribute="value"
            option-attribute="label"
            placeholder="Select experience"
            clearable
          />
        </UFormGroup>

        <!-- From Date -->
        <UFormGroup :label="$t('admin.careers.filter_from_date')">
          <UInput v-model="filterState.from_date" type="date" />
        </UFormGroup>

        <!-- To Date -->
        <UFormGroup :label="$t('admin.careers.filter_to_date')">
          <UInput v-model="filterState.to_date" type="date" />
        </UFormGroup>

        <!-- Action Buttons -->
        <div class="flex items-end gap-2 lg:col-span-2">
          <UButton color="primary" @click="applyFilters">
            {{ $t('admin.careers.apply_filters') }}
          </UButton>
          <UButton color="gray" variant="soft" @click="resetFilters">
            {{ $t('admin.careers.reset_filters') }}
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-12">
      <Icon name="eos-icons:loading" class="w-8 h-8 text-comma-primary animate-spin" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      {{ $t('admin.careers.error_loading') }}
    </div>

    <!-- Careers Grid -->
    <div v-else-if="careers.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="career in careers"
        :key="career.career_message_id"
        class="group relative bg-white rounded-2xl shadow-card border border-comma-border-subtle overflow-hidden hover:shadow-hover hover:scale-[1.02] transition-all duration-300 flex flex-col"
      >
        <!-- Colored status strip -->
        <div
          class="absolute left-0 top-0 bottom-0 w-1.5"
          :class="career.is_read ? 'bg-green-600' : 'bg-comma-primary'"
        ></div>

        <!-- Selection Checkbox -->
        <div v-if="!career.is_read" class="absolute top-3 left-4 z-10">
          <UCheckbox
            v-model="selectedIds"
            :value="career.career_message_id"
            :disabled="career.is_read"
          />
        </div>

        <!-- Read/Unread Badge -->
        <div class="absolute top-3 right-3">
          <UBadge
            :color="career.is_read ? 'green' : 'amber'"
            variant="soft"
            size="sm"
            class="shadow-sm"
          >
            <Icon
              :name="career.is_read ? 'i-heroicons-check-circle' : 'i-heroicons-envelope'"
              class="w-3 h-3 mr-1"
            />
            {{ career.is_read ? $t('admin.careers.read') : $t('admin.careers.unread') }}
          </UBadge>
        </div>

        <!-- Content -->
        <div class="p-5 pl-6 flex-1 flex flex-col justify-between">
          <!-- Top content -->
          <div>
            <!-- Header with avatar/initials -->
            <div class="flex items-start gap-3 mb-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                :class="career.is_read ? 'bg-green-600' : 'bg-comma-primary'"
              >
                {{ getInitials(career.name) }}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-bold text-comma-neutral-900 truncate">{{ career.name }}</h3>
                <p class="text-sm text-comma-primary font-medium truncate">{{ career.professional_field }}</p>
              </div>
            </div>

            <!-- Contact & Experience Grid -->
            <div class="grid grid-cols-1 gap-2 text-sm mb-3">
              <div v-if="career.email" class="flex items-center gap-2 text-comma-neutral-600">
                <Icon name="i-heroicons-envelope" class="w-4 h-4 text-comma-secondary flex-shrink-0" />
                <span class="truncate">{{ career.email }}</span>
              </div>
              <div v-if="career.phone_number" class="flex items-center gap-2 text-comma-neutral-600">
                <Icon name="i-heroicons-phone" class="w-4 h-4 text-comma-secondary flex-shrink-0" />
                <span>{{ career.phone_number }}</span>
              </div>
              <div class="flex items-center gap-2 text-comma-neutral-600">
                <Icon name="i-heroicons-clock" class="w-4 h-4 text-comma-secondary flex-shrink-0" />
                <span class="font-medium">{{ career.years_of_experience || $t('admin.careers.not_specified') }}</span>
              </div>
              <div v-if="career.link" class="flex items-center gap-2">
                <Icon name="i-fa6-brands-linkedin" class="w-4 h-4 text-[#0A66C2]" />
                <a
                  :href="career.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-comma-primary hover:underline truncate"
                >
                  {{ career.link.replace(/^https?:\/\/(www\.)?linkedin\.com\//, '') }}
                </a>
              </div>
            </div>

            <!-- Message preview with quote styling -->
            <div class="relative mb-3 min-h-[3rem]">
              <div v-if="career.message" class="absolute -left-1 -top-1 text-comma-primary opacity-20 text-4xl">"</div>
              <p
                v-if="career.message"
                class="text-sm text-comma-neutral-600 line-clamp-2 pl-3 italic border-l-2 border-comma-primary/30"
              >
                {{ career.message }}
              </p>
              <p v-else class="text-sm text-comma-neutral-400 italic">
                {{ $t('admin.careers.no_message') }}
              </p>
            </div>
          </div>

          <!-- Footer with date and view link -->
          <div class="flex items-center justify-between text-xs text-comma-neutral-400 mt-2 pt-2 border-t border-comma-border-subtle">
            <div class="flex items-center gap-1">
              <Icon name="i-heroicons-calendar" class="w-3.5 h-3.5" />
              <span>{{ career.created_at }}</span>
            </div>
            <NuxtLink
              :to="localePath(`/admin/careers/${career.career_message_id}`)"
              class="inline-flex items-center gap-1 text-comma-primary hover:text-comma-primary-dark transition-colors font-medium"
            >
              {{ $t('admin.careers.view_details') }}
              <Icon name="i-heroicons-arrow-right" class="w-4 h-4" :class="{ 'rotate-180': locale === 'ar' }" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-white rounded-2xl shadow-card">
      <Icon name="i-heroicons-document-text" class="w-16 h-16 text-comma-neutral-300 mx-auto mb-4" />
      <p class="text-comma-neutral-600">{{ $t('admin.careers.no_careers') }}</p>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.last_page > 1" class="mt-8 flex justify-center">
      <UPagination
        v-model="currentPage"
        :page-count="pagination.per_page"
        :total="pagination.total"
        @update:model-value="fetchPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCareers } from '~/composables/useCareers'

definePageMeta({
  title: 'admin.careers.title'
})

const { locale, t } = useI18n()
const localePath = useLocalePath()
const toast = useToast()
const { careers, pagination, pending, error, fetchCareers, filters } = useCareers()

const currentPage = ref(1)
const itemsPerPage = 12

// Experience Options for dropdown
const experienceOptions = [
  { value: '0-2', label: t('admin.careers.exp_0_2') },
  { value: '2-5', label: t('admin.careers.exp_2_5') },
  { value: '5-8', label: t('admin.careers.exp_5_8') },
  { value: '8-12', label: t('admin.careers.exp_8_12') },
  { value: '12+', label: t('admin.careers.exp_12_plus') },
]

// Local filter state
const filterState = ref({
  is_read: null as boolean | null,
  professional_field: '',
  email: '',
  from_date: '',
  to_date: '',
})
const selectedExperience = ref<string | null>(null)

// Read options
const readOptions = [
  { label: t('admin.careers.all'), value: null },
  { label: t('admin.careers.unread'), value: false },
  { label: t('admin.careers.read'), value: true },
]

// Bulk selection
const selectedIds = ref<number[]>([])
const hasUnreadSelected = computed(() => {
  const selected = careers.value.filter(c => selectedIds.value.includes(c.career_message_id))
  return selected.some(c => !c.is_read)
})

// Get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Initialize filters from composable on mount
onMounted(() => {
  // Sync local filterState with current filters (which might have defaults)
  filterState.value = {
    is_read: filters.value.is_read,
    professional_field: filters.value.professional_field || '',
    email: filters.value.email || '',
    from_date: filters.value.from_date || '',
    to_date: filters.value.to_date || '',
  }
  // Map min_experience to selectedExperience
  if (filters.value.min_experience) {
    const exp = filters.value.min_experience.toString()
    // Try to match to experience options (e.g., if min_experience=5, select "5-8")
    const option = experienceOptions.find(opt => {
      const [min] = opt.value.split('-').map(Number)
      return min === Number(exp)
    })
    if (option) selectedExperience.value = option.value
  }
  fetchCareers({ per_page: itemsPerPage, page: currentPage.value })
})

// Apply filters: update composable filters and reset to page 1
const applyFilters = () => {
  currentPage.value = 1
  const payload: any = {
    ...filterState.value,
    page: 1,
    per_page: itemsPerPage,
  }
  // Convert selected experience to min_experience number
  if (selectedExperience.value) {
    const [min] = selectedExperience.value.split('-').map(Number)
    payload.min_experience = min
  } else {
    payload.min_experience = null
  }
  fetchCareers(payload)
}

// Reset all filters to default
const resetFilters = () => {
  filterState.value = {
    is_read: null,
    professional_field: '',
    email: '',
    from_date: '',
    to_date: '',
  }
  selectedExperience.value = null
  applyFilters()
}

// Fetch page when pagination changes
const fetchPage = (page: number) => {
  currentPage.value = page
  const payload: any = {
    ...filterState.value,
    page,
    per_page: itemsPerPage,
  }
  if (selectedExperience.value) {
    const [min] = selectedExperience.value.split('-').map(Number)
    payload.min_experience = min
  }
  fetchCareers(payload)
}

// Format date (only date, no time)
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Bulk mark as read
const markSelectedAsRead = async () => {
  const unreadIds = careers.value
    .filter(c => selectedIds.value.includes(c.career_message_id) && !c.is_read)
    .map(c => c.career_message_id)

  if (unreadIds.length === 0) return

  try {
    const { data: response } = await useApiFetch(
      { apiType: 'admin', url: 'careers/mark-as-read', method: 'post' },
      { body: { ids: unreadIds } }
    )
    if (response.value.status === 1) {
      // Update local state
      careers.value.forEach(c => {
        if (unreadIds.includes(c.career_message_id)) {
          c.is_read = true
        }
      })
      selectedIds.value = []
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
  }
}
</script>