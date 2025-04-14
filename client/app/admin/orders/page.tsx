'use client';

import { useEffect, useState } from 'react';
import { Loader2, Package, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
  trackingNumber?: string;
  sellerNotes?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [isEditingTracking, setIsEditingTracking] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [currentTrackingNumber, setCurrentTrackingNumber] = useState('');
  const [currentNotes, setCurrentNotes] = useState('');
  const [editingOrderId, setEditingOrderId] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      await fetchOrders();
      setIsDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    }
  };

  const updateTrackingNumber = async (orderId: string, trackingNumber: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/tracking`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ trackingNumber }),
      });

      if (!response.ok) throw new Error('Failed to update tracking number');
      
      await fetchOrders();
      setIsEditingTracking(false);
      setEditingOrderId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tracking number');
    }
  };

  const updateSellerNotes = async (orderId: string, sellerNotes: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/notes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ sellerNotes }),
      });

      if (!response.ok) throw new Error('Failed to update seller notes');
      
      await fetchOrders();
      setIsEditingNotes(false);
      setEditingOrderId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update seller notes');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Orders</h1>
        <Badge variant="outline" className="px-4 py-1">
          Total Orders: {orders.length}
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <p>{error}</p>
        </Alert>
      )}

      <div className="grid gap-4">
        {orders.map((order) => (
          <Collapsible
            key={order._id}
            open={expandedOrders.includes(order._id)}
            onOpenChange={() => toggleOrderExpand(order._id)}
          >
            <Card className="overflow-hidden">
              <CollapsibleTrigger className="w-full">
                <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Package className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <h3 className="font-medium truncate">Order #{order._id.slice(-8)}</h3>
                      <Badge 
                        variant="outline" 
                        className={getStatusBadgeColor(order.status)}
                      >
                        {order.status}
                      </Badge>
                      {expandedOrders.includes(order._id) ? (
                        <ChevronDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{order.totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{order.items.length} items</p>
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="border-t">
                  <div className="p-4 grid gap-4 md:grid-cols-2">
                    {/* Customer Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Customer Details</h4>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-gray-500">Name:</span> {order.user.name}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Email:</span> {order.user.email}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Payment Method:</span> {order.paymentMethod}
                        </p>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <div className="space-y-1 text-sm">
                        <p>{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>

                    {/* Tracking Number */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Tracking Number</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingOrderId(order._id);
                            setCurrentTrackingNumber(order.trackingNumber || '');
                            setIsEditingTracking(true);
                          }}
                        >
                          {order.trackingNumber ? 'Edit' : 'Add'}
                        </Button>
                      </div>
                      {isEditingTracking && editingOrderId === order._id ? (
                        <div className="flex gap-2">
                          <Input
                            value={currentTrackingNumber}
                            onChange={(e) => setCurrentTrackingNumber(e.target.value)}
                            placeholder="Enter tracking number"
                            className="text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={() => updateTrackingNumber(order._id, currentTrackingNumber)}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm">
                          {order.trackingNumber || 'No tracking number yet'}
                        </p>
                      )}
                    </div>

                    {/* Seller Notes */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Seller Notes</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingOrderId(order._id);
                            setCurrentNotes(order.sellerNotes || '');
                            setIsEditingNotes(true);
                          }}
                        >
                          {order.sellerNotes ? 'Edit' : 'Add'}
                        </Button>
                      </div>
                      {isEditingNotes && editingOrderId === order._id ? (
                        <div className="flex flex-col gap-2">
                          <Textarea
                            value={currentNotes}
                            onChange={(e) => setCurrentNotes(e.target.value)}
                            placeholder="Add notes about this order"
                            className="text-sm min-h-[100px]"
                          />
                          <Button
                            size="sm"
                            onClick={() => updateSellerNotes(order._id, currentNotes)}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">
                          {order.sellerNotes || 'No notes added'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Quantity</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                      </thead>                      <tbody className="bg-white divide-y divide-gray-200">
                        {order.items?.map((item, index) => {
                          // Check if item.product is null or undefined
                          if (!item.product) {
                            return (
                              <tr key={index}>
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <div className="min-w-0">
                                      <p className="font-medium truncate">Product unavailable</p>
                                      <p className="text-xs text-gray-500">Product data missing</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center font-medium">{item.quantity}</td>
                                <td className="px-4 py-3 text-right">₹{item.price.toFixed(2)}</td>
                                <td className="px-4 py-3 text-right font-medium">
                                ₹{(item.price * item.quantity).toFixed(2)}
                                </td>
                              </tr>
                            );
                          }
                          
                          return (
                            <tr key={index}>
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  {item.product.imageUrl && (
                                    <div className="h-10 w-10 flex-shrink-0 mr-3">
                                      <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        className="h-10 w-10 rounded-md object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="font-medium truncate">{item.product.name}</p>
                                    <p className="text-xs text-gray-500">ID: {item.product._id.slice(-8)}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center font-medium">{item.quantity}</td>
                              <td className="px-4 py-3 text-right">₹{item.price.toFixed(2)}</td>
                              <td className="px-4 py-3 text-right font-medium">
                              ₹{(item.price * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-gray-50">
                          <td colSpan={3} className="px-4 py-3 text-right font-medium">Order Total:</td>
                          <td className="px-4 py-3 text-right font-bold">₹{order.totalAmount.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Order Actions */}
                  <div className="p-4 border-t bg-gray-50 flex flex-wrap gap-4 items-center justify-end">
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <select
                        className="border rounded px-3 py-1.5 text-sm bg-white"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}

        {orders.length === 0 && (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
            <p className="text-gray-500">When customers place orders, they will appear here.</p>
          </Card>
        )}
      </div>
    </div>
  );
}