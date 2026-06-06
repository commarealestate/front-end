import { defineStore } from 'pinia'
import type { Talent, PaginatedResponse } from '~/types/talent'
import { useNotificationStore } from './notification'

interface TalentsState {
  talents: Talent[]
  talent: Talent | null
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  } | null
  loading: boolean
  error: string | null
}

export const useTalentsStore = defineStore('talents', {
  state: (): TalentsState => ({
    talents: [],
    talent: null,
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

    // Fetch all talents (common endpoint)
    async fetchTalents(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'common',
          url: 'talents',
          method: 'GET',
        }, {
          query: params,
        })
        if (error.value) throw error.value
        const result = data.value as PaginatedResponse<Talent>
        this.talents = result.data
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

    // Fetch single talent (common)
    async fetchTalent(id: number | string) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'common',
          url: `talents/${id}`,
          method: 'GET',
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        this.talent = result
        return this.talent
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Create talent (admin, multipart/form-data)
    async createTalent(formData: FormData) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: 'talents',
          method: 'POST',
        }, {
          body: formData,
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        useNotificationStore().success('Success', 'Talent created successfully')
        return result
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Update talent (admin, POST with _method=patch)
    async updateTalent(id: number | string, formData: FormData) {
      this.loading = true
      this.error = null
      try {
        formData.append('_method', 'patch')
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `talents/${id}`,
          method: 'POST',
        }, {
          body: formData,
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        useNotificationStore().success('Success', 'Talent updated successfully')
        return result
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Delete talent
    async deleteTalent(id: number | string) {
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `talents/${id}`,
          method: 'DELETE',
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        this.talents = this.talents.filter(t => t.talent_id !== Number(id))
        useNotificationStore().success('Deleted', 'Talent deleted successfully')
        return result
      } catch (err: any) {
        useNotificationStore().error('Error', err.message)
        throw err
      }
    },
  },
})