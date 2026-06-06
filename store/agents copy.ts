import { defineStore } from 'pinia'
import type { Agent, ServiceArea, PaginatedResponse } from '~/types/agent'
import { useNotificationStore } from './notification'

interface AgentsState {
  agents: Agent[]
  agent: Agent | null
  serviceAreas: ServiceArea[]
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  } | null
  loading: boolean
  error: string | null
}

export const useAgentsStore = defineStore('agents', {
  state: (): AgentsState => ({
    agents: [],
    agent: null,
    serviceAreas: [],
    pagination: null,
    loading: false,
    error: null,
  }),

  actions: {
    handleApiResponse(response: any) {
      if (response.status === 1) {
        return response.data
      } else {
        throw new Error(response.message || 'Request failed')
      }
    },

    async fetchServiceAreas() {
      this.loading = true
      try {
        const { data, error } = await useApiFetch({
          apiType: 'common',
          url: 'service/area',
          method: 'GET',
        }, {
          query: { per_page: 100 }
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        this.serviceAreas = result
        return result
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchAgents(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'common',
          url: 'agents',
          method: 'GET',
        }, {
          query: params,
        })
        if (error.value) throw error.value
        const result = data.value as PaginatedResponse<Agent>
        this.agents = result.data
        this.pagination = {
          currentPage: result.meta.current_page,
          lastPage: result.meta.last_page,
          perPage: result.meta.per_page,
          total: result.meta.total,
        }
        return result
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchAgent(id: number | string) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'common',
          url: `agents/${id}`,
          method: 'GET',
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        this.agent = result
        return this.agent
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    async createAgent(formData: FormData) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: 'agents',
          method: 'POST',
        }, {
          body: formData,
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        useNotificationStore().success('Success', 'Agent created successfully')
        return result
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateAgent(id: number | string, formData: FormData) {
      this.loading = true
      this.error = null
      try {
        formData.append('_method', 'patch')
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `agents/${id}`,
          method: 'POST',
        }, {
          body: formData,
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        useNotificationStore().success('Success', 'Agent updated successfully')
        return result
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    async toggleActive(id: number | string, active: boolean) {
      const formData = new FormData()
      formData.append('active', active ? '1' : '0')
      formData.append('_method', 'patch')
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `agents/${id}`,
          method: 'POST',
        }, {
          body: formData,
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        const index = this.agents.findIndex(a => a.agent_id === Number(id))
        if (index !== -1) {
          this.agents[index].active = active
        }
        useNotificationStore().success('Status Updated', `Agent ${active ? 'activated' : 'deactivated'}`)
        return result
      } catch (err: any) {
        useNotificationStore().error('Error', err.message)
        throw err
      }
    },

    async deleteAgent(id: number | string) {
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `agents/${id}`,
          method: 'DELETE',
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        this.agents = this.agents.filter(a => a.agent_id !== Number(id))
        useNotificationStore().success('Deleted', 'Agent deleted successfully')
        return result
      } catch (err: any) {
        useNotificationStore().error('Error', err.message)
        throw err
      }
    },

    async removeServiceArea(agentId: number | string, serviceAreaId: number | string) {
      const formData = new FormData()
      formData.append('service_area_id', String(serviceAreaId))
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `agents/${agentId}/service-area`,
          method: 'POST',
        }, {
          body: formData,
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        useNotificationStore().success('Removed', 'Service area removed from agent')
        return result
      } catch (err: any) {
        useNotificationStore().error('Error', err.message)
        throw err
      }
    },
  },
})