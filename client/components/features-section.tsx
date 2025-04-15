import { Check } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    "Free Shipping On Order ₹1000+",
    "Easy 30 Days Returns",
    "100% Secure Payment",
    "24/7 Customer Support",
    "100% Money Back Guarantee",
  ]

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-3 hover:bg-[#f8ede3] rounded-lg transition-colors"
          >
            <div className="bg-[#f5e6d3] rounded-full p-3 mb-3">
              <div className="bg-[#e74c3c] text-white rounded-full w-10 h-10 flex items-center justify-center">
                <Check size={16} />
              </div>
            </div>
            <p className="text-xs md:text-sm font-medium">{feature}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

