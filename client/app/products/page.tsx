"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import ProductCard from "@/components/product-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, ChevronRight, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  imageUrl: string;
  rating: number;
  numReviews: number;
  tags: string[];
  stock: number;
  featured: boolean;
  createdAt?: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [showAllTags, setShowAllTags] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [cameFromUrl, setCameFromUrl] = useState(false);

  const categories = [
    "All",
    "Flowers",
    "Keychains",
    "Religious gifts",
    "Soft toys",
    "Home Decor",
    "Toys & Games",
    "Kitchen & Dining",
    "Premium Gifts",
    "Other",
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/products`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.data || []);
    } catch (err) {
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetUrlFiltersIfNeeded = () => {
    if (cameFromUrl) {
      setSelectedTag("");
      setCameFromUrl(false);
      router.push("/products");
    }
  };

  useEffect(() => {
    const tagParam = searchParams.get("tag");
    const categoryParam = searchParams.get("category");
    if (categoryParam) setSearchTerm(decodeURIComponent(categoryParam));
    if (tagParam) setSearchTerm(decodeURIComponent(tagParam));
  }, [searchParams]);

  const allTags = Array.from(
    new Set(products.flatMap((p) => p.tags || []))
  ).filter(Boolean);
  const displayedTags = showAllTags ? allTags : allTags.slice(0, 8);

  useEffect(() => {
    if (isSearching) {
      const handler = setTimeout(() => {
        if (searchTerm) {
          setSelectedCategory("all");
          setSelectedTag("");
          setPriceRange("all");
          fetchProducts();
        }
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [isSearching, searchTerm]);

  const fuse = new Fuse(products, {
    keys: ["name", "description", "tags", "category"],
    threshold: 0.3,
  });

  const getFilteredProducts = () => {
    let filtered = searchTerm
      ? fuse.search(searchTerm).map((result) => result.item)
      : products;

    return filtered.filter((product: any) => {
      const matchesTag =
        !selectedTag || (product.tags && product.tags.includes(selectedTag));

      let matchesPrice = true;
      const price = product.discountPrice || product.price;
      switch (priceRange) {
        case "under500":
          matchesPrice = price < 500;
          break;
        case "500to1000":
          matchesPrice = price >= 500 && price <= 1000;
          break;
        case "1000to2000":
          matchesPrice = price > 1000 && price <= 2000;
          break;
        case "over2000":
          matchesPrice = price > 2000;
          break;
      }

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      return matchesCategory && matchesTag && matchesPrice;
    });
  };

  const filteredProducts = getFilteredProducts();

  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;

    switch (sortBy) {
      case "price_asc":
        return priceA - priceB;
      case "price_desc":
        return priceB - priceA;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      default:
        return a.featured ? -1 : 1;
    }
  });

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    if (tag) {
      router.push(`/products?tag=${encodeURIComponent(tag)}`);
    } else {
      router.push("/products");
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange("all");
    setSortBy("featured");
    setSelectedTag("");
    router.push("/products");
    fetchProducts();
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav
          className="flex mb-8 text-sm text-gray-600"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-pink-600 flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Home
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-pink-600 font-medium">Products</li>
          </ol>
          <div className="ml-auto flex items-center space-x-2">
            <Link
              href="/cart"
              className="text-gray-600 hover:text-pink-600 flex items-center"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Cart
            </Link>
          </div>
        </nav>

        <Card className="p-6 mb-8">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);
                    setIsSearching(true);
                  }}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setSearchTerm(""); // reset search when category is changed
                }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.toLowerCase()}
                      value={category === "All" ? "all" : category}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under500">Under ₹500</SelectItem>
                  <SelectItem value="500to1000">₹500 - ₹1000</SelectItem>
                  <SelectItem value="1000to2000">₹1000 - ₹2000</SelectItem>
                  <SelectItem value="over2000">Over ₹2000</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price_asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price_desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="h-10"
                >
                  Reset
                </Button>
              </div>
            </div>

            {allTags.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedTag === "" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagSelect("")}
                  >
                    All Tags
                  </Badge>
                  {displayedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                {allTags.length > 8 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="text-xs text-gray-500 hover:text-pink-500"
                  >
                    {showAllTags
                      ? "Show Less"
                      : `Show ${allTags.length - 8} More Tags`}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product: any) => (
              <ProductCard
                key={product._id}
                product={product}
                onClick={() => router.push(`/products/${product._id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <Search className="h-12 w-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
