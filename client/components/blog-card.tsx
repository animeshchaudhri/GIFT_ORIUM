// BlogCard.tsx (unchanged from previous code)
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";

interface BlogCardProps {
  title: string;
  slug?: string;
  summary?: string;
  featuredImage?: string;
  tags?: string[];
  author?: string;
  date?: string;
  readTime?: string;
  index?: number;
  variant?: "default" | "compact" | "featured";
}

export default function BlogCard({
  title,
  slug = "",
  summary = "Discover the best spiritual items to enhance your faith and life...",
  featuredImage = "",
  tags = ["Spiritual Gifts"],
  author = "Spiritual Shop",
  date = "Apr 10, 2025",
  readTime = "4 min read",
  index = 0,
  variant = "default",
}: BlogCardProps) {
  const imageSrc =
    featuredImage || `/placeholder.svg?height=200&width=400&text=Blog${index + 1}`;

  const renderTags = (tags: string[], maxVisible: number = 3) => {
    if (!tags.length) return null;

    const visibleTags = tags.slice(0, maxVisible);
    const remainingCount = tags.length - maxVisible;

    return (
      <div className="flex flex-wrap gap-2">
        {visibleTags.map((tag, i) => (
          <Badge key={i} className="bg-blue-500 hover:bg-blue-600">{tag}</Badge>
        ))}
        {remainingCount > 0 && (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            +{remainingCount} more
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="group rounded-xl overflow-hidden bg-white shadow hover:shadow-md transition-all hover:-translate-y-1 duration-300">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {renderTags(tags, 2)}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <UserIcon size={12} /> {author}
          </span>
          <span className="flex items-center gap-1">
            <CalendarIcon size={12} /> {date}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-2 group-hover:text-blue-500 transition-colors">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{summary}</p>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
        >
          <Link href={`/blog`}>Read More</Link>
        </Button>
      </div>
    </div>
  );
}
