"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  ImagePlus,
  Video,
  X,
  Search,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useProductStore } from "@/store/productStore";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

/* ─── Types ─────────────────────────────────────────────── */
interface FormData {
  // Step 1
  imageUrls: string[];
  title: string;
  description: string;
  // Step 2
  units: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  condition: "New" | "Used";
  conditionRating: string;
  categories: string[];
  // Step 3
  pricingFormat: "Fixed Price" | "Auctions";
  price: string;
  quantity: string;
  shippingMethod: string;
  // Step 4
  shippingDetails: string;
  shipWeight: string;
  shipLength: string;
  shipWidth: string;
  shipHeight: string;
  country: string;
  city: string;
  domesticReturns: boolean;
  internationalReturns: boolean;
}

const INITIAL: FormData = {
  imageUrls: [],
  title: "",
  description: "",
  units: "",
  length: "",
  width: "",
  height: "",
  weight: "",
  condition: "New",
  conditionRating: "",
  categories: [],
  pricingFormat: "Fixed Price",
  price: "",
  quantity: "1",
  shippingMethod: "",
  shippingDetails: "",
  shipWeight: "",
  shipLength: "",
  shipWidth: "",
  shipHeight: "",
  country: "",
  city: "",
  domesticReturns: false,
  internationalReturns: false,
};

const STEPS = [
  "Media & Info",
  "Units & Details",
  "Pricing",
  "Shipping & Location",
  "Review",
];

const CATEGORY_SUGGESTIONS = [
  "Electronics",
  "Accessories",
  "Furniture",
  "Footwear",
  "Lifestyle",
  "Sports",
  "Clothing",
  "Books",
  "Home",
  "Garden",
  "Toys",
  "Automotive",
];

const SHIPPING_METHODS = [
  "Standard Shipping",
  "Express Shipping",
  "Freight Overland Items",
  "Air Freight",
  "Sea Freight",
  "Local Pickup",
];

const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "Pakistan", "UAE", "Germany", "France"];

