'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Loader2, LayoutDashboard, Package, ShoppingBag, Users, AlertCircle, LogOut, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { ToastContainer, toast } from 'react-toastify';
interface User {
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const user: User = await response.json();
        if (user.role !== 'admin') {
          router.push('/');
          return;
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-lg font-medium text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>
            {error}
            <div className="mt-4">
              <Button onClick={() => router.push('/login')}>Back to Login</Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const navigationLinks = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5 mr-3" /> },
    { href: "/admin/products", label: "Products", icon: <Package className="h-5 w-5 mr-3" /> },
    { href: "/admin/blog", label: "Blog", icon: <FileText className="h-5 w-5 mr-3" /> },
    { href: "/admin/orders", label: "Orders", icon: <ShoppingBag className="h-5 w-5 mr-3" /> },
    { href: "/admin/users", label: "Users", icon: <Users className="h-5 w-5 mr-3" /> },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname?.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r shadow-sm transition-all duration-300 ease-in-out hidden md:block`}
      >
        <div className="p-4 flex items-center justify-between">
          <h2 className={`text-xl font-bold ${!sidebarOpen && 'hidden'}`}>Admin Panel</h2>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="rounded-full p-1 hover:bg-gray-100"
          >
            {sidebarOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="px-3 py-4">
          <ul className="space-y-1">
            {navigationLinks.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
                    ${isActive(item.href) 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {item.icon}
                  <span className={!sidebarOpen ? 'hidden' : ''}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex items-center justify-end px-4 py-2 border-t border-gray-200">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="flex justify-around items-center">
          {navigationLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`p-4 flex flex-col items-center text-xs
                ${isActive(item.href) 
                  ? 'text-primary' 
                  : 'text-gray-600'
                }`}
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
      <ToastContainer />
        {children}
      </main>
    </div>
  );
}