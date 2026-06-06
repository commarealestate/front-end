<template>
  <div class="group bg-white rounded-xl shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden border border-comma-border-subtle flex flex-col h-full">
    <!-- Image -->
    <NuxtLink :to="localePath(`/admin/talents/${talent.talent_id}`)">
      <div class="relative aspect-square overflow-hidden bg-comma-neutral-100">
        <img
          v-if="talent.image"
          :src="talent.image"
          :alt="talent.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-comma-neutral-400">
          <Icon name="i-heroicons-user-circle" class="w-16 h-16" />
        </div>
      </div>
    </NuxtLink>

    <div class="p-4 flex flex-col flex-1">
      <!-- Name -->
      <NuxtLink :to="localePath(`/admin/talents/${talent.talent_id}`)" class="hover:text-comma-primary">
        <h3 class="font-display font-semibold text-comma-neutral-900 line-clamp-1">
          {{ talent.name }}
        </h3>
      </NuxtLink>
      <!-- Title -->
      <p v-if="talent.title" class="text-sm text-comma-neutral-600 mt-1 line-clamp-1">
        {{ talent.title }}
      </p>
      <!-- Email -->
      <div v-if="talent.email" class="mt-2 text-xs text-comma-neutral-500 flex items-center gap-1">
        <Icon name="i-heroicons-envelope" class="w-3 h-3" />
        <span class="truncate">{{ talent.email }}</span>
      </div>
      <!-- Actions -->
      <div class="mt-auto pt-3 flex items-center justify-between border-t border-comma-border-subtle">
        <UButton
          color="primary"
          variant="ghost"
          icon="i-heroicons-pencil-square"
          :to="localePath(`/admin/talents/${talent.talent_id}/edit`)"
          size="sm"
        />
        <UButton
          color="red"
          variant="ghost"
          icon="i-heroicons-trash"
          size="sm"
          @click="$emit('delete', talent)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Talent } from '~/types/talent'

defineProps<{
  talent: Talent
}>()
defineEmits<{
  (e: 'delete', talent: Talent): void
}>()

const localePath = useLocalePath()
</script>