'use client';

import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import ProductCard from './product-card'
import { Badge } from './ui/badge'

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

function Premium() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPremiumProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const responseData = await response.json();
        const productsArray = responseData.data || [];
        setProducts(productsArray);
      } catch (err) {
        setError('Failed to load premium products');
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumProducts();
  }, []);

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
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">
          Experience <span className="text-pink-500">Premium</span> Gifts And Products
        </h2>
        <div className="flex space-x-2">
          <Badge className="bg-pink-500 text-white">New</Badge>
          <Badge className="bg-blue-500 text-white">Hot</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button asChild className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6">
          <Link href="/products?category=premium_gifts">View All Products</Link>
        </Button>
      </div>
    </section>
  );
}

export default Premium;