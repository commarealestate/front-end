<template>
    <div class="p-6 max-w-5xl mx-auto">
        <!-- Header -->
        <div class="flex items-center gap-4 mb-8">
            <NuxtLink to="/admin/projects" class="text-comma-primary hover:underline flex items-center gap-1">
                <Icon name="mdi:arrow-left" class="w-4 h-4" />
                {{ $t('admin.projects.back_to_list') }}
            </NuxtLink>
            <div class="h-6 w-px bg-comma-border-subtle"></div>
            <h1 class="text-2xl font-display font-bold">{{ $t('admin.projects.add_new') }}</h1>
        </div>

        <!-- Form Card -->
        <form @submit.prevent="submitForm" class="bg-white rounded-2xl shadow-luxury overflow-hidden">
            <!-- Hero Section Preview Hint -->
            <div
                class="bg-gradient-to-r from-comma-primary/5 to-comma-secondary/5 p-4 border-b border-comma-border-subtle">
                <div class="flex items-center gap-3">
                    <Icon name="mdi:information-outline" class="w-5 h-5 text-comma-primary" />
                    <p class="text-sm text-comma-neutral-700">
                        This information will appear in the <strong>hero section</strong> of the project page on the
                        website.
                    </p>
                </div>
            </div>

            <div class="p-6 space-y-8">
                <!-- Basic Info Section -->
                <section>
                    <div class="flex items-center gap-3 mb-5">
                        <div class="w-8 h-8 rounded-lg bg-comma-primary/10 flex items-center justify-center">
                            <Icon name="mdi:information" class="w-4 h-4 text-comma-primary" />
                        </div>
                        <h2 class="text-lg font-bold text-comma-neutral-900">{{ $t('admin.projects.basic_info') }}</h2>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-sm font-medium text-comma-neutral-800 mb-1">{{
                                $t('admin.projects.title_en') }} <span class="text-red-500">*</span></label>
                            <input v-model="form.title_en" type="text" required
                                class="w-full border border-comma-border-subtle rounded-xl px-4 py-2.5 focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 transition" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-comma-neutral-800 mb-1">{{
                                $t('admin.projects.title_ar') }} <span class="text-red-500">*</span></label>
                            <input v-model="form.title_ar" type="text" required
                                class="w-full border border-comma-border-subtle rounded-xl px-4 py-2.5 focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 transition" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-comma-neutral-800 mb-1">{{
                                $t('admin.projects.badge_en') }}</label>
                            <input v-model="form.badge_en" type="text" placeholder="e.g., Featured, New, Hot"
                                class="w-full border border-comma-border-subtle rounded-xl px-4 py-2.5 focus:border-comma-primary transition" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-comma-neutral-800 mb-1">{{
                                $t('admin.projects.badge_ar') }}</label>
                            <input v-model="form.badge_ar" type="text" placeholder="مميز، جديد"
                                class="w-full border border-comma-border-subtle rounded-xl px-4 py-2.5" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-comma-neutral-800 mb-1">Status</label>
                            <select v-model="form.status"
                                class="w-full border border-comma-border-subtle rounded-xl px-4 py-2.5 focus:border-comma-primary transition">
                                <option value="Published">Published</option>
                                <option value="Draft">Draft</option>
                            </select>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-comma-neutral-800 mb-2">{{
                                $t('admin.projects.description_en') }}</label>
                            <RichEditor
                                v-model="form.description_en"
                                placeholder="Brief description of the project..."
                            />
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-comma-neutral-800 mb-2">{{
                                $t('admin.projects.description_ar') }}</label>
                            <RichEditor
                                v-model="form.description_ar"
                                placeholder="وصف مختصر للمشروع..."
                            />
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-comma-neutral-800 mb-1">{{
                                $t('admin.projects.cover_image') }}</label>
                            <div class="border-2 border-dashed border-comma-border-subtle rounded-xl p-6 text-center hover:border-comma-primary transition cursor-pointer"
                                @click="triggerCoverUpload">
                                <input type="file" ref="coverInput" @change="handleCoverUpload" accept="image/*"
                                    class="hidden" />
                                <div v-if="coverPreview" class="mb-3">
                                    <img :src="coverPreview" class="w-32 h-32 object-cover rounded-lg mx-auto" />
                                </div>
                                <Icon name="mdi:cloud-upload" class="w-10 h-10 text-comma-neutral-400 mx-auto mb-2" />
                                <p class="text-sm text-comma-neutral-500">Click to upload cover image (recommended
                                    1200x800)</p>
                            </div>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-comma-neutral-800 mb-1">Project Gallery</label>
                            <div class="border-2 border-dashed border-comma-border-subtle rounded-xl p-6 hover:border-comma-primary transition">
                                <input
                                    type="file"
                                    ref="galleryInput"
                                    @change="handleGalleryUpload"
                                    accept="image/*"
                                    multiple
                                    class="hidden"
                                />
                                <div class="flex flex-col gap-4">
                                    <div v-if="galleryPreviews.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                        <div v-for="(preview, index) in galleryPreviews" :key="preview" class="relative aspect-square overflow-hidden rounded-lg bg-comma-surface-subtle">
                                            <img :src="preview" class="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                class="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                                                @click="removeGalleryImage(index)"
                                                aria-label="Remove gallery image"
                                            >
                                                <Icon name="mdi:close" class="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        class="inline-flex w-fit items-center gap-2 rounded-lg border border-comma-border-subtle px-4 py-2 text-sm font-medium text-comma-neutral-700 transition hover:border-comma-primary hover:text-comma-primary"
                                        @click="triggerGalleryUpload"
                                    >
                                        <Icon name="mdi:image-plus" class="h-5 w-5" />
                                        Add gallery images
                                    </button>
                                    <p class="text-sm text-comma-neutral-500">Upload up to 5 gallery images for the project landing page.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Form Actions -->
            <div class="bg-comma-surface-subtle px-6 py-4 border-t border-comma-border-subtle flex justify-end gap-3">
                <NuxtLink to="/admin/projects"
                    class="px-6 py-2.5 border border-comma-border-subtle rounded-xl hover:bg-white transition">
                    Cancel
                </NuxtLink>
                <button type="submit" :disabled="submitting"
                    class="px-6 py-2.5 bg-comma-primary text-white rounded-xl hover:bg-comma-primary-dark transition disabled:opacity-50 flex items-center gap-2">
                    <Icon v-if="submitting" name="mdi:loading" class="w-4 h-4 animate-spin" />
                    <Icon v-else name="mdi:check" class="w-4 h-4" />
                    {{ submitting ? $t('admin.projects.saving') : $t('admin.projects.save') }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import RichEditor from '~/components/admin/RichEditor.vue'
import { useProjectsStore } from '~/store/projects'


const store = useProjectsStore()
const submitting = ref(false)
const coverInput = ref<HTMLInputElement | null>(null)
const galleryInput = ref<HTMLInputElement | null>(null)
const coverPreview = ref('')
const galleryPreviews = ref<string[]>([])

const form = reactive({
    title_en: '',
    title_ar: '',
    badge_en: '',
    badge_ar: '',
    status: 'Published',
    description_en: '',
    description_ar: '',
    cover_image: null as File | null,
    gallery: [] as File[],
})

function triggerCoverUpload() {
    coverInput.value?.click()
}

function handleCoverUpload(e: Event) {
    const target = e.target as HTMLInputElement
    if (target.files?.length) {
        form.cover_image = target.files[0]
        coverPreview.value = URL.createObjectURL(target.files[0])
    }
}

function triggerGalleryUpload() {
    galleryInput.value?.click()
}

function handleGalleryUpload(e: Event) {
    const target = e.target as HTMLInputElement
    const files = Array.from(target.files || [])
    if (!files.length) return

    const remainingSlots = Math.max(0, 5 - form.gallery.length)
    const acceptedFiles = files.slice(0, remainingSlots)

    form.gallery.push(...acceptedFiles)
    galleryPreviews.value.push(...acceptedFiles.map((file) => URL.createObjectURL(file)))

    if (target) {
        target.value = ''
    }
}

function removeGalleryImage(index: number) {
    const [preview] = galleryPreviews.value.splice(index, 1)
    if (preview) {
        URL.revokeObjectURL(preview)
    }
    form.gallery.splice(index, 1)
}

async function submitForm() {
    if (!form.title_en || !form.title_ar) {
        // Show error using notification
        useNotificationStore().error('Error', 'Title in both languages is required')
        return
    }
    submitting.value = true
    try {
        const fd = new FormData()
        fd.append('title_en', form.title_en)
        fd.append('title_ar', form.title_ar)
        if (form.badge_en) fd.append('badge_en', form.badge_en)
        if (form.badge_ar) fd.append('badge_ar', form.badge_ar)
        fd.append('status', form.status)
        if (form.description_en) fd.append('description_en', form.description_en)
        if (form.description_ar) fd.append('description_ar', form.description_ar)
        if (form.cover_image) fd.append('cover_image', form.cover_image)
        form.gallery.forEach((file, index) => {
            fd.append(`gallery[${index}][image]`, file)
        })

        await store.createProject(fd)
        await navigateTo('/admin/projects')
    } catch (err) {
        console.error(err)
    } finally {
        submitting.value = false
    }
}
</script>
