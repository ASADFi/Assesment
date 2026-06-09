"use client";
import { Package } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
    <div className="aspect-[4/3] bg-slate-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
      <div className="h-3 bg-slate-200 rounded-lg w-full" />
      <div className="h-3 bg-slate-200 rounded-lg w-5/6" />
      <div className="flex justify-between pt-2">
        <div className="h-5 bg-slate-200 rounded-lg w-20" />
        <div className="h-4 bg-slate-200 rounded-lg w-16" />
      </div>
    </div>
  </div>
);

export const ProductGrid = ({ products, isLoading }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="p-6 bg-slate-100 rounded-full mb-4">
          <Package size={48} className="text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">
          No products found
        </h3>
        <p className="text-slate-500 max-w-sm">
          Try adjusting your filters or add your first product to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
