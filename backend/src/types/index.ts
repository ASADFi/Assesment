export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateProductDto {
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

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: "price" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  condition?: string;
  country?: string;
}
