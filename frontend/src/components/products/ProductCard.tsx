"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Package } from "lucide-react";
import { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { useProductStore } from "@/store/productStore";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const deleteProduct = useProductStore((s) => s.deleteProduct);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete "${product.name}"?`)) {
      await deleteProduct(product.id);
    }
  };

  const stockColor =
    product.stock === 0
      ? "text-red-500"
      : product.stock < 10
      ? "text-amber-500"
      : "text-emerald-600";

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1 flex flex-col"
    >
      <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package size={48} className="text-slate-300" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge label={product.category} />
        </div>
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 text-red-400 hover:text-red-600 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
          aria-label="Delete product"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-slate-800 text-base leading-snug line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-lg font-bold text-teal-600">
            {formatPrice(product.price)}
          </span>
          <span className={`text-xs font-medium ${stockColor}`}>
            {product.stock === 0
              ? "Out of stock"
              : `${product.stock} in stock`}
          </span>
        </div>
      </div>
    </Link>
  );
};
