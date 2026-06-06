// stores/notification.ts
import { defineStore } from 'pinia'

export interface Notification {
  id: number
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  timeout?: number
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[],
    nextId: 1,
  }),
  actions: {
    add(notification: Omit<Notification, 'id'>) {
      const id = this.nextId++
      const timeout = notification.timeout ?? (notification.type === 'error' ? 5000 : 3000)
      this.notifications.push({ id, ...notification })

      // Auto-remove after timeout
      setTimeout(() => {
        this.remove(id)
      }, timeout)
    },
    remove(id: number) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index !== -1) this.notifications.splice(index, 1)
    },
    success(title: string, message?: string, timeout?: number) {
      this.add({ type: 'success', title, message, timeout })
    },
    error(title: string, message?: string, timeout?: number) {
      this.add({ type: 'error', title, message, timeout })
    },
    info(title: string, message?: string, timeout?: number) {
      this.add({ type: 'info', title, message, timeout })
    },
    warning(title: string, message?: string, timeout?: number) {
      this.add({ type: 'warning', title, message, timeout })
    },
  },
})