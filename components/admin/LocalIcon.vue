<template>
  <component :is="iconComponent" aria-hidden="true" />
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  Bars3Icon,
  BellIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CameraIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  FolderIcon,
  LanguageIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  NewspaperIcon,
  PencilSquareIcon,
  PhoneIcon,
  PlusIcon,
  PresentationChartBarIcon,
  SparklesIcon,
  TrashIcon,
  UserCircleIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  name?: string
}>()

const icons: Record<string, any> = {
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,
  'arrow-path': ArrowPathIcon,
  'bars-3': Bars3Icon,
  bell: BellIcon,
  briefcase: BriefcaseIcon,
  'building-office': BuildingOfficeIcon,
  camera: CameraIcon,
  envelope: EnvelopeIcon,
  'exclamation-triangle': ExclamationTriangleIcon,
  folder: FolderIcon,
  language: LanguageIcon,
  link: LinkIcon,
  'magnifying-glass': MagnifyingGlassIcon,
  newspaper: NewspaperIcon,
  'pencil-square': PencilSquareIcon,
  phone: PhoneIcon,
  plus: PlusIcon,
  'presentation-chart-bar': PresentationChartBarIcon,
  sparkles: SparklesIcon,
  trash: TrashIcon,
  'user-circle': UserCircleIcon,
  user: UserIcon,
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
