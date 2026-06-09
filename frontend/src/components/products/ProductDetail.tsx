"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Heart,
  MessageCircle,
  User,
  Star,
  Trash2,
  ChevronRight,
  Clock,
  Gavel,
  Zap,
  MapPin,
} from "lucide-react";
import { Product } from "@/types";
import { productApi } from "@/lib/api";
import { useProductStore } from "@/store/productStore";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ProductDetailPageProps {
  id: string;
}

/* ── Fake bidders for UI fidelity ── */
const FAKE_BIDDERS = [
  { name: "Alex M.", amount: 300, avatar: "AM" },
  { name: "Sara K.", amount: 280, avatar: "SK" },
  { name: "John D.", amount: 260, avatar: "JD" },
  { name: "Lena R.", amount: 250, avatar: "LR" },
  { name: "Mike T.", amount: 230, avatar: "MT" },
  { name: "Hina B.", amount: 210, avatar: "HB" },
];

/* ── Countdown digits ── */
const CountdownBox = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="bg-teal-600 text-white font-bold text-base px-3.5 py-2 rounded-lg min-w-[42px] text-center leading-none">
      {value}
    </span>
    <span className="text-[10px] text-slate-400">{label}</span>
  </div>
);

/* ── Wishlist-style product mini card ── */
const MiniCard = ({ product }: { product: Product }) => {
  const [liked, setLiked] = useState(false);
  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all">
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package size={32} className="text-slate-300" />
          </div>
        )}
        <button
          onClick={(e) => { e.preventDefault(); setLiked((l) => !l); }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow transition-colors"
        >
          <Heart size={14} className={liked ? "fill-red-500 text-red-500" : "text-slate-400"} />
        </button>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-slate-800">{formatPrice(product.price)}</span>
          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
            <Clock size={10} /> {formatDate(product.createdAt)}
          </span>
        </div>
        <p className="text-xs text-slate-700 font-medium line-clamp-1 mb-0.5">{product.name}</p>
        {(product.city || product.country) && (
          <p className="text-[10px] text-slate-400 flex items-center gap-0.5">
            <MapPin size={9} /> {[product.city, product.country].filter(Boolean).join(", ")}
          </p>
        )}
      </div>
    </Link>
  );
};

