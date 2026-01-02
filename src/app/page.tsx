import { Hero } from "@/components/home/Hero";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { TrendingSection } from "@/components/home/TrendingSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { TagCloud } from "@/components/home/TagCloud";
import { RecentFeed } from "@/components/home/RecentFeed";

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <FeaturedCarousel />
      <TrendingSection />
      <CategoryGrid />
      <TagCloud />
      <RecentFeed />
    </div>
  );
}
