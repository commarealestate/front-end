<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
      {{ mode === 'create' ? $t('admin_blogs_page.add_new') : $t('admin_blogs_page.edit_blog') }}
    </h1>

    <UForm :state="form" @submit="handleSubmit" class="space-y-8">
      <!-- Basic Info -->
      <UCard>
        <template #header>
          <h2 class="font-display font-semibold">{{ $t('admin_blogs_page.form.basic_info') }}</h2>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup label="Title (EN)" name="title_en" required>
            <UInput v-model="form.title_en" />
          </UFormGroup>
          <UFormGroup label="Title (AR)" name="title_ar" required>
            <UInput v-model="form.title_ar" />
          </UFormGroup>
          <UFormGroup label="Description (EN)" name="description_en" required class="md:col-span-2">
            <UTextarea v-model="form.description_en" rows="6" />
          </UFormGroup>
          <UFormGroup label="Description (AR)" name="description_ar" required class="md:col-span-2">
            <UTextarea v-model="form.description_ar" rows="6" />
          </UFormGroup>
          <UFormGroup label="Read Time (minutes)" name="read_time" required>
            <UInput v-model.number="form.read_time" type="number" min="1" />
          </UFormGroup>
          <UFormGroup label="External Link" name="ext_link">
            <UInput v-model="form.ext_link" placeholder="https://..." />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Main Content -->
      <UCard>
        <template #header>
          <h2 class="font-display font-semibold">{{ $t('admin_blogs_page.form.content') }}</h2>
        </template>
        <div class="space-y-6">
          <UFormGroup label="Main Content (EN)" name="content_en" required>
            <RichEditor v-model="form.content_en" :placeholder="$t('admin_blogs_page.form.content_placeholder')" />
          </UFormGroup>
          <UFormGroup label="Main Content (AR)" name="content_ar" required>
            <RichEditor v-model="form.content_ar" :placeholder="$t('admin_blogs_page.form.content_placeholder')" />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Dynamic Content Blocks -->
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="font-display font-semibold">{{ $t('admin_blogs_page.additional_contents') }}</h2>
            <UButton color="primary" variant="soft" size="sm" @click="addContentBlock">
              <Icon name="i-heroicons-plus" class="w-4 h-4 mr-1" />
              Add Block
            </UButton>
          </div>
        </template>
        <div v-if="contentBlocks.length === 0" class="text-center text-comma-neutral-500 py-4">
          No additional content blocks. Click "Add Block" to create one.
        </div>
        <div v-else class="space-y-6">
          <div v-for="(block, idx) in contentBlocks" :key="idx" class="border border-comma-border-subtle rounded-lg p-4">
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-medium">Block #{{ idx + 1 }}</h3>
              <UButton color="red" variant="ghost" size="xs" icon="i-heroicons-trash" @click="removeContentBlock(idx)" />
            </div>
            <div class="grid grid-cols-1  gap-4">
              <UFormGroup label="Content (EN)">
                <RichEditor v-model="block.content_en" :placeholder="$t('admin_blogs_page.form.content_placeholder')" />
              </UFormGroup>
              <UFormGroup label="Content (AR)">
                <RichEditor v-model="block.content_ar" :placeholder="$t('admin_blogs_page.form.content_placeholder')" />
              </UFormGroup>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <UFormGroup label="Image (optional)">
                <UInput type="file" accept="image/*" @change="(e) => handleBlockImageUpload(e, idx)" />
                <div v-if="block.imagePreview || block.existingImage" class="mt-2 relative w-32 h-32">
                  <img :src="block.imagePreview || block.existingImage" class="w-full h-full object-cover rounded" />
                  <button
                    type="button"
                    class="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
                    @click="removeBlockImage(idx)"
                  >
                    <Icon name="i-heroicons-x-mark" class="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </UFormGroup>
              <UFormGroup label="Order">
                <UInput v-model.number="block.order" type="number" min="0" step="1" />
              </UFormGroup>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Media & Tags -->
      <UCard>
        <template #header>
          <h2 class="font-display font-semibold">{{ $t('admin_blogs_page.form.media_tags') }}</h2>
        </template>
        <div class="space-y-6">
          <UFormGroup label="Featured Image" name="image" :required="mode === 'create'">
            <UInput type="file" accept="image/*" @change="handleImageUpload" />
            <div v-if="imagePreview || existingImage" class="mt-2 relative w-40 h-40">
              <img :src="imagePreview || existingImage" class="w-full h-full object-cover rounded-lg" />
              <button type="button" class="absolute top-1 right-1 p-1 bg-white rounded-full shadow" @click="removeImage">
                <Icon name="i-heroicons-x-mark" class="w-4 h-4 text-red-600" />
              </button>
            </div>
          </UFormGroup>
          <UFormGroup label="Tags" name="tags" required>
            <USelectMenu
              v-model="selectedTags"
              :options="tagOptions"
              multiple
              value-attribute="value"
              option-attribute="label"
              placeholder="Select tags"
            />
          </UFormGroup>
          <UFormGroup label="Active" name="is_active">
            <UToggle v-model="form.is_active" />
          </UFormGroup>
        </div>
      </UCard>

      <!-- SEO Fields -->
      <UCard>
        <template #header>
          <h2 class="font-display font-semibold">{{ $t('admin_blogs_page.form.seo') }}</h2>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup label="Meta Title" name="meta_title">
            <UInput v-model="form.meta_title" />
          </UFormGroup>
          <UFormGroup label="Meta Description" name="meta_description">
            <UTextarea v-model="form.meta_description" rows="5" />
          </UFormGroup>
          <UFormGroup label="Canonical URL" name="canonical_url">
            <UInput v-model="form.canonical_url" placeholder="https://..." />
          </UFormGroup>
          <UFormGroup label="OG Title" name="og_title">
            <UInput v-model="form.og_title" />
          </UFormGroup>
          <UFormGroup label="OG Description" name="og_description">
            <UTextarea v-model="form.og_description" rows="5" />
          </UFormGroup>
          <UFormGroup label="OG URL" name="og_url">
            <UInput v-model="form.og_url" placeholder="https://..." />
          </UFormGroup>
          <UFormGroup label="OG Type" name="og_type">
            <UInput v-model="form.og_type" placeholder="article" />
          </UFormGroup>
          <UFormGroup label="OG Site Name" name="og_site_name">
            <UInput v-model="form.og_site_name" />
          </UFormGroup>
          <UFormGroup label="OG Image URL" name="og_image">
            <UInput v-model="form.og_image" placeholder="https://..." />
          </UFormGroup>
        </div>
      </UCard>

      <div class="flex justify-end gap-3">
        <UButton color="gray" variant="ghost" :to="localePath('/admin/blogs')">
          {{ $t('admin_blogs_page.cancel') }}
        </UButton>
        <UButton type="submit" color="primary" :loading="submitting">
          {{ mode === 'create' ? $t('admin_blogs_page.create') : $t('admin_blogs_page.update') }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useBlogsStore } from '~/store/blogs'
