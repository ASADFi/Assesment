"use client";
import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useProductStore } from "@/store/productStore";
import { CreateProductInput } from "@/types";
import { CheckCircle2 } from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CATEGORIES = [
  "Electronics",
  "Accessories",
  "Furniture",
  "Footwear",
  "Lifestyle",
  "Sports",
  "Other",
];

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  stock?: string;
  imageUrl?: string;
}

const initialForm: CreateProductInput & { category: string } = {
  name: "",
  description: "",
  price: 0,
  category: "",
  stock: 0,
  imageUrl: "",
};

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Details" },
  { id: 3, label: "Media" },
];

export const AddProductModal = ({ isOpen, onClose }: AddProductModalProps) => {
  const { createProduct, isSubmitting } = useProductStore();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState(1);

  const validateStep = (s: number): boolean => {
    const newErrors: FormErrors = {};
    if (s === 1) {
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!form.category) newErrors.category = "Category is required";
    }
    if (s === 2) {
      if (!form.description.trim()) newErrors.description = "Description is required";
      if (form.price <= 0) newErrors.price = "Price must be greater than 0";
      if (form.stock < 0) newErrors.stock = "Stock cannot be negative";
    }
    if (s === 3) {
      if (form.imageUrl && !/^https?:\/\/.+/.test(form.imageUrl)) {
        newErrors.imageUrl = "Must be a valid URL (starting with http/https)";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    try {
      const payload: CreateProductInput = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        ...(form.imageUrl?.trim() && { imageUrl: form.imageUrl.trim() }),
      };
      await createProduct(payload);
      toast.success("Product added successfully!");
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add product");
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setErrors({});
    setStep(1);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Product">
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, idx) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step > s.id
                    ? "bg-teal-600 text-white"
                    : step === s.id
                    ? "bg-teal-600 text-white ring-4 ring-teal-100"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {step > s.id ? <CheckCircle2 size={16} /> : s.id}
              </div>
              <span className={`text-xs font-medium ${step === s.id ? "text-teal-600" : "text-slate-400"}`}>
                {s.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mb-4 rounded-full transition-colors ${step > s.id ? "bg-teal-600" : "bg-slate-200"}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <>
            <Input
              label="Product Name"
              placeholder="e.g. Wireless Headphones"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.category
                    ? "border-red-400"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <option value="">Select a category</option>
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-500">{errors.category}</p>
              )}
            </div>
          </>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <>
            <Textarea
              label="Description"
              placeholder="Describe the product..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              error={errors.description}
              rows={3}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price ($)"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={form.price || ""}
                onChange={(e) =>
                  setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                }
                error={errors.price}
                required
              />
              <Input
                label="Stock Quantity"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={form.stock || ""}
                onChange={(e) =>
                  setForm({ ...form, stock: parseInt(e.target.value) || 0 })
                }
                error={errors.stock}
                required
              />
            </div>
          </>
        )}

        {/* Step 3: Media */}
        {step === 3 && (
          <>
            <Input
              label="Image URL (optional)"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl || ""}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              error={errors.imageUrl}
              helper="Paste a direct image URL (Unsplash, Pexels, etc.)"
            />

            {/* Summary preview */}
            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 space-y-2">
              <h4 className="text-sm font-semibold text-teal-800 mb-3">Review Your Product</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-slate-500 text-xs">Name</p>
                  <p className="font-medium text-slate-800 truncate">{form.name || "—"}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Category</p>
                  <p className="font-medium text-slate-800">{form.category || "—"}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Price</p>
                  <p className="font-medium text-teal-700">${form.price || 0}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Stock</p>
                  <p className="font-medium text-slate-800">{form.stock} units</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          {step > 1 && (
            <Button type="button" variant="secondary" className="flex-1" onClick={handleBack}>
              Back
            </Button>
          )}
          {step < STEPS.length ? (
            <Button type="button" variant="primary" className="flex-1" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <>
              <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>
                Add Product
              </Button>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
};
