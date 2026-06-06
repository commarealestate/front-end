// Admin Auth
import { useAuthCustomerStore } from '../store/customer/auth';

export default defineNuxtRouteMiddleware((to) => {

    // Current Locale
    const { $i18n } = useNuxtApp();
    const locale = $i18n.locale?.value;

    // Auth Store
    const authStore = useAuthCustomerStore();
    const token = useCookie('customer-token');
    
    if (token.value) {
      authStore.authenticated = true;
      authStore.token = token.value;
    }
    
    // // if token doesn't exist redirect to Home Page 
    // if (!token.value && to.meta.layout == "customer-layout") {
    //     abortNavigation();
    //     return navigateTo(`/${locale ?? "ar"}/`);
    // }
});