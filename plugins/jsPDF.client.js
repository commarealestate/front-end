import { jsPDF } from 'jspdf'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('jsPDF', jsPDF)
})
