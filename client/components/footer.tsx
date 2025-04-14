import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

function Footer() {
  return (
    <div className="bg-gray-900 text-white pt-12 pb-6">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <Link href="/" className="text-2xl font-bold text-white flex items-center mb-4">
            <span className="bg-pink-500 text-white p-1 rounded-full mr-1">G</span>
            ift Orium
          </Link>
          <p className="text-gray-400 mb-4 text-sm">
            Premium gift shop for all occasions. Find the perfect gift for your loved ones.
          </p>
          <div className="flex space-x-2">
            {["facebook", "twitter", "instagram", "pinterest"].map((social, index) => (
              <Link
                key={index}
                href="#"
                className="bg-gray-800 hover:bg-pink-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="sr-only">{social}</span>
                {/* Icon placeholder */}
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            {["About Us", "Contact Us", "Products", "Login", "Sign Up", "FAQ", "Terms"].map((link, index) => (
              <li key={index}>
                <Link href="#" className="hover:text-pink-500 transition-colors flex items-center">
                  <ArrowRight size={12} className="mr-2" />
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Our Products</h3>
          <ul className="space-y-2 text-gray-400">
            {[
              "Birthday Gifts",
              "Anniversary Gifts",
              "Wedding Gifts",
              "Corporate Gifts",
              "Holiday Gifts",
              "Personalized Gifts",
            ].map((link, index) => (
              <li key={index}>
                <Link href="#" className="hover:text-pink-500 transition-colors flex items-center">
                  <ArrowRight size={12} className="mr-2" />
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Contact Info</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start">
              <div className="bg-pink-500 p-1 rounded mr-2 mt-1">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
              <span>123 Gift Street, New York, USA</span>
            </li>
            <li className="flex items-start">
              <div className="bg-pink-500 p-1 rounded mr-2 mt-1">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
              <span>info@gifoy.com</span>
            </li>
            <li className="flex items-start">
              <div className="bg-pink-500 p-1 rounded mr-2 mt-1">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
              <span>+1 234 567 8900</span>
            </li>
          </ul>
          <div className="mt-4">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6">Contact Us</Button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-400 text-sm mb-4 md:mb-0">
          © {new Date().getFullYear()} Gift Orium. All Rights Reserved.
        </p>
        <div className="flex items-center space-x-2">
          {["visa", "mastercard", "paypal", "apple-pay"].map((payment, index) => (
            <div key={index} className="bg-gray-800 p-1 rounded">
              <Image
                src={`/placeholder.svg?height=20&width=30&text=${payment}`}
                alt={payment}
                width={30}
                height={20}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Footer