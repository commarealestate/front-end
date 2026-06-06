<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <EmireatisationHero />

    <!-- About Emiratisation -->
    <AboutEmireatisation />

    <!-- Our Commitment -->
    <CommitmentEmireatisation />

    <!-- Program Objectives -->
    <ProgramObjectives />

    <!-- Emirati Talents -->
    <EmiratiTalents />

    <!-- Initiatives & Activities -->
    <InitiativesActivities />

    <!-- Partners -->
    <EmiratiPartnersSection />

    <!-- Final CTA -->
    <EmiratiCTA />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useHead } from '#app';

const { t } = useI18n();

useHead({
  title: t('emiratisation_page_title'),
  meta: [
    {
      name: 'description',
      content: t('emiratisation_page_description')
    },
    {
      name: 'og:title',
      content: t('emiratisation_page_title')
    },
    {
      name: 'og:description',
      content: t('emiratisation_page_description')
    }
  ]
});
</script>
