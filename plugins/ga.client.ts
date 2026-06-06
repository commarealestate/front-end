export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  if (!config.public.gaId) return;

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${config.public.gaId}`,
        async: true,
      },
      {
        children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${config.public.gaId}', {
            page_path: window.location.pathname
          });
        `,
      },
    ],
  });
});
