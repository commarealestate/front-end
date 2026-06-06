// ~/types/project.ts

export interface ProjectSection {
  id: number;
  title: string;
  title_ar: string;
  title_en: string;
  description: string;
  description_ar: string;
  description_en: string;
  image: string;
}

export interface ProjectGallery {
  id: number;
  image: string;
}

export interface ProjectDetailItem {
  item_id: number;
  item: string;
  item_ar: string;
  item_en: string;
}

export interface ProjectDetail {
  details_id: number;
  type: "location" | "services" | "facilities";
  title: string;
  title_ar: string;
  title_en: string;
  description: string;
  description_ar: string;
  description_en: string;
  image: string;
  items: ProjectDetailItem[];
}

export interface Project {
  project_id: number;
  title: string;
  title_ar: string;
  title_en: string;
  slug: string;
  description: string;
  description_ar: string;
  description_en: string;
  badge: string;
  badge_ar: string;
  badge_en: string;
  cover_image: string[];
  sections: ProjectSection[];
  gallery: ProjectGallery[];
  details: ProjectDetail[];
  created_at: string;
  updated_at: string;
}

export interface ApiProjectResponse {
  status: number;
  code: number;
  message: string;
  data: Project[];
  errors: any[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface ApiSingleProjectResponse {
  status?: number;
  code?: number;
  message?: string;
  data: Project;
}
