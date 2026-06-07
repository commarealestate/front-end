<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
      {{ mode === 'create' ? $t('admin_properties_page.add_new') : $t('admin_properties_page.edit_property') }}
    </h1>

    <UForm :state="form" @submit="handleSubmit" class="space-y-8">
      <!-- Basic Info -->
      <UCard>
        <template #header>
          <h2 class="font-display font-semibold">{{ $t('admin_properties_page.form.basic_info') }}</h2>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup label="Reference Number" name="reference_number" required>
            <UInput v-model="form.reference_number" />
          </UFormGroup>
          <UFormGroup label="Offering Type" name="offering_type" required>
            <USelect v-model="form.offering_type" :options="offeringTypeOptions" />
          </UFormGroup>
          <UFormGroup label="Title (EN)" name="title_en" required>
            <UInput v-model="form.title_en" />
          </UFormGroup>
          <UFormGroup label="Title (AR)" name="title_ar" required>
            <UInput v-model="form.title_ar" />
          </UFormGroup>
          <UFormGroup label="Description (EN)" name="description_en" required class="md:col-span-2">
            <UTextarea v-model="form.description_en" rows="4" />
          </UFormGroup>
          <UFormGroup label="Description (AR)" name="description_ar" required class="md:col-span-2">
            <UTextarea v-model="form.description_ar" rows="4" />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Location & Details -->
      <UCard>
        <template #header>
          <h2 class="font-display font-semibold">{{ $t('admin_properties_page.form.location_details') }}</h2>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup label="Community" name="community">
            <UInput v-model="form.community" />
          </UFormGroup>
          <UFormGroup label="Sub Community" name="sub_community">
            <UInput v-model="form.sub_community" />
          </UFormGroup>
          <UFormGroup label="Project Name" name="project_name" required>
            <UInput v-model="form.project_name" />
          </UFormGroup>
          <UFormGroup label="Tower" name="tower">
            <UInput v-model="form.tower" />
          </UFormGroup>
          <UFormGroup label="Unit No" name="unit_no">
            <UInput v-model="form.unit_no" />
          </UFormGroup>
          <UFormGroup label="Location (EN)" name="location_en" required>
            <UInput v-model="form.location_en" />
          </UFormGroup>
          <UFormGroup label="Location (AR)" name="location_ar" required>
            <UInput v-model="form.location_ar" />
          </UFormGroup>
          <UFormGroup label="Year Built" name="year_built">
            <UInput v-model="form.year_built" type="number" max="2099" />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Specs -->
      <UCard>
        <template #header>
          <h2 class="font-display font-semibold">{{ $t('admin_properties_page.form.specs') }}</h2>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UFormGroup label="Bedrooms" name="bedrooms" required>
            <UInput v-model.number="form.bedrooms" type="number" min="0" />
          </UFormGroup>
          <UFormGroup label="Bathrooms" name="bathrooms" required>
            <UInput v-model.number="form.bathrooms" type="number" min="0" />
          </UFormGroup>
          <UFormGroup label="Size (sqft)" name="size" required>
            <UInput v-model.number="form.size" type="number" min="0" step="0.01" />
          </UFormGroup>
          <UFormGroup label="Property Type" name="property_type" required>
            <USelect v-model="form.property_type" :options="propertyTypeOptions" />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Pricing & Status -->
      <UCard>
        <template #header>
          <h2 class="font-display font-semibold">{{ $t('admin_properties_page.form.pricing_status') }}</h2>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup label="Original Price" name="original_price" required>
            <UInput v-model.number="form.original_price" type="number" min="0" step="0.01" />
          </UFormGroup>
          <UFormGroup label="Hot Deal" name="hot_deal">
            <UToggle v-model="form.hot_deal" />
          </UFormGroup>
          <UFormGroup v-if="form.hot_deal" label="Hot Deal Price" name="hot_deal_price" required>
            <UInput v-model.number="form.hot_deal_price" type="number" min="0" step="0.01" />
          </UFormGroup>
          <UFormGroup label="Status" name="status">
            <USelect v-model="form.status" :options="statusOptions" />
          </UFormGroup>
          <!-- <UFormGroup label="Status Color" name="status_color">
            <UInput v-model="form.status_color" type="color" />
          </UFormGroup> -->
          <UFormGroup label="Featured" name="featured">
            <UToggle v-model="form.featured" />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Features & Amenities -->
      <UCard>
        <template #header>
          <h2 class="font-display font-semibold">{{ $t('admin_properties_page.form.features_amenities') }}</h2>
        </template>
        <div class="space-y-6">
          <!-- Features (dynamic key-value) -->
          <div>
            <label class="block text-sm font-medium text-comma-neutral-700 mb-2">Features</label>
            <div v-for="(feature, index) in features" :key="index" class="flex items-center gap-2 mb-2">
              <UInput v-model="feature.key" placeholder="Key (e.g., feature1)" class="flex-1" />
              <UInput v-model="feature.value" placeholder="Value" class="flex-1" />
              <UButton color="red" variant="ghost" square @click="removeFeature(index)">
                <AdminLocalIcon name="trash" class="w-4 h-4" />
              </UButton>
            </div>
            <UButton color="primary" variant="outline" size="sm" @click="addFeature">
              Add Feature
            </UButton>
          </div>
          <!-- Amenities (array) -->
          <div>
            <label class="block text-sm font-medium text-comma-neutral-700 mb-2">Amenities</label>
            <div v-for="(amenity, index) in amenities" :key="index" class="flex items-center gap-2 mb-2">
              <UInput v-model="amenities[index]" placeholder="Amenity" class="flex-1" />
              <UButton color="red" variant="ghost" square @click="removeAmenity(index)">
                <AdminLocalIcon name="trash" class="w-4 h-4" />
              </UButton>
            </div>
            <UButton color="primary" variant="outline" size="sm" @click="addAmenity">
              Add Amenity
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Images -->
      <UCard>
        <template #header>
          <h2 class="font-display font-semibold">{{ $t('admin_properties_page.form.images') }}</h2>
        </template>
        <div class="space-y-8">
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-comma-neutral-700 mb-1">Cover Images</label>
              <p class="text-xs text-comma-neutral-500">Main property photos shown first on the website.</p>
            </div>
            <UInput
              type="file"
              multiple
              accept="image/*"
              @change="handleCoverUpload"
            />
            <div v-if="existingCoverImages.length || newCoverImages.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div v-for="img in existingCoverImages" :key="img" class="relative group">
                <img :src="img" class="w-full h-28 object-cover rounded" />
                <button
                  type="button"
                  class="absolute top-1 right-1 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100"
                  @click="removeExistingCoverImage(img)"
                >
                  <AdminLocalIcon name="x-mark" class="w-4 h-4 text-red-600" />
                </button>
              </div>
              <div v-for="(file, idx) in newCoverImages" :key="`cover-${idx}-${file.name}`" class="relative group">
                <img :src="getFilePreview(file)" class="w-full h-28 object-cover rounded" />
                <button
                  type="button"
                  class="absolute top-1 right-1 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100"
                  @click="removeNewCoverImage(idx)"
                >
                  <AdminLocalIcon name="x-mark" class="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-comma-neutral-700 mb-1">Gallery Images</label>
              <p class="text-xs text-comma-neutral-500">Additional images for the property gallery.</p>
            </div>
            <UInput
              type="file"
              multiple
              accept="image/*"
              @change="handleGalleryUpload"
            />
            <div v-if="existingGalleryImages.length || newGalleryImages.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div v-for="img in existingGalleryImages" :key="img" class="relative group">
                <img :src="img" class="w-full h-28 object-cover rounded" />
                <button
                  type="button"
                  class="absolute top-1 right-1 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100"
                  @click="removeExistingGalleryImage(img)"
                >
                  <AdminLocalIcon name="x-mark" class="w-4 h-4 text-red-600" />
                </button>
              </div>
              <div v-for="(file, idx) in newGalleryImages" :key="`gallery-${idx}-${file.name}`" class="relative group">
                <img :src="getFilePreview(file)" class="w-full h-28 object-cover rounded" />
                <button
                  type="button"
                  class="absolute top-1 right-1 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100"
                  @click="removeNewGalleryImage(idx)"
                >
                  <AdminLocalIcon name="x-mark" class="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-comma-neutral-700 mb-1">Floor Plans</label>
              <p class="text-xs text-comma-neutral-500">Floor plans are uploaded separately and are not part of the property gallery.</p>
            </div>
            <UInput
              type="file"
              multiple
              accept="image/*,application/pdf"
              @change="handleFloorPlanUpload"
            />
            <div v-if="existingFloorPlans.length || newFloorPlans.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div v-for="plan in existingFloorPlans" :key="plan" class="relative group rounded border border-comma-border-subtle p-2">
                <img v-if="isImagePath(plan)" :src="plan" class="w-full h-28 object-contain rounded bg-comma-neutral-50" />
                <div v-else class="flex h-28 items-center justify-center rounded bg-comma-neutral-50 text-sm font-medium text-comma-neutral-700">
                  Floor Plan
                </div>
                <button
                  type="button"
                  class="absolute top-1 right-1 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100"
                  @click="removeExistingFloorPlan(plan)"
                >
                  <AdminLocalIcon name="x-mark" class="w-4 h-4 text-red-600" />
                </button>
              </div>
              <div v-for="(file, idx) in newFloorPlans" :key="`floor-${idx}-${file.name}`" class="relative group rounded border border-comma-border-subtle p-2">
                <img v-if="file.type.startsWith('image/')" :src="getFilePreview(file)" class="w-full h-28 object-contain rounded bg-comma-neutral-50" />
                <div v-else class="flex h-28 items-center justify-center rounded bg-comma-neutral-50 text-sm font-medium text-comma-neutral-700">
                  {{ file.name }}
                </div>
                <button
                  type="button"
                  class="absolute top-1 right-1 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100"
                  @click="removeNewFloorPlan(idx)"
                >
                  <AdminLocalIcon name="x-mark" class="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <div class="flex justify-end gap-3">
        <UButton color="gray" variant="ghost" :to="localePath('/admin/properties')">
          {{ $t('admin_properties_page.cancel') }}
        </UButton>
        <UButton type="submit" color="primary" :loading="submitting">
          {{ mode === 'create' ? $t('admin_properties_page.create') : $t('admin_properties_page.update') }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { usePropertiesStore } from '~/store/properties'
import { useNotificationStore } from '~/store/notification'

const props = defineProps<{
  mode: 'create' | 'edit'
  propertyId?: string
}>()

const store = usePropertiesStore()
const notification = useNotificationStore()
const localePath = useLocalePath()
const router = useRouter()
const submitting = ref(false)

// Form state
const form = reactive({
  reference_number: '',
  offering_type: 'sale',
  title_en: '',
  title_ar: '',
  description_en: '',
  description_ar: '',
  community: '',
  sub_community: '',
  project_name: '',
  tower: '',
  unit_no: '',
  location_en: '',
  location_ar: '',
  year_built: '',
  bedrooms: 0,
  bathrooms: 0,
  size: 0,
  property_type: 'villa',
  original_price: 0,
  hot_deal: false,
  hot_deal_price: null as number | null,
  status: '',
  status_color: '#000000',
  featured: false,
})

// Dynamic fields
const features = ref<Array<{ key: string; value: string }>>([])
const amenities = ref<string[]>([])
const existingCoverImages = ref<string[]>([])
const existingGalleryImages = ref<string[]>([])
const existingFloorPlans = ref<string[]>([])
const newCoverImages = ref<File[]>([])
const newGalleryImages = ref<File[]>([])
const newFloorPlans = ref<File[]>([])
const imagesToDelete = ref<string[]>([])
const filePreviews = new WeakMap<File, string>()

const offeringTypeOptions = [
  { label: 'Sale', value: 'sale' },
  { label: 'Rent', value: 'rent' },
]

const propertyTypeOptions = [
  { label: 'Villa', value: 'villa' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Penthouse', value: 'penthouse' },
  { label: 'Townhouse', value: 'townhouse' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Studio', value: 'studio' },
  { label: 'Duplex', value: 'duplex' },
]

const statusOptions = [
  { label: 'For Sale', value: 'For Sale' },
  { label: 'For Rent', value: 'For Rent' },
  { label: 'Sold', value: 'Sold' },
  { label: 'Under Offer', value: 'Under Offer' },
]

onUnmounted(() => {
  newCoverImages.value.forEach(revokeFilePreview)
  newGalleryImages.value.forEach(revokeFilePreview)
  newFloorPlans.value.forEach(revokeFilePreview)
})

function readText(value: any): string {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number') return String(value)

  return ''
}

function readLocalized(raw: any, field: string, locale: 'en' | 'ar'): string {
  const value = raw?.[field]
  const localeKeys = locale === 'en'
    ? ['english', 'en', 'english_text']
    : ['arabic', 'ar', 'arabic_text']
  const suffixes = locale === 'en'
    ? ['english', 'en', 'en_US']
    : ['arabic', 'ar', 'ar_AE']

  for (const key of localeKeys) {
    const text = readText(value?.[key])
    if (text) return text
  }

  for (const suffix of suffixes) {
    const text = readText(raw?.[`${field}_${suffix}`])
    if (text) return text
  }

  return ''
}

function firstText(...values: any[]): string {
  for (const value of values) {
    const text = readText(value)
    if (text) return text
  }

  return ''
}

// Load existing data if edit mode
onMounted(async () => {
  if (props.mode === 'edit' && props.propertyId) {
    await store.fetchProperty(props.propertyId)
    if (store.property) {
      const p = store.property
      // Map to form
      form.reference_number = p.reference_number || ''
      form.offering_type = p.offering_type || 'sale'
      form.title_en = firstText(p.title_en, p.titleEnglish, readLocalized(p, 'title', 'en'), p.title)
      form.title_ar = firstText(p.title_ar, p.titleArabic, readLocalized(p, 'title', 'ar'))
      form.description_en = firstText(p.description_en, p.descriptionEnglish, readLocalized(p, 'description', 'en'), p.description)
      form.description_ar = firstText(p.description_ar, p.descriptionArabic, readLocalized(p, 'description', 'ar'))
      form.community = p.community || ''
      form.sub_community = p.sub_community || ''
      form.project_name = firstText(p.project_name, p.projectName)
      form.tower = p.tower || ''
      form.unit_no = p.unit_no || ''
      form.location_en = firstText(p.location_en, p.locationEnglish, readLocalized(p, 'location', 'en'), p.location)
      form.location_ar = firstText(p.location_ar, p.locationArabic, readLocalized(p, 'location', 'ar'))
      form.year_built = p.year_built || p.build_year || ''
      form.bedrooms = Number(p.bedrooms) || 0
      form.bathrooms = Number(p.bathrooms) || 0
      form.size = Number(p.size) || 0
      form.property_type = p.property_type || 'villa'
      form.original_price = Number(p.original_price) || 0
      form.hot_deal = p.hot_deal || false
      form.hot_deal_price = p.hot_deal_price ? Number(p.hot_deal_price) : null
      form.status = p.status || ''
      form.status_color = p.status_color || '#000000'
      form.featured = p.featured || false

      // Features: from API, might be null or object. We'll parse if needed.
      // Assuming features is an object like { feature1: 'value', feature2: 'value' }
      if (p.features && typeof p.features === 'object') {
        features.value = Object.entries(p.features).map(([key, value]) => ({ key, value: String(value) }))
      }

      // Amenities: array
      amenities.value = Array.isArray(p.amenities) ? p.amenities : []

      // Images
      existingCoverImages.value = Array.isArray(p.cover_image) ? p.cover_image : []
      existingGalleryImages.value = Array.isArray(p.property_photos) ? p.property_photos : []
      existingFloorPlans.value = Array.isArray(p.floor_plan) ? p.floor_plan : (p.floor_plan ? [p.floor_plan] : [])
    }
  }
})

// Features helpers
function addFeature() {
  features.value.push({ key: '', value: '' })
}
function removeFeature(index: number) {
  features.value.splice(index, 1)
}

// Amenities helpers
function addAmenity() {
  amenities.value.push('')
}
function removeAmenity(index: number) {
  amenities.value.splice(index, 1)
}

// Image handling
function getFilePreview(file: File) {
  const existing = filePreviews.get(file)
  if (existing) return existing

  const preview = URL.createObjectURL(file)
  filePreviews.set(file, preview)
  return preview
}

function handleCoverUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    newCoverImages.value.push(...Array.from(target.files))
    target.value = ''
  }
}

function handleGalleryUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    newGalleryImages.value.push(...Array.from(target.files))
    target.value = ''
  }
}

function handleFloorPlanUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    newFloorPlans.value.push(...Array.from(target.files))
    target.value = ''
  }
}

function removeNewCoverImage(index: number) {
  const [file] = newCoverImages.value.splice(index, 1)
  revokeFilePreview(file)
}

function removeNewGalleryImage(index: number) {
  const [file] = newGalleryImages.value.splice(index, 1)
  revokeFilePreview(file)
}

function removeNewFloorPlan(index: number) {
  const [file] = newFloorPlans.value.splice(index, 1)
  revokeFilePreview(file)
}

function removeExistingCoverImage(img: string) {
  existingCoverImages.value = existingCoverImages.value.filter(i => i !== img)
  imagesToDelete.value.push(img)
}

function removeExistingGalleryImage(img: string) {
  existingGalleryImages.value = existingGalleryImages.value.filter(i => i !== img)
  imagesToDelete.value.push(img)
}

function removeExistingFloorPlan(plan: string) {
  existingFloorPlans.value = existingFloorPlans.value.filter(i => i !== plan)
  imagesToDelete.value.push(plan)
}

function isImagePath(path: string) {
  return /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(path)
}

function revokeFilePreview(file?: File) {
  if (!file) return

  const preview = filePreviews.get(file)
  if (preview) {
    URL.revokeObjectURL(preview)
    filePreviews.delete(file)
  }
}

