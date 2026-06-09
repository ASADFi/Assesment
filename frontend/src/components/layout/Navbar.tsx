"use client";
import { ShoppingBag, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  onAddProduct?: () => void;
}

export const Navbar = ({ onAddProduct }: NavbarProps) => {
  const router = useRouter();

  const handleAdd = () => {
    if (onAddProduct) onAddProduct();
    else router.push("/products/add");
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-600 rounded-xl">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              My Store
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-teal-600 transition-colors">
              Home
            </Link>
            <Link href="/#products" className="hover:text-teal-600 transition-colors">
              Products
            </Link>
            <Link href="/products/add" className="text-teal-600 font-semibold">
              My Store
            </Link>
          </div>

          <Button onClick={handleAdd} size="md">
            <Plus size={16} />
            Add Product
          </Button>
        </div>
      </div>
    </nav>
  );
};
