'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types/types';

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get currently active category ID from URL query string
  const activeCategoryId = searchParams.get('category');

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Toggle category off if clicked again, or set the new category
    if (activeCategoryId === categoryId) {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }

    // Push updated params to the URL without refreshing the whole page
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* "All" button to clear filter */}
      <button
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete('category');
          router.push(`?${params.toString()}`, { scroll: false });
        }}
        className={`rounded-full border px-5 py-2 text-sm transition ${
          !activeCategoryId
            ? 'border-primary bg-primary text-white'
            : 'border-gray-300 hover:bg-neutral-200'
        }`}
      >
        All
      </button>

      {/* Dynamic Category Buttons */}
      {categories.map((category) => {
        const isActive = activeCategoryId === category.id;
        return (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`rounded-full border px-5 py-2 text-sm transition ${
              isActive
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 hover:bg-neutral-200'
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}