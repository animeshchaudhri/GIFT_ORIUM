'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { BadgeCheck, AlertCircle, TrendingUp, Users, ShoppingCart, DollarSign, ArrowUpRight, Clock } from 'lucide-react';

interface DashboardStats {
  totalSales: number;
  recentOrders: Array<{
    _id: string;
    user: { name: string; email: string };
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    product: { name: string };
    totalSold: number;
    revenue: number;
  }>;
  userStats: {
    total: number;
    newUsersLastMonth: number;
  };
  orderStats: {
    [key: string]: number;
  };
}

// Some sample data for charts
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 }
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Skeleton className="h-10 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stats) return null;

  // Prepare order status data for pie chart
  const orderStatusData = Object.entries(stats.orderStats).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count
  }));

  // Format recent orders
  const recentOrders = stats.recentOrders.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <span className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">₹{stats.totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stats.userStats.total}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 font-medium">+{stats.userStats.newUsersLastMonth}</span> new in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processing Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stats.orderStats.processing || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stats.orderStats.pending || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={stats.orderStats.pending > 5 ? "text-amber-500" : "text-green-500"}>
                {stats.orderStats.pending > 5 ? "High volume" : "Normal volume"}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-0">
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Monthly revenue for the current year</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-0">
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Distribution of current orders by status</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-0">
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 5 orders placed</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-medium">{order.user?.name || 'Unknown User'}</p>
                      <p className="text-sm text-muted-foreground">{order.user?.email || 'No email provided'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{order.totalAmount.toFixed(2)}</p>
                      <div className="flex items-center text-xs">
                        <span className={`px-2 py-1 rounded-full capitalize ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                          order.status === 'processing' ? 'bg-blue-100 text-blue-700' : 
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status}
                        </span>
                        <span className="ml-2 text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-0">
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products by revenue</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.topProducts.slice(0, 5).map((product, idx) => ({
                    name: product.product.name.length > 15 ? 
                      product.product.name.substring(0, 15) + '...' : 
                      product.product.name,
                    revenue: product.revenue,
                    units: product.totalSold
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}