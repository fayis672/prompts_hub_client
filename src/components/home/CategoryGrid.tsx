import { getCategories } from "@/lib/api/categories";
import { CategoryCard } from "./CategoryCard";
import Link from "next/link";

export async function CategoryGrid() {
    const categories = await getCategories();

    return (
        <section className="py-20 bg-muted/30">
            <div className="px-4 md:px-0">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Browse by Category</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Find the perfect prompt for any task. Our organized categories help you discover specifically what you need.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <Link key={cat.id} href={`/categories/${cat.slug}`} className="block h-full">
                            <CategoryCard category={cat} />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
