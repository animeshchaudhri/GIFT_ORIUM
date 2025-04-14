'use client';

import { useState, useEffect, use } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage: string;
  images: string[]; // Add the images array field
  tags: string[];
  author: {
    name: string;
    _id: string;
  };
  createdAt: string;
}

// Function to parse blog content and extract/render images
const parseAndRenderContent = (content: string) => {
  if (!content) return null;
  
  // Simple regex to find image references in the content
  // This assumes images might be in markdown format ![alt](url) or HTML format <img src="url" />
  const imageRegex = /!\[(.*?)\]\((.*?)\)|<img.*?src=["'](.*?)["'].*?>/g;
  
  // Split content by image references
  const parts = content.split(imageRegex);
  
  // Collect all image matches
  const matches: string[] = [];
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    // For markdown format, the URL is in group 2
    // For HTML format, the URL is in group 3
    matches.push(match[2] || match[3]);
  }
  
  // Reset regex index
  imageRegex.lastIndex = 0;
  
  // Render content with images
  return (
    <>
      {content.split('\n').map((paragraph, index) => {
        // Check if paragraph contains an image
        if (imageRegex.test(paragraph)) {
          // Extract image URL
          let imageUrl = '';
          if (paragraph.match(/!\[(.*?)\]\((.*?)\)/)) {
            // Markdown format
            imageUrl = paragraph.match(/!\[(.*?)\]\((.*?)\)/)![2];
          } else if (paragraph.match(/<img.*?src=["'](.*?)["'].*?>/)) {
            // HTML format
            imageUrl = paragraph.match(/<img.*?src=["'](.*?)["'].*?>/)![1];
          }
          
          return (
            <div key={index} className="my-8">
              <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                <Image
                  src={imageUrl || '/placeholder.svg?height=600&width=800&text=Blog+Image'}
                  alt="Blog content image"
                  fill
                  className="object-contain"
                />
              </div>
              {/* Extract and display image caption if any */}
              {paragraph.match(/!\[(.*?)\]/) && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  {paragraph.match(/!\[(.*?)\]/)![1]}
                </p>
              )}
            </div>
          );
        } else if (paragraph.trim()) {
          // Regular paragraph
          return <p key={index} className="mb-4">{paragraph}</p>;
        }
        return null;
      })}
      
      {/* Render any additional images found in the content as a gallery */}
      {matches.length > 1 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Image Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {matches.map((url, index) => (
              <div key={index} className="relative h-48 rounded-md overflow-hidden">
                <Image
                  src={url || '/placeholder.svg?height=200&width=200&text=Gallery+Image'}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default function BlogPostPage({ params }: { params: any }) {
  // Use React.use() to unwrap the params promise as recommended by Next.js
  const unwrappedParams = use(params);
  //@ts-ignore
  const slug = unwrappedParams.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        // Use the correct API endpoint format based on your backend
        const response = await fetch(`http://localhost:5000/api/blogs`);
        if (!response.ok) throw new Error('Failed to fetch blog posts');
        
        const data = await response.json();
        // Find the post with the matching slug
        const blogPosts = Array.isArray(data) ? data : (data.data || []);
        const foundPost = blogPosts.find((post: BlogPost) => post.slug === slug);
        
        if (!foundPost) {
          throw new Error('Blog post not found');
        }
        
        setPost(foundPost);
      } catch (err) {
        setError('Failed to load blog post. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Blog post not found'}
        </div>
        <div className="mt-4">
          <Link href="/blog" className="text-pink-500 hover:underline">
            ← Back to all blogs
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-4">
        <Link href="/blog" className="text-pink-500 hover:underline flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to all blogs
        </Link>
      </div>

      {/* Featured Image Hero */}
      <div className="relative h-[400px] w-full mb-8 rounded-xl overflow-hidden">
        <Image
          src={post.featuredImage || `/placeholder.svg?height=800&width=1200&text=${encodeURIComponent(post.title)}`}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 text-white w-full">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <Badge key={index} className="bg-pink-500 hover:bg-pink-600">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm opacity-90">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {post.author.name}
            </span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>      {/* Blog Content */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="prose prose-lg max-w-none">
            {/* Parse blog content to render text and images */}
            {parseAndRenderContent(post.content)}
            
            {/* Display images from the images array */}
            {post.images && post.images.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {post.images.map((imageUrl, index) => (
                    <div key={index} className="relative h-80 rounded-lg overflow-hidden shadow-md">
                      <Image
                        src={imageUrl}
                        alt={`Image ${index + 1} for ${post.title}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Author bio */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden">
                <Image 
                  src="/placeholder-user.jpg" 
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{post.author.name}</h3>
                <p className="text-gray-600">Gift Expert & Content Creator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Posts */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* We'd map through related posts here if we had them */}
          {[1, 2, 3].map((index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <Image
                  src={`/placeholder.svg?height=200&width=400&text=Related+Post+${index}`}
                  alt={`Related post ${index}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <Badge className="bg-pink-100 text-pink-500 mb-2">Gift Ideas</Badge>
                <h3 className="font-bold mb-2">Another interesting gift article</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  Discover more amazing gift ideas for your loved ones...
                </p>
                <Link href="/blog" className="text-pink-500 text-sm font-medium hover:underline">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}