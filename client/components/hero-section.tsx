import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-pink-50 to-pink-100 py-12 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left animate-fade-in">
            <Badge className="bg-pink-500 text-white mb-4">New Collection</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800 leading-tight">
              Find The Perfect <span className="text-pink-500">Gift</span> For Your Loved Ones
            </h1>
            <p className="text-lg mb-8 text-gray-600 max-w-md mx-auto md:mx-0">
              Discover thoughtfully curated gifts for every occasion and celebration
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8 py-6 h-12">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button asChild className="bg-transparent hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-full px-8 py-6 h-12">
                <Link href="/products">Explore Collections</Link>
              </Button>
            </div>
          </div>
          <div className="relative mt-8 md:mt-0 animate-slide-up">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-pink-200 rounded-full opacity-50"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pink-300 rounded-full opacity-40"></div>
            <Image
              src="/landing2.jpg"
              alt="Gift collection"
              width={400}
              height={300}
              className="rounded-lg shadow-lg relative z-10 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

