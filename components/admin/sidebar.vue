<template>
  <aside
    class="flex flex-col h-screen bg-gradient-to-b from-comma-primary to-comma-primary-dark text-white shadow-xl transition-all duration-300 ease-in-out"
    :class="{ collapsed }"
  >
    <!-- Logo -->
    <div class="flex items-center  justify-center bg-comma-primary-subtle h-20 border-b border-comma-primary-light/30">
      <NuxtLink to="/" class="flex items-center justify-center gap-3">
        <img
          src="~/assets/images/logo.png"
          alt="Comma Real Estate"
          class="transition-all duration-300"
          :class="[
            collapsed
              ? 'w-0 h-0 opacity-0'
              : 'w-full h-auto px-2 max-h-12'
          ]"
        />
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-2 py-7 space-y-1">
      <AdminSidebarLink
        v-for="item in menuItems"
        :key="item.path"
        :icon="item.icon"
        :label="item.label"
        :to="localePath(item.path)"
        :collapsed="collapsed"
      />
    </nav>

    <!-- Collapse Button -->
    <div class="border-t border-comma-primary-light/30 p-3">
      <button
        @click="$emit('toggle-collapse')"
        class="flex items-center justify-center w-full p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      >
        <AdminLocalIcon :name="arrowIcon" class="w-5 h-5 text-white" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const localePath = useLocalePath()

const props = defineProps({
  collapsed: Boolean,
})
const { collapsed } = toRefs(props)

const menuItems = [
  { label: 'admin.sidebar.dashboard', path: '/admin', icon: 'i-heroicons-presentation-chart-bar' },
  { label: 'admin.sidebar.properties', path: '/admin/properties', icon: 'i-heroicons-building-office' },
  { label: 'admin.sidebar.property_attributes', path: '/admin/property-attributes', icon: 'i-heroicons-adjustments-horizontal' },
  { label: 'admin.sidebar.agents', path: '/admin/agents', icon: 'i-heroicons-users' },
  { label: 'admin.sidebar.projects', path: '/admin/projects', icon: 'i-heroicons-folder' },
  { label: 'admin.sidebar.blogs', path: '/admin/blogs', icon: 'i-heroicons-newspaper' },
  { label: 'admin.sidebar.careers', path: '/admin/careers', icon: 'i-heroicons-briefcase' },
    { label: 'admin.sidebar.talents', path: '/admin/talents', icon: 'i-heroicons-sparkles' },
  { label: 'admin.sidebar.emiratisation_moments', path: '/admin/emiratisation-moments', icon: 'i-heroicons-camera' },
  { label: 'admin.sidebar.contact', path: '/admin/contact', icon: 'i-heroicons-envelope' },
  // { label: 'admin.sidebar.settings', path: '/admin/settings', icon: 'i-heroicons-cog-6-tooth' },
]

const arrowIcon = computed(() => {
  const isRTL = locale.value === 'ar'
  if (isRTL) {
    return collapsed.value ? 'i-heroicons-arrow-left' : 'i-heroicons-arrow-right'
  }
  return collapsed.value ? 'i-heroicons-arrow-right' : 'i-heroicons-arrow-left'
})
</script>

<style scoped>
aside {
  width: 16rem;
}
aside.collapsed {
  width: 5rem;
}
aside {
  transition: width 0.3s ease-in-out;
}
[dir="rtl"] aside {
  direction: rtl;
}
</style>
