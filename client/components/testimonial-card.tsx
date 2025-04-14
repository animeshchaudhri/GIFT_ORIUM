import Image from "next/image"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  name: string
  role: string
  content: string
  imageSrc: string
}

export default function TestimonialCard({ name, role, content, imageSrc }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 relative">
          <Image
            src={imageSrc}
            alt={`Avatar of ${name}`}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>

      <p className="text-gray-700 mb-4 text-sm">{content}</p>

      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
        ))}
      </div>
    </div>
  )
}
