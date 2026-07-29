"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "./slider";

export default function PriceRange() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const minFromUrl = Number(searchParams.get("minPrice")) || 0;
  const maxFromUrl = Number(searchParams.get("maxPrice")) || 5000;

  const [range, setRange] = useState<[number, number]>([
    minFromUrl,
    maxFromUrl,
  ]);

  useEffect(() => {
    setRange([minFromUrl, maxFromUrl]);
  }, [minFromUrl, maxFromUrl]);

  const handleCommit = (value: number | readonly number[]) => {
    const values = Array.isArray(value) ? value : [value];
    const params = new URLSearchParams(searchParams.toString());

    params.set("minPrice", values[0].toString());
    params.set("maxPrice", values[1].toString());

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-72">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Price Range</h2>
        <span className="text-sm font-medium text-gray-700">
          ${range[0].toLocaleString()} - ${range[1].toLocaleString()}
        </span>
      </div>

      <Slider
        value={range}
        onValueChange={(val) => setRange(val as [number, number])} 
        onValueCommitted={handleCommit} 
        min={0}
        max={5000}
        step={50}
        className="mx-auto w-full max-w-xs cursor-pointer"
      />

      <div className="mt-2 flex justify-between text-sm text-gray-500">
        <span>$0</span>
        <span>$5,000</span>
      </div>
    </div>
  );
}
