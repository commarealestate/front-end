<template>
    <div v-if="store.loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-comma-primary" />
    </div>
    <div v-else-if="message" class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-2xl font-display font-bold text-comma-neutral-900">
          {{ $t('admin_contact_page.message_from', { name: message.name }) }}
        </h1>
        <div class="flex gap-2">
          <UButton
            v-if="!message.is_read"
            color="primary"
            variant="soft"
            @click="markAsRead"
          >
            {{ $t('admin_contact_page.mark_read') }}
          </UButton>
          <UButton
            color="primary"
            @click="openReplyModal"
          >
            {{ $t('admin_contact_page.reply') }}
          </UButton>
          <UButton
            color="red"
            variant="outline"
            @click="confirmDelete"
          >
            {{ $t('admin_contact_page.delete') }}
          </UButton>
        </div>
      </div>

      <!-- Message Details -->
      <div class="bg-white rounded-2xl shadow-card p-6 lg:p-8">
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <dt class="text-sm text-comma-neutral-600">{{ $t('admin_contact_page.name') }}</dt>
            <dd class="font-medium">{{ message.name }}</dd>
          </div>
          <div>
            <dt class="text-sm text-comma-neutral-600">{{ $t('admin_contact_page.email') }}</dt>
            <dd class="font-medium">
              <a :href="`mailto:${message.email}`" class="text-comma-primary hover:underline">{{ message.email }}</a>
            </dd>
          </div>
          <div>
            <dt class="text-sm text-comma-neutral-600">{{ $t('admin_contact_page.phone') }}</dt>
            <dd class="font-medium">
              <a :href="`tel:${message.phone}`" class="text-comma-primary hover:underline">{{ message.phone }}</a>
            </dd>
          </div>
          <div>
            <dt class="text-sm text-comma-neutral-600">{{ $t('admin_contact_page.received') }}</dt>
            <dd class="font-medium">{{ formatDate(message.created_at) }}</dd>
          </div>
          <div v-if="hasProjectFields" class="md:col-span-2">
            <dt class="text-sm text-comma-neutral-600">Project Inquiry</dt>
            <dd class="mt-2 grid grid-cols-1 gap-3 rounded-lg bg-comma-primary/5 p-4 md:grid-cols-2">
              <div v-if="message.project_title">
                <div class="text-xs text-comma-neutral-500">Project Title</div>
                <div class="font-medium text-comma-neutral-900">{{ message.project_title }}</div>
              </div>
              <div v-if="message.project_id">
                <div class="text-xs text-comma-neutral-500">Project ID</div>
                <div class="font-medium text-comma-neutral-900">{{ message.project_id }}</div>
              </div>
              <div v-if="message.source">
                <div class="text-xs text-comma-neutral-500">Source</div>
                <div class="font-medium text-comma-neutral-900">{{ message.source }}</div>
              </div>
              <div v-if="message.page_url" class="md:col-span-2">
                <div class="text-xs text-comma-neutral-500">Page URL</div>
                <a :href="message.page_url" target="_blank" class="break-all font-medium text-comma-primary hover:underline">
                  {{ message.page_url }}
                </a>
              </div>
              <div v-for="item in trackingFields" :key="item.key">
                <div class="text-xs text-comma-neutral-500">{{ item.label }}</div>
                <div class="font-medium text-comma-neutral-900">{{ item.value }}</div>
              </div>
            </dd>
          </div>
          <div class="md:col-span-2">
            <dt class="text-sm text-comma-neutral-600">{{ $t('admin_contact_page.message') }}</dt>
            <dd class="mt-2 p-4 bg-comma-surface-subtle rounded-lg whitespace-pre-line">{{ message.message }}</dd>
          </div>
          <div v-if="message.reply_message" class="md:col-span-2">
            <dt class="text-sm text-comma-neutral-600">{{ $t('admin_contact_page.your_reply') }}</dt>
            <dd class="mt-2 p-4 bg-comma-primary/5 rounded-lg whitespace-pre-line">{{ message.reply_message }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Reply Modal -->
    <AdminContactReplyModal
      v-model="showReplyModal"
      :message="message"
      @sent="handleReplySent"
    />
</template>

<script setup lang="ts">
import { useContactStore } from '~/store/contact'

const route = useRoute()
const store = useContactStore()
const { locale } = useI18n()
const localePath = useLocalePath()

const messageId = route.params.id as string
const showReplyModal = ref(false)

onMounted(async () => {
  await store.fetchMessage(messageId)
  // Mark as read automatically when viewing
  if (store.message && !store.message.is_read) {
    await store.markAsRead([Number(messageId)])
  }
})

const message = computed(() => store.message)

const hasProjectFields = computed(() => {
  const msg = message.value
  return !!(msg?.project_id || msg?.project_title || msg?.source || msg?.page_url || trackingFields.value.length)
})

const trackingFields = computed(() => {
  const msg = message.value
  if (!msg) return []

  return [
    { key: 'utm_source', label: 'UTM Source', value: msg.utm_source },
    { key: 'utm_medium', label: 'UTM Medium', value: msg.utm_medium },
    { key: 'utm_campaign', label: 'UTM Campaign', value: msg.utm_campaign },
    { key: 'utm_term', label: 'UTM Term', value: msg.utm_term },
    { key: 'utm_content', label: 'UTM Content', value: msg.utm_content },
  ].filter((item) => item.value)
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function openReplyModal() {
  showReplyModal.value = true
}

async function handleReplySent(reply: string) {
  await store.replyToMessage(messageId, reply)
}

async function markAsRead() {
  await store.markAsRead([Number(messageId)])
}

async function confirmDelete() {
  if (confirm('Are you sure you want to delete this message?')) {
    await store.deleteMessage(messageId)
    navigateTo(localePath('/admin/contact'))
  }
}
</script>
