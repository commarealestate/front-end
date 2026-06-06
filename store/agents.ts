import { defineStore } from "pinia";
import type { Agent } from "~/types/agent";
import { useNotificationStore } from "./notification";

interface AgentsState {
  agents: Agent[];
  agent: Agent | null;
  loading: boolean;
  error: string | null;
  serviceAreas: any[];
  serviceAreasLoading: boolean;
}

export const useAgentsStore = defineStore("agents", {
  state: (): AgentsState => ({
    agents: [],
    agent: null,
    loading: false,
    error: null,
    serviceAreas: [],
    serviceAreasLoading: false,
  }),

  getters: {
    // Only agents that should be shown on the website
    visibleAgents: (state) =>
      state.agents.filter((agent) => agent.show_on_website === "Yes"),
    visibleCount: (state) =>
      state.agents.filter((agent) => agent.show_on_website === "Yes").length,
  },

  actions: {
    async fetchAgents() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(
          "https://myemirateshome.com/im4exr/listings-api/index.php/users",
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // The API returns { data: [...], meta: {...} }
        this.agents = data.data || [];
        return this.agents;
      } catch (err: any) {
        this.error = err.message;
        const notification = useNotificationStore();
        notification.error("Error", err.message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchAgent(id: number) {
      // First ensure agents are loaded
      if (this.agents.length === 0) {
        await this.fetchAgents();
      }
      const found = this.agents.find((a) => Number(a.id) === id);
      if (found && found.show_on_website === "Yes") {
        this.agent = found;
        return this.agent;
      } else {
        this.agent = null;
        throw new Error("Agent not found or not visible");
      }
    },

    async fetchServiceAreas() {
      this.serviceAreasLoading = true;
      try {
        // This might be a separate endpoint; adapt as needed
        // For now, we extract unique service areas from agents
        const areasMap = new Map();
        this.agents.forEach((agent) => {
          if (agent.service_areas && Array.isArray(agent.service_areas)) {
            agent.service_areas.forEach((area: any) => {
              if (!areasMap.has(area.service_area_id)) {
                areasMap.set(area.service_area_id, area);
              }
            });
          }
        });
        this.serviceAreas = Array.from(areasMap.values());
        return this.serviceAreas;
      } catch (err: any) {
        this.error = err.message;
        throw err;
      } finally {
        this.serviceAreasLoading = false;
      }
    },
  },
});
