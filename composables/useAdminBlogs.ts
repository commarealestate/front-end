// composables/useAdminBlogs.ts
import type { UseFetchOptions } from "nuxt/app";

// ---------- Types ----------
export interface BlogTag {
  tag_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface AdminBlog {
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

export interface AdminBlogFormData {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  content_en: string;
  content_ar: string;
  read_time: number;
  is_active: number;
  tags: string[]; // array of tag titles
  image?: File | null; // for upload
  ext_link?: string; // optional external link
}

// ---------- Composables ----------
export const useAdminBlogs = () => {
  const filters = ref({
    page: 1,
    per_page: 10,
    is_active: null as number | null,
    tags: [] as string[],
  });

  const { data, pending, error, refresh } = useApiFetch(
    { apiType: 'common', url: 'blogs', method: 'get' },
    { query: filters.value }
  );

  const blogs = computed<AdminBlog[]>(() => {
    if (!data.value?.data) return [];
    return data.value.data;
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

export const useAdminBlog = (id: number) => {
  const { data, pending, error, refresh } = useApiFetch(
    { apiType: 'common', url: `blogs/${id}`, method: 'get' }
  );

  const blog = computed<AdminBlog | null>(() => {
    if (!data.value?.data) return null;
    return data.value.data;
  });

  return { blog, pending, error, refresh };
};

// Create blog (multipart/form-data)
export const useCreateAdminBlog = async (formData: FormData) => {
  const { data, error } = await useApiFetch(
    { apiType: 'admin', url: 'blogs', method: 'post' },
    { body: formData }
  );
  return { data, error };
};

// Update blog (with _method: patch)
export const useUpdateAdminBlog = async (id: number, formData: FormData) => {
  // Add _method: patch to FormData
  formData.append('_method', 'patch');
  const { data, error } = await useApiFetch(
    { apiType: 'admin', url: `blogs/${id}`, method: 'post' },
    { body: formData }
  );
  return { data, error };
};

// Delete blog
export const useDeleteAdminBlog = async (id: number) => {
  const { data, error } = await useApiFetch(
    { apiType: 'admin', url: `blogs/${id}`, method: 'delete' }
  );
  return { data, error };
};

// Helper to convert AdminBlogFormData to FormData
export const blogFormToFormData = (form: AdminBlogFormData): FormData => {
  const fd = new FormData();
  fd.append('title_en', form.title_en);
  fd.append('title_ar', form.title_ar);
  fd.append('description_en', form.description_en);
  fd.append('description_ar', form.description_ar);
  fd.append('content_en', form.content_en);
  fd.append('content_ar', form.content_ar);
  fd.append('read_time', String(form.read_time));
  fd.append('is_active', String(form.is_active));
  if (form.image) {
    fd.append('image', form.image);
  }
  if (form.ext_link) {
    fd.append('ext_link', form.ext_link);
  }
  // Append tags as array (multiple fields with same key)
  form.tags.forEach(tag => {
    fd.append('tags[]', tag);
  });
  return fd;
};