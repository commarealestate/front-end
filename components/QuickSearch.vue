<template>
  <div class="relative -mt-20 lg:-mt-32 mb-16 z-50">
    <div class="container mx-auto px-4 lg:px-8">
      <div class="bg-comma-neutral-900 rounded-2xl shadow-2xl p-6 lg:p-8 border border-comma-primary/20 relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-5">
          <div 
            class="h-full w-full" 
            :style="{
              backgroundImage: `
                linear-gradient(90deg, #8E084D 1px, transparent 1px),
                linear-gradient(180deg, #8E084D 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }"
          ></div>
        </div>
        
        <!-- Decorative Elements -->
        <div class="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-comma-primary/10 to-transparent rounded-full blur-2xl"></div>
        <div class="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-comma-secondary/10 to-transparent rounded-full blur-2xl"></div>

        <!-- Section Header -->
        <div class="mb-8 text-center relative z-10">
          <div class="inline-flex items-center justify-center gap-2 mb-3">
            <div class="w-2 h-2 rounded-full bg-comma-primary animate-pulse"></div>
            <h2 class="text-2xl lg:text-3xl font-bold text-white">
              {{ $t('quick_search_title') }}
            </h2>
            <div class="w-2 h-2 rounded-full bg-comma-primary animate-pulse" :style="{animationDelay: '0.5s'}"></div>
          </div>
          <p class="text-comma-neutral-300">
            {{ $t('quick_search_description') }}
          </p>
        </div>

        <!-- Search Form -->
        <form @submit.prevent="handleSearch" class="space-y-6 lg:space-y-0 relative z-10">
          <div class="mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
            <!-- Property Type -->
            <div>
              <label class="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Icon name="heroicons:building-office" class="w-4 h-4 text-comma-primary-light" />
                {{ $t('Property Type') }}
              </label>
              <div class="relative group">
                <div class="absolute inset-0 bg-gradient-to-r from-comma-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <select
                  v-model="form.property_type"
                  class="w-full px-11 py-3 rounded-lg bg-comma-neutral-800/50 border border-comma-neutral-700 text-white focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 transition-all duration-300 backdrop-blur-sm appearance-none relative z-10"
                  :class="{ 
                    'text-right': direction === 'rtl',
                    'border-comma-primary/50': form.property_type
                  }"
                >
                  <option value="" class="bg-comma-neutral-800">{{ $t('Any Type') }}</option>
                  <option value="villa" class="bg-comma-neutral-800">{{ $t('Villas') }}</option>
                  <option value="apartment" class="bg-comma-neutral-800">{{ $t('Apartments') }}</option>
                  <option value="penthouse" class="bg-comma-neutral-800">{{ $t('Penthouses') }}</option>
                  <option value="townhouse" class="bg-comma-neutral-800">{{ $t('Townhouses') }}</option>
                  <option value="commercial" class="bg-comma-neutral-800">{{ $t('Commercial') }}</option>
                  <option value="studio" class="bg-comma-neutral-800">{{ $t('Studio') }}</option>
                  <option value="duplex" class="bg-comma-neutral-800">{{ $t('Duplex') }}</option>
                </select>
                <Icon 
                  name="heroicons:building-office" 
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-comma-neutral-400 transition-colors duration-300 group-hover:text-comma-primary-light"
                  :class="{ 
                    'left-auto right-3': direction === 'rtl',
                    'text-comma-primary-light': form.property_type
                  }"
                />
                <Icon 
                  name="heroicons:chevron-down" 
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-comma-neutral-400 pointer-events-none"
                  :class="{ 'right-auto left-3': direction === 'rtl' }"
                />
              </div>
            </div>

            <!-- Transaction Type (maps to status) -->
            <div>
              <label class="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Icon name="heroicons:currency-dollar" class="w-4 h-4 text-comma-primary-light" />
                {{ $t('Transaction Type') }}
              </label>
              <div class="relative group">
                <div class="absolute inset-0 bg-gradient-to-r from-comma-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <select
                  v-model="form.status"
                  class="w-full px-11 py-3 rounded-lg bg-comma-neutral-800/50 border border-comma-neutral-700 text-white focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 transition-all duration-300 backdrop-blur-sm appearance-none relative z-10"
                  :class="{ 
                    'text-right': direction === 'rtl',
                    'border-comma-primary/50': form.status
                  }"
                >
                  <option value="" class="bg-comma-neutral-800">{{ $t('Buy or Rent') }}</option>
                  <option value="For Sale" class="bg-comma-neutral-800">{{ $t('Buy') }}</option>
                  <option value="For Rent" class="bg-comma-neutral-800">{{ $t('Rent') }}</option>
                </select>
                <Icon 
                  name="heroicons:currency-dollar" 
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-comma-neutral-400 transition-colors duration-300 group-hover:text-comma-primary-light"
                  :class="{ 
                    'left-auto right-3': direction === 'rtl',
                    'text-comma-primary-light': form.status
                  }"
                />
                <Icon 
                  name="heroicons:chevron-down" 
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-comma-neutral-400 pointer-events-none"
                  :class="{ 'right-auto left-3': direction === 'rtl' }"
                />
              </div>
            </div>

            <!-- Bedrooms -->
            <div>
              <label class="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Icon name="heroicons:home-modern" class="w-4 h-4 text-comma-primary-light" />
                {{ $t('Bedrooms') }}
              </label>
              <div class="relative group">
                <div class="absolute inset-0 bg-gradient-to-r from-comma-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <select
                  v-model="form.bedrooms"
                  class="w-full px-11 py-3 rounded-lg bg-comma-neutral-800/50 border border-comma-neutral-700 text-white focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 transition-all duration-300 backdrop-blur-sm appearance-none relative z-10"
                  :class="{ 
                    'text-right': direction === 'rtl',
                    'border-comma-primary/50': form.bedrooms
                  }"
                >
                  <option value="" class="bg-comma-neutral-800">{{ $t('Any') }}</option>
                  <option value="1" class="bg-comma-neutral-800">1+</option>
                  <option value="2" class="bg-comma-neutral-800">2+</option>
                  <option value="3" class="bg-comma-neutral-800">3+</option>
                  <option value="4" class="bg-comma-neutral-800">4+</option>
                  <option value="5" class="bg-comma-neutral-800">5+</option>
                </select>
                <Icon 
                  name="heroicons:home-modern" 
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-comma-neutral-400 transition-colors duration-300 group-hover:text-comma-primary-light"
                  :class="{ 
                    'left-auto right-3': direction === 'rtl',
                    'text-comma-primary-light': form.bedrooms
                  }"
                />
                <Icon 
                  name="heroicons:chevron-down" 
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-comma-neutral-400 pointer-events-none"
                  :class="{ 'right-auto left-3': direction === 'rtl' }"
                />
              </div>
            </div>

            <!-- Bathrooms -->
            <div>
              <label class="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Icon  name="mdi:shower" class="w-4 h-4 text-comma-primary-light" />
                {{ $t('Bathrooms') }}
              </label>
              <div class="relative group">
                <div class="absolute inset-0 bg-gradient-to-r from-comma-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <select
                  v-model="form.bathrooms"
                  class="w-full px-11 py-3 rounded-lg bg-comma-neutral-800/50 border border-comma-neutral-700 text-white focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 transition-all duration-300 backdrop-blur-sm appearance-none relative z-10"
                  :class="{ 
                    'text-right': direction === 'rtl',
                    'border-comma-primary/50': form.bathrooms
                  }"
                >
                  <option value="" class="bg-comma-neutral-800">{{ $t('Any') }}</option>
                  <option value="1" class="bg-comma-neutral-800">1+</option>
                  <option value="2" class="bg-comma-neutral-800">2+</option>
                  <option value="3" class="bg-comma-neutral-800">3+</option>
                  <option value="4" class="bg-comma-neutral-800">4+</option>
                  <option value="5" class="bg-comma-neutral-800">5+</option>
                </select>
                <Icon 
                  name="heroicons:droplet" 
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-comma-neutral-400 transition-colors duration-300 group-hover:text-comma-primary-light"
                  :class="{ 
                    'left-auto right-3': direction === 'rtl',
                    'text-comma-primary-light': form.bathrooms
                  }"
                />
                <Icon 
                  name="heroicons:chevron-down" 
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-comma-neutral-400 pointer-events-none"
                  :class="{ 'right-auto left-3': direction === 'rtl' }"
                />
              </div>
            </div>
          </div>

          <!-- Second row: Price range and Hot Deal -->
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
            <!-- Min Price -->
            <div>
              <label class="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Icon name="heroicons:currency-dollar" class="w-4 h-4 text-comma-primary-light" />
                {{ $t('Min Price') }}
              </label>
              <input
                type="number"
                v-model="form.min_price"
                placeholder="AED"
                class="w-full px-4 py-3 rounded-lg bg-comma-neutral-800/50 border border-comma-neutral-700 text-white placeholder-comma-neutral-400 focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 transition-all duration-300 backdrop-blur-sm"
                :class="{ 'text-right': direction === 'rtl' }"
              />
            </div>

            <!-- Max Price -->
            <div>
              <label class="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Icon name="heroicons:currency-dollar" class="w-4 h-4 text-comma-primary-light" />
                {{ $t('Max Price') }}
              </label>
              <input
                type="number"
                v-model="form.max_price"
                placeholder="AED"
                class="w-full px-4 py-3 rounded-lg bg-comma-neutral-800/50 border border-comma-neutral-700 text-white placeholder-comma-neutral-400 focus:border-comma-primary focus:ring-2 focus:ring-comma-primary/20 transition-all duration-300 backdrop-blur-sm"
                :class="{ 'text-right': direction === 'rtl' }"
              />
            </div>

            <!-- Hot Deal -->
            <div class="flex items-center h-full pt-6">
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" v-model="form.hot_deal" class="sr-only peer">
                <div class="w-5 h-5 rounded border border-comma-neutral-700 bg-comma-neutral-800/50 flex items-center justify-center peer-checked:bg-comma-primary peer-checked:border-comma-primary transition-all duration-300">
                  <Icon v-if="form.hot_deal" name="heroicons:check" class="w-3 h-3 text-white" />
                </div>
                <span class="text-white text-sm">{{ $t('Hot Deal') }}</span>
              </label>
            </div>

            <!-- Search Button -->
            <div class="flex items-end">
              <button
                type="submit"
                class="w-full group relative px-6 py-4 rounded-lg bg-gradient-to-r from-comma-primary via-comma-primary-dark to-comma-primary text-white font-semibold hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-comma-primary-dark via-comma-primary to-comma-primary-dark bg-[length:200%_100%] animate-gradient-x"></div>
                <div class="relative z-10 flex items-center justify-center gap-3">
                  <Icon name="heroicons:magnifying-glass" class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span class="hidden lg:inline">{{ $t('Search') }}</span>
                  <Icon 
                    name="heroicons:arrow-right" 
                    class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    :class="{ 'rotate-180': direction === 'rtl', 'group-hover:-translate-x-1': direction === 'rtl' }"
                  />
                </div>
                <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </button>
            </div>
          </div>

          <!-- Popular Locations (optional) -->
          <div class="pt-4">
            <p class="text-sm text-comma-neutral-400 mb-2">{{ $t('Popular Locations') }}:</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="location in popularLocations"
                :key="location.id"
                @click="form.service_area_id = location.id"
                class="px-3 py-1.5 rounded-full border border-comma-neutral-700 text-comma-neutral-300 hover:border-comma-primary hover:text-white hover:bg-comma-primary/10 transition-all duration-300 text-sm flex items-center gap-2 group"
                :class="{ 'border-comma-primary text-white bg-comma-primary/10': form.service_area_id === location.id }"
              >
                <Icon name="heroicons:map-pin" class="w-3 h-3" />
                {{ location.name }}
              </button>
            </div>
          </div>
        </form>

        <!-- Note: Stats removed to avoid duplication with StatsSection -->
      </div>
    </div>
  </div>
</template>

<script setup>
const { locale } = useI18n();
const router = useRouter();

const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr');

// Form data – keys match the API filter names
const form = ref({
  property_type: '',
  status: '',          // will map to 'For Sale' or 'For Rent'
  bedrooms: '',
  bathrooms: '',
  min_price: '',
  max_price: '',
  hot_deal: false,
  service_area_id: ''  // single location ID (or could be comma-separated)
});

// Popular locations (example – replace with actual service areas if needed)
const popularLocations = [
  { id: '1', name: 'Corniche Area' },
  { id: '2', name: 'Al Reem Island' },
  { id: '3', name: 'Saadiyat Island' },
  { id: '4', name: 'Yas Island' },
  { id: '5', name: 'Al Raha Beach' }
];

// Build query object, omitting empty values
const buildQuery = () => {
  const query = {};
  Object.entries(form.value).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== false) {
      if (key === 'hot_deal' && value === true) {
        query.hot_deal = 1;
      } else if (key === 'service_area_id' && value) {
        query.service_area_id = value; // could be a single ID
      } else if (value) {
        query[key] = value;
      }
    }
  });
  return query;
};

const handleSearch = () => {
  const query = buildQuery();
  router.push({
    path: '/properties',
    query
  });
};
</script>

<style scoped>
/* (same styles as before, keep them) */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a1a0a6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
[dir="rtl"] select {
  background-position: left 0.5rem center;
  padding-right: 0.75rem;
  padding-left: 2.5rem;
}
select::-ms-expand {
  display: none;
}
input:focus, select:focus {
  outline: none;
}
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient-x {
  animation: gradient-x 3s ease-in-out infinite;
}
select option {
  background: #2A2A2F;
  color: white;
  padding: 8px;
}
select::-webkit-scrollbar {
  width: 8px;
}
select::-webkit-scrollbar-track {
  background: #2A2A2F;
  border-radius: 4px;
}
select::-webkit-scrollbar-thumb {
  background: #8E084D;
  border-radius: 4px;
}
select::-webkit-scrollbar-thumb:hover {
  background: #5C0431;
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}
input:focus, select:focus {
  box-shadow: 0 0 0 3px rgba(142, 8, 77, 0.1);
}
</style>