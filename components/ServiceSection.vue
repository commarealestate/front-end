<template>
  <section ref="servicesSection" class="relative bg-gray-900 text-white py-32 px-6 lg:px-32 overflow-hidden">
    <!-- Cinematic background stars -->
    <div class="absolute inset-0 pointer-events-none">
      <div v-for="i in 25" :key="i" class="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse-slow" :style="randomStarStyle()"></div>
    </div>

    <!-- Section Title -->
    <div class="relative z-10 text-center mb-16">
      <h2 ref="title" class="text-4xl lg:text-5xl font-bold opacity-0 translate-y-8">
        Our Services
      </h2>
      <p ref="subtitle" class="text-lg lg:text-xl mt-4 opacity-0 translate-y-8 max-w-2xl mx-auto">
        Strata Horizon offers innovative AI & ML solutions designed to empower your business and drive growth.
      </p>
    </div>

    <!-- Services Grid -->
    <div ref="grid" class="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div
        v-for="(service, index) in services"
        :key="index"
        class="service-card bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 cursor-pointer shadow-2xl opacity-0 translate-y-12"
      >
        <div class="h-48 w-full rounded-xl overflow-hidden mb-4">
          <img :src="service.img" :alt="service.title" class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"/>
        </div>
        <h3 class="text-xl font-bold mb-2">{{ service.title }}</h3>
        <p class="text-gray-300">{{ service.description }}</p>
      </div>
    </div>

    <!-- More Button -->
    <div ref="moreBtn" class="relative z-10 mt-16 text-center opacity-0 translate-y-8">
      <button class="px-8 py-4 bg-comma-accent text-comma-primary font-bold rounded-lg hover:scale-105 transition-transform duration-300">
        Explore All Services
        <Icon name="heroicons:arrow-up-right" class="w-5 h-5" />
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import consulting from '~/assets/images/Consulting.jpg'
import development from '~/assets/images/Development.jpg'
import training from '~/assets/images/Training.jpg'
import cybersecurity from '~/assets/images/Cybersecurity.jpg'

gsap.registerPlugin(ScrollTrigger)

const servicesSection = ref(null)
const title = ref(null)
const subtitle = ref(null)
const moreBtn = ref(null)
const grid = ref(null)

const services = [
  { title: "AI Consulting", description: "Expert guidance to integrate AI and ML solutions tailored for your business.", img: consulting },
  { title: "AI Development", description: "Custom AI solutions built from the ground up to optimize processes and efficiency.", img: development },
  { title: "AI Training", description: "Upskill your team with hands-on AI & ML training for practical business use.", img: training },
  { title: "Cybersecurity Solutions", description: "Protect your AI infrastructure with state-of-the-art cybersecurity technologies.", img: cybersecurity }
]

const randomStarStyle = () => {
  const top = Math.random() * 100
  const left = Math.random() * 100
  const size = 1 + Math.random() * 2
  return { top: `${top}%`, left: `${left}%`, width: `${size}px`, height: `${size}px` }
}

let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    // Animate title + subtitle
    gsap.fromTo([title.value, subtitle.value], 
      { opacity: 0, y: 40 }, 
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: title.value, start: 'top 80%' } }
    )

    // Animate each service card
    gsap.utils.toArray(grid.value.children).forEach((card, i) => {
      gsap.fromTo(card, 
        { opacity: 0, y: 60, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, duration: 1.2, delay: i*0.1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' } }
      )
    })

    // Fade in More button
    gsap.fromTo(moreBtn.value, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: moreBtn.value, start: 'top 90%' } })
  }, servicesSection)
})

onBeforeUnmount(() => {
  if(ctx) ctx.revert()
})
</script>

<style scoped>
/* Cinematic stars animation */
.animate-pulse-slow {
  animation: pulse-slow 6s infinite alternate;
}
@keyframes pulse-slow {
  0% { transform: translateY(0px) scale(1); opacity: 0.3; }
  50% { transform: translateY(-10px) scale(1.03); opacity: 0.5; }
  100% { transform: translateY(0px) scale(1); opacity: 0.3; }
}

/* Scroll fade-in helpers */
.opacity-0 { opacity: 0; }
.translate-y-8 { transform: translateY(32px); }

/* Card hover cinematic effect */
.service-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.service-card:hover {
  transform: scale(1.05) translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}
</style>
