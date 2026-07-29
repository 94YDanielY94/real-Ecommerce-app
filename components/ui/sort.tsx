'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const sortOptions = [
  "Newest",
  "Price: Low → High",
  "Price: High → Low",
];

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || "Newest";

  const handleSortChange = (option: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', option);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-52">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Sort by: {currentSort}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => handleSortChange(option)}
                className={currentSort === option ? "font-bold" : ""}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}