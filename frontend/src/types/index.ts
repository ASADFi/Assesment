export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string | null;

  // Condition
  condition?: string | null;
  conditionRating?: number | null;

  // Dimensions
  length?: number | null;
  width?: number | null;
  height?: number | null;
  weight?: number | null;

  // Pricing
  pricingFormat?: string | null;
  quantity?: number | null;

  // Shipping & Location
  shippingMethod?: string | null;
  country?: string | null;
  city?: string | null;
  domesticReturns?: boolean;
  internationalReturns?: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  // Basic
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;

  // Condition
  condition?: "New" | "Used";
  conditionRating?: number;

  // Dimensions
  length?: number;
  width?: number;
  height?: number;
  weight?: number;

  // Pricing
  pricingFormat?: "Fixed Price" | "Auctions";
  quantity?: number;

  // Shipping & Location
  shippingMethod?: string;
  country?: string;
  city?: string;
  domesticReturns?: boolean;
  internationalReturns?: boolean;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: PaginationMeta;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  condition?: string;
  country?: string;
}
