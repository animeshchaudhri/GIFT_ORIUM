'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    imageUrl: string;
    stock: number; // Added stock property
  };
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Unauthorized access. Please log in again.');
          router.push('/login');
          return;
        }
        if (response.status === 404) {
          setError('Cart not found. Please add items to your cart.');
          return;
        }
      }
        
      const data = await response.json();
      setCartItems(data.items || []); // Access the items array from the cart response
    } catch (err) {
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const cartItem = cartItems.find(item => item._id === itemId);
      if (!cartItem) return;

      // Check if requested quantity exceeds available stock
      if (newQuantity > cartItem.product.stock) {
        setError(`Only ${cartItem.product.stock} units available for ${cartItem.product.name}`);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/update/${cartItem.product._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update cart');
        return;
      }

      setError(''); // Clear any previous errors
      fetchCart(); // Refresh cart after update
    } catch (err) {
      setError('Failed to update cart');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const cartItem = cartItems.find(item => item._id === itemId);
      if (!cartItem) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/remove/${cartItem.product._id}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (!response.ok) throw new Error('Failed to remove item');
      fetchCart(); // Refresh cart after removal
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  const proceedToCheckout = () => {
    router.push('/checkout');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p>Your cart is empty</p>
          <Button 
            onClick={() => router.push('/products')}
            className="mt-4"
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item._id} className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.imageUrl || '/placeholder.svg'}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-gray-600">
                    ₹{item.product.discountPrice || item.product.price}
                    </p>
                    <p className="text-sm text-gray-500">
                      Available: {item.product.stock} units
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <Input
                        type="number"
                        min={1}
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                        className="w-20"
                      />
                      <Button
                        variant="destructive"
                        onClick={() => removeItem(item._id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button
                className="w-full mt-6"
                onClick={proceedToCheckout}
              >
                Proceed to Checkout
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}