import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import {
  buildMailtoLink,
  buildWhatsappLink,
  formatPhoneDisplay,
  resolveAgentJobTitle,
  resolveAgentName,
  resolveAgentPhone,
  resolveAgentWhatsappDigits,
  resolveAgentWorkEmail,
} from '~/utils/propertyContact'

export function useAgentContact(agent: MaybeRefOrGetter<Record<string, any> | null | undefined>) {
  const { locale } = useI18n()

  const contact = computed(() => {
    const agentData = toValue(agent)
    const name = resolveAgentName(agentData)
    const email = resolveAgentWorkEmail(agentData)
    const phone = resolveAgentPhone(agentData)
    const whatsappDigits = resolveAgentWhatsappDigits(agentData)
    const isArabic = locale.value === 'ar'
    const subject = isArabic
      ? (name ? `استفسار لـ ${name}` : 'استفسار عقاري')
      : (name ? `Inquiry for ${name}` : 'Real estate inquiry')
    const body = isArabic
      ? 'مرحباً،\n\nأود الحصول على مزيد من المعلومات.\n'
      : 'Hello,\n\nI would like to get more information.\n'

    return {
      name,
      email,
      phone,
      phoneDisplay: formatPhoneDisplay(phone),
      whatsappDigits,
      whatsappDisplay: formatPhoneDisplay(whatsappDigits),
      jobTitle: resolveAgentJobTitle(agentData, locale.value),
      telLink: phone ? `tel:${phone}` : '',
      mailtoLink: email ? buildMailtoLink(email, subject, body) : '',
      whatsappLink: whatsappDigits ? buildWhatsappLink(whatsappDigits, body.trim()) : '',
    }
  })

  return {
    agentName: computed(() => contact.value.name),
    email: computed(() => contact.value.email),
    phone: computed(() => contact.value.phone),
    phoneDisplay: computed(() => contact.value.phoneDisplay),
    whatsappDisplay: computed(() => contact.value.whatsappDisplay),
    agentJobTitle: computed(() => contact.value.jobTitle),
    telLink: computed(() => contact.value.telLink),
    mailtoLink: computed(() => contact.value.mailtoLink),
    whatsappLink: computed(() => contact.value.whatsappLink),
  }
}
