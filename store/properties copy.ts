import { defineStore } from 'pinia'
import type { Property, PaginatedResponse } from '~/types/property'
import { useNotificationStore } from './notification'

interface PropertiesState {
  properties: Property[]
  property: Property | null
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  } | null
  loading: boolean
  error: string | null
  hotDeal: Property | null
  hotDealLoading: boolean
}

export const usePropertiesStore = defineStore('properties', {
  state: (): PropertiesState => ({
    properties: [],
    property: null,
    pagination: null,
    loading: false,
    error: null,
    hotDeal: null,
    hotDealLoading: false,
  }),

  actions: {
    handleApiResponse(response: any) {
      if (response.status === 1) {
        return response.data
      } else {
        throw new Error(response.message || 'Request failed')
      }
    },

    async fetchProperties(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'common',
          url: 'properties',
          method: 'GET',
        }, {
          query: params,
        })

        if (error.value) throw error.value

        const result = data.value as PaginatedResponse<Property>
        this.properties = result.data
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

    async fetchProperty(id: number | string) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'common',
          url: `properties/${id}`,
          method: 'GET',
        })

        if (error.value) throw error.value

        const result = this.handleApiResponse(data.value)
        this.property = result as Property
        return this.property
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    async createProperty(formData: FormData) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: 'properties',
          method: 'POST',
        }, {
          body: formData,
        })

        if (error.value) throw error.value

        const result = this.handleApiResponse(data.value)
        useNotificationStore().success('Success', 'Property created successfully')
        return result
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateProperty(id: number | string, formData: FormData) {
      this.loading = true
      this.error = null
      try {
        formData.append('_method', 'patch')

        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `properties/${id}`,
          method: 'POST',
        }, {
          body: formData,
        })

        if (error.value) throw error.value

        const result = this.handleApiResponse(data.value)
        useNotificationStore().success('Success', 'Property updated successfully')
        return result
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    async toggleHotDeal(id: number | string, hotDeal: boolean, hotDealPrice?: number) {
      const formData = new FormData()
      formData.append('hot_deal', hotDeal ? '1' : '0')
      if (hotDeal && hotDealPrice !== undefined) {
        formData.append('hot_deal_price', String(hotDealPrice))
      }
      formData.append('_method', 'patch')

      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `properties/${id}`,
          method: 'POST',
        }, {
          body: formData,
        })

        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        const index = this.properties.findIndex(p => p.property_id === Number(id))
        if (index !== -1) {
          this.properties[index].hot_deal = hotDeal
          if (hotDealPrice) this.properties[index].hot_deal_price = String(hotDealPrice)
        }
        if (this.hotDeal && this.hotDeal.property_id === Number(id)) {
          this.hotDeal.hot_deal = hotDeal
          if (hotDealPrice) this.hotDeal.hot_deal_price = String(hotDealPrice)
        }
        useNotificationStore().success('Hot Deal Updated', `Hot deal ${hotDeal ? 'activated' : 'deactivated'}`)
        return result
      } catch (err: any) {
        useNotificationStore().error('Error', err.message)
        throw err
      }
    },

    async deleteProperty(id: number | string) {
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `properties/${id}`,
          method: 'DELETE',
        })

        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        this.properties = this.properties.filter(p => p.property_id !== Number(id))
        if (this.hotDeal && this.hotDeal.property_id === Number(id)) {
          this.hotDeal = null
        }
        useNotificationStore().success('Deleted', 'Property deleted successfully')
        return result
      } catch (err: any) {
        useNotificationStore().error('Error', err.message)
        throw err
      }
    },

    // Updated to use property_photos instead of images
    async deleteImage(propertyId: number | string, imagePath: string) {
      const formData = new FormData()
      formData.append('image', imagePath)

      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `properties/${propertyId}/image`,
          method: 'POST',
        }, {
          body: formData,
        })

        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        if (this.property && this.property.property_id === Number(propertyId)) {
          this.property.property_photos = this.property.property_photos.filter(img => img !== imagePath)
        }
        if (this.hotDeal && this.hotDeal.property_id === Number(propertyId)) {
          this.hotDeal.property_photos = this.hotDeal.property_photos.filter(img => img !== imagePath)
        }
        useNotificationStore().success('Image Deleted', 'Image removed successfully')
        return result
      } catch (err: any) {
        useNotificationStore().error('Error', err.message)
        throw err
      }
    },

    async fetchHotDeal() {
      this.hotDealLoading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'common',
          url: 'properties',
          method: 'GET',
        }, {
          query: { hot_deal: 1, per_page: 1 }
        })

        if (error.value) throw error.value

        const result = data.value as PaginatedResponse<Property>
        this.hotDeal = result.data?.[0] || null
        return this.hotDeal
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.hotDealLoading = false
      }
    },
  },
})