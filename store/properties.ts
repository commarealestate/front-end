// ~/store/properties.ts
import { defineStore } from "pinia";
import type {
  NormalizedProperty,
  PaymentScheduleItem,
  RawApiProperty,
  ApiPaginatedResponse,
} from "~/types/property";
import { useNotificationStore } from "./notification";

function textValue(value: any): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);

  return "";
}

function asStringArray(value: any): string[] {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string" && item);
  }
  if (typeof value === "string" && value) return [value];

  return [];
}

function asPaymentSchedule(value: any): PaymentScheduleItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") {
        return { description: item };
      }

      if (item && typeof item === "object") {
        return {
          percentage: item.percentage ?? item.percent ?? null,
          frequency: item.frequency ?? null,
          duration: item.duration ?? null,
          description: item.description ?? item.title ?? null,
        };
      }

      return null;
    })
    .filter((item): item is PaymentScheduleItem => Boolean(item));
}

function normalizePropertyType(value: any): string {
  return textValue(value).toLowerCase().replace(/\s+/g, "_");
}

function asAgentPhotoArray(value: any): string[] {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string" && item);
  }
  if (typeof value === "string" && value) return [value];
  return [];
}

export function normalizePropertyAgent(raw: any) {
  if (!raw || typeof raw !== "object") return null;

  const personalPhoto = asAgentPhotoArray(raw.personal_photo);
  const legacyPhoto = asAgentPhotoArray(raw.photo);
  const photo = legacyPhoto.length ? legacyPhoto : personalPhoto;

  return {
    ...raw,
    agent_id: raw.agent_id ?? raw.id,
    photo,
    personal_photo: personalPhoto.length ? personalPhoto : photo,
    e_mail: raw.e_mail || raw.email || "",
    email: raw.email || raw.e_mail || "",
    personal_mobile:
      raw.personal_mobile || raw.personal_phone || raw.work_phone || raw.uf_phone_inner || "",
    whatsapp: raw.whatsapp || "",
  };
}

function propertyTypeQueryVariants(value: any): string[] {
  const raw = textValue(value);
  if (!raw) return [];

  const normalized = raw.toLowerCase().replace(/[_-]+/g, " ");
  const titleCase = normalized.replace(/\b\w/g, (char) => char.toUpperCase());
  const compactTitle = titleCase.replace(/\s+/g, "");
  const lowerCompact = normalized.replace(/\s+/g, "_");
  const variants = [raw, titleCase, compactTitle, lowerCompact, normalized];

  if (normalized === "apartment") {
    variants.push("Apartments", "apartments");
  }

  return [...new Set(variants.filter(Boolean))];
}

function localizedText(raw: any, field: string): { en: string; ar: string } {
  const value = raw[field];

  return {
    en:
      textValue(value?.english) ||
      textValue(value?.en) ||
      textValue(value?.english_text) ||
      textValue(raw[`${field}_english`]) ||
      textValue(raw[`${field}_en`]) ||
      textValue(raw[`${field}_en_US`]),
    ar:
      textValue(value?.arabic) ||
      textValue(value?.ar) ||
      textValue(value?.arabic_text) ||
      textValue(raw[`${field}_arabic`]) ||
      textValue(raw[`${field}_ar`]) ||
      textValue(raw[`${field}_ar_AE`]),
  };
}

function localeFallback(en: string, ar: string): string {
  return en || ar || "";
}

function normalizeAdminProperty(raw: any) {
  const coverImages = asStringArray(raw.cover_image);
  const propertyPhotos = asStringArray(raw.property_photos);
  const legacyImages = asStringArray(raw.images);
  const images = [...coverImages, ...propertyPhotos];
  const titleText = localizedText(raw, "title");
  const descriptionText = localizedText(raw, "description");
  const locationText = localizedText(raw, "location");
  const title = titleText.en || textValue(raw.title);
  const titleAr = titleText.ar;
  const description = descriptionText.en || textValue(raw.description);
  const descriptionAr = descriptionText.ar;
  const location = locationText.en || textValue(raw.location);
  const locationAr = locationText.ar;

  return {
    ...raw,
    property_id: raw.property_id ?? raw.id,
    agent: normalizePropertyAgent(raw.agent),
    title,
    title_en: title,
    title_ar: titleAr,
    description,
    description_en: description,
    description_ar: descriptionAr,
    location,
    location_en: location,
    location_ar: locationAr,
    bedrooms: raw.bedrooms ?? raw.bedroom ?? 0,
    bathrooms: raw.bathrooms ?? raw.bathroom ?? 0,
    size: raw.size ?? raw.total_area_sqft ?? "",
    original_price: raw.original_price ?? raw.price ?? null,
    featured: raw.featured ?? raw.show_on_website ?? false,
    images: images.length ? images : legacyImages,
    cover_image: coverImages,
    property_photos: propertyPhotos,
    floor_plan: raw.floor_plan || null,
  };
}

