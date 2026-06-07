<template>
    <div v-if="project" class="p-6 max-w-7xl mx-auto">
        <!-- Header (unchanged) -->
        <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
                <NuxtLink to="/admin/projects" class="text-comma-primary hover:underline flex items-center gap-1">
                    <Icon name="mdi:arrow-left" class="w-4 h-4" />
                    {{ $t('admin.projects.back_to_list') }}
                </NuxtLink>
                <div class="h-6 w-px bg-comma-border-subtle"></div>
                <h1 class="text-2xl font-display font-bold">{{ $t('admin.projects.edit_project') }}: {{ project.title_en
                    }}</h1>
            </div>
            <div class="flex gap-3">
                <button @click="openPreviewModal"
                    class="px-4 py-2 bg-comma-secondary/10 text-comma-secondary rounded-xl hover:bg-comma-secondary/20 transition flex items-center gap-2">
                    <Icon name="mdi:eye" class="w-4 h-4" />
                    Live Preview
                </button>
                <button @click="deleteProject"
                    class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
                    <Icon name="mdi:delete" class="w-4 h-4 inline mr-1" />
                    {{ $t('admin.projects.delete') }}
                </button>
            </div>
        </div>

        <!-- Tabs (same as before) -->
        <div class="border-b mb-6">
            <div class="flex gap-1 overflow-x-auto">
                <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" :class="[
                    'px-5 py-3 font-medium rounded-t-xl transition-all duration-200 flex items-center gap-2 whitespace-nowrap',
                    activeTab === tab.key
                        ? 'bg-white text-comma-primary border-b-2 border-comma-primary shadow-sm'
                        : 'text-comma-neutral-500 hover:text-comma-neutral-700 hover:bg-comma-surface-subtle'
                ]">
                    <Icon :name="tab.icon" class="w-5 h-5" />
                    {{ tab.label }}
                </button>
            </div>
        </div>

        <Transition name="fade" mode="out-in">
          <div>
               <!-- Basic Info Tab -->
                <div v-if="activeTab === 'basic'"
                    class="bg-white rounded-2xl shadow-card border border-comma-border-subtle overflow-hidden">
                    <div
                        class="bg-gradient-to-r from-comma-primary/5 to-transparent p-4 border-b border-comma-border-subtle">
                        <div class="flex items-center gap-2">
                            <Icon name="mdi:web" class="w-5 h-5 text-comma-primary" />
                            <span class="text-sm">This content appears as the hero section on the project page and as
                                the
                                card on the listing page.</span>
                        </div>
                    </div>
                    <form @submit.prevent="updateBasicInfo" class="p-6 space-y-5">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label class="block text-sm font-medium mb-1">{{ $t('admin.projects.title_en') }} <span
                                        class="text-red-500">*</span></label>
                                <input v-model="editForm.title_en" class="w-full border rounded-xl px-4 py-2.5" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">{{ $t('admin.projects.title_ar') }} <span
                                        class="text-red-500">*</span></label>
                                <input v-model="editForm.title_ar" class="w-full border rounded-xl px-4 py-2.5" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">{{ $t('admin.projects.badge_en')
                                    }}</label>
                                <input v-model="editForm.badge_en" class="w-full border rounded-xl px-4 py-2.5" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">{{ $t('admin.projects.badge_ar')
                                    }}</label>
                                <input v-model="editForm.badge_ar" class="w-full border rounded-xl px-4 py-2.5" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Status</label>
                                <select v-model="editForm.status" class="w-full border rounded-xl px-4 py-2.5">
                                    <option value="Published">Published</option>
                                    <option value="Draft">Draft</option>
                                </select>
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium mb-1">{{ $t('admin.projects.description_en')
                                    }}</label>
                                <textarea v-model="editForm.description_en" rows="3"
                                    class="w-full border rounded-xl px-4 py-2.5"></textarea>
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium mb-1">{{ $t('admin.projects.description_ar')
                                    }}</label>
                                <textarea v-model="editForm.description_ar" rows="3"
                                    class="w-full border rounded-xl px-4 py-2.5"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">{{ $t('admin.projects.current_cover')
                                    }}</label>
                                <div class="relative inline-block">
                                    <img v-if="project.cover_image?.[0]" :src="project.cover_image[0]"
                                        class="w-32 h-32 object-cover rounded-xl shadow" />
                                    <button v-if="!editForm.remove_cover" type="button"
                                        @click="editForm.remove_cover = true"
                                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                        <Icon name="mdi:close" class="w-3 h-3" />
                                    </button>
                                </div>
                                <div v-if="editForm.remove_cover" class="text-sm text-red-600 mt-1">Cover will be
                                    removed on
                                    save</div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">{{ $t('admin.projects.upload_new_cover')
                                    }}</label>
                                <div class="border-2 border-dashed border-comma-border-subtle rounded-xl p-3 text-center cursor-pointer hover:border-comma-primary"
                                    @click="triggerCoverUpload">
                                    <input type="file" ref="coverFileInput" @change="handleCoverUpload" accept="image/*"
                                        class="hidden" />
                                    <div v-if="coverPreview" class="mb-2">
                                        <img :src="coverPreview" class="w-24 h-24 object-cover rounded-lg mx-auto" />
                                    </div>
                                    <Icon name="mdi:cloud-upload" class="w-8 h-8 text-comma-neutral-400 mx-auto" />
                                    <p class="text-xs text-comma-neutral-500">Click to upload</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end pt-4 border-t">
                            <button type="submit" :disabled="saving"
                                class="px-6 py-2.5 bg-comma-primary text-white rounded-xl hover:bg-comma-primary-dark transition flex items-center gap-2">
                                <Icon v-if="saving" name="mdi:loading" class="w-4 h-4 animate-spin" />
                                <Icon v-else name="mdi:content-save" class="w-4 h-4" />
                                {{ saving ? $t('admin.projects.saving') : $t('admin.projects.save') }}
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Sections Tab -->
                <div v-if="activeTab === 'sections'" class="space-y-6">
                    <div class="flex justify-end">
                        <button @click="openSectionModal()"
                            class="bg-comma-primary text-white px-5 py-2.5 rounded-xl hover:bg-comma-primary-dark transition flex items-center gap-2 shadow-md">
                            <Icon name="mdi:plus" class="w-5 h-5" />
                            {{ $t('admin.projects.add_section') }}
                        </button>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div v-for="section in project.sections" :key="section.id"
                            class="bg-white rounded-2xl shadow-card border border-comma-border-subtle overflow-hidden group hover:shadow-luxury transition">
                            <div class="flex h-40">
                                <div class="w-2/5 bg-comma-neutral-100 overflow-hidden">
                                    <img :src="section.image"
                                        class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                </div>
                                <div class="w-3/5 p-4 flex flex-col">
                                    <h3 class="font-bold text-comma-neutral-900 line-clamp-1">{{ section.title_en }}
                                    </h3>
                                    <p class="text-sm text-comma-neutral-600 line-clamp-2 mt-1">{{
                                        section.description_en }}
                                    </p>
                                    <div class="flex gap-2 mt-auto pt-3">
                                        <button @click="openSectionModal(section)"
                                            class="text-blue-600 text-sm flex items-center gap-1 hover:underline">
                                            <Icon name="mdi:pencil" class="w-3.5 h-3.5" /> Edit
                                        </button>
                                        <button @click="deleteSection(section.id)"
                                            class="text-red-600 text-sm flex items-center gap-1 hover:underline">
                                            <Icon name="mdi:delete" class="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Gallery Tab -->
                <div v-if="activeTab === 'gallery'" class="space-y-6">
                    <div class="bg-white rounded-2xl p-6 shadow-card">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-semibold text-comma-neutral-800">Project Gallery</h3>
                            <button @click="openGalleryModal()"
                                class="bg-comma-primary text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                                <Icon name="mdi:plus" class="w-4 h-4" />
                                Add Image
                            </button>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            <div v-for="img in project.gallery" :key="img.id"
                                class="relative group aspect-square rounded-xl overflow-hidden shadow-sm">
                                <img :src="img.image" class="w-full h-full object-cover" />
                                <div
                                    class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <button @click="deleteGalleryImage(img.id)"
                                        class="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                                        <Icon name="mdi:trash-can" class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p v-if="!project.gallery.length" class="text-center text-comma-neutral-500 py-8">No images in
                            gallery. Click "Add Image" to upload.</p>
                    </div>
                </div>

                <!-- Details Tab -->
                <div v-if="activeTab === 'details'" class="space-y-6">
                    <div class="flex justify-end">
                        <button @click="openDetailModal()"
                            class="bg-comma-primary text-white px-5 py-2.5 rounded-xl hover:bg-comma-primary-dark transition flex items-center gap-2">
                            <Icon name="mdi:plus" class="w-5 h-5" />
                            {{ $t('admin.projects.add_detail') }}
                        </button>
                    </div>
                    <div class="space-y-5">
                        <div v-for="detail in project.details" :key="detail.details_id"
                            class="bg-white rounded-2xl shadow-card border border-comma-border-subtle overflow-hidden">
                            <div class="p-5 border-b border-comma-border-subtle bg-comma-surface-subtle">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <div class="flex items-center gap-2 mb-1">
                                            <div :class="[
                                                'w-6 h-6 rounded-full flex items-center justify-center',
                                                detail.type === 'location' ? 'bg-blue-100 text-blue-600' : detail.type === 'services' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                                            ]">
                                                <Icon
                                                    :name="detail.type === 'location' ? 'mdi:map-marker' : detail.type === 'services' ? 'mdi:tools' : 'mdi:pool'"
                                                    class="w-3.5 h-3.5" />
                                            </div>
                                            <h3 class="font-bold text-comma-neutral-900">{{ detail.title_en }}</h3>
                                            <span class="text-xs text-comma-neutral-500">({{ detail.type }})</span>
                                        </div>
                                        <p class="text-sm text-comma-neutral-600">{{ detail.description_en }}</p>
                                    </div>
                                    <div class="flex gap-2">
                                        <button @click="openDetailModal(detail)"
                                            class="text-blue-600 text-sm px-2 py-1 rounded hover:bg-blue-50">Edit</button>
                                        <button @click="deleteDetail(detail.details_id)"
                                            class="text-red-600 text-sm px-2 py-1 rounded hover:bg-red-50">Delete</button>
                                    </div>
                                </div>
                            </div>
                            <div class="p-5">
                                <div class="flex justify-between items-center mb-3">
                                    <h4 class="font-semibold text-sm text-comma-neutral-700 flex items-center gap-1">
                                        <Icon name="mdi:format-list-bulleted" class="w-4 h-4" />
                                        {{ $t('admin.projects.detail_items') }}
                                    </h4>
                                    <button @click="openItemModal(detail)"
                                        class="text-green-600 text-sm flex items-center gap-1 hover:underline">
                                        <Icon name="mdi:plus-circle" class="w-4 h-4" /> Add Item
                                    </button>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div v-for="item in detail.items" :key="item.item_id"
                                        class="flex justify-between items-center bg-comma-neutral-50 rounded-lg px-3 py-2">
                                        <div class="flex-1">
                                            <span class="text-sm font-medium">{{ item.item_en }}</span>
                                            <span class="text-xs text-comma-neutral-500 block">{{ item.item_ar }}</span>
                                        </div>
                                        <div class="flex gap-1">
                                            <button @click="openItemModal(detail, item)"
                                                class="text-blue-600 p-1 rounded hover:bg-blue-100">
                                                <Icon name="mdi:pencil" class="w-3.5 h-3.5" />
                                            </button>
                                            <button @click="deleteDetailItem(item.item_id)"
                                                class="text-red-600 p-1 rounded hover:bg-red-100">
                                                <Icon name="mdi:close" class="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <p v-if="!detail.items.length" class="text-center text-comma-neutral-400 text-sm py-3">
                                    No
                                    items added yet.</p>
                            </div>
                        </div>
                    </div>
                </div>

          </div>
        </Transition>

        <!-- Premium Modals (same as before, but with adjusted save logic) -->
        <!-- Section Modal -->
        <div v-if="sectionModalOpen"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            @click.self="sectionModalOpen = false">
            <div
                class="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-5 pb-3 border-b">
                    <h3 class="text-xl font-bold">{{ editingSection ? 'Edit Section' : 'Add Section' }}</h3>
                    <button @click="sectionModalOpen = false" class="p-2 rounded-full hover:bg-comma-surface-subtle">
                        <Icon name="mdi:close" class="w-5 h-5" />
                    </button>
                </div>
                <div class="space-y-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium">Title (English)</label>
                            <input v-model="sectionForm.title_en" class="w-full border rounded-xl px-4 py-2.5 mt-1" />
                        </div>
                        <div>
                            <label class="text-sm font-medium">Title (Arabic)</label>
                            <input v-model="sectionForm.title_ar" class="w-full border rounded-xl px-4 py-2.5 mt-1" />
                        </div>
                    </div>
                    <div>
                        <label class="text-sm font-medium">Description (English)</label>
                        <textarea v-model="sectionForm.description_en" rows="3"
                            class="w-full border rounded-xl px-4 py-2.5 mt-1"></textarea>
                    </div>
                    <div>
                        <label class="text-sm font-medium">Description (Arabic)</label>
                        <textarea v-model="sectionForm.description_ar" rows="3"
                            class="w-full border rounded-xl px-4 py-2.5 mt-1"></textarea>
                    </div>
                    <div>
                        <label class="text-sm font-medium">Image</label>
                        <div class="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-comma-primary transition mt-1"
                            @click="triggerSectionImageUpload">
                            <input type="file" ref="sectionImageInput" @change="handleSectionImage" accept="image/*"
                                class="hidden" />
                            <div v-if="sectionForm.image_preview" class="mb-3">
                                <img :src="sectionForm.image_preview"
                                    class="w-32 h-32 object-cover rounded-lg mx-auto" />
                            </div>
                            <Icon name="mdi:image" class="w-10 h-10 text-comma-neutral-400 mx-auto" />
                            <p class="text-sm text-comma-neutral-500">{{ editingSection && !sectionForm.image ? 'Keep current or click to change' : 'Click to upload' }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end gap-3 mt-6 pt-3 border-t">
                    <button @click="sectionModalOpen = false"
                        class="px-5 py-2.5 border rounded-xl hover:bg-comma-surface-subtle">Cancel</button>
                    <button @click="saveSection" :disabled="savingSection"
                        class="px-5 py-2.5 bg-comma-primary text-white rounded-xl hover:bg-comma-primary-dark flex items-center gap-2">
                        <Icon v-if="savingSection" name="mdi:loading" class="w-4 h-4 animate-spin" />
                        <Icon v-else name="mdi:content-save" class="w-4 h-4" />
                        {{ savingSection ? 'Saving...' : 'Save' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Gallery Modal -->
        <div v-if="galleryModalOpen"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            @click.self="galleryModalOpen = false">
            <div class="bg-white rounded-2xl p-6 w-full max-w-md">
                <h3 class="text-xl font-bold mb-4">Add Gallery Image</h3>
                <div class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-comma-primary transition"
                    @click="triggerGalleryUpload">
                    <input type="file" ref="galleryImageInput" @change="handleGalleryImage" accept="image/*"
                        class="hidden" />
                    <div v-if="galleryImagePreview" class="mb-3">
                        <img :src="galleryImagePreview" class="w-32 h-32 object-cover rounded-lg mx-auto" />
                    </div>
                    <Icon name="mdi:cloud-upload" class="w-12 h-12 text-comma-neutral-400 mx-auto" />
                    <p class="text-sm text-comma-neutral-500">Click to select image</p>
                </div>
                <div class="flex justify-end gap-3 mt-6">
                    <button @click="galleryModalOpen = false" class="px-5 py-2.5 border rounded-xl">Cancel</button>
                    <button @click="addGalleryImage" :disabled="savingGallery"
                        class="px-5 py-2.5 bg-comma-primary text-white rounded-xl flex items-center gap-2">
                        <Icon v-if="savingGallery" name="mdi:loading" class="w-4 h-4 animate-spin" />
                        <Icon v-else name="mdi:upload" class="w-4 h-4" />
                        {{ savingGallery ? 'Uploading...' : 'Upload' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Detail Modal -->
        <div v-if="detailModalOpen"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            @click.self="detailModalOpen = false">
            <div class="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div class="flex justify-between items-center mb-5 pb-3 border-b sticky top-0 bg-white">
                    <h3 class="text-xl font-bold">{{ editingDetail ? 'Edit Detail Block' : 'Add Detail Block' }}</h3>
                    <button @click="detailModalOpen = false" class="p-2 rounded-full hover:bg-comma-surface-subtle">
                        <Icon name="mdi:close" class="w-5 h-5" />
                    </button>
                </div>
                <div class="space-y-5">
                    <div>
                        <label class="text-sm font-medium">Type</label>
                        <select v-model="detailForm.type" class="w-full border rounded-xl px-4 py-2.5 mt-1">
                            <option value="location">Location</option>
                            <option value="services">Services</option>
                            <option value="facilities">Facilities</option>
                        </select>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium">Title (English)</label>
                            <input v-model="detailForm.title_en" class="w-full border rounded-xl px-4 py-2.5 mt-1" />
                        </div>
                        <div>
                            <label class="text-sm font-medium">Title (Arabic)</label>
                            <input v-model="detailForm.title_ar" class="w-full border rounded-xl px-4 py-2.5 mt-1" />
                        </div>
                    </div>
                    <div>
                        <label class="text-sm font-medium">Description (English)</label>
                        <textarea v-model="detailForm.description_en" rows="3"
                            class="w-full border rounded-xl px-4 py-2.5 mt-1"></textarea>
                    </div>
                    <div>
                        <label class="text-sm font-medium">Description (Arabic)</label>
                        <textarea v-model="detailForm.description_ar" rows="3"
                            class="w-full border rounded-xl px-4 py-2.5 mt-1"></textarea>
                    </div>
                    <div>
                        <label class="text-sm font-medium">Image</label>
                        <div class="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-comma-primary transition mt-1"
                            @click="triggerDetailImageUpload">
                            <input type="file" ref="detailImageInput" @change="handleDetailImage" accept="image/*"
                                class="hidden" />
                            <div v-if="detailForm.image_preview" class="mb-3">
                                <img :src="detailForm.image_preview"
                                    class="w-32 h-32 object-cover rounded-lg mx-auto" />
                            </div>
                            <Icon name="mdi:image" class="w-10 h-10 text-comma-neutral-400 mx-auto" />
                            <p class="text-sm text-comma-neutral-500">{{ editingDetail && !detailForm.image ? 'Keep current or click to change' : 'Click to upload' }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end gap-3 mt-6 pt-3 border-t">
                    <button @click="detailModalOpen = false" class="px-5 py-2.5 border rounded-xl">Cancel</button>
                    <button @click="saveDetail" :disabled="savingDetail"
                        class="px-5 py-2.5 bg-comma-primary text-white rounded-xl flex items-center gap-2">
                        <Icon v-if="savingDetail" name="mdi:loading" class="w-4 h-4 animate-spin" />
                        <Icon v-else name="mdi:content-save" class="w-4 h-4" />
                        {{ savingDetail ? 'Saving...' : 'Save' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Item Modal -->
        <div v-if="itemModalOpen"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            @click.self="itemModalOpen = false">
            <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">{{ editingItem ? 'Edit Item' : 'Add Item' }}</h3>
                    <button @click="itemModalOpen = false" class="p-2 rounded-full hover:bg-comma-surface-subtle">
                        <Icon name="mdi:close" class="w-5 h-5" />
                    </button>
                </div>
                <div class="space-y-4">
                    <div>
                        <label class="text-sm font-medium">Item (English)</label>
                        <input v-model="itemForm.item_en" class="w-full border rounded-xl px-4 py-2.5 mt-1" />
                    </div>
                    <div>
                        <label class="text-sm font-medium">Item (Arabic)</label>
                        <input v-model="itemForm.item_ar" class="w-full border rounded-xl px-4 py-2.5 mt-1" />
                    </div>
                </div>
                <div class="flex justify-end gap-3 mt-6">
                    <button @click="itemModalOpen = false" class="px-5 py-2.5 border rounded-xl">Cancel</button>
                    <button @click="saveDetailItem" :disabled="savingItem"
                        class="px-5 py-2.5 bg-comma-primary text-white rounded-xl flex items-center gap-2">
                        <Icon v-if="savingItem" name="mdi:loading" class="w-4 h-4 animate-spin" />
                        <Icon v-else name="mdi:content-save" class="w-4 h-4" />
                        {{ savingItem ? 'Saving...' : 'Save' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Live Preview Modal (same as before, kept for reference) -->
        <div v-if="previewModalOpen"
            class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            @click.self="previewModalOpen = false">
            <div class="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div class="sticky top-0 bg-white border-b p-5 flex justify-between items-center">
                    <h3 class="text-xl font-bold">Project Preview (Website View)</h3>
                    <button @click="previewModalOpen = false" class="p-2 rounded-full hover:bg-comma-surface-subtle">
                        <Icon name="mdi:close" class="w-6 h-6" />
                    </button>
                </div>
                <div class="p-6 bg-comma-neutral-50">
                    <div class="max-w-4xl mx-auto">
                        <!-- Hero Section -->
                        <div class="relative h-96 rounded-2xl overflow-hidden shadow-xl mb-8">
                            <img v-if="project.cover_image?.[0]" :src="project.cover_image[0]"
                                class="w-full h-full object-cover" />
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
                                <div v-if="project.badge_en"
                                    class="inline-block w-fit px-3 py-1 bg-comma-primary text-white text-sm font-semibold rounded-full mb-3">
                                    {{ project.badge_en }}
                                </div>
                                <h1 class="text-4xl font-bold text-white font-display">{{ project.title_en }}</h1>
                                <p class="text-white/80 text-lg mt-2 max-w-2xl">{{ project.description_en }}</p>
                            </div>
                        </div>
                        <!-- Sections -->
                        <div v-if="project.sections.length" class="mb-10">
                            <h2 class="text-2xl font-bold mb-6 font-display">Sections</h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div v-for="section in project.sections"
                                    class="bg-white rounded-xl shadow-md overflow-hidden">
                                    <img :src="section.image" class="h-56 w-full object-cover" />
                                    <div class="p-5">
                                        <h3 class="text-xl font-bold mb-2">{{ section.title_en }}</h3>
                                        <p class="text-comma-neutral-600">{{ section.description_en }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Gallery -->
                        <div v-if="project.gallery.length" class="mb-10">
                            <h2 class="text-2xl font-bold mb-6 font-display">Gallery</h2>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <img v-for="img in project.gallery" :key="img.id" :src="img.image"
                                    class="h-40 w-full object-cover rounded-xl shadow" />
                            </div>
                        </div>
                        <!-- Details -->
                        <div v-for="detail in project.details" :key="detail.details_id"
                            class="mb-8 bg-white rounded-xl shadow-md p-6">
                            <div class="flex items-center gap-3 mb-4">
                                <div :class="[
                                    'w-10 h-10 rounded-full flex items-center justify-center',
                                    detail.type === 'location' ? 'bg-blue-100 text-blue-600' : detail.type === 'services' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                                ]">
                                    <Icon
                                        :name="detail.type === 'location' ? 'mdi:map-marker' : detail.type === 'services' ? 'mdi:tools' : 'mdi:pool'"
                                        class="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold">{{ detail.title_en }}</h3>
                                    <p class="text-comma-neutral-600">{{ detail.description_en }}</p>
                                </div>
                            </div>
                            <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                                <li v-for="item in detail.items" :key="item.item_id" class="flex items-center gap-2">
                                    <Icon name="mdi:check-circle" class="w-5 h-5 text-comma-primary" />
                                    <span>{{ item.item_en }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="loading" class="p-6 text-center py-20">
        <div
            class="w-12 h-12 border-4 border-comma-primary/20 rounded-full animate-spin border-t-comma-primary mx-auto">
        </div>
    </div>
</template>

<script setup lang="ts">
import { useProjectsStore } from '~/store/projects'
import type { Project, ProjectSection, ProjectDetail, ProjectDetailItem } from '~/types/project'
import { useNotificationStore } from '~/store/notification'



const route = useRoute()
const store = useProjectsStore()
const notification = useNotificationStore()
const project = ref<Project | null>(null)
const loading = ref(true)
const saving = ref(false)
const activeTab = ref('basic')
const previewModalOpen = ref(false)

const tabs = [
    { key: 'basic', label: 'Basic Info', icon: 'mdi:information' },
    { key: 'sections', label: 'Sections', icon: 'mdi:view-dashboard' },
    { key: 'gallery', label: 'Gallery', icon: 'mdi:image-multiple' },
    { key: 'details', label: 'Details', icon: 'mdi:format-list-bulleted-type' }
]

// Basic edit form
const editForm = reactive({
    title_en: '',
    title_ar: '',
    badge_en: '',
    badge_ar: '',
    status: 'Published',
    description_en: '',
    description_ar: '',
    remove_cover: false,
    new_cover: null as File | null,
})
const coverFileInput = ref<HTMLInputElement | null>(null)
const coverPreview = ref('')

// Section modal
const sectionModalOpen = ref(false)
const editingSection = ref<ProjectSection | null>(null)
const sectionForm = reactive({
    id: null as number | null,
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    image: null as File | null,
    image_preview: ''
})
const sectionImageInput = ref<HTMLInputElement | null>(null)
const savingSection = ref(false)

// Gallery modal
const galleryModalOpen = ref(false)
const galleryImage = ref<File | null>(null)
const galleryImagePreview = ref('')
const galleryImageInput = ref<HTMLInputElement | null>(null)
const savingGallery = ref(false)

// Detail modal
const detailModalOpen = ref(false)
const editingDetail = ref<ProjectDetail | null>(null)
const detailForm = reactive({
    id: null as number | null,
    type: 'location' as 'location' | 'services' | 'facilities',
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    image: null as File | null,
    image_preview: ''
})
const detailImageInput = ref<HTMLInputElement | null>(null)
const savingDetail = ref(false)

// Item modal
const itemModalOpen = ref(false)
const editingItem = ref<ProjectDetailItem | null>(null)
const currentDetail = ref<ProjectDetail | null>(null)
const itemForm = reactive({
    id: null as number | null,
    item_en: '',
    item_ar: ''
})
const savingItem = ref(false)

async function loadProject() {
    const id = route.params.id as string
    await store.fetchProjectById(id)
    project.value = store.currentProject
    if (project.value) {
        editForm.title_en = project.value.title_en
        editForm.title_ar = project.value.title_ar
        editForm.badge_en = project.value.badge_en
        editForm.badge_ar = project.value.badge_ar
        editForm.status = String(project.value.status || 'Published')
        editForm.description_en = project.value.description_en
        editForm.description_ar = project.value.description_ar
    }
    loading.value = false
}

// ------------------------------------------------------------------
// Basic Info Update (only basic fields)
// ------------------------------------------------------------------
async function updateBasicInfo() {
    saving.value = true
    try {
        const fd = new FormData()
        fd.append('_method', 'patch')
        fd.append('title_en', editForm.title_en)
        fd.append('title_ar', editForm.title_ar)
        if (editForm.badge_en) fd.append('badge_en', editForm.badge_en)
        if (editForm.badge_ar) fd.append('badge_ar', editForm.badge_ar)
        fd.append('status', editForm.status)
        if (editForm.description_en) fd.append('description_en', editForm.description_en)
        if (editForm.description_ar) fd.append('description_ar', editForm.description_ar)
        if (editForm.remove_cover) fd.append('remove_cover_image', '1')
        if (editForm.new_cover) fd.append('cover_image', editForm.new_cover)

        await store.updateProject(project.value!.project_id, fd)
        await loadProject()
        notification.success('Success', 'Project updated successfully')
    } catch (err) { console.error(err) } finally { saving.value = false }
}

function triggerCoverUpload() { coverFileInput.value?.click() }
function handleCoverUpload(e: Event) {
    const target = e.target as HTMLInputElement
    if (target.files?.length) {
        editForm.new_cover = target.files[0]
        coverPreview.value = URL.createObjectURL(target.files[0])
    }
}

function openPreviewModal() { previewModalOpen.value = true }

// ------------------------------------------------------------------
// Section Handlers (send entire sections array for consistency)
// ------------------------------------------------------------------
function openSectionModal(section?: ProjectSection) {
    if (section) {
        editingSection.value = section
        sectionForm.id = section.id
        sectionForm.title_en = section.title_en
        sectionForm.title_ar = section.title_ar
        sectionForm.description_en = section.description_en
        sectionForm.description_ar = section.description_ar
        sectionForm.image = null
        sectionForm.image_preview = section.image
    } else {
        editingSection.value = null
        sectionForm.id = null
        sectionForm.title_en = ''
        sectionForm.title_ar = ''
        sectionForm.description_en = ''
        sectionForm.description_ar = ''
        sectionForm.image = null
        sectionForm.image_preview = ''
    }
    sectionModalOpen.value = true
}
function triggerSectionImageUpload() { sectionImageInput.value?.click() }
function handleSectionImage(e: Event) {
    const target = e.target as HTMLInputElement
    if (target.files?.length) {
        sectionForm.image = target.files[0]
        sectionForm.image_preview = URL.createObjectURL(target.files[0])
    }
}
async function saveSection() {
    savingSection.value = true
    try {
        // Build updated sections array
        const updatedSections = [...project.value!.sections]
        if (editingSection.value) {
            // Update existing section
            const index = updatedSections.findIndex(s => s.id === sectionForm.id)
            if (index !== -1) {
                updatedSections[index] = {
                    ...updatedSections[index],
                    title_en: sectionForm.title_en,
                    title_ar: sectionForm.title_ar,
                    description_en: sectionForm.description_en,
                    description_ar: sectionForm.description_ar,
                    image: sectionForm.image_preview || updatedSections[index].image
                }
            }
        } else {
            // Add new section (without id - backend will generate)
            updatedSections.push({
                title: sectionForm.title_en,
                title_ar: sectionForm.title_ar,
                title_en: sectionForm.title_en,
                description: sectionForm.description_en,
                description_ar: sectionForm.description_ar,
                description_en: sectionForm.description_en,
                image: sectionForm.image_preview || '',
            } as any)
        }

        // Send only sections update (plus basic fields to avoid overwriting)
        const fd = new FormData()
        fd.append('_method', 'patch')
        // Keep basic fields as they are
        fd.append('title_en', editForm.title_en)
        fd.append('title_ar', editForm.title_ar)
        fd.append('badge_en', editForm.badge_en)
        fd.append('badge_ar', editForm.badge_ar)
        fd.append('description_en', editForm.description_en)
        fd.append('description_ar', editForm.description_ar)
        // Send updated sections array
        updatedSections.forEach((section, idx) => {
            if (section.id) fd.append(`sections[${idx}][id]`, String(section.id))
            fd.append(`sections[${idx}][title_en]`, section.title_en)
            fd.append(`sections[${idx}][title_ar]`, section.title_ar)
            fd.append(`sections[${idx}][description_en]`, section.description_en || '')
            fd.append(`sections[${idx}][description_ar]`, section.description_ar || '')
            if (sectionForm.image && editingSection.value?.id === section.id) {
                fd.append(`sections[${idx}][image]`, sectionForm.image)
            }
        })
        await store.updateProject(project.value!.project_id, fd)
        await loadProject()
        notification.success('Success', editingSection.value ? 'Section updated' : 'Section added')
        sectionModalOpen.value = false
    } catch (err) { console.error(err) } finally { savingSection.value = false }
}
async function deleteSection(id: number) {
    if (confirm('Delete this section?')) {
        await store.deleteSection(id)
        await loadProject()
    }
}

// ------------------------------------------------------------------
// Gallery Handlers (send only new gallery image)
// ------------------------------------------------------------------
function openGalleryModal() {
    galleryModalOpen.value = true
    galleryImage.value = null
    galleryImagePreview.value = ''
}
function triggerGalleryUpload() { galleryImageInput.value?.click() }
function handleGalleryImage(e: Event) {
    const target = e.target as HTMLInputElement
    if (target.files?.length) {
        galleryImage.value = target.files[0]
        galleryImagePreview.value = URL.createObjectURL(target.files[0])
    }
}
async function addGalleryImage() {
    if (!galleryImage.value) return
    savingGallery.value = true
    try {
        const fd = new FormData()
        fd.append('_method', 'patch')
        // We only send the new gallery image, using the next index
        const nextIndex = project.value!.gallery.length
        fd.append(`gallery[${nextIndex}][image]`, galleryImage.value)
        await store.updateProject(project.value!.project_id, fd)
        await loadProject()
        notification.success('Success', 'Gallery image added')
        galleryModalOpen.value = false
    } catch (err) { console.error(err) } finally { savingGallery.value = false }
}
async function deleteGalleryImage(id: number) {
    if (confirm('Delete this image?')) {
        await store.deleteGalleryImage(id)
        await loadProject()
    }
}

// ------------------------------------------------------------------
// Detail Handlers (send entire details array)
// ------------------------------------------------------------------
function openDetailModal(detail?: ProjectDetail) {
    if (detail) {
        editingDetail.value = detail
        detailForm.id = detail.details_id
        detailForm.type = detail.type
        detailForm.title_en = detail.title_en
        detailForm.title_ar = detail.title_ar
        detailForm.description_en = detail.description_en
        detailForm.description_ar = detail.description_ar
        detailForm.image = null
        detailForm.image_preview = detail.image
    } else {
        editingDetail.value = null
        detailForm.id = null
        detailForm.type = 'location'
        detailForm.title_en = ''
        detailForm.title_ar = ''
        detailForm.description_en = ''
        detailForm.description_ar = ''
        detailForm.image = null
        detailForm.image_preview = ''
    }
    detailModalOpen.value = true
}
function triggerDetailImageUpload() { detailImageInput.value?.click() }
function handleDetailImage(e: Event) {
    const target = e.target as HTMLInputElement
    if (target.files?.length) {
        detailForm.image = target.files[0]
        detailForm.image_preview = URL.createObjectURL(target.files[0])
    }
}
async function saveDetail() {
    savingDetail.value = true
    try {
        const updatedDetails = [...project.value!.details]
        if (editingDetail.value) {
            const index = updatedDetails.findIndex(d => d.details_id === detailForm.id)
            if (index !== -1) {
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    type: detailForm.type,
                    title_en: detailForm.title_en,
                    title_ar: detailForm.title_ar,
                    description_en: detailForm.description_en,
                    description_ar: detailForm.description_ar,
                    image: detailForm.image_preview || updatedDetails[index].image
                }
            }
        } else {
            // New detail (without id)
            updatedDetails.push({
                type: detailForm.type,
                title_en: detailForm.title_en,
                title_ar: detailForm.title_ar,
                description_en: detailForm.description_en,
                description_ar: detailForm.description_ar,
                image: detailForm.image_preview || '',
                items: []
            } as any)
        }

        const fd = new FormData()
        fd.append('_method', 'patch')
        // Include basic fields
        fd.append('title_en', editForm.title_en)
        fd.append('title_ar', editForm.title_ar)
        fd.append('badge_en', editForm.badge_en)
        fd.append('badge_ar', editForm.badge_ar)
        fd.append('description_en', editForm.description_en)
        fd.append('description_ar', editForm.description_ar)
        // Send updated details array
        updatedDetails.forEach((detail, idx) => {
            if (detail.details_id) fd.append(`details[${idx}][id]`, String(detail.details_id))
            fd.append(`details[${idx}][type]`, detail.type)
            fd.append(`details[${idx}][title_en]`, detail.title_en)
            fd.append(`details[${idx}][title_ar]`, detail.title_ar)
            fd.append(`details[${idx}][description_en]`, detail.description_en || '')
            fd.append(`details[${idx}][description_ar]`, detail.description_ar || '')
            if (detailForm.image && editingDetail.value?.details_id === detail.details_id) {
                fd.append(`details[${idx}][image]`, detailForm.image)
            }
            // Items are kept as they are (no need to resend if unchanged)
            detail.items.forEach((item, itemIdx) => {
                fd.append(`details[${idx}][items][${itemIdx}][id]`, String(item.item_id))
                fd.append(`details[${idx}][items][${itemIdx}][item_en]`, item.item_en)
                fd.append(`details[${idx}][items][${itemIdx}][item_ar]`, item.item_ar)
            })
        })
        await store.updateProject(project.value!.project_id, fd)
        await loadProject()
        notification.success('Success', editingDetail.value ? 'Detail updated' : 'Detail added')
        detailModalOpen.value = false
    } catch (err) { console.error(err) } finally { savingDetail.value = false }
}
async function deleteDetail(id: number) {
    if (confirm('Delete this detail block?')) {
        await store.deleteDetail(id)
        await loadProject()
    }
}

// ------------------------------------------------------------------
// Item Handlers (modify details array and send full details)
// ------------------------------------------------------------------
function openItemModal(detail: ProjectDetail, item?: ProjectDetailItem) {
    currentDetail.value = detail
    if (item) {
        editingItem.value = item
        itemForm.id = item.item_id
        itemForm.item_en = item.item_en
        itemForm.item_ar = item.item_ar
    } else {
        editingItem.value = null
        itemForm.id = null
        itemForm.item_en = ''
        itemForm.item_ar = ''
    }
    itemModalOpen.value = true
}
async function saveDetailItem() {
    savingItem.value = true
    try {
        const updatedDetails = [...project.value!.details]
        const detailIndex = updatedDetails.findIndex(d => d.details_id === currentDetail.value!.details_id)
        if (detailIndex !== -1) {
            if (editingItem.value) {
                const itemIndex = updatedDetails[detailIndex].items.findIndex(i => i.item_id === itemForm.id)
                if (itemIndex !== -1) {
                    updatedDetails[detailIndex].items[itemIndex] = {
                        ...updatedDetails[detailIndex].items[itemIndex],
                        item_en: itemForm.item_en,
                        item_ar: itemForm.item_ar
                    }
                }
            } else {
                // New item (without id)
                updatedDetails[detailIndex].items.push({
                    item_en: itemForm.item_en,
                    item_ar: itemForm.item_ar
                } as any)
            }
        }
        // Send updated details
        const fd = new FormData()
        fd.append('_method', 'patch')
        fd.append('title_en', editForm.title_en)
        fd.append('title_ar', editForm.title_ar)
        fd.append('badge_en', editForm.badge_en)
        fd.append('badge_ar', editForm.badge_ar)
        fd.append('description_en', editForm.description_en)
        fd.append('description_ar', editForm.description_ar)
        updatedDetails.forEach((detail, idx) => {
            if (detail.details_id) fd.append(`details[${idx}][id]`, String(detail.details_id))
            fd.append(`details[${idx}][type]`, detail.type)
            fd.append(`details[${idx}][title_en]`, detail.title_en)
            fd.append(`details[${idx}][title_ar]`, detail.title_ar)
            fd.append(`details[${idx}][description_en]`, detail.description_en || '')
            fd.append(`details[${idx}][description_ar]`, detail.description_ar || '')
            detail.items.forEach((item, itemIdx) => {
                if (item.item_id) fd.append(`details[${idx}][items][${itemIdx}][id]`, String(item.item_id))
                fd.append(`details[${idx}][items][${itemIdx}][item_en]`, item.item_en)
                fd.append(`details[${idx}][items][${itemIdx}][item_ar]`, item.item_ar)
            })
        })
        await store.updateProject(project.value!.project_id, fd)
        await loadProject()
        notification.success('Success', editingItem.value ? 'Item updated' : 'Item added')
        itemModalOpen.value = false
    } catch (err) { console.error(err) } finally { savingItem.value = false }
}
async function deleteDetailItem(id: number) {
    if (confirm('Delete this item?')) {
        await store.deleteDetailItem(id)
        await loadProject()
    }
}

async function deleteProject() {
    if (confirm('Delete entire project? This will permanently remove all sections, gallery, and details.')) {
        await store.deleteProject(project.value!.project_id)
        await navigateTo('/admin/projects')
    }
}

onMounted(() => {
    loadProject()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
