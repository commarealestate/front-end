import { defineStore } from "pinia";
import type { Agent, PaginatedResponse, ServiceArea } from "~/types/agent";
import { useNotificationStore } from "./notification";

interface AgentsState {
  agents: Agent[];
  agent: Agent | null;
  serviceAreas: ServiceArea[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  } | null;
  loading: boolean;
  error: string | null;
}

function agentId(agent: Partial<Agent>) {
  return Number(agent.agent_id ?? agent.id);
}

function isWebsiteVisible(agent: Agent) {
  return agent.active !== false && agent.active !== 0 && agent.active !== "0";
}

function normalizeMediaUrl(value: string) {
  if (!value) return value;

  const storagePathMarker = "/storage/app/public/";
  const markerIndex = value.indexOf(storagePathMarker);

  if (markerIndex !== -1) {
    const publicPath = `/storage/${value.slice(markerIndex + storagePathMarker.length)}`;
    try {
      return value.startsWith("http") ? `${new URL(value).origin}${publicPath}` : publicPath;
    } catch {
      return publicPath;
    }
  }

  if (value.startsWith("storage/app/public/")) {
    return `/storage/${value.slice("storage/app/public/".length)}`;
  }

  return value;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string" && item.length > 0)
      .map(normalizeMediaUrl);
  }

  if (typeof value === "string" && value.length > 0) {
    return [normalizeMediaUrl(value)];
  }

  return [];
}

function normalizeAgent(agent: Agent): Agent {
  const personalPhoto = asStringArray(agent.personal_photo).length
    ? asStringArray(agent.personal_photo)
    : asStringArray(agent.photo);
  const photo = asStringArray(agent.photo).length ? asStringArray(agent.photo) : personalPhoto;

  return {
    ...agent,
    personal_photo: personalPhoto,
    photo,
    name: agent.name || agent.first_name,
    first_name: agent.first_name || agent.name || "",
    email: agent.email || agent.e_mail || null,
    e_mail: agent.e_mail || agent.email || "",
  };
}

function apiErrorFromResponse(response: any) {
  const message = response?.message || "Request failed";
  const error = new Error(message) as Error & { validationErrors?: any; response?: any };
  error.validationErrors = response?.errors;
  error.response = response;
  return error;
}

function apiErrorFromFetchError(error: any, fallbackResponse?: any) {
  const response = error?.data || error?.response?._data || fallbackResponse;
  if (response) {
    return apiErrorFromResponse(response);
  }

  return error;
}