import { useNotificationStore } from '~/store/notification'
import RichEditor from '~/components/admin/RichEditor.vue'

const props = defineProps<{
  mode: 'create' | 'edit'
  blogId?: string
}>()

const store = useBlogsStore()
const localePath = useLocalePath()
const router = useRouter()
const submitting = ref(false)

// Form state
const form = reactive({
  title_en: '',
  title_ar: '',
  description_en: '',
  description_ar: '',
  content_en: '',
  content_ar: '',
  read_time: 1,
  ext_link: '',
  is_active: true,
  meta_title: '',
  meta_description: '',
  canonical_url: '',
  og_title: '',
  og_description: '',
  og_url: '',
  og_type: 'article',
  og_site_name: '',
  og_image: '',
})

const selectedTags = ref<number[]>([])
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const existingImage = ref<string | null>(null)

// Content blocks
interface ContentBlock {
  id?: number
  content_en: string
  content_ar: string
  imageFile: File | null
  imagePreview: string | null
  existingImage: string | null
  order: number | null
}
const contentBlocks = ref<ContentBlock[]>([])
// Store original IDs for deletion tracking
const originalContentIds = ref<number[]>([])

onMounted(async () => {
  await store.fetchTags()
  if (props.mode === 'edit' && props.blogId) {
    await store.fetchBlog(props.blogId)
    if (store.blog) {
      const b = store.blog
      form.title_en = b.title_en
      form.title_ar = b.title_ar
      form.description_en = b.description_en
      form.description_ar = b.description_ar
      form.content_en = b.content_en
      form.content_ar = b.content_ar
      form.read_time = b.read_time
      form.ext_link = b.ext_link || ''
      form.is_active = !!b.is_active
      form.meta_title = b.meta_title || ''
      form.meta_description = b.meta_description || ''
      form.canonical_url = b.canonical_url || ''
      form.og_title = b.og_title || ''
      form.og_description = b.og_description || ''
      form.og_url = b.og_url || ''
      form.og_type = b.og_type || 'article'
      form.og_site_name = b.og_site_name || ''
      form.og_image = b.og_image || ''
      selectedTags.value = b.tags.map(t => t.tag_id)
      existingImage.value = b.image
      // Load contents
      if (b.contents && b.contents.length) {
        contentBlocks.value = b.contents.map(c => ({
          id: c.id,
          content_en: c.content_en || '',
          content_ar: c.content_ar || '',
          imageFile: null,
          imagePreview: null,
          existingImage: c.image || null,
          order: c.order ?? null,
        }))
        originalContentIds.value = b.contents.map(c => c.id!).filter(id => id !== undefined)
      }
    }
  }
})

