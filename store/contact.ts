import { defineStore } from 'pinia'
import type { ContactMessage, PaginatedResponse } from '~/types/contact'
import { useNotificationStore } from './notification'

interface ContactState {
  messages: ContactMessage[]
  message: ContactMessage | null
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  } | null
  loading: boolean
  error: string | null
}

export const useContactStore = defineStore('contact', {
  state: (): ContactState => ({
    messages: [],
    message: null,
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

    // Fetch all messages (admin)
    async fetchMessages(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: 'contact-us',
          method: 'GET',
        }, {
          query: params,
        })
        if (error.value) throw error.value
        const result = data.value as PaginatedResponse<ContactMessage>
        this.messages = result.data
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

    // Fetch single message
    async fetchMessage(id: number | string) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `contact-us/${id}`,
          method: 'GET',
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        this.message = result
        return this.message
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Reply to a message
    async replyToMessage(id: number | string, replyMessage: string) {
      this.loading = true
      this.error = null
      try {
        const formData = new FormData()
        formData.append('reply_message', replyMessage)

        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `contact-us/${id}/reply`,
          method: 'POST',
        }, {
          body: formData,
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        // Update local state if needed
        if (this.message && this.message.contact_us_id === Number(id)) {
          this.message.reply_message = replyMessage
        }
        useNotificationStore().success('Reply sent', 'Your reply has been sent successfully')
        return result
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Mark one or more messages as read
    async markAsRead(ids: number[]) {
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: 'contact-us/mark-as-read',
          method: 'POST',
        }, {
          body: { ids },
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        // Update local state
        this.messages = this.messages.map(msg =>
          ids.includes(msg.contact_us_id) ? { ...msg, is_read: true } : msg
        )
        if (this.message && ids.includes(this.message.contact_us_id)) {
          this.message.is_read = true
        }
        useNotificationStore().success('Marked as read', `${ids.length} message(s) marked as read`)
        return result
      } catch (err: any) {
        useNotificationStore().error('Error', err.message)
        throw err
      }
    },

    // Delete a message
    async deleteMessage(id: number | string) {
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `contact-us/${id}`,
          method: 'DELETE',
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        this.messages = this.messages.filter(msg => msg.contact_us_id !== Number(id))
        if (this.message && this.message.contact_us_id === Number(id)) {
          this.message = null
        }
        useNotificationStore().success('Deleted', 'Message deleted successfully')
        return result
      } catch (err: any) {
        useNotificationStore().error('Error', err.message)
        throw err
      }
    },
  },
})