"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationMeta } from "@/types";
import { useProductStore } from "@/store/productStore";
import { cn } from "@/lib/utils";

interface PaginationProps {
  meta: PaginationMeta;
}

export const Pagination = ({ meta }: PaginationProps) => {
  const { filters, fetchProducts } = useProductStore();

  if (meta.totalPages <= 1) return null;

  const goto = (page: number) => {
    fetchProducts({ ...filters, page });
  };

  const pages = Array.from({ length: meta.totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === meta.totalPages || Math.abs(p - meta.page) <= 2
  );

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => goto(meta.page - 1)}
        disabled={meta.page === 1}
        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page, idx) => {
        const prev = pages[idx - 1];
        return (
          <span key={page} className="flex items-center gap-1.5">
            {prev && page - prev > 1 && (
              <span className="text-slate-400 px-1">…</span>
            )}
            <button
              onClick={() => goto(page)}
              className={cn(
                "w-9 h-9 rounded-xl text-sm font-medium transition-all",
                page === meta.page
                  ? "bg-teal-600 text-white shadow-sm"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {page}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => goto(meta.page + 1)}
        disabled={meta.page === meta.totalPages}
        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
