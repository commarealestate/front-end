<template>
  <div>
    <slot />
  </div>
</template>
<script setup lang="ts">

const { t } = useI18n()
const { locale } = useI18n();
const direction = computed(()=> {
    return locale.value == 'ar' ? 'rtl' : 'ltr';
})

const route = useRoute();
const currentUserRole = getCurrentRoleNameFromRoute(route.path);

useHead({
  htmlAttrs: {
    lang: locale,
    dir:  direction,
  },
  titleTemplate: () => {
    return currentUserRole.toUpperCase() + " | " + t(route.meta.title || 'cardizerr');
  }
})
</script>
<style>
body {
  background: #fff;
}
</style>