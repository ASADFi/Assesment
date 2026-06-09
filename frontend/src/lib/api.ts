import axios from "axios";
import {
  ApiResponse,
  CreateProductInput,
  Product,
  ProductFilters,
  PaginationMeta,
} from "@/types";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error || err.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export const productApi = {
  getAll: async (
    filters?: ProductFilters
  ): Promise<{ products: Product[]; meta: PaginationMeta }> => {
    const { data } = await apiClient.get<ApiResponse<Product[]>>("/products", {
      params: filters,
    });
    return {
      products: data.data ?? [],
      meta: data.meta ?? { total: 0, page: 1, limit: 12, totalPages: 0 },
    };
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get<ApiResponse<Product>>(
      `/products/${id}`
    );
    return data.data!;
  },

  create: async (input: CreateProductInput): Promise<Product> => {
    const { data } = await apiClient.post<ApiResponse<Product>>(
      "/products",
      input
    );
    return data.data!;
  },

  update: async (
    id: string,
    input: Partial<CreateProductInput>
  ): Promise<Product> => {
    const { data } = await apiClient.put<ApiResponse<Product>>(
      `/products/${id}`,
      input
    );
    return data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  getCategories: async (): Promise<string[]> => {
    const { data } =
      await apiClient.get<ApiResponse<string[]>>("/products/categories");
    return data.data ?? [];
  },
};
