// Admin Auth
import { useAuthStore } from '../store/admin/auth';

export default defineNuxtRouteMiddleware((to) => {
    if (process.server) return
    
    const locale = useNuxtApp().$i18n.locale?.value;

    // Auth Store
    const authStore = useAuthStore();
    const token = useCookie('token');

    if (token.value) {
      authStore.authenticated = true;
      authStore.token = token.value;
    }

    if(to?.meta?.layout == "AdminAuth" && token.value) {
      const url = locale === 'ar' ? '/admin/' : '/en/admin/'
       
      return navigateTo(url);
    }
    if(to.meta.layout == "admin-layout" && !token.value) {
      const url = locale === 'ar' ? '/admin/login' : '/en/admin/login'
       return navigateTo(url);
    }


    // if token exists and url is /login redirect to Homepage
    // if (token.value && to?.name === `admin-login___${locale ?? "ar"}`) {
    //   return navigateTo(`/${locale ?? "ar"}/admin/`);
    // }
  
    
    // // if token doesn't exist redirect to log in
    // if (!token.value && to?.name != `admin-login___${locale ?? "ar"}`) {
    //     abortNavigation();
    //     return navigateTo(`/${locale ?? "ar"}/admin/login`);
    // }
});