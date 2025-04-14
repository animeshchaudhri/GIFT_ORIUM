"use client"
import { useState, useEffect, use, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/auth-context';
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
  images?: string[];
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { token } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    discountedPrice: '',
    category: '',
    stock: '',
    featured: false,
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateImageFile = useCallback((file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, PNG, and WebP images are allowed';
    }
    if (file.size > maxSize) {
      return 'Image size should not exceed 5MB';
    }
    return null;
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price.toString(),
          discountedPrice: data.discountedPrice?.toString() || '',
          category: data.category,
          stock: data.stock.toString(),
          featured: data.featured,
          images: data.images,
        });
      } catch (err) {
        setError('Failed to load product' + err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);

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

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setError('');

    if (files && files.length > 0) {
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const error = validateImageFile(files[i]);
        if (error) {
          setError(error);
          e.target.value = '';
          return;
        }
        newImages.push(URL.createObjectURL(files[i]));
      }

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages],
      }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.images || formData.images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags' && typeof value === 'string') {
          const tagsArray = value.split(',').map(tag => tag.trim()).filter(Boolean);
          tagsArray.forEach(tag => formDataToSend.append('tags[]', tag));
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      toast.success('Product updated successfully');

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to update product');}
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
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Enter product name"
              className="mt-1 w-full"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Enter product description"
              className="mt-1 w-full h-24"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-sm font-medium">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleFormChange}
                placeholder="0.00"
                className="mt-1 w-full"
                required
              />
            </div>
            <div>
              <Label htmlFor="discountedPrice" className="text-sm font-medium">Discounted Price ($)</Label>
              <Input
                id="discountedPrice"
                name="discountedPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.discountedPrice}
                onChange={handleFormChange}
                placeholder="0.00"
                className="mt-1 w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">Leave empty if no discount</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-sm font-medium">Category</Label>
              <Select
                value={formData.category}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tech Gifts">Tech Gifts</SelectItem>
                  <SelectItem value="Eco Gifts">Eco Gifts</SelectItem>
                  <SelectItem value="Beauty Gifts">Beauty Gifts</SelectItem>
                  <SelectItem value="Premium Gifts">Premium Gifts</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="stock" className="text-sm font-medium">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleFormChange}
                placeholder="0"
                className="mt-1 w-full"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex-1 font-medium text-sm">Featured Product</div>
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={handleSwitchChange}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Product Images</Label>
            <div className="mt-2 space-y-2">
              {formData.images?.map((image, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <img src={image} alt={`Product Image ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                  <Button type="button" variant="destructive" onClick={() => handleRemoveImage(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={triggerFileInput} className="mt-2">
                Add Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="mt-4 w-full md:w-auto">
          Update Product
        </Button>
      </form>
    </div>
  );
}