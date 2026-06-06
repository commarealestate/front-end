import { defineStore } from 'pinia'
import type { Blog, Tag, PaginatedResponse } from '~/types/blog'
import { useNotificationStore } from './notification'

interface BlogsState {
  blogs: Blog[]
  blog: Blog | null
  tags: Tag[]
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  } | null
  loading: boolean
  error: string | null
}

export const useBlogsStore = defineStore('blogs', {
  state: (): BlogsState => ({
    blogs: [],
    blog: null,
    tags: [],
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

    // Fetch all tags (common endpoint)
    async fetchTags() {
      this.loading = true
      try {
        const { data, error } = await useApiFetch({
          apiType: 'common',
          url: 'tags',
          method: 'GET',
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        this.tags = result
        return result
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Fetch all blogs (common endpoint)
    async fetchBlogs(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'common',
          url: 'blogs',
          method: 'GET',
        }, {
          query: params,
        })
        if (error.value) throw error.value
        const result = data.value as PaginatedResponse<Blog>
        this.blogs = result.data
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

    // Fetch single blog (common endpoint)
    async fetchBlog(id: number | string) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'common',
          url: `blogs/${id}`,
          method: 'GET',
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        this.blog = result
        return this.blog
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Create blog (admin endpoint, multipart/form-data)
    async createBlog(formData: FormData) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: 'blogs',
          method: 'POST',
        }, {
          body: formData,
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        useNotificationStore().success('Success', 'Blog created successfully')
        return result
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Update blog (admin endpoint, POST with _method=patch)
    async updateBlog(id: number | string, formData: FormData) {
      this.loading = true
      this.error = null
      try {
        formData.append('_method', 'patch')
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `blogs/${id}`,
          method: 'POST',
        }, {
          body: formData,
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        useNotificationStore().success('Success', 'Blog updated successfully')
        return result
      } catch (err: any) {
        this.error = err.message
        useNotificationStore().error('Error', err.message)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Toggle active status (quick update)
    async toggleActive(id: number | string, isActive: boolean) {
      const formData = new FormData()
      formData.append('is_active', isActive ? '1' : '0')
      formData.append('_method', 'patch')
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `blogs/${id}`,
          method: 'POST',
        }, {
          body: formData,
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        // Update local state
        const index = this.blogs.findIndex(b => b.blog_id === Number(id))
        if (index !== -1) {
          this.blogs[index].is_active = isActive ? 1 : 0
        }
        useNotificationStore().success('Status Updated', `Blog ${isActive ? 'activated' : 'deactivated'}`)
        return result
      } catch (err: any) {
        useNotificationStore().error('Error', err.message)
        throw err
      }
    },

    // Delete blog
    async deleteBlog(id: number | string) {
      try {
        const { data, error } = await useApiFetch({
          apiType: 'admin',
          url: `blogs/${id}`,
          method: 'DELETE',
        })
        if (error.value) throw error.value
        const result = this.handleApiResponse(data.value)
        this.blogs = this.blogs.filter(b => b.blog_id !== Number(id))
        useNotificationStore().success('Deleted', 'Blog deleted successfully')
        return result
      } catch (err: any) {
        useNotificationStore().error('Error', err.message)
        throw err
      }
    },
  },
})