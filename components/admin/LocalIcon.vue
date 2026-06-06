<template>
  <component :is="iconComponent" aria-hidden="true" />
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Bars3Icon,
  BellIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CameraIcon,
  EnvelopeIcon,
  FolderIcon,
  LanguageIcon,
  NewspaperIcon,
  PresentationChartBarIcon,
  SparklesIcon,
  TrashIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  name?: string
}>()

const icons: Record<string, any> = {
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,
  'bars-3': Bars3Icon,
  bell: BellIcon,
  briefcase: BriefcaseIcon,
  'building-office': BuildingOfficeIcon,
  camera: CameraIcon,
  envelope: EnvelopeIcon,
  folder: FolderIcon,
  language: LanguageIcon,
  newspaper: NewspaperIcon,
  'presentation-chart-bar': PresentationChartBarIcon,
  sparkles: SparklesIcon,
  trash: TrashIcon,
  users: UsersIcon,
  'x-mark': XMarkIcon,
}

const normalizedName = computed(() => {
  return (props.name || '')
    .replace(/^i-heroicons-/, '')
    .replace(/^heroicons:/, '')
})

const iconComponent = computed(() => icons[normalizedName.value] || SparklesIcon)
</script>
