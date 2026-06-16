import { defineStore } from 'pinia'
import type { Moment, PaginatedResponse } from '~/types/moment'
import { useNotificationStore } from './notification'
import { apiErrorFromFetchError, apiErrorFromResponse } from '~/utils/apiError'

interface MomentsState {
  moments: Moment[]
  moment: Moment | null
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  } | null
  loading: boolean
  error: string | null
}

export const useMomentsStore = defineStore('moments', {
  state: (): MomentsState => ({
    moments: [],
    moment: null,
    pagination: null,
    loading: false,
    error: null,
  }),

  actions: {
    handleApiResponse(response: any) {
      if (response?.status === 1) {
        return response.data
      }

      throw apiErrorFromResponse(response)
    },

    // Fetch all moments (common endpoint)
    async fetchMoments(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'common',
          url: 'emiratisation/moments',
          method: 'GET',
        }, {
          query: params,
        })
        if (error.value) throw apiErrorFromFetchError(error.value, data.value)
        const result = data.value as PaginatedResponse<Moment>
        this.moments = result.data
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

    // Fetch single moment (common)
    async fetchMoment(id: number | string) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'common',
          url: `emiratisation/moments/${id}`,
          method: 'GET',
        })
        if (error.value) throw apiErrorFromFetchError(error.value, data.value)
        const result = this.handleApiResponse(data.value)
        this.moment = result
        return this.moment
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Create moment (admin, multipart/form-data)
    async createMoment(formData: FormData) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: 'emiratisation/moments',
          method: 'POST',
        }, {
          body: formData,
        })
        if (error.value) throw apiErrorFromFetchError(error.value, data.value)
        const result = this.handleApiResponse(data.value)
        useNotificationStore().success('Success', 'Moment created successfully')
        return result
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Update moment (admin, POST with _method=patch)
    async updateMoment(id: number | string, formData: FormData) {
      this.loading = true
      this.error = null
      try {
        formData.append('_method', 'patch')
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `emiratisation/moments/${id}`,
          method: 'POST',
        }, {
          body: formData,
        })
        if (error.value) throw apiErrorFromFetchError(error.value, data.value)
        const result = this.handleApiResponse(data.value)
        useNotificationStore().success('Success', 'Moment updated successfully')
        return result
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Delete moment
    async deleteMoment(id: number | string) {
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `emiratisation/moments/${id}`,
          method: 'DELETE',
        })
        if (error.value) throw apiErrorFromFetchError(error.value, data.value)
        const result = this.handleApiResponse(data.value)
        this.moments = this.moments.filter(m => m.emiratisation_moments_id !== Number(id))
        useNotificationStore().success('Deleted', 'Moment deleted successfully')
        return result
      } catch (err: any) {
        useNotificationStore().error('Error', err.message)
        throw err
      }
    },
  },
})