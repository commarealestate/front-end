export interface Agent {
  [key: string]: any
  agent_id: number
  id?: number
  slug: string | null
  slug_en: string | null
  slug_ar: string | null
  xml_id: string | null
  first_name: string
  name?: string | null
  second_name?: string | null
  middle_name?: string | null
  last_name: string
  e_mail: string                       // primary email from CRM
  departments: string[]
  agent_type: string
  show_on_website: string | boolean
  agent_description: string
  specialties: string
  service_area: string
  company_e_mail: string
  photo?: string[]
  cre: number
  active: boolean                      // boolean, not string
  // Additional fields (kept for compatibility, many may be null)
  title: string | null
  email: string | null                 // legacy, use e_mail
  last_login: string | null
  date_register: string | null
  time_zone: string | null
  is_online: string | null
  personal_gender: string | null
  personal_profession: string | null
  personal_www: string | null
  personal_birthday: string | null
  personal_photo: string[]
  emirates_id: string[]
  latest_educational_certificate: string[]
  abu_dhabi_real_estate_broker_certificate: string[]
  dubai_real_estate_broker_certificate: string[]
  personal_icq: string | null
  personal_phone: string | null
  personal_fax: string | null
  personal_mobile: string | null
  personal_pager: string | null
  personal_street: string | null
  personal_city: string | null
  personal_state: string | null
  personal_zip: string | null
  personal_country: string | null
  personal_mailbox: string | null
  personal_notes: string | null
  work_phone: string | null
  work_company: string | null
  work_position: string | null
  work_department: string | null
  work_www: string | null
  work_fax: string | null
  work_pager: string | null
  work_street: string | null
  work_mailbox: string | null
  work_city: string | null
  work_state: string | null
  work_zip: string | null
  work_country: string | null
  work_profile: string | null
  work_logo: string[]
  work_notes: string | null
  uf_skype_link: string | null
  uf_zoom: string | null
  uf_employment_date: string | null
  uf_timeman: string | null
  uf_department: number[] | null
  uf_interests: string | null
  uf_skills: string | null
  uf_web_sites: string | null
  uf_xing: string | null
  uf_linkedin: string | null
  uf_facebook: string | null
  uf_twitter: string | null
  uf_skype: string | null
  uf_district: string | null
  uf_phone_inner: string | null
  education_certificate: string | null
  abu_dhabi_broker_cert: string | null
  dubai_broker_cert: string | null
  service_areas: ServiceArea[]
  created_at: string
  updated_at: string
}

export interface ServiceArea {
  service_area_id: number
  name: string
  name_ar: string
  name_en: string
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
