import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CategoryCardProps {
  title: string;
  description: string;
  badgeText: string;
  badgeColor: string;
  buttonColor: string;
  index: number;
  imageSrc: string;
}

// Maps for Tailwind-safe class names
const bgColorMap: Record<string, string> = {
  blue: "bg-blue-100",
  rose: "bg-rose-100",
  pink: "bg-pink-100",
};

const badgeBgMap: Record<string, string> = {
  blue: "bg-blue-500",
  rose: "bg-rose-500",
  pink: "bg-pink-500",
};

const buttonBgMap: Record<string, string> = {
  blue: "bg-blue-500 hover:bg-blue-600",
  rose: "bg-rose-500 hover:bg-rose-600",
  pink: "bg-pink-500 hover:bg-pink-600",
};

export default function CategoryCard({
  title,
  description,
  badgeText,
  badgeColor,
  buttonColor,
  index,
  imageSrc,
}: CategoryCardProps) {
  return (
    <div className={`rounded-lg p-6 flex items-center gap-4 ${bgColorMap[badgeColor] || "bg-gray-100"}`}>
      <div className="flex-1">
        <Badge className={`text-white mb-4 ${badgeBgMap[badgeColor] || "bg-gray-500"}`}>
          {badgeText}
        </Badge>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm mb-4">{description}</p>
        <Button
          asChild
          className={`text-white rounded-full px-4 py-1 text-sm ${buttonBgMap[buttonColor] || "bg-gray-500 hover:bg-gray-600"}`}
        >
<Link href={`/products?tag=${encodeURIComponent(title.toLowerCase().replace(/\s+/g,''))}`}>
            Shop Now
          </Link>
        </Button>
      </div>
      <div className="w-1/2 flex justify-center">
        <Image
          src={imageSrc}
          alt={title}
          width={150}
          height={150}
          className="object-contain"
        />
      </div>
    </div>
  );
}
