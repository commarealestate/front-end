import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useCookie } from "nuxt/app";
import { useApiFetch } from "~/composables/useApiFetch";

interface UserPayloadInterface {
  email: string;
  password: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
    token: ref(""),
    authenticatedUser: {
      id: "",
      email: "",
      name: "",
    },
    loading: false,
    msg: "",
  }),
  actions: {
    async authenticateUser({ email, password }: UserPayloadInterface) {
      this.msg = "";
      this.loading = true;

      const { data, error } = await useApiFetch({
        apiType: "auth",
        url: "login",
        method: "POST",
      }, {
        body: { email, password },
      });

      this.loading = false;

      if (error.value) {
        console.error("Login Error:", error.value);
        this.msg = error.value.message || "Something went wrong";
        return;
      }

      if (data.value?.status) {
        // save token to cookie
        const tokenCookie = useCookie("token");
        tokenCookie.value = data.value.data.access_token;

        // update store state
        this.token = data.value.data.access_token;
        this.authenticated = true;
        this.authenticatedUser = {
          id: data.value.data.user_id,
          email: data.value.data.email,
          name: data.value.data.name,
        };
      } else {
        this.msg = data.value?.message || "Login failed";
      }
    },

    async logUserOut() {
      const tokenCookie = useCookie("token");
      tokenCookie.value = null;
      this.authenticated = false;
      this.token = "";
      this.authenticatedUser = { id: "", email: "", name: "" };
      window.location.reload();
    },
  },
});