/* ══════════════════════════════════════════════════════════ */
export const ProductDetailPage = ({ id }: ProductDetailPageProps) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [autoBid, setAutoBid] = useState(false);
  const [liked, setLiked] = useState(false);
  const [countdown] = useState({ h: "04", m: "21", s: "04" });

  const { products, fetchProducts, deleteProduct } = useProductStore();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const p = await productApi.getById(id);
        setProduct(p);
      } catch {
        setError("Product not found.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const related = products
    .filter((p) => p.id !== id && p.category === product?.category)
    .slice(0, 4);

  /* Build a gallery of up to 5 thumbnails from imageUrl */
  const gallery = product?.imageUrl
    ? Array.from({ length: 5 }, () => product.imageUrl as string)
    : [];

  const handleDelete = async () => {
    if (!product) return;
    if (window.confirm(`Delete "${product.name}"?`)) {
      await deleteProduct(product.id);
      toast.success("Product deleted");
      router.push("/");
    }
  };

  const handleBid = () => {
    if (!bidAmount || Number(bidAmount) <= 0) {
      toast.error("Enter a valid bid amount");
      return;
    }
    toast.success(`Bid of ${formatPrice(Number(bidAmount))} placed!`);
    setBidAmount("");
  };

  const highestBid = product ? Math.round(product.price * 0.7) : 0;
  const conditionStars = product?.conditionRating
    ? Math.round((product.conditionRating / 10) * 5)
    : 4;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* ── Breadcrumb hero ──────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-teal-50 via-cyan-50 to-slate-50 py-8 px-4 overflow-hidden">
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-teal-100/60 pointer-events-none" />
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-36 h-36 rounded-full bg-cyan-200/30 pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-400">Product Details</span>
          </nav>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Loading skeleton */}
        {isLoading && (
          <div className="flex gap-8 animate-pulse">
            <div className="flex gap-3">
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-14 h-14 rounded-xl bg-slate-200" />
                ))}
              </div>
              <div className="w-80 h-96 rounded-2xl bg-slate-200" />
            </div>
            <div className="flex-1 space-y-4 pt-4">
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-10 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-700 mb-2">Product Not Found</h2>
            <p className="text-slate-500 mb-6">{error}</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-700 transition-colors">
              Back to Home
            </Link>
          </div>
        )}

        {product && !isLoading && (
          <>
            {/* ── Main grid ────────────────────────────────── */}
            <div className="flex flex-col lg:flex-row gap-8 mb-10">

              {/* LEFT: Gallery + Seller card */}
              <div className="flex flex-col gap-5 lg:w-[42%]">
                {/* Image gallery */}
                <div className="flex gap-3">
                  {/* Thumbnail strip */}
                  {gallery.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {gallery.map((url, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImg(i)}
                          className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${selectedImg === i ? "border-teal-500 shadow-md" : "border-slate-200 hover:border-teal-300"}`}
                        >
                          <Image src={url} alt="" width={56} height={56} className="object-cover w-full h-full" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Main image */}
                  <div className="relative flex-1 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-md">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package size={64} className="text-slate-300" />
                      </div>
                    )}
                    {/* Wishlist */}
                    <button
                      onClick={() => setLiked((l) => !l)}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow transition-colors"
                    >
                      <Heart size={16} className={liked ? "fill-red-500 text-red-500" : "text-slate-400"} />
                    </button>
                    {/* Delete */}
                    <button
                      onClick={handleDelete}
                      className="absolute top-3 left-3 p-2 bg-white/90 rounded-full shadow text-red-400 hover:text-red-600 transition-colors"
                      aria-label="Delete product"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Seller info card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                      <User size={20} className="text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">Seller</p>
                      <p className="font-semibold text-slate-800 text-sm truncate">
                        {product.city ? `${product.city} Store` : "My Store"}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={11}
                            className={s <= conditionStars ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
                          />
                        ))}
                        <span className="text-[10px] text-slate-500 ml-1">
                          {product.conditionRating ? `${product.conditionRating}/10 (Condition)` : "4.0 (3 Reviews)"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 flex items-center justify-center gap-1.5 border-2 border-teal-500 text-teal-600 text-xs font-semibold py-2 rounded-xl hover:bg-teal-50 transition-colors">
                      <MessageCircle size={13} /> Chat with seller
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 border-2 border-slate-200 text-slate-600 text-xs font-semibold py-2 rounded-xl hover:bg-slate-50 transition-colors">
                      <User size={13} /> View Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT: Product info */}
              <div className="flex-1 flex flex-col gap-5">
                {/* Title + time + Q&A */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h1 className="text-xl font-bold text-slate-800 leading-snug">
                      {product.name}
                      {product.condition && (
                        <span className="text-slate-500 font-normal">
                          {", "}
                          {product.conditionRating ? `${product.conditionRating}/10 condition` : product.condition}
                        </span>
                      )}
                    </h1>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap">
                        <Clock size={11} /> {formatDate(product.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-3xl font-extrabold text-slate-800">
                      {formatPrice(product.price)}
                    </span>
                    <button className="text-xs font-semibold border-2 border-teal-500 text-teal-600 px-3 py-1.5 rounded-full hover:bg-teal-50 transition-colors">
                      Q&A Section
                    </button>
                  </div>

                  {/* Location */}
                  {(product.city || product.country) && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                      <MapPin size={11} />
                      {[product.city, product.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>

                {/* Auction countdown */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">
                    Auction Ending in
                  </p>
                  <div className="flex items-end gap-3">
                    <CountdownBox value={countdown.h} label="Hours" />
                    <span className="text-teal-600 font-bold text-xl mb-3">:</span>
                    <CountdownBox value={countdown.m} label="Mins" />
                    <span className="text-teal-600 font-bold text-xl mb-3">:</span>
                    <CountdownBox value={countdown.s} label="Secs" />
                  </div>
                </div>

                {/* Product Description */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">Product Description</h3>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                    {product.description}
                  </p>
                  {product.shippingMethod && (
                    <p className="text-xs text-slate-500 mt-2">
                      Shipping via <span className="font-medium text-slate-700">{product.shippingMethod}</span>
                      {product.domesticReturns && " · Returns accepted"}
                    </p>
                  )}
                </div>

                {/* Bid + Buy section */}
                <div className="flex flex-col gap-3 pt-1">
                  {/* Highest bid row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Highest Bid</p>
                      <p className="text-2xl font-bold text-slate-800">{formatPrice(highestBid)}</p>
                    </div>
                    <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-teal-200 transition-colors text-sm">
                      <Gavel size={15} /> Place your Bid
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Buy Now for</p>
                      <p className="text-2xl font-bold text-teal-600">{formatPrice(product.price)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2.5 rounded-xl border-2 border-slate-200 text-slate-500 hover:border-teal-400 hover:text-teal-600 transition-colors">
                        <ShoppingCart size={18} />
                      </button>
                      <button
                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-teal-200 transition-colors text-sm disabled:opacity-50"
                        disabled={product.stock === 0}
                      >
                        <Zap size={14} />
                        {product.stock === 0 ? "Out of Stock" : "Buy Now"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Place Your Bid + Bidders row ────────────── */}
            <div className="flex flex-col sm:flex-row gap-6 mb-14">
              {/* Place bid form */}
              <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Place Your Bid</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your Bid"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                  <button
                    onClick={handleBid}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Bid
                  </button>
                </div>
                <button
                  onClick={() => setAutoBid((a) => !a)}
                  className={`w-full text-xs font-semibold py-2 rounded-xl border-2 transition-colors ${autoBid ? "bg-teal-600 border-teal-600 text-white" : "border-slate-200 text-slate-500 hover:border-teal-400 hover:text-teal-600"}`}
                >
                  Auto Bidding {autoBid && "(Active)"}
                </button>
              </div>

              {/* Bidders */}
              <div className="flex-1 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Bidders
                    <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                      {FAKE_BIDDERS.length}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400">Last Bid</span>
                </div>
                <div className="space-y-2.5">
                  {FAKE_BIDDERS.slice(0, 4).map((b) => (
                    <div key={b.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-700">
                          {b.avatar}
                        </div>
                        <span className="text-sm text-slate-700 font-medium">{b.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">{formatPrice(b.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── You might also like ──────────────────────── */}
            {(related.length > 0 || products.length > 0) && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-slate-800">You might also like</h2>
                  <Link href="/" className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
                    See All <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(related.length > 0 ? related : products.filter((p) => p.id !== id).slice(0, 4)).map((p) => (
                    <MiniCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};
