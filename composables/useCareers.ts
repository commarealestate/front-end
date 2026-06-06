// composables/useCareers.ts
import type { UseFetchOptions } from "nuxt/app";

export interface CareerMessage {
  career_message_id: number;
  name: string;
  email: string;
  phone_number: string | null;
  years_of_experience: string | null;
  professional_field: string;
  link: string | null;
  message: string | null;
  is_read: boolean;
  read_at: string;
  created_at: string;
  updated_at: string;
}

export const useCareers = () => {
  // Default filter values
  const defaultFilters = {
    page: 1,
    per_page: 10,
    is_read: null as boolean | null,
    professional_field: '',
    email: '',
    min_experience: null as number | null,
    max_experience: null as number | null,
    from_date: '',
    to_date: '',
  };

  const filters = ref({ ...defaultFilters });

  // Clean filters for query: remove empty strings, null, undefined
  const cleanedFilters = computed(() => {
    const f = { ...filters.value };
    Object.keys(f).forEach(key => {
      const val = f[key as keyof typeof f];
      if (val === '' || val === null || val === undefined) {
        delete f[key as keyof typeof f];
      }
    });
    return f;
  });

  const { data, pending, error, refresh } = useApiFetch(
    { apiType: 'admin', url: 'careers', method: 'get' },
    { query: cleanedFilters }
  );

  const careers = computed<CareerMessage[]>(() => {
    if (!data.value?.data) return [];
    return data.value.data;
  });

  const pagination = computed(() => data.value?.meta || null);

  const fetchCareers = (newFilters?: Partial<typeof defaultFilters>) => {
    if (newFilters) {
      filters.value = { ...filters.value, ...newFilters };
    }
    // No need to call refresh because query is reactive
  };

  return {
    careers,
    pagination,
    pending,
    error,
    fetchCareers,
    filters,
  };
};

export const useCareer = (id: number) => {
  const { data, pending, error, refresh } = useApiFetch(
    { apiType: 'admin', url: `careers/${id}`, method: 'get' }
  );

  const career = computed<CareerMessage | null>(() => {
    if (!data.value?.data) return null;
    return data.value.data;
  });

  return { career, pending, error, refresh };
};