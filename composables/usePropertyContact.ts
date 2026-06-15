import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { buildPropertyContactLinks, type PropertyContactSource } from '~/utils/propertyContact'

export function usePropertyContact(source: MaybeRefOrGetter<PropertyContactSource>) {
  const { locale } = useI18n()

  const contact = computed(() => buildPropertyContactLinks(toValue(source), locale.value))

  return {
    email: computed(() => contact.value.email),
    phone: computed(() => contact.value.phone),
    phoneDisplay: computed(() => contact.value.phoneDisplay),
    whatsappDigits: computed(() => contact.value.whatsappDigits),
    whatsappDisplay: computed(() => contact.value.whatsappDisplay),
    telLink: computed(() => contact.value.telLink),
    mailtoLink: computed(() => contact.value.mailtoLink),
    whatsappLink: computed(() => contact.value.whatsappLink),
    agentName: computed(() => contact.value.agentName),
    agentJobTitle: computed(() => contact.value.agentJobTitle),
    hasAgent: computed(() => contact.value.hasAgent),
  }
}
