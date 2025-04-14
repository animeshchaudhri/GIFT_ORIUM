'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// This is a sample/placeholder blog post for the details page
const samplePost = {
  _id: '1',
  title: 'The Art of Thoughtful Gift-Giving: How to Choose Memorable Presents',
  slug: 'art-of-thoughtful-gift-giving',
  summary: 'Learn how to select meaningful gifts that create lasting memories and strengthen your relationships.',
  content: `
    <p>Gift-giving is more than just a tradition or obligation; it's an art form that allows us to express our feelings, strengthen bonds, and create lasting memories. The perfect gift can communicate what words sometimes cannot, showing someone that you truly understand and appreciate them.</p>

    <h2>Understanding the Recipient</h2>
    <p>The first rule of thoughtful gift-giving is to focus on the recipient, not yourself. Consider their interests, needs, desires, and values. What brings them joy? What challenges do they face? What experiences do they cherish?</p>
    <p>Pay attention to subtle hints they may drop in conversation. Perhaps they've mentioned wanting to learn a new skill, or they've admired something specific while shopping. These clues can lead you to a gift that resonates deeply.</p>

    <h2>Quality Over Quantity</h2>
    <p>A single thoughtful gift will always outshine multiple generic presents. Focus on finding something meaningful rather than impressive by price tag alone. Sometimes, the most treasured gifts are those that cost little but show great consideration.</p>

    <h2>Consider Experiences</h2>
    <p>Material possessions eventually fade, but experiences create memories that last a lifetime. Consider gifting concert tickets, cooking classes, spa days, or adventure outings. These not only provide immediate joy but also give the recipient stories to tell and memories to cherish.</p>

    <h2>Personalization Makes Perfect</h2>
    <p>Adding a personal touch transforms an ordinary gift into something extraordinary. Customized items, handmade gifts, or presents that reference shared jokes or memories demonstrate the thought and care you've invested in your selection.</p>

    <h2>Timing and Presentation</h2>
    <p>Sometimes, when and how you give a gift matters as much as the gift itself. Surprising someone with a present on an ordinary day can be more meaningful than an expected gift on a holiday. Similarly, beautiful wrapping or creative presentation can elevate the entire gift-giving experience.</p>

    <h2>Ethical and Sustainable Choices</h2>
    <p>Increasingly, people appreciate gifts that align with their values. Consider eco-friendly options, fair trade products, or items that give back to communities. A gift that does good while bringing joy creates double the positive impact.</p>

    <h2>The Gift of Time and Attention</h2>
    <p>In our busy world, sometimes the most precious gift is your time and undivided attention. Offering to babysit for new parents, helping an elderly relative with household tasks, or simply planning a day dedicated to spending quality time with someone you love can be invaluable.</p>

    <p>Remember that thoughtful gift-giving isn't about perfection; it's about connecting with others in a meaningful way. When you give from the heart, focusing on the joy of the recipient rather than obligation or impression, you transform a simple exchange into a moment of genuine human connection.</p>
  `,
  featuredImage: '/placeholder.svg?height=400&width=800&text=Gift+Giving',
  tags: ['Gift Ideas', 'Relationships', 'Special Occasions'],
  author: {
    name: 'Emily Parker',
    _id: 'author1'
  },
  createdAt: '2025-03-15T10:30:00.000Z'
};

interface RelatedPost {
  _id: string;
  title: string;
  slug: string;
  featuredImage: string;
  createdAt: string;
}

const relatedPosts: RelatedPost[] = [
  {
    _id: '2',
    title: 'Top 10 Birthday Gift Ideas for 2025',
    slug: 'top-birthday-gifts-2025',
    featuredImage: '/placeholder.svg?height=200&width=300&text=Birthday+Gifts',
    createdAt: '2025-02-20T14:15:00.000Z'
  },
  {
    _id: '3',
    title: 'Sustainable Gift Options for Eco-Conscious Friends',
    slug: 'sustainable-gift-options',
    featuredImage: '/placeholder.svg?height=200&width=300&text=Eco+Gifts',
    createdAt: '2025-03-05T09:45:00.000Z'
  },
  {
    _id: '4',
    title: 'How to Create Custom Gift Baskets for Any Occasion',
    slug: 'custom-gift-baskets',
    featuredImage: '/placeholder.svg?height=200&width=300&text=Gift+Baskets',
    createdAt: '2025-03-12T16:30:00.000Z'
  }
];

export default function BlogDetailsPage() {
  // In a real application, you would fetch the post based on the slug from the URL
  const [post, setPost] = useState(samplePost);
  const [loading, setLoading] = useState(false);

  // Format the date
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/blog" className="flex items-center text-pink-500 hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative h-80 w-full">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 md:p-8">
              <div className="flex gap-2 mb-3 flex-wrap">
                {post.tags.map((tag, index) => (
                  <Badge key={index} className="bg-pink-100 text-pink-500">{tag}</Badge>
                ))}
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>5 min read</span>
                </div>
              </div>
              
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
              
              <Separator className="my-8" />
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">Share this article:</span>
                  <div className="flex gap-3 mt-2">
                    <Button variant="outline" size="sm" className="rounded-full p-2">
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full p-2">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full p-2">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-8">
          {/* Author Card */}
          <Card className="p-6">
            <h3 className="font-bold mb-4">About the Author</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden">
                <Image
                  src="/placeholder-user.jpg"
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold">{post.author.name}</h4>
                <p className="text-sm text-gray-500">Gift Specialist</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Emily specializes in gift recommendations and has been helping people find the perfect presents for over a decade.
            </p>
          </Card>
          
          {/* Related Posts */}
          <Card className="p-6">
            <h3 className="font-bold mb-4">Related Articles</h3>
            <div className="space-y-4">
              {relatedPosts.map((related) => (
                <Link href={`/blog/${related.slug}`} key={related._id} className="block group">
                  <div className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={related.featuredImage}
                        alt={related.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium group-hover:text-pink-500 line-clamp-2">{related.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(related.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
          
          {/* Newsletter */}
          <Card className="p-6 bg-pink-50">
            <h3 className="font-bold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get the latest gift ideas and special offers directly to your inbox.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <Button className="w-full">Subscribe</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}