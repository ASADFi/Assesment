"use client";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useProductStore } from "@/store/productStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export const ProductFilters = () => {
  const { filters, categories, setFilters } = useProductStore();
  const [search, setSearch] = useState(filters.search || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search: search.trim() || undefined });
  };

  const clearSearch = () => {
    setSearch("");
    setFilters({ search: undefined });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <Button type="submit" size="md" variant="primary">
            Search
          </Button>
        </form>

        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={15} className="text-slate-500" />
            <select
              value={filters.category || ""}
              onChange={(e) =>
                setFilters({ category: e.target.value || undefined })
              }
              className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-700"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <select
            value={`${filters.sortBy}_${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("_") as [
                string,
                "asc" | "desc"
              ];
              setFilters({ sortBy, sortOrder });
            }}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-700"
          >
            <option value="createdAt_desc">Newest First</option>
            <option value="createdAt_asc">Oldest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
};
