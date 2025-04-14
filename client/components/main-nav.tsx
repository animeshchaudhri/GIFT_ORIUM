import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

const DropdownMenu = ({ label, links }: { label: string; links: { href: string; label: string }[] }) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150); // delay hides dropdown
  };

  return (
    <li
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center font-medium hover:text-pink-500 focus:outline-none">
        {label} <ChevronDown size={16} className="ml-1" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          {links.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </li>
  );
};

export default function MainNav() {
  return (
    <nav className="w-full">
      <ul className="hidden md:flex flex-wrap justify-end space-x-8 py-3 text-sm">
        <li>
          <Link href="/" className="flex items-center font-medium hover:text-pink-500">
            Home
          </Link>
        </li>

        <DropdownMenu
          label="Categories"
          links={[
            { href: "/products?category=birthday", label: "Birthday Gifts" },
            { href: "/products?category=anniversary", label: "Anniversary Gifts" },
            { href: "/products?category=wedding", label: "Wedding Gifts" },
            { href: "/products?category=corporate", label: "Corporate Gifts" },
          ]}
        />

        <DropdownMenu
          label="Shop"
          links={[
            { href: "/products", label: "New Arrivals" },
            { href: "/products", label: "Best Sellers" },
            { href: "/products", label: "Sale Items" },
            { href: "/products", label: "Gift Cards" },
          ]}
        />

        <DropdownMenu
          label="Pages"
          links={[
            { href: "/about", label: "About Us" },
            { href: "/contact", label: "Contact Us" },
            { href: "/faq", label: "FAQ" },
            { href: "/terms", label: "Terms & Conditions" },
          ]}
        />

        <DropdownMenu
          label="Blog"
          links={[
            { href: "/blog/grid", label: "Blog Grid" },
            { href: "/blog/list", label: "Blog List" },
            { href: "/blog/details", label: "Blog Details" },
          ]}
        />

        <li>
          <Link href="/contact" className="flex items-center font-medium hover:text-pink-500">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
