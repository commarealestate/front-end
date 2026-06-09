import { defineStore } from "pinia";
import type { PropertyAttributeDefinition } from "~/types/property";
import { useNotificationStore } from "./notification";

interface PropertyAttributesState {
  definitions: PropertyAttributeDefinition[];
  meta: {
    listing_categories: string[];
    field_types: string[];
    property_columns: string[];
  } | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const usePropertyAttributesStore = defineStore("propertyAttributes", {
  state: (): PropertyAttributesState => ({
    definitions: [],
    meta: null,
    loading: false,
    saving: false,
    error: null,
  }),

  actions: {
    async fetchDefinitions(filters: Record<string, any> = {}) {
      this.loading = true;
      this.error = null;

      try {
        const { data, error } = await useApiFetch({
          url: "property-attribute-definitions",
          method: "GET",
          apiType: "admin",
        }, { query: filters });

        if (error.value) throw error.value;

        const payload = data.value as any;
        this.definitions = payload?.data || [];
      } catch (err: any) {
        this.error = err?.message || "Failed to load property attributes";
        useNotificationStore().error({ title: "Error", message: this.error });
      } finally {
        this.loading = false;
      }
    },

    async fetchMeta() {
      try {
        const { data, error } = await useApiFetch({
          url: "property-attribute-definitions/meta",
          method: "GET",
          apiType: "admin",
        });

        if (error.value) throw error.value;

        const payload = data.value as any;
        this.meta = payload?.data || null;
      } catch (err: any) {
        useNotificationStore().error({
          title: "Error",
          message: err?.message || "Failed to load attribute metadata",
        });
      }
    },

    async createDefinition(payload: Partial<PropertyAttributeDefinition>) {
      this.saving = true;

      try {
        const { data, error } = await useApiFetch({
          url: "property-attribute-definitions",
          method: "POST",
          apiType: "admin",
        }, { body: payload });

        if (error.value) throw error.value;

        const created = (data.value as any)?.data;
        if (created) this.definitions.push(created);
        useNotificationStore().success({ title: "Saved", message: "Attribute created successfully." });
        return created;
      } catch (err: any) {
        useNotificationStore().error({
          title: "Error",
          message: err?.message || "Failed to create attribute",
        });
        throw err;
      } finally {
        this.saving = false;
      }
    },

    async updateDefinition(id: number, payload: Partial<PropertyAttributeDefinition>) {
      this.saving = true;

      try {
        const { data, error } = await useApiFetch({
          url: `property-attribute-definitions/${id}`,
          method: "PATCH",
          apiType: "admin",
        }, { body: payload });

        if (error.value) throw error.value;

        const updated = (data.value as any)?.data;
        if (updated) {
          const index = this.definitions.findIndex((item) => item.id === id);
          if (index >= 0) this.definitions[index] = updated;
        }

        useNotificationStore().success({ title: "Saved", message: "Attribute updated successfully." });
        return updated;
      } catch (err: any) {
        useNotificationStore().error({
          title: "Error",
          message: err?.message || "Failed to update attribute",
        });
        throw err;
      } finally {
        this.saving = false;
      }
    },

    async deleteDefinition(id: number) {
      try {
        const { error } = await useApiFetch({
          url: `property-attribute-definitions/${id}`,
          method: "DELETE",
          apiType: "admin",
        });

        if (error.value) throw error.value;

        this.definitions = this.definitions.filter((item) => item.id !== id);
        useNotificationStore().success({ title: "Deleted", message: "Attribute removed successfully." });
      } catch (err: any) {
        useNotificationStore().error({
          title: "Error",
          message: err?.message || "Failed to delete attribute",
        });
        throw err;
      }
    },
  },
});
