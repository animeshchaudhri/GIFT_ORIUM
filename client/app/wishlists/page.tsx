'use client';

import { Heart, Loader2, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  imageUrl?: string;
}

export default function WishlistPage() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    // Load wishlist from localStorage
    const storedWishlist = localStorage.getItem('wishlist');
    const wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
    setWishlistIds(wishlist);

    // Fetch products data
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        const wishlistProducts = data.data.filter((product: Product) => wishlist.includes(product._id));
        setProducts(wishlistProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        toast.error('Failed to load wishlist items');
      }
    };

    if (wishlist.length > 0) {
      fetchProducts();
    }
  }, []);

  const removeFromWishlist = (itemId: string) => {
    const newWishlist = wishlistIds.filter(id => id !== itemId);
    setWishlistIds(newWishlist);
    setProducts(products.filter(product => product._id !== itemId));
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    toast.success('Removed from wishlist');
  };

  const addToCart = async (itemId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          productId: itemId,
          quantity: 1
        })
      });

      if (!response.ok) throw new Error('Failed to add to cart');
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Error adding to cart');
    } finally {
      setLoading(false);
    };
  };

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-4">Start adding items to your wishlist to keep track of products you love.</p>
          <Button
            className="bg-pink-500 hover:bg-pink-600 text-white"
            onClick={() => window.location.href = '/products'}
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={product.images?.[0] || product.imageUrl || `/placeholder.svg?height=300&width=300&text=${product.name.replace(/ /g, '+')}`}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-pink-500 font-bold mb-4">
                ₹{product.discountPrice || product.price}
                {product.discountPrice && (
                  <span className="text-sm text-gray-400 line-through ml-2">₹{product.price}</span>
                )}
              </p>
              <div className="flex space-x-2">
                <Button
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                  onClick={() => addToCart(product._id)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeFromWishlist(product._id)}
                  className="hover:text-red-500 hover:border-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}