// ----------------------------------------------------------------------
// Normalization helper: API property (new backend) -> NormalizedProperty
// ----------------------------------------------------------------------
function normalizeApiProperty(raw: RawApiProperty): NormalizedProperty {
  const titleText = localizedText(raw, "title");
  const descriptionText = localizedText(raw, "description");
  const locationText = localizedText(raw, "location");
  const titleEnglish = titleText.en || textValue(raw.title);
  const titleArabic = titleText.ar;
  const descEnglish = descriptionText.en || textValue(raw.description);
  const descArabic = descriptionText.ar;
  const locationEnglish = locationText.en || textValue(raw.location);
  const locationArabic = locationText.ar;
  const processedCoverImages = asStringArray(raw.processed_cover_image);
  const processedPropertyPhotos = asStringArray(raw.processed_property_photos);
  const coverImages = processedCoverImages.length ? processedCoverImages : asStringArray(raw.cover_image);
  const propertyPhotos = processedPropertyPhotos.length ? processedPropertyPhotos : asStringArray(raw.property_photos);
  const legacyImages = asStringArray(raw.images);
  const fallbackPhotos = propertyPhotos.length ? propertyPhotos : legacyImages;
  const floorPlans = asStringArray(raw.floor_plan);

  return {
    id: raw.property_id,
    referenceNumber: raw.reference_number || "",
    unitNo: raw.unit_no || "",
    totalAreaSqft: raw.total_area_sqft,
    bedroom: raw.bedroom ?? 0,
    bathroom: raw.bathroom ?? 0,
    parking: raw.parking || "",
    titleEnglish,
    descriptionEnglish: descEnglish,
    titleArabic,
    descriptionArabic: descArabic,
    location: localeFallback(locationEnglish, locationArabic),
    locationEnglish,
    locationArabic,
    city: raw.city || "",
    community: raw.community || "",
    subCommunity: raw.sub_community || "",
    tower: raw.tower || "",
    projectName: raw.project_name || "",
    projectStatus: raw.project_status || "",
    developers: raw.developers || "",
    buildYear: raw.build_year,
    availability: raw.availability || "",
    availableFrom: raw.available_from,
    rentalPeriod: raw.rental_period || "",
    furnished: raw.furnished || "",
    downPaymentPrice: raw.down_payment_price,
    noOfCheques: raw.no_of_cheques,
    serviceCharge: raw.service_charge,
    paymentMethod: raw.payment_method || "",
    financialStatus: raw.financial_status || "",
    contractExpiryDate: raw.contract_expiry_date,
    floorPlan: floorPlans[0] || null,
    floorPlans,
    qrCode: raw.qr_code_property_booster,
    guaranteedBadge: raw.guaranteed_badge || null,
    propertyPhotos: fallbackPhotos,
    notes: raw.notes || "",
    price: raw.price,
    status: raw.status || "",
    titleDeed: raw.title_deed || "",
    hasGarden: raw.has_garden === true || raw.has_garden === "Y",
    finishingType: raw.finishing_type || "",
    floorNo: raw.floor_no || "",
    landNo: raw.land_no || "",
    plotNo: raw.plot_no || "",
    noOfMortgageYears: raw.no_of_mortgage_years,
    hasParkingOnSite:
      raw.has_parking_on_site === true || raw.has_parking_on_site === "Y",
    permitIssueDate: raw.permit_issue_date,
    hasKitchen: raw.has_kitchen === true || raw.has_kitchen === "Y",
    propertyType: normalizePropertyType(raw.property_type),
    saleType: raw.sale_type || "",
    buildUpAreaSqft: raw.build_up_area_sqft,
    listingOwner: raw.listing_owner,
    rera: raw.rera || "",
    adgm: raw.adgm || "",
    offeringType: raw.offering_type || "",
    inventoryStatus: raw.inventory_status || "",
    amenities: raw.amenities || [],
    view: raw.view || [],
    installments: raw.installments || [],
    paymentSchedule: asPaymentSchedule(raw.payment_schedule),
    coverImage: coverImages[0] || fallbackPhotos[0] || "",
    allCoverImages: coverImages,
    latitude: raw.latitude || null,
    longitude: raw.longitude || null,
    investmentInsight: raw.investment_insight || null,
    projectHandoverDate: raw.project_handover_date || null,
    projectStartYear: raw.project_start_year || null,
    developerBrief: raw.developer_brief || null,
    securityDeposit: raw.security_deposit,
    acType: raw.ac_type,
    billingCycle: raw.billing_cycle,
    chiller: raw.chiller,
    contractDuration: raw.contract_duration,
    availabilityStatus: raw.availability_status,
    paymentPlanDescription: raw.payment_plan_description,
    minimumContractDuration: raw.minimum_contract_duration,
    maximumContractDuration: raw.maximum_contract_duration,
    renewalTerms: raw.renewal_terms,
    noticePeriod: raw.notice_period,
    internalSize: raw.internal_size,
    externalSize: raw.external_size,
    permitNumber: raw.permit_number,
    approvalStatus: raw.approval_status,
    listingCategory: raw.listing_category || "",
    attributeGroups: Array.isArray(raw.attribute_groups) ? raw.attribute_groups : [],
    linkedAgent: normalizePropertyAgent(raw.agent),
  };
}

