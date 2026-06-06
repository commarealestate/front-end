export interface Moment {
  emiratisation_moments_id: number
  title: string
  title_ar: string
  title_en: string
  description: string
  description_ar: string
  description_en: string
  media: string // URL
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