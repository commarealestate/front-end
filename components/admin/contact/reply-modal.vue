<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-display font-semibold">
          {{ $t('admin_contact_page.reply_to', { name: message?.name }) }}
        </h3>
      </template>

      <div class="space-y-4">
        <div class="bg-comma-surface-subtle p-4 rounded-lg">
          <p class="text-sm text-comma-neutral-700 whitespace-pre-line">{{ message?.message }}</p>
        </div>

        <UFormGroup :label="$t('admin_contact_page.your_reply')" required>
          <UTextarea
            v-model="reply"
            rows="5"
            :placeholder="$t('admin_contact_page.reply_placeholder')"
          />
        </UFormGroup>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="gray" variant="ghost" @click="isOpen = false">
            {{ $t('admin_contact_page.cancel') }}
          </UButton>
          <UButton
            color="primary"
            :disabled="!reply.trim()"
            :loading="sending"
            @click="sendReply"
          >
            {{ $t('admin_contact_page.send_reply') }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { ContactMessage } from '~/types/contact'

const props = defineProps<{
  modelValue: boolean
  message: ContactMessage | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'sent', reply: string): void
}>()

const reply = ref('')
const sending = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

watch(isOpen, (open) => {
  if (!open) reply.value = ''
})

async function sendReply() {
  if (!reply.value.trim()) return
  sending.value = true
  try {
    emit('sent', reply.value)
    isOpen.value = false
  } finally {
    sending.value = false
  }
}
</script>