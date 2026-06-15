import type { SiteContactContext } from '~/constants/contact'
import { COMPANY_PHONE, COMPANY_PHONE_DISPLAY, getContactEmail } from '~/constants/contact'

export function useSiteContact(context: SiteContactContext) {
  const email = computed(() => getContactEmail(context))
  const phone = computed(() => COMPANY_PHONE)
  const phoneDisplay = computed(() => COMPANY_PHONE_DISPLAY)
  const telLink = computed(() => `tel:${phone.value}`)
  const mailtoLink = computed(() => `mailto:${email.value}`)

  return {
    email,
    phone,
    phoneDisplay,
    telLink,
    mailtoLink,
  }
}
