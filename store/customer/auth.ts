import { defineStore } from 'pinia';

interface UserPayloadInterface {
  email: string;
  password: string;
}

export const useAuthCustomerStore = defineStore('customer-auth', {
  state: () => ({
    authenticated: false,
    token: ref(null),
    authenticatedUser: null,
    loading: false,
    msg: "",
  }),
  actions: {
    async authenticateUser({ email, password }: UserPayloadInterface) {
      const config = useRuntimeConfig();
      this.msg= "";
      this.loading= true;
      const { data, pending }: any = await useFetch(`${config?.public?.apiCustomerUrl}/login`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'x-api-password': config?.public?.xApiPassword },
        body: {
          email,
          password,
        },
      });
      this.loading = pending.value;
      
      if (data.value.status) {
        const token = useCookie('customer-token');
        token.value = data?.value?.data?.api_token; // set token to cookie
        this.authenticated = true; // set authenticated  state value to true
        this.authenticatedUser = data?.value?.data; // set authenticated  state value to true
      } else {
        this.msg = data?.value?.msg;
      }
    },
    async logUserOut() {
      // const token = useCookie('customer-token');
      // token.value = null;
      this.authenticated = false;
      this.token = null;
    },
  },
});