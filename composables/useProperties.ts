// composables/useProperties.ts
import type { UseFetchOptions } from "nuxt/app";

// ---------- Types ----------
export interface Property {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: string;
  originalPrice: number | null;
  hotDealPrice: number | null;
  hotDeal: boolean;
  priceUnit: string;
  beds: number;
  baths: number;
  size: string;
  featured: boolean;
  status: string;
  statusColor: string;
  type: string;
  location: string;
  amenities: string[];
  images: string[];
  features: {
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    parking: number;
    year: number;
    floors?: number;
  };
  agentId?: number;
  agent?: Agent | null;
}

export interface Agent {
  id: number;
  slug: string;
  name: string;
  position: string;
  bio: string;
  bioLong: string;
  avatar: string;
  phone: string;
  email: string;
  whatsapp?: string;
  experience: number;
  propertiesCount: number;
  rating: number;
  reviewCount: number;
  specialties: string[];
  serviceAreas: string[];
  languages: string[];
  social?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

// ---------- API raw types ----------
interface ApiProperty {
  property_id: number;
  slug: string;
  reference_number: string;
  offering_type: string;
  title: string;
  title_en: string;
  title_ar: string;
  description: string;
  description_en: string;
  description_ar: string;
  unit_no: string;
  community: string;
  sub_community: string;
  project_name: string;
  permit_number: string | null;
  tower: string;
  bedrooms: number;
  bathrooms: number;
  size: string;
  location: string;
  location_en: string;
  location_ar: string;
  year_built: string;
  sale_type: string;
  original_price: string | null;
  hot_deal_price: string | null;
  geopoints: string | null;
  featured: boolean;
  hot_deal: boolean;
  status: string;
  status_color: string | null;
  property_type: string;
  amenities: string[] | null;
  features: any | null;
  images: string[];
  agent: ApiAgent | null;
  service_area_id: {
    service_area_id: number;
    name: string;
    name_ar: string;
    name_en: string;
  } | null;
  city: string | null;
  parking: string | null;
  lot_size: number | null;
  total_plot_size: number | null;
  buildup_area: string | null;
  layout_type: string | null;
  project_status: string | null;
  ownership: string | null;
  developers: string | null;
  availability: string | null;
  available_from: string | null;
  rental_period: string | null;
  furnished: string | null;
  finishing_type: string | null;
  floor_no: string | null;
  land_no: string | null;
  plot_no: string | null;
  no_of_floors: string | null;
  permit_issue_date: string | null;
  permit_type: string | null;
  down_payment_price: string | null;
  no_of_cheques: number | null;
  service_charge: string | null;
  payment_method: string | null;
  financial_status: string | null;
  no_of_mortgage_years: string | null;
  listing_owner: string | null;
  landlord_name: string | null;
  landlord_email: string | null;
  landlord_contact: string | null;
  contract_expiry_date: string | null;
  floor_plan: string | null;
  qr_code_property_booster: string | null;
  title_deed: string | null;
  notes: string | null;
  has_garden: boolean;
  has_parking_on_site: boolean;
  has_kitchen: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiAgent {
  agent_id: number;
  slug: string;
  slug_en: string;
  slug_ar: string;
  name: string;
  name_ar: string;
  name_en: string;
  position: string;
  position_ar: string;
  position_en: string;
  bio: string | null;
  bio_ar: string | null;
  bio_en: string | null;
  bio_long: string | null;
  bio_long_ar: string | null;
  bio_long_en: string | null;
  avatar: string | null;
  phone: string;
  email: string;
  whatsapp: string | null;
  experience: number;
  properties_count: number;
  rating: string;
  review_count: number;
  specialties: string[] | null;
  specialties_ar: string[] | null;
  specialties_en: string[] | null;
  languages: string[] | null;
  languages_ar: string[] | null;
  languages_en: string[] | null;
  social: {
    linkedin: string | null;
    facebook: string | null;
    twitter: string | null;
    skype: string | null;
  } | null;
  is_active: boolean;
  service_areas?: Array<{ service_area_id: number; name: string }>; // optional
  created_at: string;
  updated_at: string;
}

// ---------- Mappers ----------
function mapApiPropertyToProperty(apiProp: ApiProperty): Property {
  const originalPrice = apiProp.original_price
    ? parseInt(apiProp.original_price)
    : null;
  const hotDealPrice = apiProp.hot_deal_price
    ? parseInt(apiProp.hot_deal_price)
    : null;
  const hotDeal = apiProp.hot_deal || false;

  const priceStr = originalPrice
    ? `AED ${originalPrice.toLocaleString("en-US")}`
    : "Price on request";

  const status = apiProp.offering_type || apiProp.status || "For Sale";
  const statusColor = status.toLowerCase().includes("rent")
    ? "bg-comma-secondary"
    : "bg-comma-primary";

  const locationParts = [
    apiProp.community,
    apiProp.sub_community,
    apiProp.city,
  ].filter(Boolean);
  const location = locationParts.join(", ") || apiProp.location || "Unknown";

  const features = {
    bedrooms: apiProp.bedrooms,
    bathrooms: apiProp.bathrooms,
    sqft: parseFloat(apiProp.size) || 0,
    parking: parseInt(apiProp.parking || "0") || 0,
    year: parseInt(apiProp.year_built) || new Date().getFullYear(),
    floors: apiProp.no_of_floors ? parseInt(apiProp.no_of_floors) : undefined,
  };

  const images =
    apiProp.images && apiProp.images.length
      ? apiProp.images
      : [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&fit=crop",
        ];

  return {
    id: apiProp.property_id,
    slug: apiProp.slug,
    title: apiProp.title,
    description: apiProp.description,
    price: priceStr,
    originalPrice,
    hotDealPrice,
    hotDeal,
    priceUnit: apiProp.rental_period || "",
    beds: apiProp.bedrooms,
    baths: apiProp.bathrooms,
    size: apiProp.size ? `${apiProp.size} sq.ft.` : "",
    featured: apiProp.featured,
    status,
    statusColor,
    type: apiProp.property_type,
    location,
    amenities: apiProp.amenities || [],
    images,
    features,
    agentId: apiProp.agent?.agent_id,
    agent: apiProp.agent ? mapApiAgentToAgent(apiProp.agent) : null,
  };
}

function mapApiAgentToAgent(apiAgent: ApiAgent): Agent {
  return {
    id: apiAgent.agent_id,
    slug: apiAgent.slug,
    name: apiAgent.name,
    position: apiAgent.position,
    bio: apiAgent.bio || "",
    bioLong: apiAgent.bio_long || "",
    avatar:
      apiAgent.avatar ||
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&fit=crop",
    phone: apiAgent.phone,
    email: apiAgent.email,
    whatsapp: apiAgent.whatsapp || undefined,
    experience: apiAgent.experience,
    propertiesCount: apiAgent.properties_count,
    rating: parseFloat(apiAgent.rating) || 0,
    reviewCount: apiAgent.review_count,
    specialties: apiAgent.specialties || [],
    serviceAreas: apiAgent.service_areas
      ? apiAgent.service_areas.map((sa) => sa.name)
      : [],
    languages: apiAgent.languages || [],
    social: {
      linkedin: apiAgent.social?.linkedin || undefined,
      twitter: apiAgent.social?.twitter || undefined,
      facebook: apiAgent.social?.facebook || undefined,
    },
  };
}

// ---------- Composables ----------
export const useProperties = () => {
  // Default filter values
  const defaultFilters = {
    page: 1,
    per_page: 10,
    title: "",
    status: "",
    property_type: "",
    bedrooms: null as number | null,
    bathrooms: null as number | null,
    min_price: null as number | null,
    max_price: null as number | null,
    hot_deal: null as boolean | null,
    sort_by: "created_at",
    sort_direction: "desc",
    agent_id: null as number | null,
    service_area_id: null as string | null,
  };

  const filters = ref({ ...defaultFilters });

  // Clean filters for query: remove empty strings, null, undefined
  const cleanedFilters = computed(() => {
    const f = { ...filters.value };
    Object.keys(f).forEach((key) => {
      const val = f[key as keyof typeof f];
      if (val === "" || val === null || val === undefined) {
        delete f[key as keyof typeof f];
      }
    });
    return f;
  });

  const { data, pending, error, refresh } = useApiFetch(
    { apiType: "common", url: "properties", method: "get" },
    { query: cleanedFilters },
  );

  const properties = computed<Property[]>(() => {
    if (!data.value?.data) return [];
    return data.value.data.map(mapApiPropertyToProperty);
  });

  const pagination = computed(() => data.value?.meta || null);

  const fetchProperties = (newFilters?: Partial<typeof defaultFilters>) => {
    if (newFilters) {
      filters.value = { ...defaultFilters, ...newFilters };
    } else {
      filters.value = { ...defaultFilters };
    }
  };

  return {
    properties,
    pagination,
    pending,
    error,
    fetchProperties,
    filters,
  };
};

export const useProperty = (id: number) => {
  const { data, pending, error, refresh } = useApiFetch({
    apiType: "common",
    url: `properties/${id}`,
    method: "get",
  });

  const property = computed<Property | null>(() => {
    if (!data.value?.data) return null;
    return mapApiPropertyToProperty(data.value.data);
  });

  return { property, pending, error, refresh };
};

export const useAgents = () => {
  const filters = ref({
    page: 1,
    per_page: 10,
    name: "",
    service_area_name: "",
    is_active: null as boolean | null,
  });

  const { data, pending, error, refresh } = useApiFetch(
    { apiType: "common", url: "agents", method: "get" },
    { query: filters.value },
  );

  const agents = computed<Agent[]>(() => {
    if (!data.value?.data) return [];
    return data.value.data.map(mapApiAgentToAgent);
  });

  const pagination = computed(() => data.value?.meta || null);

  const fetchAgents = (newFilters?: Partial<typeof filters.value>) => {
    if (newFilters) {
      filters.value = { ...filters.value, ...newFilters };
    }
    refresh();
  };

  return { agents, pagination, pending, error, fetchAgents, filters };
};

export const useAgent = (id: number) => {
  const { data, pending, error, refresh } = useApiFetch({
    apiType: "common",
    url: `agents/${id}`,
    method: "get",
  });

  const agent = computed<Agent | null>(() => {
    if (!data.value?.data) return null;
    return mapApiAgentToAgent(data.value.data);
  });

  return { agent, pending, error, refresh };
};

export const useServiceAreas = (perPage = 100) => {
  const { data, pending, error, refresh } = useApiFetch({
    apiType: "common",
    url: `service/area?per_page=${perPage}`,
    method: "get",
  });

  const serviceAreas = computed(() => data.value?.data || []);

  // Deduplicate by service_area_id (API sometimes returns duplicates)
  const uniqueServiceAreas = computed(() => {
    const seen = new Set<number>();
    return serviceAreas.value.filter((area: any) => {
      if (seen.has(area.service_area_id)) return false;
      seen.add(area.service_area_id);
      return true;
    });
  });

  return { serviceAreas: uniqueServiceAreas, pending, error, refresh };
};

export default useProperties;
