// composables/useBlogs.ts
import type { UseFetchOptions } from "nuxt/app";

// ---------- Types ----------
export interface BlogTag {
  tag_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ApiBlog {
  blog_id: number;
  slug: string;
  slug_ar: string;
  slug_en: string;
  title: string;
  title_en: string;
  title_ar: string;
  description: string;
  description_en: string;
  description_ar: string;
  content: string;
  content_en: string;
  content_ar: string;
  image: string | null;
  is_active: number;
  read_time: number;
  ext_link: string | null;
  tags: BlogTag[];
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: number;
  slug: string;
  slug_ar: string;
  slug_en: string;
  title: string;
  title_en: string;
  title_ar: string;
  description: string;
  description_en: string;
  description_ar: string;
  content: string;
  content_en: string;
  content_ar: string;
  image: string;
  is_active: boolean;
  readTime: number;
  extLink: string | null;
  tags: BlogTag[];
  createdAt: string;
  updatedAt: string;
}

// ---------- Mapper ----------
function mapApiBlogToBlog(apiBlog: ApiBlog): Blog {
  return {
    id: apiBlog.blog_id,
    slug: apiBlog.slug,
    slug_ar: apiBlog.slug_ar,
    slug_en: apiBlog.slug_en,
    title: apiBlog.title,
    title_en: apiBlog.title_en,
    title_ar: apiBlog.title_ar,
    description: apiBlog.description,
    description_en: apiBlog.description_en,
    description_ar: apiBlog.description_ar,
    content: apiBlog.content,
    content_en: apiBlog.content_en,
    content_ar: apiBlog.content_ar,
    image: apiBlog.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&fit=crop',
    is_active: apiBlog.is_active === 1,
    readTime: apiBlog.read_time || 5,
    extLink: apiBlog.ext_link,
    tags: apiBlog.tags || [],
    createdAt: apiBlog.created_at,
    updatedAt: apiBlog.updated_at,
  };
}

// ---------- Composables ----------
export const useBlogs = () => {
  const filters = ref({
    page: 1,
    per_page: 10,
    tags: [] as string[], // tag titles or IDs?
    is_active: 1,
  });

  const { data, pending, error, refresh } = useApiFetch(
    { apiType: 'common', url: 'blogs', method: 'get' },
    { query: filters.value }
  );

  const blogs = computed<Blog[]>(() => {
    if (!data.value?.data) return [];
    return data.value.data.map(mapApiBlogToBlog);
  });

  const pagination = computed(() => data.value?.meta || null);

  const fetchBlogs = (newFilters?: Partial<typeof filters.value>) => {
    if (newFilters) {
      filters.value = { ...filters.value, ...newFilters };
    }
    refresh();
  };

  return {
    blogs,
    pagination,
    pending,
    error,
    fetchBlogs,
    filters,
  };
};

export const useBlog = (id: number) => {
  const { data, pending, error, refresh } = useApiFetch(
    { apiType: 'common', url: `blogs/${id}`, method: 'get' }
  );

  const blog = computed<Blog | null>(() => {
    if (!data.value?.data) return null;
    return mapApiBlogToBlog(data.value.data);
  });

  return { blog, pending, error, refresh };
};

export default useBlogs;