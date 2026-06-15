export const CONTACT_EMAILS = {
  info: 'info@commarealestate.ae',
  sales: 'sales@commarealestate.ae',
  careers: 'careers@commarealestate.ae',
} as const

export type SiteContactContext = keyof typeof CONTACT_EMAILS

/** Company main line — homepage, footer, navbar, general contact */
export const COMPANY_PHONE = '+971508008879'

export const COMPANY_PHONE_DISPLAY = '+971 50 800 8879'

/** Fallback when no listing agent is assigned on property pages */
export const DEFAULT_SALES_PHONE = COMPANY_PHONE

/** WhatsApp fallback digits (no + prefix) */
export const DEFAULT_WHATSAPP_DIGITS = '971508008879'

export function getContactEmail(context: SiteContactContext): string {
  return CONTACT_EMAILS[context]
}