// ----------------------------------------------------------------------
// Store state interface
// ----------------------------------------------------------------------
interface PropertiesState {
  // Legacy (admin/old API)
  properties: any[];
  property: any | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  } | null;
  loading: boolean;
  error: string | null;
  hotDeal: any | null;
  hotDealLoading: boolean;

  agents: any[];
  agentsLoading: boolean;
  agentsError: string | null;

  // New API properties (normalized)
  normalizedProperties: NormalizedProperty[];
  livePropertiesLoading: boolean;
  livePropertiesError: string | null;

  // Pagination for the new API
  propertiesPagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  } | null;
}

export const usePropertiesStore = defineStore("properties", {
  state: (): PropertiesState => ({
    // Legacy
    properties: [],
    property: null,
    pagination: null,
    loading: false,
    error: null,
    hotDeal: null,
    hotDealLoading: false,

    // New
    normalizedProperties: [],
    livePropertiesLoading: false,
    livePropertiesError: null,
    agents: [],
    agentsLoading: false,
    agentsError: null,
    propertiesPagination: null,
  }),

  actions: {
    // ------------------------------------------------------------------
    // Legacy helpers (unchanged)
    // ------------------------------------------------------------------
    handleApiResponse(response: any) {
      if (response.status === 1) {
        return response.data;
      } else {
        throw new Error(response.message || "Request failed");
      }
    },

    // ------------------------------------------------------------------
    // NEW: Fetch properties from the synced backend API
    // ------------------------------------------------------------------
    async fetchPropertiesFromApi(params: Record<string, any> = {}) {
      this.livePropertiesLoading = true;
      this.livePropertiesError = null;

      // Always filter only Live inventory
      const queryParams: Record<string, any> = {
        inventory_status: "Live",
        per_page: params.per_page || 12,
        ...params,
      };

      const propertyTypeVariants = propertyTypeQueryVariants(queryParams.property_type);
      if (propertyTypeVariants.length) {
        queryParams.property_type = propertyTypeVariants[0];
      }

      // Remove undefined/null values
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] === undefined || queryParams[key] === null) {
          delete queryParams[key];
        }
      });

      try {
        let response: ApiPaginatedResponse<RawApiProperty> | null = null;
        let lastError: any = null;
        const attempts = propertyTypeVariants.length ? propertyTypeVariants : [undefined];

        for (const propertyType of attempts) {
          const query = { ...queryParams };
          if (propertyType) query.property_type = propertyType;

          const { data, error } = await useApiFetch(
            {
              apiType: "common",
              url: "properties",
              method: "GET",
            },
            {
              query,
            },
          );

          if (error.value) {
            lastError = error.value;
            continue;
          }

          response = data.value as ApiPaginatedResponse<RawApiProperty>;
          if ((response.data || []).length || !propertyTypeVariants.length) {
            break;
          }
        }

        if (!response && lastError) throw lastError;
        if (!response || response.status !== 1) {
          throw new Error(response?.message || "Failed to fetch properties");
        }

        const rawProperties = response.data || [];
        this.normalizedProperties = rawProperties.map(normalizeApiProperty);
        this.propertiesPagination = {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          total: response.meta.total,
        };

        return {
          properties: this.normalizedProperties,
          pagination: this.propertiesPagination,
        };
      } catch (err: any) {
        this.livePropertiesError = err.message;
        useNotificationStore().error("Error", err.message);
        throw err;
      } finally {
        this.livePropertiesLoading = false;
      }
    },

    // ------------------------------------------------------------------
    // NEW: Fetch single property by ID from backend
    // ------------------------------------------------------------------
    async fetchPropertyById(id: number | string) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await useApiFetch({
          apiType: "common",
          url: `properties/${id}`,
          method: "GET",
        });

        if (error.value) throw error.value;

        const response = data.value as any;
        if (response.status !== 1) {
          throw new Error(response.message || "Property not found");
        }

        const rawProperty = response.data;
        const normalized = normalizeApiProperty(rawProperty);
        this.property = normalized;
        return normalized;
      } catch (err: any) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // ------------------------------------------------------------------
    // NEW: Fetch agents from backend
    // ------------------------------------------------------------------
    async fetchAgents(params: Record<string, any> = {}) {
      this.agentsLoading = true;
      this.agentsError = null;
      try {
        const { data, error } = await useApiFetch(
          {
            apiType: "common",
            url: "agents",
            method: "GET",
          },
          {
            query: params,
          },
        );

        if (error.value) throw error.value;

        const response = data.value as any;
        if (response.status !== 1) {
          throw new Error(response.message || "Failed to fetch agents");
        }

        this.agents = response.data || [];
        return this.agents;
      } catch (err: any) {
        this.agentsError = err.message;
        useNotificationStore().error("Error", err.message);
        throw err;
      } finally {
        this.agentsLoading = false;
      }
    },

    // ------------------------------------------------------------------
    // NEW: Fetch single agent by ID
    // ------------------------------------------------------------------
    async fetchAgentById(id: number | string) {
      this.agentsLoading = true;
      this.agentsError = null;
      try {
        const { data, error } = await useApiFetch({
          apiType: "common",
          url: `agents/${id}`,
          method: "GET",
        });

        if (error.value) throw error.value;

        const response = data.value as any;
        if (response.status !== 1) {
          throw new Error(response.message || "Agent not found");
        }

        return normalizePropertyAgent(response.data);
      } catch (err: any) {
        this.agentsError = err.message;
        throw err;
      } finally {
        this.agentsLoading = false;
      }
    },

    // ------------------------------------------------------------------
    // Legacy methods (keep unchanged for admin)
    // ------------------------------------------------------------------
    async fetchProperties(params?: Record<string, any>) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await useApiFetch(
          {
            apiType: "common",
            url: "properties",
            method: "GET",
          },
          {
            query: params,
          },
        );
        if (error.value) throw error.value;
        const result = data.value as any;
        this.properties = (result.data || []).map(normalizeAdminProperty);
        this.pagination = {
          currentPage: result.meta.current_page,
          lastPage: result.meta.last_page,
          perPage: result.meta.per_page,
          total: result.meta.total,
        };
        return result;
      } catch (err: any) {
        this.error = err.message;
        useNotificationStore().error("Error", err.message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchProperty(id: number | string) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await useApiFetch({
          apiType: "common",
          url: `properties/${id}`,
          method: "GET",
        });
        if (error.value) throw error.value;
        const result = this.handleApiResponse(data.value);
        this.property = normalizeAdminProperty(result);
        return this.property;
      } catch (err: any) {
        this.error = err.message;
        useNotificationStore().error("Error", err.message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createProperty(formData: FormData) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await useApiFetch(
          {
            apiType: "admin",
            url: "properties",
            method: "POST",
          },
          { body: formData },
        );
        if (error.value) throw error.value;
        const result = this.handleApiResponse(data.value);
        useNotificationStore().success(
          "Success",
          "Property created successfully",
        );
        return result;
      } catch (err: any) {
        this.error = err.message;
        useNotificationStore().error("Error", err.message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateProperty(id: number | string, formData: FormData) {
      this.loading = true;
      this.error = null;
      try {
        formData.append("_method", "patch");
        const { data, error } = await useApiFetch(
          {
            apiType: "admin",
            url: `properties/${id}`,
            method: "POST",
          },
          { body: formData },
        );
        if (error.value) throw error.value;
        const result = this.handleApiResponse(data.value);
        useNotificationStore().success(
          "Success",
          "Property updated successfully",
        );
        return result;
      } catch (err: any) {
        this.error = err.message;
        useNotificationStore().error("Error", err.message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async toggleHotDeal(
      id: number | string,
      hotDeal: boolean,
      hotDealPrice?: number,
    ) {
      const formData = new FormData();
      formData.append("hot_deal", hotDeal ? "1" : "0");
      if (hotDeal && hotDealPrice !== undefined) {
        formData.append("hot_deal_price", String(hotDealPrice));
      }
      formData.append("_method", "patch");
      try {
        const { data, error } = await useApiFetch(
          {
            apiType: "admin",
            url: `properties/${id}`,
            method: "POST",
          },
          { body: formData },
        );
        if (error.value) throw error.value;
        const result = this.handleApiResponse(data.value);
        const index = this.properties.findIndex(
          (p) => p.property_id === Number(id),
        );
        if (index !== -1) {
          this.properties[index].hot_deal = hotDeal;
          if (hotDealPrice)
            this.properties[index].hot_deal_price = String(hotDealPrice);
        }
        if (this.hotDeal && this.hotDeal.property_id === Number(id)) {
          this.hotDeal.hot_deal = hotDeal;
          if (hotDealPrice) this.hotDeal.hot_deal_price = String(hotDealPrice);
        }
        useNotificationStore().success(
          "Hot Deal Updated",
          `Hot deal ${hotDeal ? "activated" : "deactivated"}`,
        );
        return result;
      } catch (err: any) {
        useNotificationStore().error("Error", err.message);
        throw err;
      }
    },

    async deleteProperty(id: number | string) {
      try {
        const { data, error } = await useApiFetch({
          apiType: "admin",
          url: `properties/${id}`,
          method: "DELETE",
        });
        if (error.value) throw error.value;
        const result = this.handleApiResponse(data.value);
        this.properties = this.properties.filter(
          (p) => p.property_id !== Number(id),
        );
        if (this.hotDeal && this.hotDeal.property_id === Number(id)) {
          this.hotDeal = null;
        }
        useNotificationStore().success(
          "Deleted",
          "Property deleted successfully",
        );
        return result;
      } catch (err: any) {
        useNotificationStore().error("Error", err.message);
        throw err;
      }
    },

    async deleteImage(propertyId: number | string, imagePath: string) {
      const formData = new FormData();
      formData.append("image", imagePath);
      try {
        const { data, error } = await useApiFetch(
          {
            apiType: "admin",
            url: `properties/${propertyId}/image`,
            method: "POST",
          },
          { body: formData },
        );
        if (error.value) throw error.value;
        const result = this.handleApiResponse(data.value);
        const removeImage = (property: any) => {
          property.images = (property.images || []).filter(
            (img: string) => img !== imagePath,
          );
          property.cover_image = (property.cover_image || []).filter(
            (img: string) => img !== imagePath,
          );
          property.property_photos = (property.property_photos || []).filter(
            (img: string) => img !== imagePath,
          );
        };
        if (this.property && this.property.property_id === Number(propertyId)) {
          removeImage(this.property);
        }
        if (this.hotDeal && this.hotDeal.property_id === Number(propertyId)) {
          removeImage(this.hotDeal);
        }
        useNotificationStore().success(
          "Image Deleted",
          "Image removed successfully",
        );
        return result;
      } catch (err: any) {
        useNotificationStore().error("Error", err.message);
        throw err;
      }
    },

    async fetchHotDeal() {
      this.hotDealLoading = true;
      this.error = null;
      try {
        const { data, error } = await useApiFetch(
          {
            apiType: "common",
            url: "properties",
            method: "GET",
          },
          {
            query: { inventory_status: "Live", hot_deal: 1, per_page: 1 },
          },
        );
        if (error.value) throw error.value;
        const result = data.value as any;
        this.hotDeal = result.data?.[0] || null;
        return this.hotDeal;
      } catch (err: any) {
        this.error = err.message;
        useNotificationStore().error("Error", err.message);
        throw err;
      } finally {
        this.hotDealLoading = false;
      }
    },

    // ------------------------------------------------------------------
    // Deprecated external CRM fetch – kept for reference but not used
    // ------------------------------------------------------------------
    async fetchLiveProperties() {
      console.warn(
        "fetchLiveProperties is deprecated. Use fetchPropertiesFromApi instead.",
      );
      this.livePropertiesLoading = true;
      this.livePropertiesError = null;
      try {
        const response = await fetch(
          "https://myemirateshome.com/im4exr/listings-api/index.php/listings",
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const rawLive = data.data.filter(
          (p: any) => p.inventory_status?.toLowerCase() === "live",
        );
        // This normalization is for the external schema; kept for legacy
        // this.normalizedProperties = rawLive.map(...);
        return this.normalizedProperties;
      } catch (err: any) {
        this.livePropertiesError = err.message;
        useNotificationStore().error("Error", err.message);
        throw err;
      } finally {
        this.livePropertiesLoading = false;
      }
    },
  },
});
