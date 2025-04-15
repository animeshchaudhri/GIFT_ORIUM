'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import BlogCard from '@/components/blog-card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { SearchIcon, RssIcon, MailIcon, ArrowRightIcon } from 'lucide-react';

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

// Helper function to display tags with a limit
const displayTags = (tags: string[], limit: number = 3) => {
  if (tags.length <= limit) return tags;
  return [...tags.slice(0, limit), `+${tags.length - limit}`];
};

// Helper function to format dates
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper function to estimate read time (1 min per 200 words)
const estimateReadTime = (content: string): string => {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`);
        if (!response.ok) throw new Error('Failed to fetch blog posts');
        const data = await response.json();
        // Check if data is an array directly or if it's nested in a data property
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
  
  // Extract all unique categories/tags from posts
  const allCategories = posts.length > 0 
    ? ['all', ...new Set(posts.flatMap(post => post.tags))]
    : ['all'];
  
  // Filter posts based on search query and active category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || 
      post.tags.includes(activeCategory);
    
    return matchesSearch && matchesCategory;
  });
  
  // Loading state with skeleton UI
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="h-64 w-full bg-gray-200 animate-pulse rounded-xl mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="rounded-xl overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                <div className="h-10 bg-gray-200 animate-pulse rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
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
  
  // No posts found
  if (posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">No Blog Posts Found</h2>
          <p className="text-gray-600 mb-8">Check back soon for new content!</p>
        </div>
      </div>
    );
  }

  return (
    <>      {/* Hero Section - Enhanced with better spacing and visuals */}      <section className="relative bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200&text=Blog+Background')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_70%)]"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white/30 backdrop-blur-sm text-white hover:bg-white/40 mb-4 px-4 py-1 text-sm">OUR BLOG</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Discover Gift Ideas & Inspiration</h1>
            <p className="text-base md:text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Explore our collection of articles, tips, and guides to find the perfect gifts for every occasion
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-12 py-7 rounded-full text-gray-800 border-0 shadow-lg focus:ring-2 focus:ring-pink-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </div>
      </section>
        <div className="container mx-auto px-4 py-16">        {/* Category Tabs - Scrollable container to prevent overflow */}
        <Tabs defaultValue="all" className="mb-12">
          <div className="mb-6 flex justify-center">
            <div className="relative w-full max-w-3xl overflow-x-auto hide-scrollbar">
              <TabsList className="flex whitespace-nowrap bg-white px-2 py-1 rounded-full shadow-sm border border-gray-100 w-fit mx-auto overflow-x-auto max-w-full">
                {allCategories.slice(0, 8).map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    onClick={() => setActiveCategory(category)}
                    className="data-[state=active]:bg-pink-500 data-[state=active]:text-white rounded-full px-4 py-1.5 m-1 transition-all text-sm whitespace-nowrap"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </TabsTrigger>
                ))}
                {allCategories.length > 8 && (
                  <TabsTrigger 
                    value="more"
                    className="rounded-full px-4 py-1.5 m-1 text-sm"
                  >
                    More +
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
          </div>
            <TabsContent value={activeCategory} className="mt-0">
            {/* Featured Post - Enhanced design with better spacing and visual hierarchy */}
            {filteredPosts.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-8 text-center">
                  <span className="inline-block pb-2 border-b-2 border-pink-500">Featured Post</span>
                </h2>
                <div className="transform transition-all hover:-translate-y-1 duration-300">
                  <BlogCard 
                    title={filteredPosts[0].title}
                    slug={filteredPosts[0].slug}
                    summary={filteredPosts[0].summary}
                    featuredImage={filteredPosts[0].featuredImage}
                    tags={filteredPosts[0].tags}
                    author={filteredPosts[0].author?.name || "Anonymous"}
                    date={formatDate(filteredPosts[0].createdAt)}
                    readTime={estimateReadTime(filteredPosts[0].content)}
                    variant="featured"
                  />
                </div>
              </div>
            )}
            
            {/* Main Blog Grid - Improved with better spacing and header */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8 text-center">
                <span className="inline-block pb-2 border-b-2 border-pink-500">Latest Articles</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.slice(1).map((post, index) => (
                  <div key={post._id} className="transform transition-all hover:-translate-y-2 duration-300">
                    <BlogCard 
                      title={post.title}
                      slug={post.slug}
                      summary={post.summary}
                      featuredImage={post.featuredImage}
                      tags={post.tags}
                      author={post.author?.name || "Anonymous"}
                      date={formatDate(post.createdAt)}
                      readTime={estimateReadTime(post.content)}
                      index={index + 1}
                     
                    />
                  </div>
                ))}
              </div>
            </div>
              {/* Pagination - Enhanced with better styling */}
            {filteredPosts.length > 9 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <div className="inline-flex items-center justify-center bg-white shadow-sm rounded-full overflow-hidden p-1">
                  <Button variant="outline" size="sm" disabled className="rounded-full w-10 h-10 p-0 font-medium bg-pink-500 text-white border-none">1</Button>
                  <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 font-medium hover:bg-pink-50 hover:text-pink-500">2</Button>
                  <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 font-medium hover:bg-pink-50 hover:text-pink-500">3</Button>
                  <span className="mx-2 text-gray-400">•••</span>
                  <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 font-medium hover:bg-pink-50 hover:text-pink-500">12</Button>
                  <Button variant="outline" size="sm" className="rounded-full h-10 px-5 ml-2 font-medium hover:bg-pink-500 hover:text-white border-pink-200 text-pink-500">
                    Next <ArrowRightIcon className="ml-2" size={16} />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Newsletter Section - Redesigned with a more modern and attractive layout */}
        {/* <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 md:p-12 mt-20 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-pink-500">
              <path d="M45.3,-49.7C56.9,-34.1,63.2,-16.8,64.7,1.5C66.1,19.8,62.7,39.5,51.1,51.3C39.5,63.1,19.8,66.9,0.6,66.3C-18.5,65.7,-37,60.7,-52.6,48.9C-68.2,37,-80.8,18.5,-80.3,0.5C-79.7,-17.5,-65.9,-35,-50.2,-50.6C-34.5,-66.2,-17.3,-80.1,-0.2,-79.9C16.8,-79.7,33.7,-65.3,45.3,-49.7Z" transform="translate(100 100)" />
            </svg>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <Badge className="bg-pink-100 text-pink-600 mb-5 py-1.5 px-4">Stay Updated</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Get gift ideas delivered to your inbox</h2>
              <p className="text-gray-600 mb-6">
                Join our newsletter for the latest gifting tips, exclusive offers, and inspiration.
                No spam, just great content you'll actually enjoy.
              </p>
              <div className="flex w-full max-w-md relative">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="rounded-r-none border-r-0 focus:ring-pink-500 pr-3 py-6"
                />
                <Button className="rounded-l-none bg-pink-500 hover:bg-pink-600 px-6 py-6">
                  Subscribe <MailIcon className="ml-2" size={16} />
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <div className="relative h-64 w-64">
                <div className="absolute -right-4 -top-4 h-16 w-16 bg-yellow-200 rounded-full opacity-60"></div>
                <div className="absolute -left-2 -bottom-2 h-20 w-20 bg-pink-200 rounded-full opacity-70"></div>
                <Image 
                  src="/placeholder.svg?height=300&width=300&text=Newsletter" 
                  alt="Newsletter illustration"
                  fill
                  className="object-contain relative z-10 rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div> */}
          {/* Popular Posts - Enhanced with a modern card layout and visual styling */}
        {/* <div className="mt-24 mb-16">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="h-8 w-2 bg-pink-500 rounded-full"></div>
              <h2 className="text-2xl font-bold">Popular Articles</h2>
            </div>
            <Link href="/blog/grid" className="text-pink-500 hover:text-pink-600 flex items-center transition-colors group">
              View all 
              <ArrowRightIcon className="ml-1 group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.slice(0, 4).map((post, index) => (
              <div key={post._id} className="transform transition-all hover:-translate-y-1 hover:shadow-md duration-300">
                <BlogCard 
                  title={post.title}
                  slug={post.slug}
                  featuredImage={post.featuredImage}
                  date={formatDate(post.createdAt)}
                  index={index}
                  variant="compact"
                />
              </div>
            ))}
          </div>
        </div> */}
      </div>
      
      {/* Bottom CTA - Redesigned with more visual impact */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=800&text=Gift+Pattern')] opacity-5 bg-repeat"></div>
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-pink-500 to-purple-600"></div>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <Badge className="bg-pink-500/20 text-pink-300 mb-6 py-1.5 px-4 backdrop-blur-sm">Find The Perfect Gift</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-white">Ready to find the perfect gift?</h2>
            <p className="text-gray-300 mb-10 text-lg">
              Browse our extensive catalog of unique and thoughtful gifts for every occasion.
              From birthdays to anniversaries, we've got you covered.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-pink-500 hover:bg-pink-600 py-6 px-8 text-lg shadow-lg hover:shadow-pink-500/20 transition-all">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-black hover:bg-white/10 hover:text-white py-6 px-8 text-lg backdrop-blur-sm">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}