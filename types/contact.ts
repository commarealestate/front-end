export interface ContactMessage {
  contact_us_id: number
  name: string
  email: string
  phone: string
  message: string
  reply_message: string | null
  is_read: boolean
  created_at: string
  updated_at: string
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