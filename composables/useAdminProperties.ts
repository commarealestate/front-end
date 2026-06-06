// composables/useAdminProperties.ts
import { useToast } from "vue-toastification";

export const useAdminProperties = () => {
  const toast = useToast();
  const { t } = useI18n();

  const buildFormData = (data: Record<string, any>, method: 'post' | 'patch' = 'post'): FormData => {
    const formData = new FormData();

    const append = (key: string, value: any) => {
      if (value === null || value === undefined) return;
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && !(item instanceof File)) {
            Object.entries(item).forEach(([subKey, subValue]) => {
              append(`${key}[${index}][${subKey}]`, subValue);
            });
          } else {
            append(`${key}[]`, item);
          }
        });
      } else if (typeof value === 'object' && !(value instanceof File)) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          append(`${key}[${subKey}]`, subValue);
        });
      } else {
        formData.append(key, value);
      }
    };

    Object.entries(data).forEach(([key, value]) => append(key, value));

    if (method === 'patch') {
      formData.append('_method', 'patch');
    }
    return formData;
  };

  const createProperty = async (formData: FormData) => {
    try {
      const { data, error } = await $apiFetch(
        { apiType: 'admin', url: 'properties', method: 'post' },
        { body: formData }
      );
      if (error.value) throw error.value;
      toast.success(t('admin.properties.created'));
      return data.value;
    } catch (err) {
      toast.error(t('admin.properties.create_error'));
      throw err; // rethrow so page can handle field errors
    }
  };

  const updateProperty = async (id: number, formData: FormData) => {
    try {
      const { data, error } = await $apiFetch(
        { apiType: 'admin', url: `properties/${id}`, method: 'post' },
        { body: formData }
      );
      if (error.value) throw error.value;
      toast.success(t('admin.properties.updated'));
      return data.value;
    } catch (err) {
      toast.error(t('admin.properties.update_error'));
      throw err;
    }
  };

  const deleteProperty = async (id: number) => {
    try {
      const { data, error } = await $apiFetch(
        { apiType: 'admin', url: `properties/${id}`, method: 'delete' }
      );
      if (error.value) throw error.value;
      toast.success(t('admin.properties.deleted'));
      return data.value;
    } catch (err) {
      toast.error(t('admin.properties.delete_error'));
      throw err;
    }
  };

  const toggleHotDeal = async (id: number, hotDeal: boolean, hotDealPrice?: number) => {
    const payload: Record<string, any> = {
      hot_deal: hotDeal ? '1' : '0',
    };
    if (hotDeal && hotDealPrice !== undefined && hotDealPrice > 0) {
      payload.hot_deal_price = hotDealPrice.toString();
    } else {
      payload.hot_deal_price = '0'; // or send original price? but we'll handle in page
    }
    const formData = buildFormData(payload, 'patch');
    return updateProperty(id, formData);
  };

  return { createProperty, updateProperty, deleteProperty, toggleHotDeal, buildFormData };
};