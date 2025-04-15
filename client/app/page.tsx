'use client';

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";

import BlogCard from "@/components/blog-card";
import Footer from "@/components/footer";
import Premium from "@/components/premium";
import Trending from "@/components/Trending";
import Testimonials from "@/components/Testimonials";

export default function Home() {
 
  
  const deals = [
    {
      name: "Perfume Set",
      imageSrc: "https://images.unsplash.com/photo-1585386959984-a4155224a1b1?auto=format&fit=crop&w=400&q=80",
      discount: "-20%",
    },
    {
      name: "Gold Watch",
      imageSrc: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=400&q=80",
      discount: "-15%",
    },
    {
      name: "Silver Necklace",
      imageSrc: "https://images.unsplash.com/photo-1611599531556-92f4b10f882b?auto=format&fit=crop&w=400&q=80",
      discount: "-25%",
    },
    {
      name: "Gift Box",
      imageSrc: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=400&q=80",
      discount: "-30%",
    },
    {
      name: "Beauty Kit",
      imageSrc: "https://images.unsplash.com/photo-1600180758890-6f12f6611f8a?auto=format&fit=crop&w=400&q=80",
      discount: "-10%",
    },
  ];
  
  

  // blogPosts.ts or inline in your page/component
  const blogPosts = [
    {
      title: "Cuddle Up with Love: Explore Our Cutest Soft Toys",
      slug: "why-soft-toys-make-the-perfect-gift-for-all-ages",
      summary: "Discover our collection of the cutest soft toys that bring comfort and joy to anyone's life.",
      featuredImage: "soft.png",
      tags: ["Soft Toys"],
      author: "Admin",
      date: "Apr 10, 2025",
      readTime: "5 min read"
    },
    {
      title: "Why Artificial Flowers Are the New Home Trend",
      slug: "the-perfect-long-lasting-gift-that-never-wilts",
      summary: "Artificial flowers are becoming a popular trend in home decor for their beauty and longevity.",
      featuredImage: "artificial-flowers.jpg",
      tags: ["Artificial Flowers"],
      author: "Admin",
      date: "Apr 12, 2025",
      readTime: "4 min read"
    },
    {
      title: "Bring Home Blessings with Our Guruji Religious Collection",
      slug: "thoughtful-guruji-gifts-that-show-respect-and-gratitude",
      summary: "Explore our curated collection of religious items, bringing blessings and serenity into your home.",
      featuredImage: "guruji-items.jpg",
      tags: ["Guruji Items"],
      author: "Admin",
      date: "Apr 14, 2025",
      readTime: "6 min read"
    }
  ];
  

  

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <HeroSection />
        <FeaturesSection />

        {/* Premium Gifts Section */}
        <Premium/>

       <Trending/>

        {/* Values Section */}
        <section className="bg-blue-100 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">What Makes Us Unique In Our Values</h2>
                <p className="text-gray-600 mb-6">
                  We believe in providing exceptional gift experiences that create lasting memories.
                </p>
                <Button asChild className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
              <div>
                <Image
                  src="https://plus.unsplash.com/premium_vector-1739458998236-b4fed7451200?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Happy customer with gifts"
                  width={500}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sale Banner */}
        <section className="bg-amber-100 py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">HUGE SALE UP TO 50% OFF</h2>
            <p className="text-lg mb-6">Limited time offer on selected items</p>
            <Button asChild className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8 py-2">
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </section>

        {/* Best Deals */}
        <section className="bg-purple-100 py-12">
  <div className="container mx-auto px-4">
    <h2 className="text-2xl font-bold mb-8 text-center">Best Deals For This Week</h2>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {deals.map((item, index) => (
        <Link
          href={`/products?category=${encodeURIComponent(item.name.toLowerCase().replace(" ", "-"))}`}
          key={index}
        >
          <div className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="relative w-24 h-24 mx-auto mb-2">
              <Image
                src={item.imageSrc}
                alt={item.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <h3 className="font-medium text-sm">{item.name}</h3>
            <div className="flex justify-center mt-2">
              <Badge className="bg-pink-500 text-white">{item.discount}</Badge>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>


        {/* Quality Service */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">We Provide Best And Quality Gifts For You</h2>
              <p className="text-gray-600 mb-6">
                Our team of gift experts carefully curates each collection to ensure you find the perfect gift for every
                occasion.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Handpicked premium products",
                  "Secure packaging and delivery",
                  "30-day money-back guarantee",
                  "24/7 customer support",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="bg-pink-500 rounded-full p-1 mr-3">
                      <Check size={14} className="text-white" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
            <div>
              <Image
                src="https://images.unsplash.com/photo-1639422742213-cb2f9a99d3f0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fEdpZnQlMjBCb3glMjBxdWFsaXR5fGVufDB8fDB8fHww"
                alt="Quality service"
                width={500}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Problem Solution */}
        <section className="bg-pink-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">We Provide Premium Quality Gift For You</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Curated Collections", desc: "Handpicked gifts for every occasion" },
                { title: "Fast Delivery", desc: "Get your gifts on time, every time" },
                { title: "Gift Wrapping", desc: "Beautiful presentation for your special gifts" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 flex items-start hover:shadow-md transition-shadow"
                >
                  <div className="bg-purple-100 p-2 mr-4">
                    <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8">Let's Check Our Photo Gallery</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="overflow-hidden rounded-lg">
                <Image
                  src={`/placeholder.svg?height=200&width=200&text=Gallery${index + 1}`}
                  alt={`Gallery image ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

     

        {/* Blog */}
        <section className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Latest From Our Blog</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post, index) => (
                <BlogCard index={0} key={index} {...post} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
