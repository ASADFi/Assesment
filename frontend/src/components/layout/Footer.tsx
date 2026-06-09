import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export const Footer = () => (
  <footer className="bg-[#1a0a3c] text-white mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-teal-500 rounded-lg">
              <ShoppingBag size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg">My Store</span>
          </div>
          <p className="text-purple-200 text-sm leading-relaxed">
            Find it. Bid it. Win it. Your go-to marketplace for amazing products.
          </p>
        </div>

        {/* Features */}
        <div>
          <h3 className="font-semibold text-white mb-4 uppercase text-xs tracking-widest">
            Features
          </h3>
          <ul className="space-y-2.5 text-sm text-purple-200">
            <li><Link href="#" className="hover:text-teal-400 transition-colors">Browse Products</Link></li>
            <li><Link href="#" className="hover:text-teal-400 transition-colors">Categories</Link></li>
            <li><Link href="#" className="hover:text-teal-400 transition-colors">Search</Link></li>
            <li><Link href="#" className="hover:text-teal-400 transition-colors">Filter & Sort</Link></li>
          </ul>
        </div>

        {/* Actions */}
        <div>
          <h3 className="font-semibold text-white mb-4 uppercase text-xs tracking-widest">
            Actions
          </h3>
          <ul className="space-y-2.5 text-sm text-purple-200">
            <li><Link href="#" className="hover:text-teal-400 transition-colors">Add Product</Link></li>
            <li><Link href="#" className="hover:text-teal-400 transition-colors">Manage Listings</Link></li>
            <li><Link href="#" className="hover:text-teal-400 transition-colors">Track Stock</Link></li>
            <li><Link href="#" className="hover:text-teal-400 transition-colors">Reports</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-white mb-4 uppercase text-xs tracking-widest">
            Company
          </h3>
          <ul className="space-y-2.5 text-sm text-purple-200">
            <li><Link href="#" className="hover:text-teal-400 transition-colors">About</Link></li>
            <li><Link href="#" className="hover:text-teal-400 transition-colors">Contact</Link></li>
            <li><Link href="#" className="hover:text-teal-400 transition-colors">Privacy</Link></li>
            <li><Link href="#" className="hover:text-teal-400 transition-colors">Terms</Link></li>
          </ul>
        </div>
      </div>
    </div>

    <div className="border-t border-purple-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-purple-300 text-sm">
          &copy; {new Date().getFullYear()} My Store. Built with Next.js & Prisma.
        </p>
        <div className="flex items-center gap-4 text-xs text-purple-400">
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  </footer>
);
