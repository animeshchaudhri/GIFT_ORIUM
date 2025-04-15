'use client';

import { Card } from "@/components/ui/card";
import { Check, Heart, Users, Sparkles, Shield } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Description } from "@radix-ui/react-toast";

export default function AboutPage() {
  const values = [
    { title: "Quality", description: "We source only the finest products from trusted suppliers worldwide." },
    { title: "Customer First", description: "Your satisfaction is our top priority - we're here to serve you." },
    { title: "Innovation", description: "Constantly evolving our selection to bring you unique gift options." },
    { title: "Integrity", description: "Honest pricing and transparent business practices you can trust." },
  ];

  const team = [
    { name: "Ravi Bhasin", role: "Founder", image: "/owner.png", description: "Expert in business development and customer relations with years of experience in various fields." },
    { name: "Sahil Bhasin", role: "Co-founder", image: "/Owner2.png", description: "Passionate about creating innovative gifting solutions and enhancing customer experiences." },
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
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-100 via-pink-50 to-pink-100 py-32">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 bg-repeat"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
          >
            About Gift_Orium
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
          >
            We're passionate about helping you find the perfect gift for every occasion.
            Our curated collection brings joy to both givers and receivers.
          </motion.p>
        </div>
      </div>

      {/* Values Section */}
    

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Meet Our Team</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">The passionate individuals behind Gift_Orium, dedicated to making your gifting experience exceptional.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative w-56 h-56 mx-auto mb-6 overflow-hidden rounded-2xl border-4 border-purple-100 group-hover:border-purple-200 transition-colors duration-300">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{member.name}</h3>
                <p className="text-purple-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gradient-to-r from-purple-100 via-pink-50 to-pink-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 bg-repeat rotate-3"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Our Mission</h2>
            <p className="text-2xl text-gray-700 leading-relaxed">
              To create memorable gifting experiences by offering carefully curated, high-quality products
              at competitive prices while providing exceptional customer service and a seamless shopping journey.
            </p>
          </motion.div>
        </div>
      </section>

   

      <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index}
              >
                <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl mr-4 shadow-lg">
                    {index === 0 ? <Heart className="h-6 w-6 text-white" /> :
                     index === 1 ? <Users className="h-6 w-6 text-white" /> :
                     index === 2 ? <Sparkles className="h-6 w-6 text-white" /> :
                     <Shield className="h-6 w-6 text-white" />}
                  </div>
                  <h3 className="font-semibold text-xl">{value.title}</h3>
                </div>
                <p className="text-gray-600">{value.description}</p>
              </Card>
           
            </motion.div>
            ))}
        </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 text-center bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
         {/* Contact Section */}
         <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Contact Us</h2>
            <p className="text-gray-600 text-lg">We're here to help! Reach out to us through any of these channels.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="grid md:grid-cols-2 gap-8 text-lg">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Address</h3>
                    <p className="text-gray-600">
                      Shop no 3, Ad block Housing board complex,
                      Gandhi Nagar, Jammu,
                      Jammu and Kashmir 180004
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Phone</h3>
                    <a href="tel:+919419135840" className="text-purple-600 hover:text-purple-700 transition-colors duration-300">
                      +91 94191 35840
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}