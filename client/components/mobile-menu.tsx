"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react"

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    if (isOpen) {
      setActiveSubmenu(null)
      document.body.style.overflow = "auto"
    } else {
      document.body.style.overflow = "hidden"
    }
  }

  const toggleSubmenu = (menu: string) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu)
  }

  const menuItems = [
    { name: "Home", link: "/", hasSubmenu: false },
    {
      name: "Categories",
      link: "/products",
      hasSubmenu: true,
      submenu: [
        { name: "Flowers", link: "/products?tag=flowers" },
        { name: "Keychains", link: "/products?tag=keychains" },
        { name: "Religious gifts", link: "/products?tag=religious-gifts" },
        { name: "Beauty Gifts", link: "/products?tag=beauty-gifts" },
        { name: "Home Decor", link: "/products?tag=home-decor" },
        { name: "Soft toys", link: "/products?tag=soft toys" },
        { name: "Kitchen & Dining", link: "/products?tag=kitchen-dining" },
        { name: "Premium Gifts", link: "/products?tag=premium-gifts" }
      ],
    },
    {
      name: "Shop",
      link: "/products",
      hasSubmenu: true,
      submenu: [
        { name: "New Arrivals", link: "/products?filter=new" },
        { name: "Best Sellers", link: "/products?filter=bestsellers" },
        { name: "Sale Items", link: "/products?filter=sale" },
        { name: "Gift Cards", link: "/products?type=giftcards" }
      ],
    },
    {
      name: "Pages",
      link: "#",
      hasSubmenu: true,
      submenu: [
        { name: "About Us", link: "/about" },
        { name: "Contact Us", link: "/contact" },
        { name: "FAQ", link: "/faq" },
        { name: "Terms & Conditions", link: "/terms" }
      ],
    },
    { name: "Blog", link: "/blog", hasSubmenu: false },
    { name: "Contact", link: "/contact", hasSubmenu: false },
  ]

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-600 hover:text-pink-500 focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600 hover:text-pink-500 focus:outline-none"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <li key={index} className="border-b border-gray-100 pb-3">
                  {item.hasSubmenu ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className="flex items-center justify-between w-full py-2 font-medium"
                      >
                        {item.name}
                        {activeSubmenu === item.name ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>

                      {activeSubmenu === item.name && (
                        <ul className="pl-4 mt-2 space-y-2">
                          {item.submenu?.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                href={typeof subItem === 'string' ? '#' : subItem.link}
                                className="block py-1 text-gray-600 hover:text-pink-500"
                                onClick={toggleMenu}
                              >
                                {typeof subItem === 'string' ? subItem : subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link href={item.link} className="block py-2 font-medium hover:text-pink-500" onClick={toggleMenu}>
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}

