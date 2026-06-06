export interface Talent {
  talent_id: number
  name: string
  name_en: string
  name_ar: string
  title: string
  title_en: string
  title_ar: string
  image: string | null
  url: string | null
  email: string | null
  desc_en?: string | null
  desc_ar?: string | null
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