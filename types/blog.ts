export interface Tag {
  tag_id: number
  title: string
  created_at: string
  updated_at: string
}

export interface BlogContent {
  id?: number
  content_en?: string
  content_ar?: string
  image?: string | null
  order?: number
}

export interface Blog {
  blog_id: number
  slug: string
  slug_ar: string
  slug_en: string
  title: string
  title_en: string
  title_ar: string
  description: string
  description_en: string
  description_ar: string
  content: string
  content_en: string
  content_ar: string
  contents?: BlogContent[]   // new field
  image: string | null
  is_active: 0 | 1
  read_time: number
  ext_link: string | null
  tags: Tag[]
  meta_title: string
  meta_description: string
  canonical_url: string
  og_title: string
  og_description: string
  og_url: string
  og_type: string
  og_site_name: string
  og_image: string
  twitter_card: string | null
  twitter_title: string | null
  twitter_description: string | null
  twitter_image: string | null
  schema_context: string | null
  schema_type: string | null
  schema_headline: string | null
  schema_description: string | null
  author_type: string | null
  schema_author: string | null
  publisher_type: string
  schema_publisher: string
  schema_logo: string
  schema_date_published: string | null
  schema_date_modified: string | null
  schema_page_url: string | null
  schema_keywords: string[] | null
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