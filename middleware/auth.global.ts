// Global Admin Auth Middleware
import { useAuthStore } from '../store/admin/auth';

export default defineNuxtRouteMiddleware((to) => {
    if (process.server) return
    
    const locale = useNuxtApp().$i18n.locale?.value;

    // Only apply to admin routes
    if (!to.path.includes('/admin/')) return;

    // Auth Store
    const authStore = useAuthStore();
    const token = useCookie('token');

    if (token.value) {
      authStore.authenticated = true;
      authStore.token = token.value;
    }

    // If trying to access admin login page and already authenticated, redirect to admin dashboard
    if(to.path.includes('/admin/login') && token.value) {
      const url = locale === 'ar' ? '/admin/' : '/en/admin/'
      return navigateTo(url);
    }

    // If trying to access admin pages without token, redirect to login
    if(!to.path.includes('/admin/login') && !token.value) {
      const url = locale === 'ar' ? '/admin/login' : '/en/admin/login'
      return navigateTo(url);
    }
}); 