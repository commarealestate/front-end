<template>
  <UModal v-model="isOpen" :prevent-close="false">
    <UCard>
      <template #header>
        <h3 class="text-lg font-display font-semibold">
          {{ property?.hot_deal ? $t('admin_properties_page.hot_deal.deactivate') : $t('admin_properties_page.hot_deal.activate') }}
        </h3>
      </template>

      <div class="space-y-4">
        <p v-if="!property?.hot_deal">
          {{ $t('admin_properties_page.hot_deal.enter_price') }}
        </p>
        <p v-else>
          {{ $t('admin_properties_page.hot_deal.confirm_deactivate') }}
        </p>

        <UFormGroup
          v-if="!property?.hot_deal"
          :label="$t('admin_properties_page.hot_deal.price_label')"
          required
        >
          <UInput
            v-model.number="price"
            type="number"
            min="0"
            step="0.01"
            :placeholder="property?.original_price"
          />
        </UFormGroup>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="gray" variant="ghost" @click="isOpen = false">
            {{ $t('admin_properties_page.cancel') }}
          </UButton>
          <UButton
            color="primary"
            :disabled="!property?.hot_deal && !price"
            @click="confirm"
          >
            {{ $t('admin_properties_page.confirm') }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { Property } from '~/types/property'

const props = defineProps<{
  modelValue: boolean
  property: Property | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', payload: { hotDeal: boolean; price?: number }): void
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const price = ref<number | undefined>()

// Reset price when modal opens/closes
watch(isOpen, (open) => {
  if (open && props.property) {
    price.value = props.property.hot_deal_price ? Number(props.property.hot_deal_price) : undefined
  } else {
    price.value = undefined
  }
})

function confirm() {
  if (!props.property) return
  if (props.property.hot_deal) {
    // Deactivate
    emit('confirm', { hotDeal: false })
  } else {
    // Activate with price
    if (!price.value) return
    emit('confirm', { hotDeal: true, price: price.value })
  }
  isOpen.value = false
}
</script>