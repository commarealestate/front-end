<template>
  <NuxtLink
    :to="localePath(to)"
    class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group"
    :class="[
      isActive
        ? 'bg-comma-primary/20 text-white shadow-md'
        : 'text-white/80 hover:bg-comma-primary/10 hover:text-white'
    ]"
  >
    <AdminLocalIcon
      :name="icon"
      class="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110"
    />
    <span
      v-if="!collapsed"
      class="font-medium text-sm truncate"
    >
      {{ $t(label) }}
    </span>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  icon: String,
  label: String,
  to: String,
  collapsed: Boolean,
})

const route = useRoute()
const localePath = useLocalePath()

const isActive = computed(() => {
  if (props.to === '/admin') return route.path === localePath('/admin')
  return route.path.startsWith(localePath(props.to))
})
</script>
