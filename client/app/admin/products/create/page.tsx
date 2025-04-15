'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-toastify';

const categories = [
  'All',
  'Flowers',
  'Keychains',
  'Religious gifts',
  'Soft toys',
  'Home Decor',
  "Toys & Games",
  'Kitchen & Dining',
  'Premium Gifts',
  'Other'
];
export default function CreateProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
    featured: false,
    tags: '',
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [imageError, setImageError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleFeaturedChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setImageError('');

    if (files && files.length > 0) {
      if (files.length > 5) {
        setImageError('You can only upload up to 5 images');
        e.target.value = '';
        return;
      }

      // Validate each file
      for (let i = 0; i < files.length; i++) {
        const error = validateImageFile(files[i]);
        if (error) {
          setImageError(error);
          e.target.value = '';
          return;
        }
      }

      setImages(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if images are provided
    if (!images || images.length === 0) {
      setImageError('Please upload at least one image');
      return;
    }
    
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags' && typeof value === 'string') {
          // Convert tags string to array
          const tagsArray = value.split(',').map(tag => tag.trim()).filter(Boolean);
          tagsArray.forEach(tag => formDataToSend.append('tags[]', tag));
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      // Append images
      Array.from(images).forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create product');
        //throw new Error(errorData.message || 'Failed to create product');
      }
      if(response.ok){
        toast.success('Product created successfully');
        router.push('/admin/products');
        router.refresh();
    }
     
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Create New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 relative z-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountPrice" className="text-sm font-medium">Discount Price</Label>
                <Input
                  id="discountPrice"
                  name="discountPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-sm font-medium">Stock *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="tag1, tag2, tag3"
                  className="w-full"
                />
              </div>

              <div className="space-y-2 col-span-full">
                <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="min-h-[100px] w-full"
                />
              </div>

              <div className="space-y-4 col-span-full">
                <Label htmlFor="images" className="text-sm font-medium">Product Images * (up to 5)</Label>
                <div className="relative">
                  <Input
                    id="images"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImageChange}
                    className="cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 w-full"
                    required
                  />
                  {imageError && (
                    <p className="text-sm text-red-500 mt-1">{imageError}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted formats: JPG, PNG, WebP (max 5MB each). At least one image is required.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 col-span-full">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={handleFeaturedChange}
                />
                <Label htmlFor="featured" className="text-sm font-medium">Featured Product</Label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}