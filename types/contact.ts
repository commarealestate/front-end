export interface ContactMessage {
  [key: string]: any
  contact_us_id: number
  name: string
  email: string
  phone: string
  message: string
  reply_message: string | null
  is_read: boolean
  first_contact_at?: string | null
  last_activity_at?: string | null
  project_id?: number | string | null
  project_title?: string | null
  property_id?: number | string | null
  property_reference?: string | null
  property_title?: string | null
  listing_agent_id?: number | string | null
  source?: string | null
  page_url?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_term?: string | null
  utm_content?: string | null
  activities?: CrmActivity[]
  created_at: string
  updated_at: string
}

export interface CrmActivity {
  id: number
  entity_type: 'agent' | 'contact'
  entity_id: number
  activity_type: string
  occurred_at: string | null
  notes: string | null
  created_by?: number | null
  created_at?: string | null
  updated_at?: string | null
}

export interface PaginatedResponse<T> {
  status: number
  code: number
  message: string
  data: T[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    path: string
    per_page: number
    to: number
    total: number
  }
  errors: any[]
}
