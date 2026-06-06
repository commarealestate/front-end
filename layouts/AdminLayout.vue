<template>
  <div class="min-h-screen bg-comma-neutral-50" :class="{ 'show-sidebar': sidebarOpen }" id="main-wrapper">
    <!-- Mobile backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="toggleSidebar"
    ></div>

    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0"
      :class="[
        sidebarCollapsed ? 'w-20' : 'w-64',
        direction === 'rtl' ? 'right-0' : 'left-0',
        sidebarOpen
          ? 'translate-x-0'
          : direction === 'rtl'
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <AdminSidebar
        :collapsed="sidebarCollapsed"
        @close-sidebar="closeSidebar"
        @toggle-collapse="toggleCollapse"
      />
    </div>

    <!-- Main content -->
    <div
      :class="[
        direction === 'rtl'
          ? (sidebarCollapsed ? 'lg:mr-20' : 'lg:mr-64')
          : (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64')
      ]"
      class="transition-all duration-300 ease-in-out"
    >
      <!-- Header -->
      <AdminHeader @toggle-sidebar="toggleSidebar">
        {{ pageHeader }}
      </AdminHeader>

      <!-- Page content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <div class="mx-auto max-w-7xl">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()

// Sidebar state
const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)

// Direction (RTL or LTR)
const direction = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))

const toggleSidebar = () => (sidebarOpen.value = !sidebarOpen.value)
const closeSidebar = () => (sidebarOpen.value = false)
const toggleCollapse = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  if (process.client) localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString())
}

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
  if (process.client && window.innerWidth < 1024) sidebarOpen.value = false
})

// Persist sidebar state
onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved) sidebarCollapsed.value = saved === 'true'
  }
})

// Page title
const pageHeader = computed(() => t(route.meta.title ?? 'admin.dashboard'))

useHead({
  htmlAttrs: {
    lang: locale,
    dir: direction,
  },
  titleTemplate: (title) => `${t(title ?? 'admin.Dashboard')} | Comma Admin`,
})
</script>

<style>
body {
  overflow-y: auto;
}

@media (max-width: 1023px) {
  .show-sidebar {
    overflow: hidden;
  }
}
</style>