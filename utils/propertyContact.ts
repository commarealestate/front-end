import {
  CONTACT_EMAILS,
  DEFAULT_SALES_PHONE,
  DEFAULT_WHATSAPP_DIGITS,
} from '~/constants/contact'

export function asContactString(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (value == null) return ''
  return String(value).trim()
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

export function resolveAgentWorkEmail(agent: Record<string, any> | null | undefined): string {
  if (!agent) return ''
  return (
    asContactString(agent.company_e_mail)
    || asContactString(agent.work_e_mail)
    || asContactString(agent.e_mail)
    || asContactString(agent.email)
  )
}

export function resolveAgentPhone(agent: Record<string, any> | null | undefined): string {
  if (!agent) return ''
  return asContactString(
    agent.personal_mobile
    || agent.work_phone
    || agent.personal_phone
    || agent.whatsapp
    || agent.phone
    || agent.uf_phone_inner,
  )
}

export function resolveAgentWhatsappDigits(agent: Record<string, any> | null | undefined): string {
  if (!agent) return ''
  return digitsOnly(
    asContactString(agent.whatsapp)
    || resolveAgentPhone(agent),
  )
}

export function resolveAgentJobTitle(
  agent: Record<string, any> | null | undefined,
  locale: string,
): string {
  if (!agent) return ''

  if (locale === 'ar') {
    return (
      asContactString(agent.position_ar)
      || asContactString(agent.work_position_ar)
      || asContactString(agent.position)
      || asContactString(agent.work_position)
      || asContactString(agent.personal_profession)
      || asContactString(agent.title)
    )
  }

  return (
    asContactString(agent.position_en)
    || asContactString(agent.position)
    || asContactString(agent.work_position)
    || asContactString(agent.personal_profession)
    || asContactString(agent.title)
  )
}

export function resolveAgentName(agent: Record<string, any> | null | undefined): string {
  if (!agent) return ''

  if (asContactString(agent.name)) {
    return asContactString(agent.name)
  }

  const parts = [
    agent.first_name,
    agent.second_name || agent.middle_name,
    agent.last_name,
  ].map(asContactString).filter(Boolean)

  return parts.join(' ').trim()
}

export function formatPropertyPrice(price: number | string | null | undefined): string {
  const numeric = typeof price === 'number' ? price : Number(price)
  if (!Number.isFinite(numeric)) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
  }).format(numeric)
}

export interface PropertyInquiryDetails {
  title: string
  location?: string
  price?: number | string | null
  referenceNumber?: string
  propertyUrl?: string
}

export function buildPropertyInquiryMessage(
  details: PropertyInquiryDetails,
  locale: string,
): string {
  const priceText = formatPropertyPrice(details.price ?? null)
  const ref = details.referenceNumber ? `\nReference: ${details.referenceNumber}` : ''
  const location = details.location ? `\nLocation: ${details.location}` : ''
  const price = priceText ? `\nPrice: ${priceText}` : ''
  const link = details.propertyUrl ? `\n\nProperty Link:\n${details.propertyUrl}` : ''

  if (locale === 'ar') {
    return `مرحباً،

أنا مهتم بالعقار التالي:

العقار: ${details.title}${location}${price}${ref}${link}

هل يمكنكم مشاركة المزيد من التفاصيل؟`
  }

  return `Hello,

I'm interested in the following property:

Property: ${details.title}${location}${price}${ref}${link}

Could you please share more details?`
}

export function buildPropertyInquirySubject(title: string, locale: string): string {
  if (locale === 'ar') {
    return `استفسار عن: ${title}`
  }
  return `Inquiry about: ${title}`
}

export function buildMailtoLink(email: string, subject: string, body: string): string {
  if (!email) return ''
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function buildWhatsappLink(digits: string, message: string): string {
  if (!digits) return ''
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function resolvePropertyContactEmail(agent: Record<string, any> | null | undefined): string {
  return resolveAgentWorkEmail(agent) || CONTACT_EMAILS.sales
}

export function resolvePropertyContactPhone(agent: Record<string, any> | null | undefined): string {
  return resolveAgentPhone(agent) || DEFAULT_SALES_PHONE
}

export function resolvePropertyWhatsappDigits(agent: Record<string, any> | null | undefined): string {
  return resolveAgentWhatsappDigits(agent) || DEFAULT_WHATSAPP_DIGITS
}

export function formatPhoneDisplay(phone: string): string {
  const trimmed = asContactString(phone)
  if (!trimmed) return ''
  if (trimmed.startsWith('+')) return trimmed
  const digits = digitsOnly(trimmed)
  return digits ? `+${digits}` : trimmed
}

export interface PropertyContactSource {
  agent?: Record<string, any> | null
  title: string
  location?: string
  price?: number | string | null
  referenceNumber?: string
  propertyUrl?: string
}

export function buildPropertyContactLinks(
  source: PropertyContactSource,
  locale: string,
) {
  const email = resolvePropertyContactEmail(source.agent)
  const phone = resolvePropertyContactPhone(source.agent)
  const whatsappDigits = resolvePropertyWhatsappDigits(source.agent)
  const inquiry = {
    title: source.title,
    location: source.location,
    price: source.price,
    referenceNumber: source.referenceNumber,
    propertyUrl: source.propertyUrl,
  }
  const message = buildPropertyInquiryMessage(inquiry, locale)
  const subject = buildPropertyInquirySubject(source.title, locale)

  return {
    email,
    phone,
    phoneDisplay: formatPhoneDisplay(phone),
    whatsappDigits,
    whatsappDisplay: formatPhoneDisplay(whatsappDigits),
    telLink: phone ? `tel:${phone}` : '',
    mailtoLink: buildMailtoLink(email, subject, message),
    whatsappLink: buildWhatsappLink(whatsappDigits, message),
    agentName: resolveAgentName(source.agent),
    agentJobTitle: resolveAgentJobTitle(source.agent, locale),
    hasAgent: Boolean(source.agent),
  }
}
