// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: false },

  app: {
    routerOptions: {
      trailingSlash: false,
    },

    head: {
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: true,
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
        },
      ],

      script: [
        // =========================
        // GA4 loader
        // =========================
        {
          src: "https://www.googletagmanager.com/gtag/js?id=G-JQQNW5P5EN",
          async: true,
        },

        // =========================
        // GA4 init
        // =========================
        {
          children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;

          gtag('js', new Date());
          gtag('config', 'G-JQQNW5P5EN', {
            send_page_view: true
          });
        `,
          type: "text/javascript",
        },

        // =========================
        // Google Ads (NEW)
        // =========================
        {
          src: "https://www.googletagmanager.com/gtag/js?id=AW-18080022865",
          async: true,
        },

        {
          children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;

          gtag('js', new Date());

          // Google Ads base tracking
          gtag('config', 'AW-18080022865');
        `,
          type: "text/javascript",
        },
      ],
    },
  },

  ssr: false,

  target: "static",
  generate: {
    fallback: true,
  },

  nitro: {},

  runtimeConfig: {
    public: {
      apiAuthAdminUrl: process.env.ADMIN_AUTH_API_URL,
      apiAdminUrl: process.env.ADMIN_API_URL,
      apiCommonUrl: process.env.COMMON_API_URL,
      apiGeneralUrl: process.env.GENERAL_API_URL,
    },
  },

  colorMode: {
    preference: "light",
  },

  css: ["~/assets/styles/main.scss"],

  plugins: ["~/plugins/vue-toastification.js"],

  modules: [
    "@pinia/nuxt",
    "@nuxt/ui",
    "nuxt-zod-i18n",
    "@nuxtjs/i18n",
    "nuxt-icon",
    "@sidebase/nuxt-pdf",
    "@zadigetvoltaire/nuxt-gtm",
  ],

  gtm: {
    id: "GTM-PL3HKX59",
    defer: true,
    enabled: true,
    debug: true,
    loadScript: true,
  },

  vite: {
    server: {
      watch: {
        ignored: ["**/.nuxt/**", "**/.output/**", "**/nuxt-dev*.log"],
      },
    },
    resolve: {
      alias: {
        "#zod": "nuxt-zod-i18n/runtime",
      },
    },
  },

  i18n: {
    vueI18n: "../i18n.config.ts",
    strategy: "prefix_and_default",
    locales: [
      {
        code: "en",
        iso: "en-US",
      },
      {
        code: "ar",
        iso: "ar-AE",
        dir: "rtl",
      },
    ],
    defaultLocale: "en",
  },

  routeRules: {},

  compatibilityDate: "2024-07-27",
});
