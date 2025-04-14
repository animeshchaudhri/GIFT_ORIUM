import React from 'react'
import TestimonialCard from './testimonial-card';
const testimonials = [
    {
      name: "Priya Sharma",
      role: "Regular Customer",
      content:
        "The gifts I ordered were beautifully packaged and arrived right on time for Diwali. My entire family loved them! Will definitely order again.",
      imageSrc: "https://randomuser.me/api/portraits/women/28.jpg",
    },
    {
      name: "Rajesh Kumar",
      role: "Happy Client",
      content:
        "Exceptional quality and service. The personalized gifts were perfect for our corporate Diwali celebrations. Highly recommended!",
      imageSrc: "https://randomuser.me/api/portraits/men/44.jpg",
    },
    {
      name: "Anjali Patel",
      role: "Loyal Customer",
      content:
        "I've been shopping with Gift Orium for all occasions - from Raksha Bandhan to Diwali. Their attention to detail and customer service is unmatched.",
      imageSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    },
  ];
function Testimonials() {
  return (
       
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">What Our Client Says About Us</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </div>
        </section>
  )
}

export default Testimonials