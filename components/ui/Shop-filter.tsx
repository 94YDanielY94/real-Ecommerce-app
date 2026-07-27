"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Slider } from "./slider";
const categories = [
  "Chair",
  "Desk",
  "Sofa",
  "Table",
  "Lighting",
  "Storage",
  "Decoration",
];

const sortOptions = [
  "Featured",
  "Newest",
  "Price: Low → High",
  "Price: High → Low",
];

export default function ShopFilter() {
  return (
    <section className="w-full px-18 py-6">
      <div className="flex flex-wrap items-start justify-between gap-8">
        {/* Categories */}
        <div className="flex-1">
          <h2 className="mb-4 text-xl font-semibold">Categories</h2>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className="rounded-full border border-gray-300 px-5 py-2 text-sm transition hover:bg-neutral-200 "
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="w-72">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Price Range</h2>

            <span className="text-sm text-gray-500">$0 - $10,000</span>
          </div>

          <Slider
            defaultValue={[100, 5000]}
            max={10000}
            step={5}
            className="mx-auto w-full max-w-xs"
          />

          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>$0</span>
            <span>$10,000</span>
          </div>
        </div>

        {/* Sort */}
        <div className="w-52">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              sort by
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 0.72 0.72"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>down_fill</title>
                <g
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                >
                  <g id="Arrow" transform="translate(-290 -48)">
                    <g id="down_fill" transform="translate(290 48)">
                      <path
                        d="M0.72 0v0.72H0V0zM0.378 0.698l0 0 -0.002 0.001 -0.001 0 0 0 -0.002 -0.001q0 0 -0.001 0l0 0 -0.001 0.013 0 0.001 0 0 0.003 0.002 0 0 0 0 0.003 -0.002 0 0 0 -0.001 -0.001 -0.013q0 0 -0.001 -0.001m0.008 -0.003 0 0 -0.006 0.003 0 0 0 0 0.001 0.013 0 0 0 0 0.006 0.003q0.001 0 0.001 0l0 0 -0.001 -0.018q0 -0.001 -0.001 -0.001m-0.021 0a0.001 0.001 0 0 0 -0.001 0l0 0 -0.001 0.018q0 0.001 0.001 0.001l0 0 0.006 -0.003 0 0 0 0 0.001 -0.013 0 0 0 0z"
                        id="MingCute"
                      />
                      <path
                        d="M0.392 0.482a0.045 0.045 0 0 1 -0.064 0l-0.17 -0.17a0.045 0.045 0 1 1 0.064 -0.064L0.36 0.386l0.138 -0.138a0.045 0.045 0 0 1 0.064 0.064z"
                        fill="#09244B"
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {sortOptions.map((option) => (
                  <DropdownMenuItem key={option}>{option}</DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </section>
  );
}
