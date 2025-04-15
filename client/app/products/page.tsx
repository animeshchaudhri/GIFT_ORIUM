'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, ChevronRight, Search, ShoppingCart } from 'lucide-react';
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
  const [initialLoad, setInitialLoad] = useState(true);
  
  const categories = [
    'All',
    'Flowers',
    'Keychains',
    'Religious gifts',
    'Soft toys',
    'Home Decor',
    "Toys & Games",
    'Kitchen & Dining',
    'Premium Gifts',
    'Other'
  ];
  
  // Parse URL search parameters on initial load only
  useEffect(() => {
    if (!initialLoad) return;
    
    const searchParams = new URLSearchParams(window.location.search);
    
    const search = searchParams.get('search');
    if (search) setSearchTerm(search);
    
    const category = searchParams.get('category');
    if (category) {
      // Find the matching category from our categories array (case-insensitive)
      const matchingCategory = categories.find(
        c => c.toLowerCase() === decodeURIComponent(category).toLowerCase()
      );
      if (matchingCategory) {
        setSelectedCategory(matchingCategory);
      }
    }
    
    const tag = searchParams.get('tag');
    if (tag) setSelectedTag(decodeURIComponent(tag));
    
    const sort = searchParams.get('sort');
    if (sort) setSortBy(sort);
    
    const price = searchParams.get('price');
    if (price) setPriceRange(price);
    
    setInitialLoad(false);
  }, [categories, initialLoad]);

  // Update URL when filters change
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedTag) params.set('tag', selectedTag);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    if (priceRange !== 'all') params.set('price', priceRange);
    
    const newUrl = `/products${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [searchTerm, selectedCategory, selectedTag, sortBy, priceRange]);

  // Fetch products when filters change
  useEffect(() => {
    // Skip on initial load since we'll fetch after reading URL params
    if (initialLoad) return;
    
    fetchProducts();
    updateUrlParams();
  }, [selectedCategory, sortBy, updateUrlParams, searchTerm, priceRange, selectedTag, initialLoad]);

  const fetchProducts = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/products?`;
      
      // Only add category parameter if it's not 'all' and is a valid category
      if (selectedCategory !== 'all' && categories.find(c => c === selectedCategory)) {
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
        case 'newest':
          url += 'sort=-createdAt';
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
  const allTags = Array.from(new Set(products.flatMap(product => product.tags || []))).filter(Boolean);
  
  // Limit displayed tags initially
  const [showAllTags, setShowAllTags] = useState(false);
  const displayedTags = showAllTags ? allTags : allTags.slice(0, 8);

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
        case 'under500':
          matchesPriceRange = price < 500;
          break;
        case '500to1000':
          matchesPriceRange = price >= 500 && price <= 1000;
          break;
        case '1000to2000':
          matchesPriceRange = price > 1000 && price <= 2000;
          break;
        case 'over2000':
          matchesPriceRange = price > 2000;
          break;
      }
    }

    return matchesSearch && matchesPriceRange && matchesTag;
  });

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.toLowerCase()} 
                      value={category === 'All' ? 'all' : category}
                    >
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
                  <SelectItem value="under500">Under ₹500</SelectItem>
                  <SelectItem value="500to1000">₹500 - ₹1000</SelectItem>
                  <SelectItem value="1000to2000">₹1000 - ₹2000</SelectItem>
                  <SelectItem value="over2000">Over ₹2000</SelectItem>
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
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedTag === '' ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedTag('')}
                  >
                    All Tags
                  </Badge>
                  {displayedTags.map((tag) => (
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
                {allTags.length > 8 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="text-xs text-gray-500 hover:text-pink-500"
                  >
                    {showAllTags ? 'Show Less' : `Show ${allTags.length - 8} More Tags`}
                  </Button>
                )}
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