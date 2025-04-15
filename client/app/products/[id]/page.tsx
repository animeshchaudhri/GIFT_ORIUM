'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Heart, Star, Check, Minus, Plus, X, ChevronRight, Home, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Review {
  _id: string;
  name: string;
  content: string;
  rating: number;
  createdAt: string;
  role: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  imageUrl: string;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  featured: boolean;
  tags: string[];
  reviews?: Review[];
}

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  
  // Unwrap the params using React.use()
  const { id } = React.use(params);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);        if (!response.ok) {
          toast.error('Failed to load product');
          //throw new Error('Failed to load product');
        }
        
        const data = await response.json();
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
          setSelectedImageIndex(0);
        } else if (data.imageUrl) {
          setSelectedImage(data.imageUrl);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials?productId=${id}`);
        if (!response.ok) throw new Error('Failed to load reviews');
        const data = await response.json();
        setReviews(data.data || []);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  const addToCart = async () => {
    try {
      if (!product) return;
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity
        })
      });

      if (!response.ok) {
        toast.error('Please log in to add to cart');
        router.push('/login');
        return;
      }

      toast.success('Added to cart!');
      router.push('/cart');
    } catch (err) {
      console.error(err);
      toast.error('Error adding to cart');
    }
  };

  const toggleWishlist = () => {
    if (!product) return;
    
    const newWishlist = wishlist.includes(product._id)
      ? wishlist.filter(id => id !== product._id)
      : [...wishlist, product._id];
    
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    
    toast.success(
      wishlist.includes(product._id)
        ? 'Removed from wishlist'
        : 'Added to wishlist'
    );
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const nextImage = () => {
    if (!product || !product.images || product.images.length <= 1) return;
    
    const newIndex = (selectedImageIndex + 1) % product.images.length;
    setSelectedImageIndex(newIndex);
    setSelectedImage(product.images[newIndex]);
  };

  const prevImage = () => {
    if (!product || !product.images || product.images.length <= 1) return;
    
    const newIndex = (selectedImageIndex - 1 + product.images.length) % product.images.length;
    setSelectedImageIndex(newIndex);
    setSelectedImage(product.images[newIndex]);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            className="h-5 w-5 text-yellow-400 fill-current"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-5 w-5 text-gray-300 fill-current" />
            <div className="absolute inset-0 overflow-hidden w-[50%]">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star
            key={i}
            className="h-5 w-5 text-gray-300 fill-current"
          />
        );
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Product not found'}
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
            <li>
              <Link href="/products" className="hover:text-pink-600">
                Products
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-pink-600 font-medium">
              {product?.name || 'Product Details'}
            </li>
          </ol>
        </nav>

        <Card className="overflow-hidden bg-white shadow-lg rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative h-[500px] w-full rounded-xl overflow-hidden bg-gray-50 border">
                <Image
                  src={selectedImage || product?.imageUrl || '/placeholder.svg'}
                  alt={product?.name || 'Product Image'}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                
                {/* Left-right navigation arrows */}
                {product?.images && product.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all hover:scale-110"
                      aria-label="Previous image"
                    >
                      <ChevronRight className="h-6 w-6 transform rotate-180 text-gray-800" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all hover:scale-110"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6 text-gray-800" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {product.images.map((_, index) => (
                        <div 
                          key={index}
                          className={`w-2 h-2 rounded-full ${selectedImageIndex === index ? 'bg-pink-500' : 'bg-gray-300'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {product?.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      className={`relative h-24 w-full flex-shrink-0 cursor-pointer rounded-lg overflow-hidden transition-all ${
                        selectedImage === img ? 'ring-2 ring-pink-500' : 'ring-1 ring-gray-200'
                      }`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - view ${index + 1}`}
                        fill
                        className="object-cover hover:opacity-80 transition-opacity"
                        sizes="(max-width: 768px) 25vw, 15vw"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Product Description and Reviews */}
              <Tabs defaultValue="description" className="w-full mt-8">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="reviews">
                    Reviews ({product?.numReviews || 0})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4">
                  <div className="prose max-w-none text-gray-600">
                    <p className="leading-relaxed">{product?.description}</p>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-4">
                  {loadingReviews ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : reviews.length > 0 ? (
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review._id} className="border-b pb-4 last:border-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium">{review.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex">
                                    {renderStars(review.rating)}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              {review.role === 'Admin' && (
                                <Badge>Admin</Badge>
                              )}
                            </div>
                            <p className="text-gray-600 mt-2">{review.content}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No reviews yet</p>
                      <p className="text-sm mt-1">Be the first to review this product</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Product Details */}
            <div className="flex flex-col h-full">
              <div className="space-y-6">
                {/* Product Title and Wishlist */}
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-900">{product?.name}</h1>
                  <Button 
                    variant="outline"
                    size="icon" 
                    onClick={toggleWishlist}
                    className={`rounded-full hover:bg-pink-50 ${wishlist.includes(product?._id || '') ? 'text-pink-500' : 'text-gray-400'}`}
                  >
                    <Heart className={`h-5 w-5 ${wishlist.includes(product?._id || '') ? 'fill-pink-500' : ''}`} />
                  </Button>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(product?.rating || 0)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product?.rating ? `${product.rating.toFixed(1)} (${product.numReviews} ${product.numReviews === 1 ? 'review' : 'reviews'})` : 'No reviews yet'}
                  </span>
                </div>

                {/* Price and Discount */}
                <div className="flex items-baseline gap-3">
                  {product?.discountPrice ? (
                    <>
                      <span className="text-4xl font-bold text-pink-600">₹{product.discountPrice.toFixed(2)}</span>
                      <span className="text-xl text-gray-400 line-through">₹{product.price.toFixed(2)}</span>
                      <Badge variant="secondary" className="ml-2">
                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                      </Badge>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-gray-900">₹{product?.price.toFixed(2)}</span>
                  )}
                </div>

                {/* Categories and Tags */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-sm">
                    {product?.category}
                  </Badge>
                  {product?.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 text-sm">
                  {product?.stock ? (
                    <>
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-green-600 font-medium">
                        In stock
                      </span>
                      <span className="text-gray-600">
                        ({product.stock} units available)
                      </span>
                    </>
                  ) : (
                    <>
                      <X className="h-5 w-5 text-red-500" />
                      <span className="text-red-600 font-medium">Out of stock</span>
                    </>
                  )}
                </div>
              </div>

              {/* Add to Cart Section - Pushed to bottom */}
              <div className="mt-auto border-t pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center border rounded-lg bg-gray-50 w-fit">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="text-gray-600 hover:text-pink-500 hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-16 text-center font-medium">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={increaseQuantity}
                      disabled={!product || quantity >= product.stock}
                      className="text-gray-600 hover:text-pink-500 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium"
                    size="lg"
                    onClick={addToCart}
                    disabled={!product || product.stock === 0}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}