export const useAgentsStore = defineStore("agents", {
  state: (): AgentsState => ({
    agents: [],
    agent: null,
    serviceAreas: [],
    pagination: null,
    loading: false,
    error: null,
  }),

  getters: {
    visibleAgents: (state) => state.agents.filter(isWebsiteVisible),
    visibleCount: (state) => state.agents.filter(isWebsiteVisible).length,
  },

  actions: {
    handleApiResponse(response: any) {
      if (response?.status === 1) {
        return response.data;
      }

      throw apiErrorFromResponse(response);
    },

    async fetchServiceAreas() {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await useApiFetch(
          {
            apiType: "common",
            url: "service/area",
            method: "GET",
          },
          {
            query: { per_page: 100 },
          },
        );
        if (error.value) throw apiErrorFromFetchError(error.value, data.value);
        const result = this.handleApiResponse(data.value);
        this.serviceAreas = result || [];
        return this.serviceAreas;
      } catch (err: any) {
        this.error = err.message;
        useNotificationStore().error("Error", err.message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchAgents(params?: Record<string, any>) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await useApiFetch(
          {
            apiType: "common",
            url: "agents",
            method: "GET",
          },
          {
            query: params,
          },
        );
        if (error.value) throw apiErrorFromFetchError(error.value, data.value);

        const result = data.value as PaginatedResponse<Agent>;
        this.agents = (result.data || []).map(normalizeAgent);
        this.pagination = result.meta
          ? {
              currentPage: result.meta.current_page,
              lastPage: result.meta.last_page,
              perPage: result.meta.per_page,
              total: result.meta.total,
            }
          : null;
        return result;
      } catch (err: any) {
        this.error = err.message;
        useNotificationStore().error("Error", err.message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchAgent(id: number | string) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await useApiFetch({
          apiType: "admin",
          url: `agents/${id}`,
          method: "GET",
        });
        if (error.value) throw apiErrorFromFetchError(error.value, data.value);
        const result = this.handleApiResponse(data.value);
        this.agent = normalizeAgent(result);
        return this.agent;
      } catch (err: any) {
        this.error = err.message;
        useNotificationStore().error("Error", err.message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createAgent(formData: FormData) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await useApiFetch(
          {
            apiType: "admin",
            url: "agents",
            method: "POST",
          },
          {
            body: formData,
          },
        );
        if (error.value) throw apiErrorFromFetchError(error.value, data.value);
        const result = this.handleApiResponse(data.value);
        useNotificationStore().success("Success", "Agent created successfully");
        return result;
      } catch (err: any) {
        this.error = err.message;
        useNotificationStore().error("Error", err.message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateAgent(id: number | string, formData: FormData) {
      this.loading = true;
      this.error = null;
      try {
        if (!formData.has("_method")) {
          formData.append("_method", "patch");
        }
        const { data, error } = await useApiFetch(
          {
            apiType: "admin",
            url: `agents/${id}`,
            method: "POST",
          },
          {
            body: formData,
          },
        );
        if (error.value) throw apiErrorFromFetchError(error.value, data.value);
        const result = this.handleApiResponse(data.value);
        useNotificationStore().success("Success", "Agent updated successfully");
        return result;
      } catch (err: any) {
        this.error = err.message;
        useNotificationStore().error("Error", err.message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async toggleActive(id: number | string, active: boolean) {
      const formData = new FormData();
      formData.append("active", active ? "1" : "0");
      formData.append("show_on_website", active ? "Yes" : "No");
      formData.append("_method", "patch");
      try {
        const { data, error } = await useApiFetch(
          {
            apiType: "admin",
            url: `agents/${id}`,
            method: "POST",
          },
          {
            body: formData,
          },
        );
        if (error.value) throw apiErrorFromFetchError(error.value, data.value);
        const result = this.handleApiResponse(data.value);
        const index = this.agents.findIndex((agent) => agentId(agent) === Number(id));
        if (index !== -1) {
          this.agents[index].active = active;
          this.agents[index].show_on_website = active ? "Yes" : "No";
        }
        useNotificationStore().success("Status Updated", `Agent ${active ? "activated" : "deactivated"}`);
        return result;
      } catch (err: any) {
        useNotificationStore().error("Error", err.message);
        throw err;
      }
    },

    async deleteAgent(id: number | string) {
      try {
        const { data, error } = await useApiFetch({
          apiType: "admin",
          url: `agents/${id}`,
          method: "DELETE",
        });
        if (error.value) throw apiErrorFromFetchError(error.value, data.value);
        const result = this.handleApiResponse(data.value);
        this.agents = this.agents.filter((agent) => agentId(agent) !== Number(id));
        useNotificationStore().success("Deleted", "Agent deleted successfully");
        return result;
      } catch (err: any) {
        useNotificationStore().error("Error", err.message);
        throw err;
      }
    },

    async removeServiceArea(agentIdValue: number | string, serviceAreaId: number | string) {
      const formData = new FormData();
      formData.append("service_area_id", String(serviceAreaId));
      try {
        const { data, error } = await useApiFetch(
          {
            apiType: "admin",
            url: `agents/${agentIdValue}/service-area`,
            method: "POST",
          },
          {
            body: formData,
          },
        );
        if (error.value) throw apiErrorFromFetchError(error.value, data.value);
        const result = this.handleApiResponse(data.value);
        useNotificationStore().success("Removed", "Service area removed from agent");
        return result;
      } catch (err: any) {
        useNotificationStore().error("Error", err.message);
        throw err;
      }
    },
  },
});
