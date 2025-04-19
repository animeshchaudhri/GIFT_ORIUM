'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Package, ArrowLeft, Calendar, CreditCard, MapPin, Box, AlertCircle, CircleDollarSign, Star } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    image: string;
  };
  quantity: number;
}

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
}

interface ReviewFormData {
  content: string;
  rating: number;
  productIds: string[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewFormData, setReviewFormData] = useState<ReviewFormData>({
    content: '',
    rating: 5,
    productIds: []
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const handleSubmitReview = async () => {
    if (!order) return;

    setIsSubmittingReview(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          content: reviewFormData.content,
          rating: reviewFormData.rating,
          orderId: order?._id,
          name: order?.user?.name,
          productIds: selectedProducts.length > 0 ? selectedProducts : undefined,
          productId: selectedProducts.length === 1 ? selectedProducts[0] : undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      toast.success('Thank you for your review!');
      setIsReviewDialogOpen(false);
      setReviewFormData({ content: '', rating: 5, productIds: [] });
      setSelectedProducts([]);
    } catch (err) {
      console.error('Review submission error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-4">This order doesn't exist or you don't have permission to view it.</p>
            <Link href="/orders">
              <Button>View All Orders</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
        </div>
        <div className="flex items-center gap-3">
          {order?.status === 'delivered' && (
            <Button
              onClick={() => setIsReviewDialogOpen(true)}
              variant="outline"
              className="gap-2"
            >
              <Star className="h-4 w-4" />
              Leave Review
            </Button>
          )}
          <Badge variant="outline" className={`text-sm px-3 py-1 ${getStatusColor(order?.status || '')}`}>
            {order?.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <Calendar className="h-5 w-5" />
            <h2 className="font-semibold">Order Information</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-medium">{order._id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date Placed</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <MapPin className="h-5 w-5" />
            <h2 className="font-semibold">Shipping Address</h2>
          </div>
          <div className="space-y-1">
            <p className="font-medium">{order.user.name}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6 text-muted-foreground">
          <Box className="h-5 w-5" />
          <h2 className="font-semibold">Order Items</h2>
        </div>
        
        <div className="divide-y">
          {order.items.map((item, index) => (
            <div key={index} className="py-4 first:pt-0 last:pb-0">
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                  ₹{((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                  </p>
                  {item.product.discountPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₹{order.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>Extra charges may or may not apply</span>
          </div>
          <div className="flex justify-between font-medium text-lg pt-2">
            <span>Total</span>
            <div className="flex items-center gap-1">
              <CircleDollarSign className="h-5 w-5 text-green-600" />
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Your Experience</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Select Products to Review</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {order?.items.map((item) => (
                  <div key={item.product._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={item.product._id}
                      checked={selectedProducts.includes(item.product._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, item.product._id]);
                        } else {
                          setSelectedProducts(selectedProducts.filter(id => id !== item.product._id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={item.product._id}>{item.product.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewFormData(prev => ({ ...prev, rating: star }))}
                    className={`p-1 hover:text-yellow-400 transition-colors ${
                      star <= reviewFormData.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Your Review</Label>
              <Textarea
                value={reviewFormData.content}
                onChange={(e) => setReviewFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your thoughts about the selected products..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsReviewDialogOpen(false);
                setSelectedProducts([]);
                setReviewFormData({ content: '', rating: 5, productIds: [] });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={!reviewFormData.content.trim() || selectedProducts.length === 0 || isSubmittingReview}
            >
              {isSubmittingReview ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}