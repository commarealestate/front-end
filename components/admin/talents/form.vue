<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
      {{ mode === 'create' ? $t('admin_talents_page.add_new') : $t('admin_talents_page.edit_talent') }}
    </h1>

    <UForm :state="form" @submit="handleSubmit" class="space-y-8">
      <!-- Image -->
      <UCard>
        <template #header>
          <h2 class="font-display font-semibold">{{ $t('admin_talents_page.form.image') }}</h2>
        </template>
        <div class="space-y-4">
          <UFormGroup label="Profile Image" name="image">
            <UInput
              type="file"
              accept="image/*"
              @change="handleImageUpload"
            />
          </UFormGroup>
          <!-- Preview -->
          <div v-if="imagePreview || existingImage" class="mt-4">
            <p class="text-sm font-medium mb-2">Preview:</p>
            <div class="relative max-w-xs">
              <img :src="imagePreview || existingImage" class="w-full rounded-lg" />
              <button
                type="button"
                class="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                @click="removeImage"
              >
                <UIcon name="i-heroicons-x-mark" class="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Basic Info -->
      <UCard>
        <template #header>
          <h2 class="font-display font-semibold">{{ $t('admin_talents_page.form.basic_info') }}</h2>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup label="Name (EN)" name="name_en" required>
            <UInput v-model="form.name_en" />
          </UFormGroup>
          <UFormGroup label="Name (AR)" name="name_ar" required>
            <UInput v-model="form.name_ar" />
          </UFormGroup>
          <UFormGroup label="Title (EN)" name="title_en" required>
            <UInput v-model="form.title_en" />
          </UFormGroup>
          <UFormGroup label="Title (AR)" name="title_ar" required>
            <UInput v-model="form.title_ar" />
          </UFormGroup>
          <UFormGroup label="Email" name="email">
            <UInput v-model="form.email" type="email" />
          </UFormGroup>
          <UFormGroup label="LinkedIn URL (profile url)" name="url">
            <UInput v-model="form.url" placeholder="https://..." />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Descriptions -->
      <UCard>
        <template #header>
          <h2 class="font-display font-semibold">{{ $t('admin_talents_page.form.descriptions') }}</h2>
        </template>
        <div class="space-y-6">
          <UFormGroup label="Description (EN)" name="desc_en">
            <UTextarea v-model="form.desc_en" rows="4" />
          </UFormGroup>
          <UFormGroup label="Description (AR)" name="desc_ar">
            <UTextarea v-model="form.desc_ar" rows="4" />
          </UFormGroup>
        </div>
      </UCard>

      <div class="flex justify-end gap-3">
        <UButton color="gray" variant="ghost" :to="localePath('/admin/talents')">
          {{ $t('admin_talents_page.cancel') }}
        </UButton>
        <UButton type="submit" color="primary" :loading="submitting">
          {{ mode === 'create' ? $t('admin_talents_page.create') : $t('admin_talents_page.update') }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useTalentsStore } from '~/store/talents'
import { useNotificationStore } from '~/store/notification'

const props = defineProps<{
  mode: 'create' | 'edit'
  talentId?: string
}>()

const store = useTalentsStore()
const localePath = useLocalePath()
const router = useRouter()
const submitting = ref(false)

const form = reactive({
  name_en: '',
  name_ar: '',
  title_en: '',
  title_ar: '',
  email: '',
  url: '',
  desc_en: '',
  desc_ar: '',
})

const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const existingImage = ref<string | null>(null)

// Load existing data if editing
onMounted(async () => {
  if (props.mode === 'edit' && props.talentId) {
    await store.fetchTalent(props.talentId)
    if (store.talent) {
      const t = store.talent
      form.name_en = t.name_en || ''
      form.name_ar = t.name_ar || ''
      form.title_en = t.title_en || ''
      form.title_ar = t.title_ar || ''
      form.email = t.email || ''
      form.url = t.url || ''
      // Descriptions may be present in the API response
      form.desc_en = (t as any).desc_en || ''
      form.desc_ar = (t as any).desc_ar || ''
      existingImage.value = t.image
    }
  }
})

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0]
    imagePreview.value = URL.createObjectURL(target.files[0])
    existingImage.value = null
  }
}

function removeImage() {
  imageFile.value = null
  imagePreview.value = null
  existingImage.value = null
}

async function handleSubmit() {
  submitting.value = true
  try {
    const formData = new FormData()
    formData.append('name_en', form.name_en)
    formData.append('name_ar', form.name_ar)
    formData.append('title_en', form.title_en)
    formData.append('title_ar', form.title_ar)
    if (form.email) formData.append('email', form.email)
    if (form.url) formData.append('url', form.url)
    if (form.desc_en) formData.append('desc_en', form.desc_en)
    if (form.desc_ar) formData.append('desc_ar', form.desc_ar)

    if (props.mode === 'create') {
      if (!imageFile.value) {
        useNotificationStore().error('Error', 'Image is required')
        submitting.value = false
        return
      }
      formData.append('image', imageFile.value)
      await store.createTalent(formData)
      router.push(localePath('/admin/talents'))
    } else if (props.mode === 'edit' && props.talentId) {
      if (imageFile.value) {
        formData.append('image', imageFile.value)
      } else if (!existingImage.value && !imageFile.value) {
        // User removed existing image and didn't upload new one → delete image
        formData.append('delete_image', '1')
      }
      await store.updateTalent(props.talentId, formData)
      router.push(localePath(`/admin/talents/${props.talentId}`))
    }
  } catch (err) {
    // error handled in store
  } finally {
    submitting.value = false
  }
}
</script>