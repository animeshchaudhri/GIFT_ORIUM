'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, ChevronRight, Search, SlidersHorizontal, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

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
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');

  const categories = [
    'All',
    'Tech Gifts',
    'Eco Gifts',
    'Beauty Gifts',
    'Premium Gifts',
    'Other'
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      let url = 'http://localhost:5000/api/products?';
      if (selectedCategory.toLowerCase() !== 'all') {
        url += `category=${encodeURIComponent(selectedCategory)}&`;
      }
      
      // Add sorting parameters
      switch (sortBy) {
        case 'price_asc':
          url += 'sort=price';
          break;
        case 'price_desc':
          url += 'sort=-price';
          break;
        case 'rating':
          url += 'sort=-rating';
          break;
        case 'featured':
          url += 'featured=true';
          break;
        default:
          url += 'sort=-createdAt';
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const responseData = await response.json();
      const productsArray = responseData.data || [];
      setProducts(productsArray);
    } catch (err) {
      setError('Failed to load products');
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  };

  // Get unique tags from all products
  const allTags = Array.from(new Set(products.flatMap(product => product.tags || [])));

  // Filter products based on search term, price range, and tags
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = !selectedTag || (product.tags && product.tags.includes(selectedTag));

    let matchesPriceRange = true;
    if (priceRange !== 'all') {
      const price = product.discountPrice || product.price;
      switch (priceRange) {
        case 'under50':
          matchesPriceRange = price < 50;
          break;
        case '50to100':
          matchesPriceRange = price >= 50 && price <= 100;
          break;
        case '100to200':
          matchesPriceRange = price > 100 && price <= 200;
          break;
        case 'over200':
          matchesPriceRange = price > 200;
          break;
      }
    }

    return matchesSearch && matchesPriceRange && matchesTag;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

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
        <nav className="flex mb-8 text-sm text-gray-600" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-pink-600 flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Home
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-pink-600 font-medium">
              Products
            </li>
          </ol>
          <div className="ml-auto flex items-center space-x-2">
            <Link href="/cart" className="text-gray-600 hover:text-pink-600 flex items-center">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Cart
            </Link>
          </div>
        </nav>

        <Card className="p-6 mb-8">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory.toLowerCase()} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.toLowerCase()} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Range Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under50">Under ₹500</SelectItem>
                  <SelectItem value="50to100">$50 - ₹1000</SelectItem>
                  <SelectItem value="100to200">$100 - ₹2000</SelectItem>
                  <SelectItem value="over200">Over ₹2000</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedTag === '' ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag('')}
                >
                  All Tags
                </Badge>
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}