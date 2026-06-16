<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
      {{ mode === 'create' ? $t('admin_moments_page.add_new') : $t('admin_moments_page.edit_moment') }}
    </h1>

    <UForm :state="form" @submit="handleSubmit" class="space-y-8">
      <!-- Media Upload -->
      <UCard>
        <template #header>
          <h2 class="font-display font-semibold">{{ $t('admin_moments_page.form.media') }}</h2>
        </template>
        <div class="space-y-4">
          <UFormGroup label="Media File" name="media" :required="mode === 'create'">
            <UInput
              type="file"
              accept="image/*,video/*"
              @change="handleMediaUpload"
            />
            <div class="mt-2 text-xs text-comma-neutral-500">
              Supported: jpg, jpeg, png, webp, mp4, mov, avi, webm — max 50 MB
            </div>
          </UFormGroup>
          <!-- Preview -->
          <div v-if="mediaPreview || existingMedia" class="mt-4">
            <p class="text-sm font-medium mb-2">Preview:</p>
            <div class="relative max-w-md">
              <video
                v-if="isVideoPreview"
                :src="mediaPreview || existingMedia"
                controls
                class="w-full rounded-lg"
              />
              <img
                v-else
                :src="mediaPreview || existingMedia"
                class="w-full rounded-lg"
              />
              <button
                type="button"
                class="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                @click="removeMedia"
              >
                <UIcon name="i-heroicons-x-mark" class="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Title & Description -->
      <UCard>
        <template #header>
          <h2 class="font-display font-semibold">{{ $t('admin_moments_page.form.details') }}</h2>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup label="Title (EN)" name="title_en">
            <UInput v-model="form.title_en" placeholder="(optional, defaults to '-')" />
          </UFormGroup>
          <UFormGroup label="Title (AR)" name="title_ar">
            <UInput v-model="form.title_ar" placeholder="(optional, defaults to '-')" />
          </UFormGroup>
          <UFormGroup label="Description (EN)" name="description_en" class="md:col-span-2">
            <UTextarea v-model="form.description_en" rows="3" placeholder="(optional, defaults to '-')" />
          </UFormGroup>
          <UFormGroup label="Description (AR)" name="description_ar" class="md:col-span-2">
            <UTextarea v-model="form.description_ar" rows="3" placeholder="(optional, defaults to '-')" />
          </UFormGroup>
        </div>
      </UCard>

      <div class="flex justify-end gap-3">
        <UButton color="gray" variant="ghost" :to="localePath('/admin/emiratisation-moments')">
          {{ $t('admin_moments_page.cancel') }}
        </UButton>
        <UButton type="submit" color="primary" :loading="submitting">
          {{ mode === 'create' ? $t('admin_moments_page.create') : $t('admin_moments_page.update') }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useMomentsStore } from '~/store/moments'
import { useNotificationStore } from '~/store/notification'
import {
  MAX_MOMENT_MEDIA_BYTES,
  validateFileMaxSize,
} from '~/utils/adminFormHelpers'

const props = defineProps<{
  mode: 'create' | 'edit'
  momentId?: string
}>()

const store = useMomentsStore()
const localePath = useLocalePath()
const router = useRouter()
const submitting = ref(false)

// Form state
const form = reactive({
  title_en: '',
  title_ar: '',
  description_en: '',
  description_ar: '',
})

const mediaFile = ref<File | null>(null)
const mediaPreview = ref<string | null>(null)
const existingMedia = ref<string | null>(null)

// Determine if preview is video
const isVideoPreview = computed(() => {
  const url = mediaPreview.value || existingMedia.value
  if (!url) return false
  const ext = url.split('.').pop()?.toLowerCase()
  return ext === 'mp4' || ext === 'mov' || ext === 'avi' || ext === 'webm'
})

// Load existing data if editing
onMounted(async () => {
  if (props.mode === 'edit' && props.momentId) {
    await store.fetchMoment(props.momentId)
    if (store.moment) {
      const m = store.moment
      form.title_en = m.title_en !== '-' ? m.title_en : ''
      form.title_ar = m.title_ar !== '-' ? m.title_ar : ''
      form.description_en = m.description_en !== '-' ? m.description_en : ''
      form.description_ar = m.description_ar !== '-' ? m.description_ar : ''
      existingMedia.value = m.media
    }
  }
})

function handleMediaUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const sizeError = validateFileMaxSize(file, MAX_MOMENT_MEDIA_BYTES, 'Media file')
    if (sizeError) {
      useNotificationStore().error('Error', sizeError)
      target.value = ''
      return
    }

    mediaFile.value = file
    mediaPreview.value = URL.createObjectURL(file)
    existingMedia.value = null
  }
}

function removeMedia() {
  mediaFile.value = null
  mediaPreview.value = null
  existingMedia.value = null
}

async function handleSubmit() {
  submitting.value = true
  try {
    const formData = new FormData()
    // Required fields: always send something (use "-" if empty)
    formData.append('title_en', form.title_en.trim() || '-')
    formData.append('title_ar', form.title_ar.trim() || '-')
    formData.append('description_en', form.description_en.trim() || '-')
    formData.append('description_ar', form.description_ar.trim() || '-')
    
    if (props.mode === 'create') {
      // For create, media is required
      if (!mediaFile.value) {
        useNotificationStore().error('Error', 'Media file is required')
        submitting.value = false
        return
      }
      formData.append('media', mediaFile.value)
      await store.createMoment(formData)
      router.push(localePath('/admin/emiratisation-moments'))
    } else if (props.mode === 'edit' && props.momentId) {
      // For edit, only send media if changed
      if (mediaFile.value) {
        formData.append('media', mediaFile.value)
      }
      await store.updateMoment(props.momentId, formData)
      router.push(localePath(`/admin/emiratisation-moments/${props.momentId}`))
    }
  } catch (err) {
    // error handled in store
  } finally {
    submitting.value = false
  }
}
</script>