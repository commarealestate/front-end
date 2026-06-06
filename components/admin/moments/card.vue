<template>
  <div class="group bg-white rounded-xl shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden border border-comma-border-subtle flex flex-col h-full">
    <!-- Media (image/video) -->
    <NuxtLink :to="localePath(`/admin/emiratisation-moments/${moment.emiratisation_moments_id}`)">
      <div class="relative aspect-video overflow-hidden bg-comma-neutral-100">
        <video
          v-if="isVideo"
          :src="moment.media"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          muted
          loop
          @mouseenter="playVideo"
          @mouseleave="pauseVideo"
          ref="videoRef"
        />
        <img
          v-else
          :src="moment.media"
          :alt="moment.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <!-- Play icon overlay for video -->
        <div v-if="isVideo" class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
            <Icon name="mdi:play" class="w-6 h-6 text-comma-primary" />
          </div>
        </div>
      </div>
    </NuxtLink>

    <div class="p-4 flex flex-col flex-1">
  
      <!-- Actions -->
      <div class="mt-auto pt-3 flex items-center justify-between border-t border-comma-border-subtle">
        <UButton
          color="primary"
          variant="ghost"
          icon="i-heroicons-pencil-square"
          :to="localePath(`/admin/emiratisation-moments/${moment.emiratisation_moments_id}/edit`)"
          size="sm"
        />
        <UButton
          color="red"
          variant="ghost"
          icon="i-heroicons-trash"
          size="sm"
          @click="$emit('delete', moment)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Moment } from '~/types/moment'

const props = defineProps<{
  moment: Moment
}>()
defineEmits<{
  (e: 'delete', moment: Moment): void
}>()

const localePath = useLocalePath()
const { locale } = useI18n()

const isVideo = computed(() => {
  const url = props.moment.media
  const ext = url.split('.').pop()?.toLowerCase()
  return ext === 'mp4' || ext === 'mov' || ext === 'avi' || ext === 'webm'
})

const videoRef = ref<HTMLVideoElement | null>(null)

function playVideo() {
  videoRef.value?.play()
}
function pauseVideo() {
  videoRef.value?.pause()
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US')
}
</script>