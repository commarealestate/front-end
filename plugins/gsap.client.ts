import { defineNuxtPlugin } from "#app"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default defineNuxtPlugin(() => {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger)

  // Return gsap and ScrollTrigger for use in components
  return {
    provide: {
      gsap,
      ScrollTrigger,
    },
  }
})
