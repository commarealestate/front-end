export default defineNuxtRouteMiddleware(() => {
  if (import.meta.dev) {
    return
  }

  const localePath = useLocalePath()
  return navigateTo(localePath('/'))
})
