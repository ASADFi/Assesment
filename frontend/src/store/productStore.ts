"use client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Product, CreateProductInput, ProductFilters, PaginationMeta } from "@/types";
import { productApi } from "@/lib/api";

interface ProductState {
  products: Product[];
  categories: string[];
  meta: PaginationMeta;
  filters: ProductFilters;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchCategories: () => Promise<void>;
  getProductById: (id: string) => Promise<Product>;
  createProduct: (input: CreateProductInput) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductState>()(
  devtools(
    (set, get) => ({
      products: [],
      categories: [],
      meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
      filters: { page: 1, limit: 12, sortBy: "createdAt", sortOrder: "desc" },
      isLoading: false,
      isSubmitting: false,
      error: null,

      fetchProducts: async (filters?: ProductFilters) => {
        set({ isLoading: true, error: null });
        try {
          const merged = { ...get().filters, ...filters };
          const { products, meta } = await productApi.getAll(merged);
          set({ products, meta, filters: merged, isLoading: false });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Failed to fetch products",
            isLoading: false,
          });
        }
      },

      fetchCategories: async () => {
        try {
          const categories = await productApi.getCategories();
          set({ categories });
        } catch {
          // non-critical
        }
      },

      getProductById: async (id: string) => {
        return await productApi.getById(id);
      },

      createProduct: async (input: CreateProductInput) => {
        set({ isSubmitting: true, error: null });
        try {
          const product = await productApi.create(input);
          set((state) => ({
            products: [product, ...state.products],
            meta: { ...state.meta, total: state.meta.total + 1 },
            isSubmitting: false,
          }));
          return product;
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to create product";
          set({ error: message, isSubmitting: false });
          throw new Error(message);
        }
      },

      deleteProduct: async (id: string) => {
        try {
          await productApi.delete(id);
          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
            meta: { ...state.meta, total: state.meta.total - 1 },
          }));
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Failed to delete product",
          });
        }
      },

      setFilters: (filters: Partial<ProductFilters>) => {
        const merged = { ...get().filters, ...filters, page: 1 };
        set({ filters: merged });
        get().fetchProducts(merged);
      },

      clearError: () => set({ error: null }),
    }),
    { name: "product-store" }
  )
);
