"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Pagination } from "@/components/products/Pagination";
import { useProductStore } from "@/store/productStore";
import { ShoppingBag, Layers, CheckCircle2 } from "lucide-react";

export const HomePage = () => {
  const router = useRouter();
  const { products, meta, categories, isLoading, error, fetchProducts, fetchCategories } =
    useProductStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onAddProduct={() => router.push("/products/add")} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-50 via-cyan-50 to-white text-slate-800 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
                Product Marketplace
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                Find it.{" "}
                <span className="text-teal-600">Bid it.</span>{" "}
                Win it.
              </h1>
              <p className="text-slate-500 text-lg max-w-lg mb-8 mx-auto lg:mx-0">
                Browse our curated collection of amazing products. Add listings,
                manage your catalog, and keep your inventory up to date.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => router.push("/products/add")}
                  className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold px-7 py-3 rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
                >
                  <ShoppingBag size={18} />
                  Add a Product
                </button>
                <a
                  href="#products"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold px-7 py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Browse Products
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-row lg:flex-col gap-4 lg:gap-5">
              {[
                { icon: ShoppingBag, label: "Total Products", value: meta.total, color: "bg-teal-600" },
                { icon: Layers, label: "Categories", value: categories.length || "—", color: "bg-violet-600" },
                { icon: CheckCircle2, label: "In Stock", value: products.filter((p) => p.stock > 0).length, color: "bg-emerald-600" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 min-w-[180px]"
                >
                  <div className={`${color} p-3 rounded-xl`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{value}</p>
                    <p className="text-slate-500 text-xs">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <main id="products" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Just Listed</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {meta.total} product{meta.total !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6">
          <ProductFilters />
          <ProductGrid products={products} isLoading={isLoading} />
          <div className="flex justify-center pt-4">
            <Pagination meta={meta} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
