'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Loader2, UploadCloud, X, AlertCircle, ImageIcon, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string;
  stock: number;
  featured: boolean;
  images: string[];
}

interface FormData {
  name: string;
  description: string;
  price: string;
  discountedPrice: string;
  category: string;
  stock: string;
  featured: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    discountedPrice: '',
    category: '',
    stock: '',
    featured: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Failed to fetch products');
        return;
      }

      const data = await response.json();
      if (!Array.isArray(data.data)) {
        toast.error('Invalid response format');
        return;
      }

      setProducts(data.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred while fetching products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price.toString(),
        discountedPrice: editingProduct.discountedPrice?.toString() || '',
        category: editingProduct.category,
        stock: editingProduct.stock.toString(),
        featured: editingProduct.featured,
      });
      setImagePreviewUrls(editingProduct.images);
    } else {
      resetForm();
    }
  }, [editingProduct]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      discountedPrice: '',
      category: '',
      stock: '',
      featured: false,
    });
    setImageFiles([]);
    setImagePreviewUrls([]);
    setUploadProgress(0);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImageFiles = Array.from(files);
    setImageFiles(prev => [...prev, ...newImageFiles]);

    const newImagePreviews = newImageFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newImagePreviews]);
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToCloudinary = async () => {
    if (imageFiles.length === 0) {
      return imagePreviewUrls;
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [];
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Authentication required');
      return imagePreviewUrls;
    }

    try {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
          // Validate file size
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast.error(`Image ${file.name} exceeds 5MB size limit`);
          continue;
        }

        const formData = new FormData();
        formData.append('images', file);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.message || `Failed to upload image ${file.name}`);
          continue;
        }

        const data = await response.json();
        if (!data.imageUrl) {
          toast.error(`Invalid response format for image ${file.name}`);
          continue;
        }

        uploadedUrls.push(data.imageUrl);
        setUploadProgress(Math.round(((i + 1) / imageFiles.length) * 100));
      }

      const existingImages = editingProduct ? imagePreviewUrls.filter(url => url.startsWith('http')) : [];
      return [...existingImages, ...uploadedUrls];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Image upload failed';
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveLoading(true);try {
      // Validate form data
      if (!formData.name.trim()) {
        toast.error('Product name is required');
        return;
      }
      if (!formData.description.trim()) {
        toast.error('Product description is required');
        return;
      }
      if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        toast.error('Please enter a valid price');
        return;
      }
      if (formData.discountedPrice && (isNaN(parseFloat(formData.discountedPrice)) || parseFloat(formData.discountedPrice) >= parseFloat(formData.price))) {
        toast.error('Discounted price must be less than regular price');
        return;
      }
      if (!formData.category) {
        toast.error('Please select a category');
        return;
      }
      if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
        toast.error('Please enter a valid stock quantity');
        return;
      }
      // Validate that at least one image is selected
      if (!editingProduct && imageFiles.length === 0) {
        toast.error('Please upload at least one image');
        return;
      }
      if (editingProduct && imageFiles.length === 0 && imagePreviewUrls.length === 0) {
        toast.error('Please upload at least one image');
        return;
      }

      const imageUrls = await uploadImagesToCloudinary();
      
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : undefined,
        category: formData.category,
        stock: parseInt(formData.stock),
        featured: formData.featured,
        images: imageUrls.length > 0 ? imageUrls : ['/placeholder.svg'],
      };      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const url = editingProduct
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/${editingProduct._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/products`;

      const response = await fetch(url, {
        method: editingProduct ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || `Failed to ${editingProduct ? 'update' : 'create'} product`);
        return;
      }

      const result = await response.json();
      if (!result.data) {
        toast.error('Invalid response format');
        return;
      }

      // Show success message
      toast.success(`Product ${editingProduct ? 'updated' : 'created'} successfully`);

      await fetchProducts();
      setIsDialogOpen(false);
      setEditingProduct(null);
      resetForm();    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteConfirmId(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        toast.error('Failed to delete product');
        return;
      }

      await fetchProducts();
      toast.success('Product deleted successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

 
  const DeleteConfirmationDialog = ({ id }: { id: string }) => (
    <Dialog open={deleteConfirmId === id} onOpenChange={() => setDeleteConfirmId(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this product? This action cannot be undone.</p>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => handleDelete(id)}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const router = useRouter();

  const handleAddProduct = () => {
    router.push('/admin/products/create');
  };

  const handleEditProduct = (id: string) => {
    router.push(`/admin/products/edit/${id}`);
  };
  
  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Button onClick={handleAddProduct} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      

      {products.length === 0 && !loading  ? (
        <Card className="py-8 sm:py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No products found</h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm mb-6">
              There are no products in your store yet. Add your first product to get started.
            </p>
            <Button onClick={handleAddProduct} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <Card key={product._id} className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={product.images[0] || '/placeholder.svg'}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                {product.featured && (
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    Featured
                  </Badge>
                )}
                {product.discountedPrice && product.discountedPrice < product.price && (
                  <Badge className="absolute top-2 left-2" variant="destructive">
                    Sale
                  </Badge>
                )}
              </div>
              <CardContent className="p-3 sm:p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-base sm:text-lg truncate">{product.name}</h3>                  <div className="flex flex-col items-end">
                    {product.discountedPrice ? (
                      <>
                        <span className="font-bold text-sm sm:text-base">₹{product.discountedPrice.toFixed(2)}</span>
                        <span className="text-xs sm:text-sm text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="font-bold text-sm sm:text-base">₹{product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </Badge>
                  <span className={`text-xs sm:text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(product);
                      setIsDialogOpen(true);
                      handleEditProduct(product._id)
                    }}
                    className="text-xs sm:text-sm"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteConfirmId(product._id)}
                    className="text-xs sm:text-sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
              {deleteConfirmId === product._id && <DeleteConfirmationDialog id={product._id} />}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}