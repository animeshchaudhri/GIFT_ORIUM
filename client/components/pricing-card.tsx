import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PricingCardProps {
  title: string
  price: string
  features: string[]
}

export default function PricingCard({ title, price, features }: PricingCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow text-center">
      <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <span className="text-pink-500 font-bold">{title}</span>
      </div>
      <h3 className="text-xl font-bold mb-2">{price}</h3>
      <ul className="space-y-2 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center justify-center">
            <Check size={16} className="text-pink-500 mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6 w-full">Choose Plan</Button>
    </div>
  )
}

