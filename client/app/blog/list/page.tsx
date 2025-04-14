'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { List, Grid3X3, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage: string;
  tags: string[];
  author: {
    name: string;
    _id: string;
  };
  createdAt: string;
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`);
        if (!response.ok) throw new Error('Failed to fetch blog posts');
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPosts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you might want to fetch filtered posts from the API
    // For now we'll just filter the client-side data
  };
  
  const filteredPosts = searchTerm 
    ? posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : posts;
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Articles</h1>
        <div className="flex items-center gap-2">
          <Link href="/blog/list" className="flex items-center text-pink-500 font-medium">
            <List className="h-4 w-4 mr-1" />
            List View
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/blog/grid" className="flex items-center text-gray-600 hover:text-pink-500">
            Grid View
          </Link>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>
      
      {/* Blog Posts List */}
      <div className="space-y-8 max-w-4xl mx-auto">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card key={post._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="relative h-60 md:h-auto md:w-1/3">
                  <Image
                    src={post.featuredImage || `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(post.title)}`}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex gap-2 mb-3">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} className="bg-pink-100 text-pink-500">{tag}</Badge>
                    ))}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.summary}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <p>By {post.author.name}</p>
                      <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="text-pink-500 border-pink-500 hover:bg-pink-50">
                      <Link href={`/blog/${post.slug}`}>Read More</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No blog posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}