/* ─── Step indicator ────────────────────────────────────── */
const StepBar = ({ step }: { step: number }) => (
  <div className="flex items-center gap-0 mb-10">
    {STEPS.map((label, idx) => {
      const num = idx + 1;
      const done = step > num;
      const active = step === num;
      return (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1 min-w-[64px]">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${done ? "bg-teal-600 text-white" : active ? "bg-teal-600 text-white ring-4 ring-teal-100" : "bg-slate-200 text-slate-400"}`}
            >
              {done ? <CheckCircle2 size={18} /> : num}
            </div>
            <span className={`text-xs font-medium text-center leading-tight ${active ? "text-teal-600" : done ? "text-teal-500" : "text-slate-400"}`}>
              {label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mb-5 mx-1 rounded-full transition-colors ${done ? "bg-teal-500" : "bg-slate-200"}`} />
          )}
        </div>
      );
    })}
  </div>
);

/* ─── Image upload placeholder ──────────────────────────── */
const ImageUploadBox = ({
  icon: Icon,
  label,
  url,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  url: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-col gap-2 flex-1">
    <div
      className="relative aspect-[4/3] border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 flex flex-col items-center justify-center gap-3 hover:border-teal-400 hover:bg-teal-50 transition-all cursor-pointer group"
      onClick={() => {
        const v = window.prompt("Paste an image URL:");
        if (v) onChange(v);
      }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
      ) : (
        <>
          <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-teal-100 transition-colors">
            <Icon size={24} className="text-slate-400 group-hover:text-teal-600" />
          </div>
          <p className="text-xs text-slate-500 text-center px-3">{label}</p>
        </>
      )}
    </div>
    {url && (
      <button
        onClick={() => onChange("")}
        className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 justify-center"
      >
        <X size={12} /> Remove
      </button>
    )}
  </div>
);

/* ─── Field helpers ──────────────────────────────────────── */
const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    {children}
  </div>
);

const TextInput = ({
  placeholder,
  value,
  onChange,
  type = "text",
  unit,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  unit?: string;
}) => (
  <div className="relative">
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
    />
    {unit && (
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
        {unit}
      </span>
    )}
  </div>
);

/* ─── Main Component ─────────────────────────────────────── */
export const AddProductPage = () => {
  const router = useRouter();
  const { createProduct, isSubmitting } = useProductStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [catInput, setCatInput] = useState("");
  const catRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const addCategory = (cat: string) => {
    const trimmed = cat.trim();
    if (trimmed && !form.categories.includes(trimmed)) {
      set("categories", [...form.categories, trimmed]);
    }
    setCatInput("");
  };

  const removeCategory = (cat: string) =>
    set("categories", form.categories.filter((c) => c !== cat));

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Product title is required");
      setStep(1);
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.error("A valid price is required");
      setStep(3);
      return;
    }

    try {
      const payload: Parameters<typeof createProduct>[0] = {
        // Basic
        name: form.title.trim(),
        description: form.description.trim() || "No description provided.",
        price: Number(form.price),
        category: form.categories[0] || "Other",
        stock: Number(form.units) || Number(form.quantity) || 1,
        ...(form.imageUrls[0] && { imageUrl: form.imageUrls[0] }),

        // Condition
        ...(form.condition && { condition: form.condition }),
        ...(form.conditionRating && { conditionRating: Number(form.conditionRating) }),

        // Dimensions
        ...(form.length && { length: Number(form.length) }),
        ...(form.width && { width: Number(form.width) }),
        ...(form.height && { height: Number(form.height) }),
        ...(form.weight && { weight: Number(form.weight) }),

        // Pricing
        pricingFormat: form.pricingFormat,
        quantity: Number(form.quantity) || 1,

        // Shipping & Location
        ...(form.shippingMethod && { shippingMethod: form.shippingMethod }),
        ...(form.country && { country: form.country }),
        ...(form.city && { city: form.city }),
        domesticReturns: form.domesticReturns,
        internationalReturns: form.internationalReturns,
      };

      await createProduct(payload);
      toast.success("Product listed successfully!");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add product");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar onAddProduct={() => router.push("/products/add")} />

      {/* Hero bar */}
      <div className="relative bg-gradient-to-br from-teal-50 via-cyan-50 to-slate-50 py-8 px-4 overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-teal-100/50 pointer-events-none" />
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-teal-200/30 pointer-events-none" />
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-900 text-sm font-medium mb-3 transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">
            My Store{" "}
            <span className="text-slate-400 font-normal">›</span>{" "}
            <span className="text-teal-700">Add Product</span>
          </h1>
        </div>
      </div>

      {/* Form */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <StepBar step={step} />

        {/* ── Step 1: Media & Basic Info ─────────────────────── */}
        {step === 1 && (
          <div className="space-y-8">
            {/* Pictures & Videos */}
            <section>
              <h2 className="text-base font-semibold text-slate-800 mb-1">
                Pictures &amp; Videos
              </h2>
              <p className="text-sm text-slate-500 mb-5">
                You can add up to 10 photos and 3–4 one-minute videos of your product.
              </p>
              <div className="flex gap-4">
                <ImageUploadBox
                  icon={ImagePlus}
                  label="Click to add a photo"
                  url={form.imageUrls[0] || ""}
                  onChange={(v) =>
                    set("imageUrls", v ? [v, ...form.imageUrls.slice(1)] : form.imageUrls.slice(1))
                  }
                />
                <ImageUploadBox
                  icon={Video}
                  label="Click to add a video link"
                  url={form.imageUrls[1] || ""}
                  onChange={(v) => {
                    const next = [...form.imageUrls];
                    if (v) next[1] = v;
                    else next.splice(1, 1);
                    set("imageUrls", next);
                  }}
                />
                {/* Extra empty slots */}
                {[2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex-1 aspect-[4/3] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex items-center justify-center cursor-pointer hover:border-teal-300 transition-colors"
                    onClick={() => {
                      const v = window.prompt("Paste an image URL:");
                      if (v) {
                        const arr = [...form.imageUrls];
                        arr[i] = v;
                        set("imageUrls", arr);
                      }
                    }}
                  >
                    <ImagePlus size={20} className="text-slate-300" />
                  </div>
                ))}
              </div>
            </section>

            {/* Product Title */}
            <Field label="Product Title">
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Add product title"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </Field>

            {/* Product Description */}
            <Field label="Product Description">
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="The product is all that..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white resize-none transition-all"
              />
            </Field>
          </div>
        )}

        {/* ── Step 2: Units & Dimensions ─────────────────────── */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left */}
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  Units &amp; Dimensions
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Add the measurements of your product.
                </p>
              </div>

              <Field label="Number of Units available">
                <TextInput
                  placeholder="Available units"
                  value={form.units}
                  onChange={(v) => set("units", v)}
                  type="number"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Length (in)">
                  <TextInput placeholder="0.00" value={form.length} onChange={(v) => set("length", v)} type="number" unit="in" />
                </Field>
                <Field label="Width (in)">
                  <TextInput placeholder="0.00" value={form.width} onChange={(v) => set("width", v)} type="number" unit="in" />
                </Field>
                <Field label="Height (in)">
                  <TextInput placeholder="0.00" value={form.height} onChange={(v) => set("height", v)} type="number" unit="in" />
                </Field>
                <Field label="Weight (kg)">
                  <TextInput placeholder="0.00" value={form.weight} onChange={(v) => set("weight", v)} type="number" unit="kg" />
                </Field>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-5">
              {/* Product Condition */}
              <div>
                <h2 className="text-base font-semibold text-slate-800 mb-3">
                  Product Condition
                </h2>
                <div className="flex gap-3">
                  {(["New", "Used"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => set("condition", c)}
                      className={`px-6 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                        form.condition === c
                          ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-200"
                          : "bg-white border-slate-200 text-slate-600 hover:border-teal-300"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Rating */}
              <Field label="Condition Rating">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={form.conditionRating}
                    onChange={(e) => set("conditionRating", e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    /10
                  </span>
                </div>
              </Field>

              {/* Product Categories */}
              <div>
                <h2 className="text-base font-semibold text-slate-800 mb-2">
                  Product Categories
                </h2>
                {/* Tag input */}
                <div className="relative mb-3">
                  <input
                    ref={catRef}
                    type="text"
                    value={catInput}
                    onChange={(e) => setCatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        addCategory(catInput);
                      }
                    }}
                    placeholder="Add category of your product"
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                  />
                  <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>

                {/* Selected tags */}
                {form.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.categories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1.5 bg-teal-100 text-teal-800 text-xs font-medium px-3 py-1.5 rounded-full"
                      >
                        {cat}
                        <button onClick={() => removeCategory(cat)}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                {catInput && (
                  <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                    {CATEGORY_SUGGESTIONS.filter(
                      (c) =>
                        c.toLowerCase().includes(catInput.toLowerCase()) &&
                        !form.categories.includes(c)
                    ).map((c) => (
                      <button
                        key={c}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                        onClick={() => addCategory(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick-add pills */}
                {!catInput && (
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_SUGGESTIONS.filter((c) => !form.categories.includes(c))
                      .slice(0, 5)
                      .map((c) => (
                        <button
                          key={c}
                          onClick={() => addCategory(c)}
                          className="text-xs px-3 py-1 rounded-full border border-slate-200 text-slate-500 hover:border-teal-400 hover:text-teal-600 transition-colors"
                        >
                          + {c}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Pricing ────────────────────────────────── */}
        {step === 3 && (
          <div className="max-w-2xl space-y-8">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Pricing</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Select fixed price or auction.
              </p>
            </div>

            {/* Pricing Format */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">
                Pricing Format
              </p>
              <div className="flex gap-3">
                {(["Fixed Price", "Auctions"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => set("pricingFormat", f)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                      form.pricingFormat === f
                        ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-200"
                        : "bg-white border-slate-200 text-slate-600 hover:border-teal-300"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Quantity */}
            <div className="grid grid-cols-2 gap-6">
              <Field label="Price">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                  />
                </div>
              </Field>

              <Field label="Quantity">
                <TextInput
                  placeholder="1"
                  value={form.quantity}
                  onChange={(v) => set("quantity", v)}
                  type="number"
                />
              </Field>
            </div>

            {/* Shipping method */}
            <Field label="Shipping">
              <select
                value={form.shippingMethod}
                onChange={(e) => set("shippingMethod", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              >
                <option value="">Select shipping method</option>
                {SHIPPING_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {/* ── Step 4: Shipping Details & Location ─────────────── */}
        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Pricing summary (left) */}
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold text-slate-800">Pricing</h2>
                <p className="text-sm text-slate-500 mt-0.5">Select buy it now or Auction</p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Pricing Format</p>
                <div className="flex gap-2">
                  {(["Fixed Price", "Auctions"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => set("pricingFormat", f)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                        form.pricingFormat === f
                          ? "bg-teal-600 border-teal-600 text-white"
                          : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Price">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => set("price", e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-6 pr-2 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                    />
                  </div>
                </Field>
                <Field label="Quantity">
                  <TextInput placeholder="1" value={form.quantity} onChange={(v) => set("quantity", v)} type="number" />
                </Field>
              </div>

              <Field label="Shipping">
                <select
                  value={form.shippingMethod}
                  onChange={(e) => set("shippingMethod", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                >
                  <option value="">Select shipping method</option>
                  {SHIPPING_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Shipping Details (middle) */}
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold text-slate-800">Shipping</h2>
                <p className="text-sm text-slate-500 mt-0.5">Add the shipping details</p>
              </div>

              <Field label="Shipping Method">
                <select
                  value={form.shippingDetails}
                  onChange={(e) => set("shippingDetails", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                >
                  <option value="">Select method</option>
                  {SHIPPING_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </Field>

              <Field label="Weight (kg)">
                <TextInput placeholder="0.00" value={form.shipWeight} onChange={(v) => set("shipWeight", v)} type="number" unit="kg" />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Length (in)">
                  <TextInput placeholder="0.00" value={form.shipLength} onChange={(v) => set("shipLength", v)} type="number" unit="in" />
                </Field>
                <Field label="Width (in)">
                  <TextInput placeholder="0.00" value={form.shipWidth} onChange={(v) => set("shipWidth", v)} type="number" unit="in" />
                </Field>
                <Field label="Height (in)">
                  <TextInput placeholder="0.00" value={form.shipHeight} onChange={(v) => set("shipHeight", v)} type="number" unit="in" />
                </Field>
              </div>
            </div>

            {/* Location (right) */}
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold text-slate-800">Location</h2>
              </div>

              <Field label="Country">
                <select
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="City">
                <TextInput placeholder="Select city" value={form.city} onChange={(v) => set("city", v)} />
              </Field>

              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Domestic Returns</p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => set("domesticReturns", !form.domesticReturns)}
                    className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${form.domesticReturns ? "bg-teal-600" : "bg-slate-200"}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${form.domesticReturns ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                  <span className="text-sm text-slate-600">
                    {form.domesticReturns ? "Accept returns" : "No returns"}
                  </span>
                </label>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">International Returns</p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => set("internationalReturns", !form.internationalReturns)}
                    className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${form.internationalReturns ? "bg-teal-600" : "bg-slate-200"}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${form.internationalReturns ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                  <span className="text-sm text-slate-600">
                    {form.internationalReturns ? "Accept returns" : "No returns"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 5: Review ──────────────────────────────────── */}
        {step === 5 && (
          <div className="max-w-3xl space-y-8">
            <h2 className="text-base font-semibold text-slate-800">
              Review your listing
            </h2>

            {/* Image preview */}
            {form.imageUrls.filter(Boolean).length > 0 && (
              <div className="flex gap-3">
                {form.imageUrls.filter(Boolean).map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="w-24 h-24 rounded-2xl object-cover border border-slate-200"
                  />
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Basic */}
              <div className="bg-teal-50 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-teal-800 border-b border-teal-200 pb-2">
                  Basic Info
                </h3>
                <ReviewRow label="Title" value={form.title || "—"} />
                <ReviewRow label="Description" value={form.description ? `${form.description.slice(0, 60)}…` : "—"} />
                <ReviewRow label="Categories" value={form.categories.join(", ") || "—"} />
                <ReviewRow label="Condition" value={`${form.condition}${form.conditionRating ? ` (${form.conditionRating}/10)` : ""}`} />
              </div>

              {/* Dimensions */}
              <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-200 pb-2">
                  Dimensions
                </h3>
                <ReviewRow label="Units" value={form.units || "—"} />
                <ReviewRow label="L × W × H" value={`${form.length || "0"} × ${form.width || "0"} × ${form.height || "0"} in`} />
                <ReviewRow label="Weight" value={form.weight ? `${form.weight} kg` : "—"} />
              </div>

              {/* Pricing */}
              <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-200 pb-2">
                  Pricing
                </h3>
                <ReviewRow label="Format" value={form.pricingFormat} />
                <ReviewRow label="Price" value={form.price ? `$${Number(form.price).toFixed(2)}` : "—"} highlight />
                <ReviewRow label="Quantity" value={form.quantity || "1"} />
                <ReviewRow label="Shipping" value={form.shippingMethod || "—"} />
              </div>

              {/* Location */}
              <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-200 pb-2">
                  Location
                </h3>
                <ReviewRow label="Country" value={form.country || "—"} />
                <ReviewRow label="City" value={form.city || "—"} />
                <ReviewRow label="Domestic Returns" value={form.domesticReturns ? "Accepted" : "No"} />
                <ReviewRow label="International Returns" value={form.internationalReturns ? "Accepted" : "No"} />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={back}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-slate-200 text-slate-600 font-semibold hover:border-teal-300 hover:text-teal-700 transition-all text-sm"
            >
              <ArrowLeft size={15} />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length ? (
            <button
              onClick={next}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-2.5 rounded-full shadow-lg shadow-teal-200 transition-all text-sm"
            >
              Next
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-10 py-3 rounded-full shadow-lg shadow-teal-200 transition-all text-sm"
            >
              {isSubmitting ? "Publishing…" : "Publish Listing"}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* ─── Review helper ──────────────────────────────────────── */
const ReviewRow = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex justify-between items-start gap-2">
    <span className="text-xs text-slate-500 shrink-0">{label}</span>
    <span className={`text-xs font-semibold text-right ${highlight ? "text-teal-700 text-sm" : "text-slate-700"}`}>
      {value}
    </span>
  </div>
);
