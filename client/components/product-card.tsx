'use client';

import Image from "next/image";
import { ShoppingCart, Heart, Search, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Product {
  _id?: string;
  name: string;
  description?: string;
  price: string | number;
  discountPrice?: string | number;
  category?: string;
  imageUrl?: string;
  images?: string[];
  rating?: number;
  numReviews?: number;
}

interface ProductCardProps {
  product?: Product;
  name?: string;
  price?: string;
  discount?: string;
  index?: number;
  onClick?: () => void;
}

export default function ProductCard({ product, name, price, discount, index, onClick }: ProductCardProps) {
  const router = useRouter();
  const productData: Product = product || {
    name: name || '',
    price: price || '',
    discountPrice: discount,
    imageUrl: `/placeholder.svg?height=200&width=200&text=${(name || '').replace(/ /g, '+')}`
  };

  const handleProductClick = () => {
    if (productData._id) {
      router.push(`/products/${productData._id}`);
    }
  };
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (!productData._id) return;
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,

        },
        body: JSON.stringify({
          productId: productData._id,
          quantity: 1
        })
      });

      if (!response.ok) throw new Error('Failed to add to cart');
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Error adding to cart');
    }
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const storedWishlist = localStorage.getItem('wishlist');
    const wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
    
    if (productData._id) {
      const newWishlist = wishlist.includes(productData._id)
        ? wishlist.filter((id: string) => id !== productData._id)
        : [...wishlist, productData._id];
      
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      toast.success(wishlist.includes(productData._id) ? 'Removed from wishlist' : 'Added to wishlist');
    }
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
            size={14}
            className="text-yellow-400"
            fill="currentColor"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star size={14} className="text-gray-300" fill="currentColor" />
            <div className="absolute inset-0 overflow-hidden w-[50%]">
              <Star size={14} className="text-yellow-400" fill="currentColor" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star 
            key={i} 
            size={14}
            className="text-gray-300"
            fill="currentColor"
          />
        );
      }
    }
    return stars;
  };

  return (
    <div 
      className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="relative aspect-square">
        <Image
          src={productData.images?.[0] || productData.imageUrl || `/placeholder.svg?height=300&width=300&text=${productData.name.replace(/ /g, '+')}`}
          alt={productData.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {(productData.discountPrice || discount) && (
          <Badge className="absolute top-3 right-3 bg-pink-500text-white">
            Sale
          </Badge>
        )}
      </div>

      {/* Quick action buttons */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full bg-white hover:bg-ppink-500over:text-white"
          onClick={handleAddToWishlist}
        >
          <Heart className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full bg-white hover:bg-p-pinki50hver:text-white"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-lg mb-2 line-clamp-1">{productData.name}</h3>
        
        <div className="flex items-center mb-2">
          <div className="flex">
            {renderStars(productData.rating || 0)}
          </div>
          <span className="text-xs text-gray-500 ml-2">
            {productData.numReviews ? `(${productData.numReviews})` : '(No reviews yet)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-pink-600">
           ₹{typeof productData.discountPrice === 'number' ? 
              productData.discountPrice.toFixed(2) : 
              typeof productData.price === 'number' ? 
                productData.price.toFixed(2) : 
                productData.price}
          </span>
          {productData.discountPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{typeof productData.price === 'number' ? 
                productData.price.toFixed(2) : 
                productData.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