const tagOptions = computed(() => store.tags.map(t => ({ label: t.title, value: t.tag_id })))

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

function addContentBlock() {
  contentBlocks.value.push({
    content_en: '',
    content_ar: '',
    imageFile: null,
    imagePreview: null,
    existingImage: null,
    order: contentBlocks.value.length + 1,
  })
}
function removeContentBlock(index: number) {
  const block = contentBlocks.value[index]
  if (block.id) {
    // Will be deleted via deleted_contents array
  }
  contentBlocks.value.splice(index, 1)
}
function handleBlockImageUpload(event: Event, index: number) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const block = contentBlocks.value[index]
    block.imageFile = target.files[0]
    block.imagePreview = URL.createObjectURL(target.files[0])
    block.existingImage = null
  }
}
function removeBlockImage(index: number) {
  const block = contentBlocks.value[index]
  block.imageFile = null
  block.imagePreview = null
  block.existingImage = null
}

async function handleSubmit() {
  submitting.value = true
  try {
    const formData = new FormData()
    // Append basic fields
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'is_active') {
          formData.append(key, value ? '1' : '0')
        } else {
          formData.append(key, String(value))
        }
      }
    })
    selectedTags.value.forEach((tagId, idx) => {
      formData.append(`tags[${idx}]`, String(tagId))
    })
    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    // Append content blocks
    contentBlocks.value.forEach((block, idx) => {
      if (block.content_en) formData.append(`contents[${idx}][content_en]`, block.content_en)
      if (block.content_ar) formData.append(`contents[${idx}][content_ar]`, block.content_ar)
      if (block.imageFile) formData.append(`contents[${idx}][image]`, block.imageFile)
      if (block.order !== null && block.order !== undefined) {
        formData.append(`contents[${idx}][order]`, String(block.order))
      }
    })

    // For edit, send deleted content IDs
    if (props.mode === 'edit' && props.blogId) {
      const currentIds = contentBlocks.value.map(b => b.id).filter(id => id !== undefined) as number[]
      const deletedIds = originalContentIds.value.filter(id => !currentIds.includes(id))
      deletedIds.forEach(id => {
        formData.append('deleted_contents[]', String(id))
      })
    }

    if (props.mode === 'create') {
      if (!imageFile.value) {
        useNotificationStore().error('Error', 'Featured image is required')
        submitting.value = false
        return
      }
      await store.createBlog(formData)
      router.push(localePath('/admin/blogs'))
    } else if (props.mode === 'edit' && props.blogId) {
      await store.updateBlog(props.blogId, formData)
      router.push(localePath(`/admin/blogs/${props.blogId}`))
    }
  } catch (err) {
    // error handled in store
  } finally {
    submitting.value = false
  }
}
</script>