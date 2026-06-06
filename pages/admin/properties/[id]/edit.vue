<template>

    <AdminPropertiesForm mode="edit" :property-id="route.params.id as string" />

</template>

<script setup lang="ts">
const route = useRoute()
</script>