<template>
  <UCard class="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-comma-surface-elevated" :ui="{ body: 'p-5', base: 'border border-comma-border-subtle' }">
    <NuxtLink :to="to" class="absolute inset-0 z-10">
      <span class="sr-only">{{ title }}</span>
    </NuxtLink>
    <div class="flex items-start justify-between p-5">
      <div>
        <p class="text-sm font-medium text-comma-neutral-600">{{ title }}</p>
        <p class="text-3xl font-bold text-comma-neutral-900 mt-1">{{ count }}</p>
        <p v-if="subtext" class="text-xs text-comma-neutral-500 mt-2 flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full" :class="subtextColorClass"></span>
          {{ subtext }}
        </p>
      </div>
      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-comma-primary/10 to-comma-primary/5 flex items-center justify-center text-comma-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
        <Icon :name="icon" class="w-6 h-6" />
      </div>
    </div>
    <!-- Subtle decorative line -->
    <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-comma-primary/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  count: number
  icon: string
  to: string
  subtext?: string
  subtextColor?: 'green' | 'orange' | 'blue'
}>()

const subtextColorClass = computed(() => {
  switch (props.subtextColor) {
    case 'green': return 'bg-green-500'
    case 'orange': return 'bg-orange-500'
    case 'blue': return 'bg-blue-500'
    default: return 'bg-comma-primary'
  }
})
</script>