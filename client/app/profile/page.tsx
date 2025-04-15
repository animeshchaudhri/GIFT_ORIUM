'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { Alert } from '@/components/ui/alert';

interface User {
  _id: string;
  name: string;
  email: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

interface Order {
  _id: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  items: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, token, isAuthenticated, isLoading, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  useEffect(() => {
    // Wait for auth context to finish loading before checking authentication
    if (isLoading) {
      return; // Don't do anything while auth is still loading
    }
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    fetchUserProfile();
    fetchOrders();
  }, [isAuthenticated, isLoading]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setUser(data);
      setFormData({
        name: data.name,
        email: data.email,
        street: data.address?.street || '',
        city: data.address?.city || '',
        state: data.address?.state || '',
        zipCode: data.address?.zipCode || '',
        country: data.address?.country || ''
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country
          }
        })
      });

      if (!response.ok) throw new Error('Failed to update profile');
      const updatedUser = await response.json();
      setUser(updatedUser);
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <p>{error}</p>
        </Alert>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Please log in to view your profile</h2>
          <Button onClick={() => router.push('/login')}>Go to Login</Button>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <div className="ml-auto">
          <Button
            variant="destructive"
            onClick={logout}
            className="flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Address</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Street</label>
                    <Input
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <Input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP Code</label>
                      <Input
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Country</label>
                      <Input
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">Save Changes</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p>{user.name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p>{user.email}</p>
                </div>

                {user.address && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p>
                      {user.address.street}<br />
                      {user.address.city}, {user.address.state} {user.address.zipCode}<br />
                      {user.address.country}
                    </p>
                  </div>
                )}

                <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
              </div>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order._id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">Order #{order._id}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{order.totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 capitalize">{order.status}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.product?.name || 'Product Unavailable'} x {item.quantity}</span>
                      <span>₹{((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => router.push(`/orders/${order._id}`)}
                >
                  View Details
                </Button>
              </Card>
            ))}

            {orders.length === 0 && (
              <p className="text-center py-4">No orders found</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}