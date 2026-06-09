<template>
    <div class="p-6 bg-comma-surface-subtle min-h-screen">
        <!-- Header with gradient -->
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-display font-bold text-comma-neutral-900">{{ $t('admin.projects.title') }}</h1>
                <p class="text-comma-neutral-600 mt-1">Manage your showcased projects and developments</p>
            </div>
            <NuxtLink to="/admin/projects/add"
                class="group bg-comma-primary text-white px-6 py-3 rounded-xl hover:bg-comma-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                <Icon name="mdi:plus" class="w-5 h-5 group-hover:rotate-90 transition-transform" />
                {{ $t('admin.projects.add_new') }}
            </NuxtLink>
        </div>

        <!-- Loading state -->
        <div v-if="store.loading" class="flex justify-center py-20">
            <div class="relative">
                <div
                    class="w-16 h-16 border-4 border-comma-primary/20 rounded-full animate-spin border-t-comma-primary">
                </div>
            </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="store.projects.length === 0"
            class="text-center py-20 bg-white rounded-2xl shadow-card border border-comma-border-subtle">
            <div class="w-24 h-24 rounded-full bg-comma-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="mdi:office-building-cog" class="w-12 h-12 text-comma-primary" />
            </div>
            <p class="text-comma-neutral-600 text-lg">{{ $t('admin.projects.no_projects') }}</p>
            <NuxtLink to="/admin/projects/add"
                class="inline-block mt-4 text-comma-primary hover:text-comma-primary-dark font-medium">
                {{ $t('admin.projects.add_first') }}
            </NuxtLink>
        </div>

        <!-- Projects grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="project in store.projects" :key="project.project_id"
                class="group bg-white rounded-2xl shadow-card hover:shadow-luxury transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-comma-border-subtle">
                <!-- Image with overlay badge -->
                <div class="relative h-56 overflow-hidden">
                    <img :src="project.cover_image?.[0] || '/placeholder-project.jpg'" :alt="project.title_en"
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    </div>
                    <div class="absolute top-3 left-3 flex gap-2">
                        <span
                            class="px-2 py-1 bg-comma-primary/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow">
                            {{ project.badge_en || 'Project' }}
                        </span>
                    </div>
                    <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <NuxtLink :to="`/admin/projects/${project.project_id}`"
                            class="bg-white/90 backdrop-blur text-comma-primary p-2 rounded-full shadow-md hover:bg-white transition">
                            <Icon name="mdi:pencil" class="w-4 h-4" />
                        </NuxtLink>
                    </div>
                </div>

                <!-- Content -->
                <div class="p-5">
                    <div class="flex justify-between items-start gap-2 mb-2">
                        <h3 class="text-xl font-bold text-comma-neutral-900 line-clamp-1">{{ project.title_en }}</h3>
                        <span
                            class="text-xs bg-comma-neutral-100 text-comma-neutral-600 px-2 py-1 rounded-full whitespace-nowrap">
                            ID: {{ project.project_id }}
                        </span>
                    </div>
                    <p class="text-comma-neutral-600 text-sm line-clamp-2 mb-4">{{ stripHtml(project.description_en) }}</p>
                    <div class="flex gap-2 pt-3 border-t border-comma-border-subtle">
                        <NuxtLink :to="`/admin/projects/${project.project_id}`"
                            class="flex-1 text-center bg-comma-primary/10 text-comma-primary font-medium px-3 py-2 rounded-xl hover:bg-comma-primary hover:text-white transition-all duration-300">
                            <Icon name="mdi:eye" class="w-4 h-4 inline mr-1" />
                            {{ $t('admin.projects.edit_project') }}
                        </NuxtLink>
                        <button @click="confirmDelete(project)"
                            class="flex-1 text-center bg-red-50 text-red-600 font-medium px-3 py-2 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300">
                            <Icon name="mdi:delete" class="w-4 h-4 inline mr-1" />
                            {{ $t('admin.projects.delete') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete modal -->
        <div v-if="deleteModalOpen"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform scale-95 animate-scale-in">
                <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <Icon name="mdi:alert" class="w-6 h-6 text-red-600" />
                </div>
                <h3 class="text-xl font-bold text-center mb-2">{{ $t('admin.projects.delete') }}</h3>
                <p class="text-comma-neutral-600 text-center mb-6">{{ $t('admin.projects.delete_confirm') }}</p>
                <div class="flex justify-end gap-3">
                    <button @click="deleteModalOpen = false"
                        class="px-4 py-2 border rounded-xl hover:bg-comma-surface-subtle transition">
                        {{ $t('admin.cancel') }}
                    </button>
                    <button @click="deleteProject"
                        class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
                        {{ $t('admin.delete') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useProjectsStore } from '~/store/projects'
import type { Project } from '~/types/project'
import { stripHtml } from '~/utils/stripHtml'



const store = useProjectsStore()
const deleteModalOpen = ref(false)
const projectToDelete = ref<Project | null>(null)

async function loadProjects() {
    await store.fetchProjects({ per_page: 50 })
}

function confirmDelete(project: Project) {
    projectToDelete.value = project
    deleteModalOpen.value = true
}

async function deleteProject() {
    if (!projectToDelete.value) return
    await store.deleteProject(projectToDelete.value.project_id)
    deleteModalOpen.value = false
    projectToDelete.value = null
    await loadProjects()
}

onMounted(() => {
    loadProjects()
})
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.2s ease-out;
}

.animate-scale-in {
    animation: scaleIn 0.2s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes scaleIn {
    from {
        transform: scale(0.95);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>