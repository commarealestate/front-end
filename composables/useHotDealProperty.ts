// composables/useHotDealProperty.ts
import type { UseFetchOptions } from "nuxt/app";

// Reuse the Property type and mapper from useProperties (or duplicate for simplicity)
export interface Property {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: string;
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
  agent?: any | null;
}

// Mapper function (copied from useProperties to keep this composable self‑contained)
function mapApiPropertyToProperty(apiProp: any): Property {
  const priceNum = apiProp.original_price
    ? parseInt(apiProp.original_price)
    : 0;
  const priceStr = priceNum
    ? `AED ${priceNum.toLocaleString("en-US")}`
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
    parking: parseInt(apiProp.parking) || 0,
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
    agent: apiProp.agent,
  };
}

export const useHotDealProperty = () => {
  const { data, pending, error, refresh } = useApiFetch(
    { apiType: "common", url: "properties", method: "get" },
    {
      query: {
        // hot_deal: 1,
        inventory_status: "Live",
        per_page: 1,
        sort_by: "created_at",
        sort_direction: "desc",
      },
      // Optional: cache the result to avoid refetching on every route change
      key: "hot-deal-property",
    },
  );

  const property = computed<Property | null>(() => {
    if (!data.value?.data || data.value.data.length === 0) return null;
    return mapApiPropertyToProperty(data.value.data[0]);
  });

  return { property, pending, error, refresh };
};
