<template>
  <UForm :state="form" @submit="submit">
    <div class="space-y-6">
      <!-- Title EN / AR -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup :label="$t('admin.blogs.title_en')" required>
          <UInput v-model="form.title_en" />
        </UFormGroup>
        <UFormGroup :label="$t('admin.blogs.title_ar')" required>
          <UInput v-model="form.title_ar" dir="rtl" />
        </UFormGroup>
      </div>

      <!-- Description EN / AR -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup :label="$t('admin.blogs.description_en')" required>
          <UTextarea v-model="form.description_en" :rows="3" />
        </UFormGroup>
        <UFormGroup :label="$t('admin.blogs.description_ar')" required>
          <UTextarea v-model="form.description_ar" dir="rtl" :rows="3" />
        </UFormGroup>
      </div>

      <!-- Content EN / AR (Rich Editor) -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-comma-neutral-900">{{ $t('admin.blogs.content_en') }}</h3>
        <AdminRichEditor v-model="form.content_en" :placeholder="$t('admin.blogs.content_placeholder')" />
      </div>

      <div class="space-y-4">
        <h3 class="text-lg font-bold text-comma-neutral-900">{{ $t('admin.blogs.content_ar') }}</h3>
        <AdminRichEditor v-model="form.content_ar" :placeholder="$t('admin.blogs.content_placeholder')" />
      </div>

      <!-- Read Time, Image, Tags, Active -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup :label="$t('admin.blogs.read_time')" required>
          <UInput v-model.number="form.read_time" type="number" min="1" />
        </UFormGroup>

        <UFormGroup :label="$t('admin.blogs.is_active')">
          <USelect v-model="form.is_active" :options="activeOptions" value-attribute="value" option-attribute="label" />
        </UFormGroup>
      </div>

      <UFormGroup :label="$t('admin.blogs.image')">
        <UInput type="file" accept="image/*" @change="handleImageUpload" />
        <div v-if="imagePreview" class="mt-2">
          <img :src="imagePreview" class="h-20 w-auto object-cover rounded" />
        </div>
      </UFormGroup>

      <UFormGroup :label="$t('admin.blogs.tags')">
        <div class="flex flex-wrap gap-2 mb-2">
          <span
            v-for="(tag, index) in form.tags"
            :key="index"
            class="px-3 py-1 bg-comma-primary/10 text-comma-primary rounded-full text-sm flex items-center gap-1"
          >
            {{ tag }}
            <button type="button" @click="removeTag(index)" class="hover:text-red-500">
              <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
            </button>
          </span>
        </div>
        <div class="flex gap-2">
          <UInput v-model="newTag" :placeholder="$t('admin.blogs.add_tag')" />
          <UButton @click="addTag" :disabled="!newTag.trim()">Add</UButton>
        </div>
      </UFormGroup>

      <UFormGroup :label="$t('admin.blogs.ext_link')">
        <UInput v-model="form.ext_link" placeholder="https://..." />
      </UFormGroup>

      <div class="flex justify-end gap-3 pt-4">
        <UButton variant="outline" @click="$emit('cancel')">
          {{ $t('admin.cancel') }}
        </UButton>
        <UButton type="submit" color="primary" :loading="submitting">
          {{ submitting ? $t('admin.saving') : $t('admin.save') }}
        </UButton>
      </div>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { AdminBlogFormData } from '~/composables/useAdminBlogs'

const props = defineProps<{
  initialData?: Partial<AdminBlogFormData>
}>()

const emit = defineEmits(['submit', 'cancel'])

const { t } = useI18n()

const form = reactive<AdminBlogFormData>({
  title_en: '',
  title_ar: '',
  description_en: '',
  description_ar: '',
  content_en: '',
  content_ar: '',
  read_time: 5,
  is_active: 1,
  tags: [],
  image: null,
  ext_link: '',
})

const imagePreview = ref<string | null>(null)

const activeOptions = [
  { label: t('admin.blogs.active'), value: 1 },
  { label: t('admin.blogs.inactive'), value: 0 },
]

const newTag = ref('')
const submitting = ref(false)

// Populate form with initial data if editing
watchEffect(() => {
  if (props.initialData) {
    Object.assign(form, props.initialData)
    if (props.initialData.image && typeof props.initialData.image === 'string') {
      imagePreview.value = props.initialData.image
    }
  }
})

const addTag = () => {
  if (newTag.value.trim()) {
    form.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  form.tags.splice(index, 1)
}

const handleImageUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    form.image = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const submit = async () => {
  submitting.value = true
  try {
    await emit('submit', form)
  } finally {
    submitting.value = false
  }
}
</script>