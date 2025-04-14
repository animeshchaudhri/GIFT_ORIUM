'use client';

import { useState, useRef, useEffect, use } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage: string;
  tags: string[];
  status: 'draft' | 'published';
  featured: boolean;
  author: {
    name: string;
    _id: string;
  };
  createdAt: string;
}

export default function EditBlogPost(props: { params: Promise<{ id: string }> }) {
 const { id } = use(props.params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    tags: '',
    status: 'draft',
    featured: false,
    contentImages: [] as string[],
    oldFeaturedImage: '',
    oldContentImages: [] as string[]
  });
  const [featuredImagePreview, setFeaturedImagePreview] = useState('');
  const [contentImagesPreview, setContentImagesPreview] = useState<string[]>([]);
  const featuredImageRef = useRef<HTMLInputElement>(null);
  const contentImagesRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    fetchBlogPost();
  }, [id]);
  
  const fetchBlogPost = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch blog post');
      const { data } = await response.json();
      const post: BlogPost = Array.isArray(data) ? data[0] : data;
      
      setFormData({
        //@ts-ignore
        oldFeaturedImage: post.featuredImage || post.imageUrl || '',
        //@ts-ignore
        oldContentImages: post.images || [],
        title: post.title,
        summary: post.summary,
        content: post.content,
        tags: post.tags.join(', '),
        status: post.status,
        featured: post.featured,
        contentImages: []
      });
      //@ts-ignore
      if (post.featuredImage || post.imageUrl) {
         //@ts-ignore
        setFeaturedImagePreview(post.featuredImage || post.imageUrl);
      }
       //@ts-ignore
      // Set content images preview
      if (post.images && post.images.length > 0) {
         //@ts-ignore
        setContentImagesPreview(post.images);
      }
    } catch (err) {
      toast.error('Error fetching blog post'+err);
      router.push('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'featured' | 'content') => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'featured') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFeaturedImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      const newPreviews: string[] = [...contentImagesPreview];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          formData.contentImages.push(reader.result as string);
          setContentImagesPreview([...newPreviews]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags') {
            //@ts-ignore
          formDataToSend.append(key, value.split(',').map(tag => tag.trim()).join(','));
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      if (featuredImageRef.current?.files?.[0]) {
        formDataToSend.append('featuredImage', featuredImageRef.current.files[0]);
      } else if (formData.oldFeaturedImage && !featuredImagePreview) {
        formDataToSend.append('deleteFeaturedImage', 'true');
      }

      if (contentImagesRef.current?.files) {
        Array.from(contentImagesRef.current.files).forEach(file => {
          formDataToSend.append('contentImages', file);
        });
      }

      // Handle deleted content images
      const deletedImages = formData.oldContentImages.filter(
        img => !contentImagesPreview.includes(img)
      );
      if (deletedImages.length > 0) {
        formDataToSend.append('deleteContentImages', JSON.stringify(deletedImages));
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to update blog post');
      
      toast.success('Blog post updated!');
      router.push('/admin/blog');
    } catch (err) {
      toast.error('Error updating blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Blog Post</h1>
          <Button
            variant="outline"
            onClick={() => router.push('/admin/blog')}
          >
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter blog post title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                required
                placeholder="Enter blog post summary"
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="Enter blog post content"
                rows={6}
              />
            </div>

            <div className="grid gap-2">
              <Label>Featured Image</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => featuredImageRef.current?.click()}
                  className="w-full h-32 border-dashed flex flex-col items-center justify-center gap-2"
                >
                  <UploadCloud className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">Upload Featured Image</span>
                  <span className="text-xs text-gray-400">(Max size: 5MB)</span>
                </Button>
                <input
                  type="file"
                  ref={featuredImageRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'featured')}
                />
              </div>
              {featuredImagePreview && (
                <div className="relative w-full h-48 mt-2 group">
                  <Image
                    src={featuredImagePreview}
                    alt="Featured image preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFeaturedImagePreview('')}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Content Images</Label>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => contentImagesRef.current?.click()}
                  className="h-32 border-dashed flex flex-col items-center justify-center gap-2"
                >
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">Add Images</span>
                </Button>
                <input
                  type="file"
                  ref={contentImagesRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageChange(e, 'content')}
                />
                {contentImagesPreview.map((preview, index) => (
                  <div key={index} className="relative h-32 group">
                    <Image
                      src={preview}
                      alt={`Content image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newPreviews = [...contentImagesPreview];
                        newPreviews.splice(index, 1);
                        setContentImagesPreview(newPreviews);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="featured">Featured Post</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                required
                placeholder="Enter tags, separated by commas"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/blog')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Post'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}