// Submit
async function handleSubmit() {
  submitting.value = true
  try {
    const formData = new FormData()

    const fieldMap: Record<string, string> = {
      title_en: 'title_english',
      title_ar: 'title_arabic',
      description_en: 'description_english',
      description_ar: 'description_arabic',
      location_en: 'location',
      location_ar: 'location_arabic',
      year_built: 'build_year',
      bedrooms: 'bedroom',
      bathrooms: 'bathroom',
      size: 'total_area_sqft',
      original_price: 'price',
      featured: 'show_on_website',
    }

    Object.entries(form).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return

      const backendKey = fieldMap[key] || key
      if (key === 'hot_deal' || key === 'featured') {
        formData.append(backendKey, value ? '1' : '0')
      } else {
        formData.append(backendKey, String(value))
      }
    })

    if (form.offering_type) {
      formData.set('sale_type', form.offering_type.toLowerCase() === 'rent' ? 'Rent' : 'Sale')
    }

    // Append features as separate fields: features[feature1] etc.
    features.value.forEach((feat, idx) => {
      if (feat.key && feat.value) {
        formData.append(`features[${feat.key}]`, feat.value)
      }
    })

    // Append amenities as array: amenities[]
    amenities.value.forEach((a, idx) => {
      if (a) {
        formData.append(`amenities[${idx}]`, a)
      }
    })

    // Append new cover images
    newCoverImages.value.forEach((file) => {
      formData.append('cover_image[]', file)
    })

    // Append new gallery images
    newGalleryImages.value.forEach((file) => {
      formData.append('property_photos[]', file)
    })

    // Append new floor plans separately from the public gallery
    newFloorPlans.value.forEach((file) => {
      formData.append('floor_plan[]', file)
    })

    // For edit mode, we need to handle deleted images by calling deleteImage API separately
    // (not part of this form submission). We'll do that after successful update.

    if (props.mode === 'create') {
      await store.createProperty(formData)
      notification.success('Created', 'Property created successfully')
      router.push(localePath('/admin/properties'))
    } else if (props.mode === 'edit' && props.propertyId) {
      await store.updateProperty(props.propertyId, formData)
      // Now delete images marked for deletion
      for (const img of imagesToDelete.value) {
        await store.deleteImage(props.propertyId, img)
      }
      notification.success('Updated', 'Property updated successfully')
      router.push(localePath(`/admin/properties/${props.propertyId}`))
    }
  } catch (err) {
    // Error already handled in store
  } finally {
    submitting.value = false
  }
}
</script>
