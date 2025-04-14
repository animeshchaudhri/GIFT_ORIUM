import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const values = [
    { title: "Quality", description: "We source only the finest products from trusted suppliers worldwide." },
    { title: "Customer First", description: "Your satisfaction is our top priority - we're here to serve you." },
    { title: "Innovation", description: "Constantly evolving our selection to bring you unique gift options." },
    { title: "Integrity", description: "Honest pricing and transparent business practices you can trust." },
  ];

  const team = [
    { name: "Sarah Johnson", role: "Founder & CEO", image: "/placeholder-user.jpg" },
    { name: "Mike Chen", role: "Head of Curation", image: "/placeholder-user.jpg" },
    { name: "Lisa Patel", role: "Customer Experience", image: "/placeholder-user.jpg" },
  ];

  const stats = [
    { value: "10K+", label: "Happy Customers" },
    { value: "5000+", label: "Products" },
    { value: "99%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Gifty</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            We're passionate about helping you find the perfect gift for every occasion.
            Our curated collection brings joy to both givers and receivers.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-2 rounded-full mr-4">
                    <Check className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-xl">{value.title}</h3>
                </div>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            To create memorable gifting experiences by offering carefully curated, high-quality products
            at competitive prices while providing exceptional customer service and a seamless shopping journey.
          </p>
        </div>
      </section>
    </div>
  );
}