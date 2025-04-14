import React from 'react'
import CategoryCard from './category-card'

const categories = [
    {
      title: "Key Chains",
      description: "Handcrafted with love",
      badgeText: "New Arrival",
      badgeColor: "blue",
      buttonColor: "blue",
      imageSrc: "https://images.unsplash.com/photo-1687363714985-990685339050?auto=format&fit=crop&w=150&q=80",
    },
    {
      title: "Flowers",
      description: "Fresh & fragrant blooms",
      badgeText: "Limited Stock",
      badgeColor: "rose",
      buttonColor: "rose",
      imageSrc: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=150&q=80",
    },
    {
      title: "Soft Toys",
      description: "Cuddly companions for all ages",
      badgeText: "Popular",
      badgeColor: "pink",
      buttonColor: "pink",
      imageSrc: "https://images.unsplash.com/photo-1567169866456-a0759b6bb0c8?auto=format&fit=crop&w=150&q=80",
    },
  ];
  
  
  

function Trending() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8">Trending Items</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            title={category.title}
            description={category.description}
            badgeText={category.badgeText}
            badgeColor={category.badgeColor}
            buttonColor={category.buttonColor}
            imageSrc={category.imageSrc}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

export default Trending
