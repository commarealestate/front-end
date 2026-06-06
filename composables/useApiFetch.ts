import type { UseFetchOptions } from "nuxt/app";
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/admin/auth';

export function useApiFetch<T>(data: any, options: UseFetchOptions<T> = {}) {

    const config = useRuntimeConfig();

    // Admin Store
    const { logUserOut } = useAuthStore();
    const { authenticated, token } = storeToRefs(useAuthStore());

    // Current Locale [To Redirection]
    const { $i18n } = useNuxtApp();
    const locale = $i18n.locale?.value;

    // Request Headers
    let headers: any = {
        accept: "application/json",
        "Accept-Language": locale,
    };
    if(authenticated && token.value) {
        headers["Authorization"] = `Bearer ${token.value}`;
    }

    // Determine API URL based on apiType
    let apiUrl: string;
    switch (data?.apiType) {
        case 'general':
            apiUrl = config.public.apiGeneralUrl;
            break;
        case 'common':
            apiUrl = config.public.apiCommonUrl;
            break;
        case 'auth':
            apiUrl = config.public.apiAuthAdminUrl;
            break;
        default:
            apiUrl = config.public.apiAdminUrl;
            break;
    }

    return useFetch(() => `${apiUrl}/${data?.url}`, {
        method: data?.method,
        headers: {
            ...headers,
            ...options?.headers,
        },
        query: options.query,
        body: options.body,
        watch: options.watch,
        lazy: options.lazy,
        immediate: options.immediate,
        onResponse({ response }) {
            if(response?._data?.code == 401) {
                const adminToken = useCookie('token');
                adminToken.value = "";
                const url = locale === 'ar' ? '/admin/login' : '/en/admin/login';
                navigateTo(url);
            }
        },
    });
}


export async function $apiFetch<T>(data: any, options: UseFetchOptions<T> = {}) {
    const config = useRuntimeConfig();

    // Admin Store
    const { logUserOut } = useAuthStore();
    const { authenticated, token } = storeToRefs(useAuthStore());

    // Current Locale
    const { $i18n } = useNuxtApp();
    const locale = $i18n.locale?.value;

    // Request Headers
    let headers: any = {
        accept: "application/json",
        "Accept-Language": locale,
    };
    if (authenticated && token.value) {
        headers["Authorization"] = `Bearer ${token.value}`;
    }

    // Determine API URL based on apiType
    let apiUrl: string;
    switch (data?.apiType) {
        case 'general':
            apiUrl = config.public.apiGeneralUrl;
            break;
        case 'auth':
            apiUrl = config.public.apiAuthAdminUrl;
            break;
        default:
            apiUrl = config.public.apiAdminUrl;
            break;
    }

    try {
        const response = await $fetch(`${apiUrl}/${data?.url}`, {
            method: data?.method,
            headers: { ...headers, ...options?.headers },
            query: options.query,
            body: options.body,
        });

        // Handle 401 Unauthorized
        if (response?.code === 401) {
            const adminToken = useCookie('token');
            adminToken.value = "";
            const url = locale === 'ar' ? '/admin/login' : '/en/admin/login';
            await navigateTo(url);
            throw new Error('Unauthorized');
        }

        // Handle API-level errors (status 0 or code >= 400)
        if (response?.status === 0 || response?.code >= 400) {
            throw createError({
                statusCode: response.code || 422,
                statusMessage: response.message || 'Request failed',
                data: response.errors || []
            });
        }

        return { data: ref(response), error: ref(null) };
    } catch (error: any) {
        console.error('API Fetch Error:', error);
        return { data: ref(null), error: ref(error) };
    }
}
