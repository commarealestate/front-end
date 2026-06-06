// ~/store/projects.ts
import { defineStore } from "pinia";
import type {
  Project,
  ApiProjectResponse,
  ApiSingleProjectResponse,
} from "~/types/project";
import { useNotificationStore } from "./notification";

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  } | null;
  loading: boolean;
  error: string | null;
  adminLoading: boolean;
  adminError: string | null;
}

export const useProjectsStore = defineStore("projects", {
  state: (): ProjectsState => ({
    projects: [],
    currentProject: null,
    pagination: null,
    loading: false,
    error: null,
    adminLoading: false,
    adminError: null,
  }),

  actions: {
    // Helper to extract data from response (handles both wrapped and direct responses)
    extractData(response: any) {
      // If response has status 0, it's an error
      if (response.status === 0) {
        throw this.createValidationError(response);
      }
      // If response has data property, return it (both success patterns)
      if (response.data) {
        return response.data;
      }
      // If response itself is the data object (unlikely but fallback)
      return response;
    },

    // Create a formatted error from API response
    createValidationError(response: any) {
      let message = response.message || "Request failed";
      if (
        response.errors &&
        Array.isArray(response.errors) &&
        response.errors.length
      ) {
        message = response.errors.join("\n");
      } else if (response.errors && typeof response.errors === "object") {
        // Laravel style errors object
        const errorMessages = Object.values(response.errors).flat().join("\n");
        if (errorMessages) message = errorMessages;
      }
      const error = new Error(message);
      (error as any).validationErrors = response.errors;
      return error;
    },

    // ------------------------------------------------------------------
    // Public: Fetch all projects (with filters/pagination)
    // ------------------------------------------------------------------
    async fetchProjects(params: Record<string, any> = {}) {
      this.loading = true;
      this.error = null;
      const notification = useNotificationStore();
      try {
        const { data, error } = await useApiFetch(
          {
            apiType: "common",
            url: "projects",
            method: "GET",
          },
          { query: params },
        );

        if (error.value) throw error.value;

        const response = data.value as ApiProjectResponse;
        // For the list endpoint, we expect status, data, meta
        if (response.status !== 1) {
          throw new Error(response.message || "Failed to fetch projects");
        }

        this.projects = response.data;
        this.pagination = {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          total: response.meta.total,
        };

        return {
          projects: this.projects,
          pagination: this.pagination,
        };
      } catch (err: any) {
        this.error = err.message;
        notification.error("Error", err.message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // ------------------------------------------------------------------
    // Public: Fetch single project by ID
    // ------------------------------------------------------------------
    async fetchProjectById(id: number | string) {
      this.loading = true;
      this.error = null;
      const notification = useNotificationStore();
      try {
        const { data, error } = await useApiFetch({
          apiType: "common",
          url: `projects/${id}`,
          method: "GET",
        });

        if (error.value) throw error.value;

        const response = data.value;
        let projectData = null;

        // Handle different response structures
        if (response && response.status === 1 && response.data) {
          projectData = response.data;
        } else if (response && response.data) {
          projectData = response.data;
        } else if (response && response.project_id) {
          projectData = response;
        } else {
          throw new Error("Invalid response format from API");
        }

        this.currentProject = projectData;
        return this.currentProject;
      } catch (err: any) {
        this.error = err.message;
        notification.error("Error", err.message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // ------------------------------------------------------------------
    // Admin: Create a new project (multipart/form-data)
    // ------------------------------------------------------------------
    async createProject(formData: FormData) {
      this.adminLoading = true;
      this.adminError = null;
      const notification = useNotificationStore();
      try {
        const { data, error } = await useApiFetch(
          {
            apiType: "admin",
            url: "projects",
            method: "POST",
          },
          { body: formData },
        );

        if (error.value) throw error.value;

        const responseData = data.value;
        // Extract the actual data (could be directly the project or wrapped)
        const project = this.extractData(responseData);
        notification.success("Success", "Project created successfully");
        return project;
      } catch (err: any) {
        this.adminError = err.message;
        notification.error("Error", err.message);
        throw err;
      } finally {
        this.adminLoading = false;
      }
    },

    // ------------------------------------------------------------------
    // Admin: Update an existing project (multipart/form-data)
    // ------------------------------------------------------------------
    async updateProject(id: number | string, formData: FormData) {
      this.adminLoading = true;
      this.adminError = null;
      const notification = useNotificationStore();
      try {
        // Add _method=patch for Laravel
        formData.append("_method", "patch");

        const { data, error } = await useApiFetch(
          {
            apiType: "admin",
            url: `projects/${id}`,
            method: "POST",
          },
          { body: formData },
        );

        if (error.value) throw error.value;

        const responseData = data.value;
        const project = this.extractData(responseData);
        notification.success("Success", "Project updated successfully");
        return project;
      } catch (err: any) {
        this.adminError = err.message;
        notification.error("Error", err.message);
        throw err;
      } finally {
        this.adminLoading = false;
      }
    },

    // ------------------------------------------------------------------
    // Admin: Delete a project
    // ------------------------------------------------------------------
    async deleteProject(id: number | string) {
      this.adminLoading = true;
      this.adminError = null;
      const notification = useNotificationStore();
      try {
        const { data, error } = await useApiFetch({
          apiType: "admin",
          url: `projects/${id}`,
          method: "DELETE",
        });

        if (error.value) throw error.value;

        const responseData = data.value;
        // For delete, the response might be { status: 1, message: ... } or just { message }
        // We'll just check if we got a success indication
        if (responseData.status === 0) {
          throw this.createValidationError(responseData);
        }

        // Remove from local list if present
        this.projects = this.projects.filter(
          (p) => p.project_id !== Number(id),
        );
        if (this.currentProject?.project_id === Number(id)) {
          this.currentProject = null;
        }
        notification.success("Deleted", "Project deleted successfully");
        return responseData;
      } catch (err: any) {
        this.adminError = err.message;
        notification.error("Error", err.message);
        throw err;
      } finally {
        this.adminLoading = false;
      }
    },

    // ------------------------------------------------------------------
    // Admin: Delete a gallery image by gallery ID
    // ------------------------------------------------------------------
    async deleteGalleryImage(galleryId: number | string) {
      this.adminLoading = true;
      const notification = useNotificationStore();
      try {
        const { data, error } = await useApiFetch({
          apiType: "admin",
          url: `projects/gallery/${galleryId}`,
          method: "DELETE",
        });

        if (error.value) throw error.value;

        const responseData = data.value;
        if (responseData.status === 0) {
          throw this.createValidationError(responseData);
        }

        // Remove from currentProject gallery array if present
        if (this.currentProject) {
          this.currentProject.gallery = this.currentProject.gallery.filter(
            (g) => g.id !== Number(galleryId),
          );
        }
        notification.success("Success", "Gallery image deleted");
        return responseData;
      } catch (err: any) {
        notification.error("Error", err.message);
        throw err;
      } finally {
        this.adminLoading = false;
      }
    },

    // ------------------------------------------------------------------
    // Admin: Delete a section by section ID
    // ------------------------------------------------------------------
    async deleteSection(sectionId: number | string) {
      this.adminLoading = true;
      const notification = useNotificationStore();
      try {
        const { data, error } = await useApiFetch({
          apiType: "admin",
          url: `projects/sections/${sectionId}`,
          method: "DELETE",
        });

        if (error.value) throw error.value;

        const responseData = data.value;
        if (responseData.status === 0) {
          throw this.createValidationError(responseData);
        }

        if (this.currentProject) {
          this.currentProject.sections = this.currentProject.sections.filter(
            (s) => s.id !== Number(sectionId),
          );
        }
        notification.success("Success", "Section deleted");
        return responseData;
      } catch (err: any) {
        notification.error("Error", err.message);
        throw err;
      } finally {
        this.adminLoading = false;
      }
    },

    // ------------------------------------------------------------------
    // Admin: Delete a detail block by detail ID
    // ------------------------------------------------------------------
    async deleteDetail(detailId: number | string) {
      this.adminLoading = true;
      const notification = useNotificationStore();
      try {
        const { data, error } = await useApiFetch({
          apiType: "admin",
          url: `projects/details/${detailId}`,
          method: "DELETE",
        });

        if (error.value) throw error.value;

        const responseData = data.value;
        if (responseData.status === 0) {
          throw this.createValidationError(responseData);
        }

        if (this.currentProject) {
          this.currentProject.details = this.currentProject.details.filter(
            (d) => d.details_id !== Number(detailId),
          );
        }
        notification.success("Success", "Detail block deleted");
        return responseData;
      } catch (err: any) {
        notification.error("Error", err.message);
        throw err;
      } finally {
        this.adminLoading = false;
      }
    },

    // ------------------------------------------------------------------
    // Admin: Delete a detail item by item ID
    // ------------------------------------------------------------------
    async deleteDetailItem(itemId: number | string) {
      this.adminLoading = true;
      const notification = useNotificationStore();
      try {
        const { data, error } = await useApiFetch({
          apiType: "admin",
          url: `projects/detail-items/${itemId}`,
          method: "DELETE",
        });

        if (error.value) throw error.value;

        const responseData = data.value;
        if (responseData.status === 0) {
          throw this.createValidationError(responseData);
        }

        // Remove from currentProject details items
        if (this.currentProject) {
          for (const detail of this.currentProject.details) {
            detail.items = detail.items.filter(
              (i) => i.item_id !== Number(itemId),
            );
          }
        }
        notification.success("Success", "Detail item deleted");
        return responseData;
      } catch (err: any) {
        notification.error("Error", err.message);
        throw err;
      } finally {
        this.adminLoading = false;
      }
    },
  },
});
