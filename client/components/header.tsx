
import Link from "next/link";

import { ShoppingCart, Search, Heart, User } from "lucide-react";
import MobileMenu from "@/components/mobile-menu";
import MainNav from "@/components/main-nav";

export default function Header() {
  

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchInput = e.currentTarget.elements.namedItem('search') as HTMLInputElement;
    const searchTerm = searchInput.value;
    if (searchTerm.trim()) {
     window.location.href = `/products?category=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="hidden md:flex justify-between items-center bg-[#f8f8f8] px-6 py-2 text-xs">
        <div className="flex items-center space-x-4">
          <span>Welcome to Gift Orium Gift Shop</span>
          <span>|</span>
          <span>Free Shipping on Orders ₹1000+</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/about" className="hover:text-pink-500">
            About
          </Link>
          <span>|</span>
          <Link href="/contact" className="hover:text-pink-500">
            Contact
          </Link>
          <span>|</span>
          <Link href="blog" className="hover:text-pink-500">
            Blog
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link
            href="/"
            className="text-2xl font-bold text-pink-500 flex items-center"
          >
            <span className="bg-pink-500 text-white p-2 rounded-full mr-2">
              G
            </span>
            ift Orium
          </Link>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-1/3 mb-4 md:mb-0">
          <input
            type="text"
            name="search"
            placeholder="Search for gifts..."
            className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500"
          >
            <Search size={18} />
          </button>
        </form>

        <div className="flex items-center space-x-6">
          <Link
            href="/wishlists"
            className="flex items-center hover:text-pink-500"
          >
            <Heart size={20} />
            <span className="ml-1 hidden md:inline">Wishlist</span>
          </Link>
          <Link
            href="/profile"
            className="flex items-center hover:text-pink-500"
          >
            <User size={20} />
            <span className="ml-1 hidden md:inline">Account</span>
          </Link>
          <Link href="/cart" className="flex items-center hover:text-pink-500">
            <div className="relative">
              <ShoppingCart size={20} />
            </div>
            <span className="ml-1 hidden md:inline">Cart</span>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t border-b border-gray-200">
        <div className="container mx-auto px-4 relative flex items-center justify-between">
          <div className="md:hidden">
            <MobileMenu />
          </div>
          <MainNav />
        </div>
      </div>
    </header>
  );
}
